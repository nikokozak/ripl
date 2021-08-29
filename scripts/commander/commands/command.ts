import s from '../../settings'
import { grid_x_to_x, grid_y_to_y } from '../../utils'
import Modifier from '../modifiers/modifier'

export default class Command 
{
	public x: number; public y: number; public glyph: string;
	public name: string;

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

	draw (canvas_context: CanvasRenderingContext2D)
	{
		this.draw_glyph(canvas_context);
	}

	scan (_modifiers: Array<Modifier>)
	{
		return null;
	}

	refresh (_modifiers: Array<Modifier>)
	{
		return null;
	}
	
}
