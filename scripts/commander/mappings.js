import { NorthLine, SouthLine, WestLine, EastLine } from './commands/lines'
import { StopLine, 
	NorthLine as MNorthLine,
	SouthLine as MSouthLine,
	EastLine as MEastLine,
	WestLine as MWestLine } from './modifiers/lines'

export default {
	"N": NorthLine,
	"n": MNorthLine,
	"S": SouthLine,
	"s": MSouthLine,
	"W": WestLine,
	"w": MWestLine,
	"E": EastLine,
	"e": MEastLine,
	"x": StopLine,
}
