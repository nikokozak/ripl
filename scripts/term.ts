import s from './settings'
import {obj_to_style} from './utils'

export default class Term
{
	public width: number;
	public height: number;

	public dom_wrapper: HTMLElement;
	public dom_text_out: HTMLElement;
	public dom_text_in: HTMLInputElement;
	public dom_mode: HTMLElement;

	public message: string;

	constructor ()
	{
		this.dom_wrapper = document.createElement('div');
		this.dom_mode = document.createElement('p');
		this.dom_text_out = document.createElement('p');

		this.dom_wrapper.appendChild(this.dom_mode);
		this.dom_wrapper.appendChild(this.dom_text_out);
		this.dom_wrapper.setAttribute('style', obj_to_style(this.wrapper_style()));
		this.dom_mode.setAttribute('style', obj_to_style(this.mode_style()));
		this.dom_text_out.setAttribute('style', obj_to_style(this.text_style()));

		this.set_mode();
		this.set_message();

		document.body.appendChild(this.dom_wrapper);
	}

	set_mode (mode_name: string = "cursor")
	{
		this.dom_mode.innerText = mode_name.toUpperCase() + " >>";
	}

	set_message (message: string = "")
	{
		this.dom_text_out.innerText = " " + message;
	}

	wrapper_style()
	{
		return {
			width: `${s.canvas_width}px`,
			height: `20px`,
			position: `absolute`,
			top: `${s.canvas_height + 20}px`,
			'background-color': `${s.bg_color}`,
			color: `${s.font_color}`
		}
	}

	text_style()
	{
		return {
			'margin-top': `0px`,
			'margin-left': `0.5rem`,
		}
	}

	mode_style()
	{
		return {
			float: 'left',
			'margin-top': `0px`,
		}
	}
	
}
