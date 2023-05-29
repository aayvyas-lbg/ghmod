const { spinner } = require('../../utils/spinners');

require('../../utils/spinners');

const checkRateLimit = async => {
	const myHeaders = {
		Accept: 'application/vnd.github+json',
		Authorization: `Bearer ${process.env.GITHUB_PAT}`,
		'X-GitHub-Api-Version': '2022-11-28'
	};

	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};
	const spin = spinner();
	fetch('https://api.github.com/rate_limit', requestOptions)
		.then(response => response.json())
		.then(result => {
			process.stdout.write('\r\x1b[K');
			clearInterval(spin);
			console.log(result);
		})
		.catch(error => console.log('error', error));
};

module.exports = { checkRateLimit };
