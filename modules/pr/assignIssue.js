const assignIssue = (prNumber, gitInfo) => {
	var myHeaders = new Headers();
	myHeaders.append('Accept', 'application/vnd.github+json');
	myHeaders.append('Authorization', `Bearer ${process.env.GITHUB_PAT}`);
	myHeaders.append('X-GitHub-Api-Version', '2022-11-28');
	myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

	var raw = JSON.stringify({
		assignees: [gitInfo.username]
	});

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};

	return fetch(
		`https://api.github.com/repos/${gitInfo.owner}/${gitInfo.repoName}/issues/${prNumber}/assignees`,
		requestOptions
	);
};

module.exports = { assignIssue };
