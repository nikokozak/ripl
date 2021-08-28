import { grid_x_to_x, grid_y_to_y } from '../utils'

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
		this.x_coord = grid_x_to_x(x_index);
		this.y_coord = grid_y_to_y(y_index);

		this.wrapper_element = document.createElement('div');
		this.text_input_element = document.createElement('input');

		this.text_input_attributes = {
			type: 'text',
			style: 'boder: none; width: 100px; outline: none;'
		}

		this.wrapper_attributes = {
			style: `width: 100px; 
			height: 100px; 
			background-color: red; 
			position: absolute;
			left: ${this.x_coord}px;
			top: ${this.y_coord}px;`
		}

		this.apply_attributes_to(this.text_input_element, this.text_input_attributes)
		this.apply_attributes_to(this.wrapper_element, this.wrapper_attributes);

		this.wrapper_element.appendChild(this.text_input_element);
		document.body.appendChild(this.wrapper_element);
		
		this.text_input_element.focus();
	}

	apply_attributes_to(element: HTMLElement, attribute_map: object)
	{
		Object.entries(attribute_map).forEach(([key, value]) => {
			element.setAttribute(key, value);
		})
	}

}
