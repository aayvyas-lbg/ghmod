const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { logger } = require('../../utils/logger');
const { stderr, exit } = require('process');
const { error } = require('console');

const execGit = async command => {
	let op = await exec(command).catch(err => {
		console.log(err.stderr);
		logger('PR', 'Error: Not a git repository', 'error');
		exit(0);
	});
	return op.stdout.trim();
};
const getTitle = async () => {
	return await execGit('git log -1 --pretty=%B');
};
const getBranch = async () => {
	return await execGit('git branch --show');
};
const getBody = async (title, branch) => {
	return ` ## ${title}
    **Jira ticket ID** : \`${branch}\`
    `;
};

const gitInfo = async () => {
	const op = await execGit('git config --get remote.origin.url');
	return {
		repoName: op.split('/')[1].replace('.git', ''),
		owner: op.split(':')[1].split('/')[0]
	};
};
const prepareData = async () => {
	let title = await getTitle();
	let branch = await getBranch();
	var raw = JSON.stringify({
		title: title,
		body: await getBody(title, branch),
		head: branch,
		base: branch
	});

	return raw;
};

const call = async () => {
	const info = await gitInfo();

	var myHeaders = new Headers();
	myHeaders.append('Accept', 'application/vnd.github+json');
	myHeaders.append('Authorization', `Bearer ${process.env.GITHUB_PAT}`);
	myHeaders.append('X-GitHub-Api-Version', '2022-11-28');
	myHeaders.append('Content-Type', 'application/json');

	const raw = await prepareData();

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	console.log(raw);

	await fetch(
		`https://api.github.com/repos/${info.owner}/${info.repoName}/pulls`,
		requestOptions
	)
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));
};

const createPR = async () => {
	await call();
};

module.exports = { createPR };
