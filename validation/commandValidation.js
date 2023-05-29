const { logger } = require('../utils/logger');

const validateCodeSearch = inputs => {
	const keyword = inputs.includes('code');
	// console.log(
	// 	keyword,
	// 	inputs[inputs.length - 1].toString(),
	// 	inputs[inputs.length - 1] !== undefined,
	// 	inputs[inputs.length - 1] !== ' ',
	// 	inputs[inputs.length - 1]

	// );
	if (!keyword) {
		return false;
	}
	if (
		keyword &&
		inputs[inputs.length - 1] !== 'code' &&
		inputs[inputs.length - 1] !== undefined
	) {
		return true;
	}
	logger('SEARCH', 'Enter Something to search', 'error');
	return false;
};

module.exports = { validateCodeSearch };
