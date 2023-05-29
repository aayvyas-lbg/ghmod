const welcome = require('cli-welcome');
const pkg = require('./../package.json');
const unhandled = require('cli-handle-unhandled');
const color = require('@colors/colors');
module.exports = ({ clear = false }) => {
	unhandled();
	welcome({
		title: `ghmod`,
		tagLine: color.bgWhite(color.black(` by Aayush Vyas `)),
		description: pkg.description,
		version: pkg.version,
		bgColor: '#36BB09',
		color: '#000000',
		margin: '20px',
		bold: true,
		clear
	});
};
