import s from './settings';
import { grid_x_to_x, grid_y_to_y } from './utils';

// Controller for all of our Operators.
export default class Operators 
{
	public canvas: HTMLCanvasElement;
	public canvas_context: CanvasRenderingContext2D;
	public store: Array<LineOp>;

	constructor (canvas: HTMLCanvasElement)
	{
		this.canvas = canvas;
		this.canvas_context = canvas.getContext('2d');
		this.store = Array<LineOp>(s.cols * s.rows);
	}

	write (glyph: string, x: number, y: number)
	{
		this.store[this.index_at(x, y)] = new library[glyph](x, y);
		console.log(this.store);
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

	// Helpers

	at (x: number, y: number): Entity | void
	{
		return this.store.find(op => op.x == x && op.y == y);
	}

	index_at (x: number, y: number): number
	{
		return y * s.cols + x;
	}
}

class Entity
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

class LineOp extends Entity
{
	public commands: Array<any>;
	constructor (glyph: string, x: number, y: number)
	{
		super(glyph, x, y);
		this.commands = [];
	}
	draw (canvas_context: CanvasRenderingContext2D)
	{
		this.draw_glyph(canvas_context);

		for (let cI = 0; cI + 1 < this.commands.length; cI ++)
		{
			const command = this.commands[cI];
			const next_command = this.commands[cI + 1];
		
			canvas_context.beginPath();
			canvas_context.moveTo(grid_x_to_x(command.x, true),
														grid_y_to_y(command.y, true));
			canvas_context.lineTo(grid_x_to_x(next_command.x, true),
														grid_y_to_y(next_command.y, true));
			canvas_context.strokeStyle = s.font_color;
			canvas_context.stroke();
		}
	}
}

export class NorthOp extends LineOp
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

export class SouthOp extends LineOp
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

export class WestOp extends LineOp
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

export class EastOp extends LineOp
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

export const library = {
	"N": NorthOp,
	"S": SouthOp,
	"W": WestOp,
	"E": EastOp
}


