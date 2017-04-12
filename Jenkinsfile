#!groovy
pipeline {
    agent any
    stages {
        stage('build') {
            steps {
                echo "Hello World!"
                sh 'mvn --version'
                sh 'mvn -f currency-v1/pom.xml clean'
           }
        }
    }
}
