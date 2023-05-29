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

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	if (!validateOutputFlag(flags.output)) {
		logger(
			'INVALID OUTPUT FLAG',
			`${flags.output} is an invalid output flag`,
			'error'
		);
		return;
	}
	validateCodeSearch(input) &&
		codeSearch.runSearch(
			flags.output,
			input[input.length - 1],
			flags.organization
		);

	input.includes('ratelimit') && checkRateLimit();

	debug && log(flags);
})();
