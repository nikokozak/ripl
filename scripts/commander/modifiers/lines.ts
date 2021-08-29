import Modifier from './modifier'
import s from '../../settings'

// Stop a line
export class StopLine extends Modifier
{
	constructor (x: number, y: number)
	{
		super("x", x, y);
		
		this.name = "Stop Line Modifier";
	}

	modify (commands: Array<any>, instruction_index: number)
	{
		const new_commands = commands.slice(0, instruction_index + 1);
		new_commands.push({x: this.x, y: this.y});
		
		return new_commands;
	}
}

export class NorthLine extends Modifier
{
	constructor (x: number, y: number)
	{
		super("n", x, y);

		this.name = "North Line Modifier";
	}

	modify (commands: Array<any>, instruction_index: number)
	{
		const new_commands = commands.slice(0, instruction_index + 1)
		new_commands.push({x: this.x, y: this.y});
		new_commands.push({x: this.x, y: 0});

		return new_commands;
	}
}

export class SouthLine extends Modifier
{
	constructor (x: number, y: number)
	{
		super("s", x, y);

		this.name = "South Line Modifier";
	}

	modify (commands: Array<any>, instruction_index: number)
	{
		const new_commands = commands.slice(0, instruction_index + 1)
		new_commands.push({x: this.x, y: this.y});
		new_commands.push({x: this.x, y: s.rows - 1});

		return new_commands;
	}
}

export class EastLine extends Modifier
{
	constructor (x: number, y: number)
	{
		super("e", x, y);

		this.name = "East Line Modifier";
	}

	modify (commands: Array<any>, instruction_index: number)
	{
		const new_commands = commands.slice(0, instruction_index + 1)
		new_commands.push({x: this.x, y: this.y});
		new_commands.push({x: s.cols - 1, y: this.y});

		return new_commands;
	}
}

export class WestLine extends Modifier
{
	constructor (x: number, y: number)
	{
		super("w", x, y);

		this.name = "West Line Modifier";
	}

	modify (commands: Array<any>, instruction_index: number)
	{
		const new_commands = commands.slice(0, instruction_index + 1)
		new_commands.push({x: this.x, y: this.y});
		new_commands.push({x: 0, y: this.y});

		return new_commands;
	}
}
