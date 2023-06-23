#!/usr/bin/env node

/**
 * ghmod
 * Github Operations
 *
 * @author Aayush Vyas <https://github.com/aayvyas-lbg>
 */
const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');


const codeSearch = require('./modules/codeSearch/codeSearch');
const { logger } = require('./utils/logger');
const { validateOutputFlag } = require('./validation/flagValidation');
const { validateCodeSearch } = require('./validation/commandValidation');
const { ratelimit, checkRateLimit } = require('./modules/ratelimit/ratelimit');
const { createPR } = require('./modules/PR/createPR');







const input = cli.input;




const flags = cli.flags;
const { noClear, debug } = flags;

(async () => {
	init({ noClear });
	input.includes(`help`) && cli.showHelp(0);
	if (input.length == 0) {
		return;
	}

	if (!validateOutputFlag(flags.output)) {
		logger(
			'INVALID OUTPUT FLAG',
			`${flags.output} is an invalid output flag`,
			'error'
		);
		return;
	} else if (validateCodeSearch(input)) {
		codeSearch.runSearch(
			flags.output,
			input[input.length - 1],
			flags.organization
		);
	} else if (input.includes('ratelimit')) {
		checkRateLimit();
	} else if (input.includes('pr')) {
		createPR();
	} else {
		logger('INVALID COMMAND', 'Please enter a valid command', 'error');
	}

	debug && log(flags);
})();
