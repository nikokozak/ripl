// KeyboardEvent.key -> cursor event emitted
export const event_mappings = {
	'h': 'move_left',
	'l': 'move_right',
	'j': 'move_down',
	'k': 'move_up',
	'N': 'N', 'S': 'S', 'E': 'E', 'W': 'W',
	'n': 'n', 's': 's', 'e': 'e', 'w': 'w',
	'Backspace': 'Backspace',
	'x': 'x',
	'Enter': 'Enter',
	'?': '?'
}


export const events = Object.entries(event_mappings).reduce(
	(accum, [_key, val], _i, _a) => {
		accum.push(val);
		return accum;
	}, [] as any);

export const default_fn = (_x: number, _y: number) => {};

// Exports a map of events: default_fn
export default events.reduce(
	(accum: any, curr: string) => {
		accum[curr] = default_fn;
		return accum;
	}, {});
