import { mod } from './utils'

class Settings
{
	public canvas_width: number;
	public canvas_height: number;
	public cell_size: number;
	public cols: number;
	public rows: number;
	public h_padding: number;
	public v_padding: number;

	public font_size: number;
	public font: string;
	public text_baseline: CanvasTextBaseline;
	public text_align: CanvasTextAlign;
	public font_color: string;
	public highlight_fg_color: string;
	public highlight_bg_color: string;
	public bg_color: string;
	public base_glyph: string;

	constructor ()
	{
		this.canvas_width = 500;
		this.canvas_height = 500;
		this.cell_size = 20;
		this.cols = Math.floor(this.canvas_width / this.cell_size);
		this.rows = Math.floor(this.canvas_height / this.cell_size);
		this.h_padding = mod(this.canvas_width, this.cell_size) / 2;
		this.v_padding = mod(this.canvas_height, this.cell_size) / 2;

		this.font_size = this.cell_size - 2;
		this.font = `${this.font_size}px sans-serif`;
		this.text_baseline = "middle";
		this.text_align = "center";
		this.font_color = "rgb(255, 255, 255)";
		this.highlight_fg_color = "rgb(0, 0, 0)";
		this.highlight_bg_color = "rgb(255, 255, 255)";
		this.bg_color = "rgb(0, 0, 0)";
		this.base_glyph = "·";
	}

	install (canvases: Array<HTMLCanvasElement>) {
		for (let canvas of canvases)
			{
				const canvas_context = canvas.getContext('2d');
				canvas.width = this.canvas_width;
				canvas.height = this.canvas_height;
				canvas_context.textBaseline = this.text_baseline;
				canvas_context.textAlign = this.text_align;
				canvas_context.font = this.font;
			}
	}
}

const settings = new Settings();
export default settings;
