properties([
    pipelineTriggers([
      pullRequestReview(reviewStates: ['approved'])
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
                bat 'npm install'
            }
        }
    }
}