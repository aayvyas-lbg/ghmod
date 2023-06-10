properties([
    pipelineTriggers([
        pullRequestReview(reviewStates: ['approved']),
        issueCommentTrigger('^/run.*')
    ])
])        
        
        
def triggerCause = currentBuild.rawBuild.getCause(org.jenkinsci.plugins.pipeline.github.trigger.IssueCommentCause)

if (triggerCause) {
    echo("Build was started by ${triggerCause.userLogin}, who wrote: " +
         "\"${triggerCause.comment}\", which matches the " +
         "\"${triggerCause.triggerPattern}\" trigger pattern.")
    bat("npm install && npm run test")
} else {
   echo('Build was not started by a trigger')
}
echo('Build triggered')