import settings from './settings'
import RefGrid from './reference-grid'
import Commander from './commander/commander'
import Cursor from './cursor/cursor'
import Popup from './cursor/popup'
import Term from './term'

const grid_canvas = document.getElementById('grid-canvas') as HTMLCanvasElement;
const commander_canvas = document.getElementById('commander-canvas') as HTMLCanvasElement;
const cursor_canvas = document.getElementById('cursor-canvas') as HTMLCanvasElement;

export default class Ripl
{
	public commander: Commander;
	public grid: RefGrid; 
	public cursor: Cursor;
	public term: Term;

	constructor ()
	{
		settings.install([grid_canvas, commander_canvas, cursor_canvas]);

		this.grid = new RefGrid(grid_canvas);
		this.commander = new Commander(commander_canvas);
		this.cursor = new Cursor(cursor_canvas);
		this.term = new Term();
		
		// Cursor / keyboard listeners
		
		// Helper for forming event functions
		this.cursor.on_multiple(
			['N', 'n', 'S', 's', 'E', 'e', 'W', 'w', 'x'],
			(glyph: string) => {
				return (x: number, y: number) => {
					const entity = this.commander.write(glyph, x, y);
					this.cursor.glyph = entity.glyph;
					this.term.set_message(entity.name);
				}
		});

		this.cursor.on('Backspace', (x: number, y: number) => {
			this.commander.erase(x, y); 
			this.cursor.glyph = "@";
			this.term.set_message();
			this.commander.refresh(); 
		});

		this.cursor.on('Enter', (x: number, y: number) => {
			new Popup(x, y);
		});

		this.cursor.on_multiple(
			['move_left', 'move_right', 'move_up', 'move_down'], 
			(_event_name: string) => {
				return (x: number, y: number) => {
					const entity = this.commander.at(x, y);
					if (entity) { 
						this.term.set_message(entity.name);
						this.cursor.glyph = entity.glyph;
					}
					else { 
						this.term.set_message();
						this.cursor.glyph = "@";
					}
				}
		});
	}

	draw ()
	{
		this.grid.draw();
		this.commander.draw();
		this.cursor.draw();
	}
}
