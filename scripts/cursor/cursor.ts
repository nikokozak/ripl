import s from '../settings'
import { unsafe, grid_x_to_x, grid_y_to_y } from '../utils'
import default_events from './events'
import { event_mappings } from './events'

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
		
		this.events = default_events;

		window.addEventListener("keydown", this.event_handler(this));
	}

	on(event: string, assoc_fun: (_x: number, _y: number) => any)
	{
		if (event in this.events)
			{
				this.events[event] = assoc_fun;
			} else {
				throw new EvalError(`Event ${event} does not exist in cursor`);
			}
	}

	on_multiple(events: Array<string>, assoc_fun: (_x: number, _y: number) => any)
	{
		events.forEach(event => this.on(event, assoc_fun));
	}

	private event_handler(cursor: Cursor) 
	{
		return function (e: KeyboardEvent) 
		{
			const key = e.key;

			switch (key) {
				case 'h': 
					cursor.move_left();
					cursor.events[event_mappings['h']](cursor.x, cursor.y);
					break;
				case 'l':
					cursor.move_right();
					cursor.events[event_mappings['l']](cursor.x, cursor.y);
					break;
				case 'j':
					cursor.move_down();
					cursor.events[event_mappings['j']](cursor.x, cursor.y);
					break;
				case 'k':
					cursor.move_up();
					cursor.events[event_mappings['k']](cursor.x, cursor.y);
					break;
				default:
					// Look up keypressed in event_mappings, and call local event function accordingly.
					if (event_mappings.hasOwnProperty(key)) {
						cursor.events[event_mappings[key]](cursor.x, cursor.y);
					}
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
