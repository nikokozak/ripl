import s from './settings';

export function mod(n: number, m: number) : number
{
  return ((n % m) + m) % m;
}

export function unsafe(x: number, y: number) : boolean
{
  return (x > s.cols - 1) || (x < 0) || (y > s.rows - 1) || (y < 0);
}

export function grid_x_to_x(x: number, center: boolean = false) : number
{
  return (x + (center ? 0.5 : 0)) * s.cell_size + s.h_padding;
}

export function grid_y_to_y(y: number, center: boolean = false) : number
{
  return (y + (center ? 0.6 : 0)) * s.cell_size + s.v_padding;
}

export function range(start: number, end: number) : Array<number>
{
  const result = Array(Math.abs(end - start))
  let result_index = 0;
  if (start == end) return [start];
  while (start != end)
    {
      result[result_index++] = start < end ? start++ : start--;
    }
  return result;
}

export function clone(obj_or_array: object | Array<any>)
{
  return JSON.parse(JSON.stringify(obj_or_array));
}
