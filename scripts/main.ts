import Ripl from './ripl'

const ripl = new Ripl();

function draw(): void
{
	ripl.draw();
	window.requestAnimationFrame(draw);
}

draw();
