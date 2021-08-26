import Command from './command'
import accepts from '../accepts'
import Modifier from '../modifiers/modifier'
import { grid_x_to_x, grid_y_to_y, range, clone } from '../../utils'
import s from '../../settings'

export default class Line extends Command
{
	public commands: Array<any>;
	public _commands: Array<any>;
	public modifiers: Array<Modifier>;
	public accepts: Array<any>;

	constructor (glyph: string, x: number, y: number)
	{
		super(glyph, x, y);
		this.commands = [];
		this._commands = []; // Keep originals
		this.accepts = accepts.Line;
	}

	draw (canvas_context: CanvasRenderingContext2D)
	{
		//const modded_commands = this.modify(this.commands);

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
			canvas_context.lineWidth = s.line_width;
			canvas_context.stroke();
		}

		this.draw_glyph(canvas_context);
	}

	interact (unvetted_modifiers: Array<Modifier>)
	{
		this.modifiers = [];
		let index = 0;
		while (index < this.commands.length - 1)
		{ 
			const collision = this.collision_at_cmd_index(index, unvetted_modifiers);
		 	if (collision && !this.modifiers.includes(collision) && this.compatible(collision))
		 	{
				this.modifiers.push(collision);
		 		this.commands = collision.modify(this.commands, index);
				console.log("collided with " + collision.glyph);
		 	}
		
			index++;
		}
	}

	// At a given command index, returns the nearest collision between the command at the given index and the next command.
	collision_at_cmd_index (command_index: number, modifiers: Array<Modifier>) : Modifier | false
	{
		if (command_index == this.commands.length - 1) { return false }

		const cX = this.commands[command_index].x;
		const cY = this.commands[command_index].y;
		const cX1 = this.commands[command_index + 1].x;
		const cY1 = this.commands[command_index + 1].y;

		const collision_range_x = range(Math.min(cX, cX1), Math.max(cX, cX1));
		const collision_range_y = range(Math.min(cY, cY1), Math.max(cY, cY1));

		const collisions_at_curr_index = modifiers.filter(modifier => {
			return modifier 
			&& collision_range_x.includes(modifier.x) 
			&& collision_range_y.includes(modifier.y)
			&& (modifier.x != cX || modifier.y != cY)
		})

		const nearest_collider = collisions_at_curr_index.sort((m1, m2) => {
			const m1_diff = Math.abs(m1.x - cX) + Math.abs(m1.y - cY);
			const m2_diff = Math.abs(m2.x - cX) + Math.abs(m2.y - cY);

			return m1_diff - m2_diff;
		})[0]

		return nearest_collider ? nearest_collider : false;
	}

	refresh (modifiers: Array<Modifier>)
	{
		this.commands = clone(this._commands);
		this.interact(modifiers)
	}

	// Check if the given operator is present in our "accepts" array.
	compatible (modifier: Modifier): boolean
	{
		return this.accepts.find(acceptable => {
			return modifier instanceof acceptable;
		}) ? true : false;
	}

}

export class NorthLine extends Line
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

		this._commands = clone(this.commands);
	}
}

export class SouthLine extends Line
{
	constructor (x: number, y: number)
	{
		super("S", x, y);

		this.commands = [
			{ x: this.x,
				y: this.y },
			{ x: this.x,
				y: s.rows - 1 }
		];

		this._commands = clone(this.commands);
	}
}

export class WestLine extends Line
{
	constructor (x: number, y: number)
	{
		super("W", x, y);

		this.commands = [
			{ x: this.x,
				y: this.y },
			{ x: 0,
				y: this.y }
		];

		this._commands = clone(this.commands);
	}
}

export class EastLine extends Line
{
	constructor (x: number, y: number)
	{
		super("E", x, y);

		this.commands = [
			{ x: this.x,
				y: this.y },
			{ x: s.cols - 1,
				y: this.y }
		];

		this._commands = clone(this.commands);
	}
}
