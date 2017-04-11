pipeline {
    agent { docker 'maven:3.0.5' }
    stages {
        stage('build') {
            steps {
                sh 'mvn --version'
            }
        }
    }
}