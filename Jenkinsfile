properties([
    pipelineTriggers([
      pullRequestReview(reviewStates: ['approved'])
    ])
])

pipeline {
    agent any
    tools {
        maven 'apache-maven-3.0.1' 
    }
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