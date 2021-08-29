import { grid_x_to_x, grid_y_to_y, obj_to_style } from '../utils'
import s from '../settings'

export default class HelpMenu
{
	x_coord: number;
	y_coord: number;
	wrapper_element: HTMLElement;
	active: boolean;

	constructor (x_index: number = 2, y_index: number = 2)
	{
		this.x_coord = grid_x_to_x(x_index, true) - 2;
		this.y_coord = grid_y_to_y(y_index) - (s.cell_size - 7);

		this.wrapper_element = document.createElement('div');
		this.wrapper_element.setAttribute('class', 'help-menu');
		this.wrapper_element.innerHTML = this.wrapper_text();

		this.hide();

		document.body.appendChild(this.wrapper_element);

		this.active = true;
	}

	wrapper_text()
	{
		return `
		<p>Help Menu</p>
		<br />
		<p>This is a rudimentary and experimental CAD program.</p>
		<p>This version does not support saving or exportind drawings.</p>
		<br />
		<p>Controls:</p>
		<br />
		<p>'?' - bring up this menu</p>
		<p>'h' or 'left-arrow' - move left</p>
		<p>'l' or 'right-arrow' - move right</p>
		<p>'j' or 'down-arrow' - move down</p>
		<p>'k' or 'up-arrow' - move up</p>
		<p>'N' | 'S' | 'E' | 'W' - create line command</p>
		<p>'n' | 's' | 'e' | 'w' - create line modifier</p>
		<p> 'x' - stop line</p>
		<p> 'Backspace' - erase modifier or command.
		`;
	}

	show()
	{
		this.wrapper_element.setAttribute('style', 'display: default;');
	}

	hide()
	{
		this.wrapper_element.setAttribute('style', 'display: none;');
	}
}
