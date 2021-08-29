import Command from './command'
import Modifier from '../modifiers/modifier'
import { grid_x_to_x, grid_y_to_y } from '../../utils'
import s from '../../settings'

export default class Arc extends Command
{
	public commands: Array<any>;
	public _commands: Array<any>;
	public modifiers: Array<Modifier>;
	public accepts: Array<any>;

	constructor (glyph: string, x: number, y: number)
	{
		super(glyph, x, y);
		this.commands = [];
		this._commands = [];
	}


}
