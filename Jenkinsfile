properties([
    pipelineTriggers([
        pullRequestReview(reviewStates: ['approved']),
        issueCommentTrigger('.*test.*')
    ])
])        
        
        
def triggerCause = currentBuild.rawBuild.getCause(org.jenkinsci.plugins.pipeline.github.trigger.IssueCommentCause)

if (triggerCause) {
    echo("Build was started by ${triggerCause.userLogin}, who wrote: " +
         "\"${triggerCause.comment}\", which matches the " +
         "\"${triggerCause.triggerPattern}\" trigger pattern.")
} else {
    echo('Build was not started by a trigger')
}

// def triggerCause = currentBuild.rawBuild.getCause(org.jenkinsci.plugins.pipeline.github.trigger.PullRequestReviewCause)

// if (triggerCause) {
//     echo("Build was started by ${triggerCause.userLogin}, who reviewed the PR: " +
//          "\"${triggerCause.state}\", which matches one of " +
//          "\"${triggerCause.reviewStates}\" trigger pattern.")
// } else {
//     echo('Build was not started by a trigger')
// }
echo('Build triggered')