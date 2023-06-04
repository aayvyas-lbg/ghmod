const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { logger } = require('../../utils/logger');
const { stderr, exit } = require('process');
const { error } = require('console');
const colors = require('@colors/colors');
const { assignIssue } = require('./assignIssue');

const execGit = async command => {
	let op = await exec(command).catch(err => {
		logger('Pull Request', 'Error: Not a git repository', 'error');
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

const titleCase = str => {
	return str
		.toLowerCase()
		.split(' ')
		.map(function (word) {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(' ');
};

const getBody = async (title, branch) => {
	return (
		`# ${
			title.split(':').length > 1
				? title.split(':')[1].split(branch)[1] !== undefined
					? await titleCase(title.split(':')[1].split(branch)[1])
					: await titleCase(title.split(':')[1])
				: title
		} \n` +
		`<p> <strong>Jira ticket ID</strong>: <code>${branch}</code> </p>`
	);
};
const gitInfo = async () => {
	const username = await execGit('git config user.name');
	const branch = await getBranch();
	if (username === undefined || username === '') {
		logger(
			'Pull Request',
			'username is not set, use: git config user.name',
			'warning'
		);
	}
	const op = await execGit('git config --get remote.origin.url');
	return {
		repoName: op.split('/')[1].replace('.git', ''),
		owner: op.split(':')[1].split('/')[0],
		username: username,
		branch: branch
	};
};
const prepareData = async () => {
	let title = await getTitle();
	var raw = JSON.stringify({
		title: title,
		body: await getBody(title, info.branch),
		head: info.branch,
		base: 'master'
	});

	return raw;
};
const call = async () => {
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

	return await fetch(
		`https://api.github.com/repos/${info.owner}/${info.repoName}/pulls`,
		requestOptions
	);
};

let info = null;
const createPR = async () => {
	info = await gitInfo();
	await call().then(response => {
		if (response.status === 422) {
			response.json().then(async data => {
				if (data.errors[0].message === undefined) {
					logger(
						'Pull Request',
						`Branch: ${info.branch} Doesnot exists on remote, please run: git push origin ${info.branch}`,
						'error'
					);
				} else {
					logger(
						'Pull Request',
						'Pull Request Already Exists',
						'error'
					);
				}
			});

			return;
		}
		if (response.status === 201) {
			response.json().then(data => {
				const pr = data.html_url;
				logger(
					'Pull Request',
					`Successfully created pull request: ${colors.blue(pr)}`,
					'success'
				);
				assignIssue(
					parseInt(pr.split('/')[pr.split('/').length - 1]),
					info
				).then(
					response.status
						? logger(
								'Pull Request',
								`Assign the Pull Requests to @${info.username}`,
								'info'
						  )
						: logger(
								'Pull Request',
								`Failed to Assign to ${info.username}`,
								'error'
						  )
				);
			});
		}
		if (response.status === 403) {
			logger('Pull Request', 'Bad Credentials', 'error');
			return;
		}
	});
};

module.exports = { createPR };
