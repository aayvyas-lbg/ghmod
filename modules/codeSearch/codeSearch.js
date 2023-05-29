const fs = require('fs');
const { logger } = require('../../utils/logger');
const { writeToCsv } = require('./writeToCsv');
const { writeToTable } = require('./writeToTable');
const { spinner } = require('../../utils/spinners');
var colors = require('@colors/colors');
require('dotenv').config();
globalThis.fetch = fetch;

let totalCount = 0;
let repositories = new Map();

const sleep = ms => {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
};

// takes items array and iterate over it and extracts the repo name from it, returns paginated arrays
const extractName = async items => {
	if (items == null) {
		console.log('rate limit');
		return;
	}
	if (items.length === 0) {
		console.log('No items left to iterate');
		return;
	}

	await items.forEach(async element => {
		const repoName = element['repository']['name'];
		// what happens if repo name already exists ?
		const file = {
			file_name: element['name'],
			file_path: element['path'],
			file_url: element['html_url']
		};

		// create a new entry
		if (
			repositories.has(repoName) &&
			repositories.get(repoName) != undefined
		) {
			let repo = repositories.get(repoName);
			repo.file_names.push(file.file_name);
			repo.file_paths.push(file.file_path);
			repo.file_urls.push(file.file_url);
		} else {
			const repo = {
				repo_name: element['repository']['name'],
				repo_url: element['repository']['html_url'],
				file_names: [file.file_name],
				file_paths: [file.file_path],
				file_urls: [file.file_url]
			};
			repositories.set(await element['repository']['name'], await repo);
		}
	});
};

let totatResponses = 0;
// takes page number and makes an api call
const call = async (page, query, org) => {
	var requestOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${process.env.GITHUB_PAT}`
		},
		redirect: 'follow'
	};
	let response;
	let data;
	try {
		response = await fetch(
			`https://api.github.com/search/code?q=${query} org:${org}&per_page=100&page=${page}`,
			requestOptions
		);
		data = await response.json();

		if (response.status === 200 && data['items'].length == 0) {
			return 404;
		}

		if (response.status === 422) {
			totatResponses = data['totat_count'];
			console.log('No More items left');
			console.log(totatResponses);
			return response.status;
		}
		if (response.status === 403) {
			process.stdout.write('\r\x1b[K');
			// rate limit reached
			logger(
				'RATE LIMIT',
				`Rate Limit Reached, waiting for cool down`,
				'warning'
			);
			return response.status;
		}
	} catch (error) {
		console.error(error);
		return null;
	}
	await extractName(data['items']);
	return response.status;
};

// for each page calls the call method
const paginatedResponse = async (start, query, org) => {
	let rateLimitReached = false;
	let when = 0;
	for (let i = start; i <= 1000000; i++) {
		let status = await call(i, query, org);
		if (status === 404) {
			clearInterval(spin);
			break;
		}
		if (status === 403) {
			rateLimitReached = true;
			when = i;
			break;
		}
		if (status === 422) {
			logger(
				'MAX LIMIT REACHED',
				`Cannot Display Beyond 1000 items`,
				'error'
			);
			clearInterval(spin);
			break;
		}
	}
	if (rateLimitReached === true) {
		await sleep(20000);
		await paginatedResponse(when, query, org);
	}
};
let spin;
const runSearch = async (output, query, org) => {
	spin = spinner();
	await paginatedResponse(1, query, org);
	process.stdout.write('\r\x1b[K');
	process.stdout.write(
		`Total repositories found: ${colors.green(
			colors.bold(repositories.size.toString())
		)}, for query: ${colors.green(colors.bold(query))}`
	);
	switch (output) {
		case 'csv':
			logger(`GENERATING CSV", "Generating CSV...`, 'success');
			await writeToCsv(repositories, query);
			break;
		case 'json':
			console.log(repositories);
			break;
		case 'table':
			await writeToTable(repositories);
			break;
		default:
			await writeToTable(repositories);
	}

	return repositories;
};

module.exports = { runSearch };
