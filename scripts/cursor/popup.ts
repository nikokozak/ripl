import { grid_x_to_x, grid_y_to_y } from '../utils'
import s from '../settings'

// TODO: This should be run by cursor:
// 1. Cursor goes into text_input: true
// 2. Keyboard events are temporarily deactivated.
// 3. "Enter" key is remapped to read/close popup.
// 4. An event registered in RIPL returns the value entered as text.

export default class Popup
{
	x_coord: number;
	y_coord: number;
	text_input_attributes: any;
	text_input_element: HTMLElement;
	wrapper_attributes: any;
	wrapper_element: HTMLElement;

	constructor (x_index: number, y_index: number)
	{
		this.x_coord = grid_x_to_x(x_index, true) - 2;
		this.y_coord = grid_y_to_y(y_index) - (s.cell_size - 7);

		this.wrapper_element = document.createElement('div');
		this.text_input_element = document.createElement('input');

		this.text_input_attributes = {
			type: 'text',
			style: `boder: none; 
			width: 100px; 
			outline: none;
			position: absolute;
			left: ${this.x_coord}px;
			top: ${this.y_coord}px;
			`
		}


		this.apply_attributes_to(this.text_input_element, this.text_input_attributes)
		document.body.appendChild(this.text_input_element);
		
		this.text_input_element.focus();
	}

	apply_attributes_to(element: HTMLElement, attribute_map: object)
	{
		Object.entries(attribute_map).forEach(([key, value]) => {
			element.setAttribute(key, value);
		})
	}

}
