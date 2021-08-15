import settings from './settings'
import RefGrid from './reference-grid'
import Operators from './operators'
import Cursor from './cursor'

const grid_canvas = document.getElementById('grid-canvas') as HTMLCanvasElement;
const operator_canvas = document.getElementById('operator-canvas') as HTMLCanvasElement;
const cursor_canvas = document.getElementById('cursor-canvas') as HTMLCanvasElement;

export default class Ripl
{
	public operators: Operators;
	public modifiers: Array<any>;
	public grid: RefGrid; public cursor: Cursor;


	constructor ()
	{
		this.modifiers = []; // modifiers modify operators.

		settings.install([grid_canvas, operator_canvas, cursor_canvas]);

		this.grid = new RefGrid(grid_canvas);
		this.operators = new Operators(operator_canvas);
		this.cursor = new Cursor(cursor_canvas);
		
		// Cursor / keyboard listeners
		this.cursor.on('n', (x: number, y: number) => this.operators.write("N", x, y))
		this.cursor.on('s', (x: number, y: number) => this.operators.write("S", x, y))
		this.cursor.on('e', (x: number, y: number) => this.operators.write("E", x, y))
		this.cursor.on('w', (x: number, y: number) => this.operators.write("W", x, y))
		this.cursor.on('x', (x: number, y: number) => this.operators.erase(x, y))
	}

	draw ()
	{
		this.grid.draw();
		this.operators.draw();
		this.cursor.draw();
	}
}
