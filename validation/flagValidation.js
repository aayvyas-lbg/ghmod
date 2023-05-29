const validateOutputFlag = data => {
	return data === 'json' || data === 'csv' || data === 'table' ? true : false;
};

module.exports = { validateOutputFlag };
