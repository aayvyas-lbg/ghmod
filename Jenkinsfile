properties([
    pipelineTriggers([
        pullRequestReview(reviewStates: ['approved']),
        issueCommentTrigger('.*test.*')
    ])
])        
        
        
  
pipeline {
    agent any

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