import { grid_x_to_x, grid_y_to_y } from './utils'
import s from './settings'

export default class ReferenceGrid
{
	public width: number;
	public height: number;
	public cols: number;
	public rows: number;
	public v_padding: number;
	public h_padding: number;
	public canvas: HTMLCanvasElement;
	public canvas_context: CanvasRenderingContext2D;
	public glyph: string;

	constructor(canvas: HTMLCanvasElement)
	{
		this.canvas = canvas;
		this.canvas_context = canvas.getContext('2d');
		this.glyph = "·";
		this.width = s.canvas_width;
		this.height = s.canvas_height;
		this.v_padding = s.v_padding;
		this.h_padding = s.h_padding;
		this.cols = s.cols;
		this.rows = s.rows;
	}

	draw()
	{
		this.canvas_context.clearRect(0, 0, this.width, this.height);
		for (let x = 0; x < this.cols; x++) 
		{
			for (let y = 0; y < this.rows; y++)
			{
				this.canvas_context.fillStyle = s.bg_color;
				this.canvas_context.fillRect(grid_x_to_x(x),
																		 grid_y_to_y(y),
																		 s.cell_size,
																		 s.cell_size);
				this.canvas_context.fillStyle = s.font_color;
				this.canvas_context.fillText(this.glyph,
																		 grid_x_to_x(x, true),
																		 grid_y_to_y(y, true))
			}
		}
	}
}
