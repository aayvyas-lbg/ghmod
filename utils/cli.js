const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
	clear: {
		type: `boolean`,
		default: true,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: false,
		desc: `Don't clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	},
	output: {
		type: 'string',
		alias: 'o',
		desc: 'csv|json|table',
		default: 'table'
	},
	organization: {
		type: 'string',
		alias: 'org',
		desc: 'Name of the Github organization',
		default: ' '
	}
};

const commands = {
	help: { desc: `Print help info` },
	code: { desc: 'Github Code Search with file level tracing' },
	ratelimit: { desc: 'Check rate limit for current auth session' },
	pr: { desc: 'Creates a PR by using information from your local git' }
};

const helpText = meowHelp({
	name: `ghmod`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

module.exports = meow(helpText, options);
// module.exports = { commands };
