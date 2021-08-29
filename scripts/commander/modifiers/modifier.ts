import s from '../../settings'
import { grid_x_to_x, grid_y_to_y } from '../../utils'

export default class Modifier
{
	public x: number; 
	public y: number;
	public glyph: string;
	public name: string;

	constructor (glyph: string, x: number, y: number)
	{
		this.x = x; this.y = y; this.glyph = glyph;
	}

	draw (canvas_context: CanvasRenderingContext2D)
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

	modify (commands: Array<any>, _instruction_index: number)
	{
		return commands;
	}
}
