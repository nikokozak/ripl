import s from '../settings';
import glyph_mappings from './glyph_mappings';
import Command from './commands/command'
import Modifier from './modifiers/modifier'

// Controller for all of our Commander.
export default class Commander 
{
	public canvas: HTMLCanvasElement;
	public canvas_context: CanvasRenderingContext2D;
	public commands: Array<Command>;
	public modifiers: Array<Modifier>;

	constructor (canvas: HTMLCanvasElement)
	{
		this.canvas = canvas;
		this.canvas_context = canvas.getContext('2d');
		this.commands = Array<Command>(s.cols * s.rows);
		this.modifiers = Array<Modifier>(s.cols * s.rows);
	}

	write (glyph: string, x: number, y: number) : Command | Modifier
	{
		const new_entity = new glyph_mappings[glyph](x, y) as Command | Modifier;

		if (new_entity instanceof Modifier)
			{
				this.modifiers[this.index_at(x, y)] = new_entity;
				this.commands[this.index_at(x, y)] = undefined;
			}
		else if (new_entity instanceof Command)
			{
				this.commands[this.index_at(x, y)] = new_entity;
				this.modifiers[this.index_at(x, y)] = undefined;
			}

		this.refresh();
		return new_entity;
	}

	erase (x: number, y: number)
	{
		this.commands[this.index_at(x, y)] = undefined;
		this.modifiers[this.index_at(x, y)] = undefined;
	}

	draw ()
	{
		this.canvas_context.clearRect(0, 0, s.canvas_width, s.canvas_height);
		for (let command of this.commands) 
			{
				if (command) command.draw(this.canvas_context);	
			}
		for (let modifier of this.modifiers)
			{
				if (modifier) modifier.draw(this.canvas_context);
			}
	}

	refresh ()
	{
		for (let command of this.commands)
			{
				if (command instanceof Command) command.refresh(this.modifiers);
			}
	}

	// Helpers

	at (x: number, y: number): Command | Modifier | void
	{
		return this.commands.find(op => op ? op.x == x && op.y == y : false) || this.modifiers.find(mod => mod ? mod.x == x && mod.y == y : false);
	}

	index_at (x: number, y: number): number
	{
		return y * s.cols + x;
	}
}
