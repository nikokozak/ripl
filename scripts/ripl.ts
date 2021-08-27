import settings from './settings'
import RefGrid from './reference-grid'
import Commander from './commander/commander'
import Cursor from './cursor/cursor'
import { grid_y_to_y, grid_x_to_x } from './utils'

const grid_canvas = document.getElementById('grid-canvas') as HTMLCanvasElement;
const commander_canvas = document.getElementById('commander-canvas') as HTMLCanvasElement;
const cursor_canvas = document.getElementById('cursor-canvas') as HTMLCanvasElement;

export default class Ripl
{
	public commander: Commander;
	public grid: RefGrid; public cursor: Cursor;

	constructor ()
	{
		settings.install([grid_canvas, commander_canvas, cursor_canvas]);

		this.grid = new RefGrid(grid_canvas);
		this.commander = new Commander(commander_canvas);
		this.cursor = new Cursor(cursor_canvas);
		
		// Cursor / keyboard listeners
		this.cursor.on('N', (x: number, y: number) => this.commander.write("N", x, y));
		this.cursor.on('n', (x: number, y: number) => this.commander.write("n", x, y));
		this.cursor.on('S', (x: number, y: number) => this.commander.write("S", x, y));
		this.cursor.on('s', (x: number, y: number) => this.commander.write("s", x, y));
		this.cursor.on('E', (x: number, y: number) => this.commander.write("E", x, y));
		this.cursor.on('e', (x: number, y: number) => this.commander.write("e", x, y));
		this.cursor.on('W', (x: number, y: number) => this.commander.write("W", x, y));
		this.cursor.on('w', (x: number, y: number) => this.commander.write("w", x, y));
		this.cursor.on('Backspace', (x: number, y: number) => {
			this.commander.erase(x, y); this.commander.refresh(); 
		});
		this.cursor.on('x', (x: number, y: number) => this.commander.write("x", x, y));
		this.cursor.on('Enter', (x: number, y: number) => {
			const frame = document.createElement('div') 
			const text_box = document.createElement('input')
			frame.appendChild(text_box);
			const x_coord = grid_x_to_x(x);
			const y_coord = grid_y_to_y(y);
			text_box.setAttribute('type', 'text')
			frame.setAttribute('style', `width: 100px; height: 100px; background-color: red; position: absolute; left: ${x_coord}px; top: ${y_coord}px`);
			document.body.appendChild(frame);
			text_box.focus();
		});
	}

	draw ()
	{
		this.grid.draw();
		this.commander.draw();
		this.cursor.draw();
	}
}
