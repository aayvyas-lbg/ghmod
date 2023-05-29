var Table = require('cli-table3');
var colors = require('@colors/colors');

const writeToTable = object => {
	// instantiate
	var table = new Table({
		head: [
			colors.green('repo_name'),
			colors.green('repo_url'),
			colors.green('file_names')
		],
		colWidths: [40, 80, 80],
		style: { compact: true, 'padding-left': 1 }
	});
	object.forEach((value, key) => {
		let fileNames = '';
		value.file_names.forEach(file_name => {
			fileNames += file_name + '  ';
		});
		let filePaths = '';
		value.file_paths.forEach(file_path => {
			filePaths += file_path + '  ';
		});
		let fileUrls = '';
		value.file_urls.forEach(file_urls => {
			fileUrls += file_urls + '  ';
		});
		table.push([value.repo_name, value.repo_url, fileNames]);
	});
	console.log('\n');
	console.log(table.toString());
};

module.exports = { writeToTable };
