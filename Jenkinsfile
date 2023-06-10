properties([
    pipelineTriggers([

    ])
])

pipeline {
    agent any
    triggers {
        pullRequestReview(reviewStates: ['approved'])
        issueCommentTrigger('.*test.*')
    }
    stages {
        stage('npm install') {
            steps {
                bat 'npm install'
            }
        }
        stage('npm run test') {
            steps {
                script{
                    bat 'npm run test'
                }
                
            }
        }
    }
}