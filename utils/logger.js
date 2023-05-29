const alert = require('cli-alerts');

const logger = (name, msg, type) => {
	alert({
		type: type,
		name: name,
		msg: msg
	});
};

module.exports = { logger };
