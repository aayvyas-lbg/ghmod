const fs = require('fs');
const { logger } = require('../../utils/logger');

const writeToCsv = async (object, fileName) => {
	fileName = fileName.replace(':', '_');
	let writer = fs.createWriteStream(`${fileName}.csv`);
	writer.write('repo_name, repo_url, file_names, file_paths, file_url\n');
	await object.forEach(async (value, key) => {
		let fileNames = '';
		await value.file_names.forEach(async file_name => {
			fileNames += file_name + '  ';
		});
		let filePaths = '';
		await value.file_paths.forEach(async file_path => {
			filePaths += file_path + '  ';
		});
		let fileUrls = '';
		await value.file_urls.forEach(async file_urls => {
			fileUrls += file_urls + '  ';
		});

		writer.write(
			`${value.repo_name}, ${value.repo_url}, ${fileNames}, ${filePaths} , ${fileUrls}\n`
		);
	});
	await logger(
		'SUCCESS',
		`Successfully generated csv file ${fileName}`,
		'success'
	);
};

module.exports = { writeToCsv };
