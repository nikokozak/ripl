import s from './settings'
import { unsafe, grid_x_to_x, grid_y_to_y } from './utils'

type CursorEventName = 
	'move_left' | 'move_right' | 'move_down' | 'move_up' |
	'n' | 's' | 'e' | 'w' |
	'Backspace' |
	'x' ; 
type CursorEventFunction =
	(cursor_x: number, cursor_y: number) => void;

export default class Cursor
{
	public glyph: string;
	public x: number;
	public y: number;
	public events: any;
	private canvas: HTMLCanvasElement;
	private canvas_context: CanvasRenderingContext2D;

	constructor(canvas: HTMLCanvasElement, x: number = 0, y: number = 0)
	{
		this.canvas = canvas;
		this.canvas_context = canvas.getContext('2d');
		this.glyph = "@";
		this.x = x;
		this.y = y;

		const default_fn = (_x: number, _y: number) => {};

		// ADD NEW EVENT NAMES HERE, MAKE SURE TO ADD THEM TO THE SWITCH CASE AS WELL!:
		const event_names = ['move_left', 'move_right', 'move_up', 'move_down', 'Backspace', 'n', 's', 'e', 'w', 'x'];
		
		// Register event_names as object { event_name: default_fn }
		this.events = event_names.reduce((prev, curr, _i) =>{
			prev[curr] = default_fn;
			return prev;
		}, {});

		window.addEventListener("keydown", this.event_handler(this));
	}

	on(event: CursorEventName, assoc_fun: CursorEventFunction)
	{
		if (event in this.events)
			{
				this.events[event] = assoc_fun;
			} else {
				throw new EvalError(`Event ${event} does not exist in cursor`);
			}
	}

	private event_handler(binding: Cursor) 
	{
		return function (e: KeyboardEvent) 
		{
			const key = e.key;

			switch (key) {
				case 'h': 
					binding.move_left();
					binding.events['move_left'](binding.x, binding.y);
					break;
				case 'l':
					binding.move_right();
					binding.events['move_right'](binding.x, binding.y);
					break;
				case 'j':
					binding.move_down();
					binding.events['move_down'](binding.x, binding.y);
					break;
				case 'k':
					binding.move_up();
					binding.events['move_up'](binding.x, binding.y);
					break;
				case 'n':
					binding.events['n'](binding.x, binding.y);
					break;
				case 's':
					binding.events['s'](binding.x, binding.y);
					break;
				case 'e':
					binding.events['e'](binding.x, binding.y);
					break;
				case 'w':
					binding.events['w'](binding.x, binding.y);
					break;
				case 'x':
					binding.events['x'](binding.x, binding.y);
					break;
				case 'Backspace':
					binding.events['Backspace'](binding.x, binding.y);
					break;
			}
		}
	}
	
	move_up()
	{
		this.x = this.x;
		this.y = unsafe(this.x, this.y - 1) ? this.y : this.y - 1;
	}

	move_down()
	{
		this.x = this.x;
		this.y = unsafe(this.x, this.y + 1) ? this.y : this.y + 1;
	}

	move_left()
	{
		this.x = unsafe(this.x - 1, this.y) ? this.x : this.x - 1;
		this.y = this.y;
	}

	move_right()
	{
		this.x = unsafe(this.x + 1, this.y) ? this.x : this.x + 1;
		this.y = this.y;
	}

	public draw()
	{
		this.canvas_context.clearRect(0, 0, s.canvas_width, s.canvas_height);
		this.canvas_context.fillStyle = s.highlight_bg_color;
		this.canvas_context.fillRect(grid_x_to_x(this.x),
															grid_y_to_y(this.y),
															s.cell_size,
															s.cell_size)
		this.canvas_context.fillStyle = s.highlight_fg_color;
		this.canvas_context.fillText(this.glyph,
															grid_x_to_x(this.x, true),
															grid_y_to_y(this.y, true));
	}
}
