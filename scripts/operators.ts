import s from './settings';
import { grid_x_to_x, grid_y_to_y, range } from './utils';

// Controller for all of our Operators.
export default class Operators 
{
	public canvas: HTMLCanvasElement;
	public canvas_context: CanvasRenderingContext2D;
	public store: Array<LineEnt>;

	constructor (canvas: HTMLCanvasElement)
	{
		this.canvas = canvas;
		this.canvas_context = canvas.getContext('2d');
		this.store = Array<LineEnt>(s.cols * s.rows);
	}

	write (glyph: string, x: number, y: number)
	{
		this.store[this.index_at(x, y)] = new library[glyph](x, y);
		this.refresh_objects();
	}

	erase (x: number, y: number)
	{
		this.store[this.index_at(x, y)] = undefined;
	}

	draw ()
	{
		this.canvas_context.clearRect(0, 0, s.canvas_width, s.canvas_height);
		for (let operator of this.store) 
			{
				if (operator) operator.draw(this.canvas_context);	
			}
	}

	refresh_objects ()
	{
		for (let obj of this.store)
			{
				if (obj instanceof LineEnt) obj.scan(this.store);
			}
	}

	// Helpers

	at (x: number, y: number): Operator | void
	{
		return this.store.find(op => op.x == x && op.y == y);
	}

	index_at (x: number, y: number): number
	{
		return y * s.cols + x;
	}
}

class Operator 
{
	public x: number; public y: number; public glyph: string;
	constructor (glyph: string, x: number, y: number)
	{
		this.x = x; this.y = y; this.glyph = glyph;
	}
	draw_glyph (canvas_context: CanvasRenderingContext2D)
	{
		canvas_context.fillStyle = s.bg_color;
		canvas_context.fillRect(grid_x_to_x(this.x),
															grid_y_to_y(this.y),
															s.cell_size,
															s.cell_size);
		canvas_context.fillStyle = s.font_color;
		canvas_context.fillText(this.glyph,
															grid_x_to_x(this.x, true),
															grid_y_to_y(this.y, true));
	}
}

class LineMod extends Operator
{
	constructor (glyph: string, x: number, y: number)
	{
		super(glyph, x, y);
	}

	draw (canvas_context: CanvasRenderingContext2D)
	{
		this.draw_glyph(canvas_context);
	}
}

class LineEnt extends Operator
{
	public commands: Array<any>;
	public modifiers: Array<[number, StopMod]>;
	public accepts: Array<any>;

	constructor (glyph: string, x: number, y: number)
	{
		super(glyph, x, y);
		this.commands = [];
		this.accepts = [LineMod];
	}

	draw (canvas_context: CanvasRenderingContext2D)
	{
		this.draw_glyph(canvas_context);

		const modded_commands = this.modify(this.commands);

		for (let cI = 0; cI + 1 < modded_commands.length; cI ++)
		{
			const command = modded_commands[cI];
			const next_command = modded_commands[cI + 1];
		
			canvas_context.beginPath();
			canvas_context.moveTo(grid_x_to_x(command.x, true),
														grid_y_to_y(command.y, true));
			canvas_context.lineTo(grid_x_to_x(next_command.x, true),
														grid_y_to_y(next_command.y, true));
			canvas_context.strokeStyle = s.font_color;
			canvas_context.stroke();
		}
	}

	// Returns the index of collision with command. 
	// Meaning, if value collides with line drawn from command [0] to [1], index returned is 0.
	// Otherwise returns false.
	collides (x: number, y: number): number | false
	{
		let collision_index: boolean | number = false;
		for (let cI = 0; cI + 1 < this.commands.length; cI ++)
		{
			const cX = this.commands[cI].x;
			const cY = this.commands[cI].y;
			const cX1 = this.commands[cI + 1].x;
			const cY1 = this.commands[cI + 1].y;
			const collision_range_x = range(Math.min(cX, cX1), Math.max(cX, cX1));
			const collision_range_y = range(Math.min(cY, cY1), Math.max(cY, cY1));

			if (collision_range_x.includes(x) && collision_range_y.includes(y)) collision_index = cI;
		}
		return collision_index;
	}
	
	scan (operators: Array<any>)
	{
		this.modifiers = [];
		for (let operator of operators.filter(e => e != undefined))
			{
				// Ignore the calling operator
				if (operator == this) continue;

				const collides_at = this.collides(operator.x, operator.y);
				if (collides_at !== false && this.compatible(operator))
					{
						this.modifiers.push([collides_at, operator]);
						console.log("Just collided!");
					}
			}
	}

	// Returns a new command Array with the modifiers applied.
	modify (commands: Array<any>): Array<any>
	{
		if (this.modifiers.length > 0) {
			return this.modifiers.reduce((accum, [index, modifier]) => {
				return modifier.modify(accum, index);
			}, commands);
		} else {
			return commands;
		}
	}

	// Check if the given operator is present in our "accepts" array.
	compatible (operator: Operator): boolean
	{
		let found = false;
		for (let acceptable of this.accepts) { if (operator instanceof acceptable) found = true; }
		return found;
	}

}

export class NorthEnt extends LineEnt
{
	constructor (x: number, y: number)
	{
		super("N", x, y);

		this.commands = [
			{	x: this.x,
				y: this.y },
			{ x: this.x,
				y: 0 }
		];
	}
}

export class SouthEnt extends LineEnt
{
	constructor (x: number, y: number)
	{
		super("S", x, y);

		this.commands = [
			{ x: this.x,
				y: this.y },
			{ x: this.x,
				y: s.rows - 1 }
		]	
	}
}

export class WestEnt extends LineEnt
{
	constructor (x: number, y: number)
	{
		super("W", x, y);

		this.commands = [
			{ x: this.x,
				y: this.y },
			{ x: 0,
				y: this.y }
		]
	}
}

export class EastEnt extends LineEnt
{
	constructor (x: number, y: number)
	{
		super("E", x, y);

		this.commands = [
			{ x: this.x,
				y: this.y },
			{ x: s.cols - 1,
				y: this.y }
		]
	}
}

// Stop a line
export class StopMod extends LineMod
{
	constructor (x: number, y: number)
	{
		super("x", x, y);
	}

	modify (commands: Array<any>, instruction_index: number)
	{
		const new_commands = commands.slice(0, instruction_index + 1);
		new_commands.push({x: this.x, y: this.y});
		
		return new_commands;
	}
}

export const library = {
	"N": NorthEnt,
	"S": SouthEnt,
	"W": WestEnt,
	"E": EastEnt,
	"x": StopMod
}



