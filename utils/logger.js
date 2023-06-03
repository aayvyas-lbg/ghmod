const alert = require('cli-alerts');
var colors = require('@colors/colors');

const logger = (name, msg, type) => {
	alert({
		type: type,
		name: type === 'error' ? colors.bold(name) : name,
		msg: msg
	});
};

module.exports = { logger };
