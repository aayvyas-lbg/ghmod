const cliSpinners = require('cli-spinners');
const spinner = async => {
	let i = 0;
	const spin = setInterval(() => {
		process.stdout.write('\033[0G' + cliSpinners.dots.frames[i]);
		i++;
		if (i >= cliSpinners.dots.frames.length) {
			i = 0;
		}
	}, cliSpinners.dots.interval);
	return spin;
};

module.exports = { spinner };
