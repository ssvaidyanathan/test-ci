#!groovy
def project_dir = 'currency-v1'
pipeline {
    agent any

    stages {
        stage("Show tool versions") {
          steps {
                sh 'mvn --version'
                sh 'npm --version'
                 }
        }
        stage('clean') {
            steps {
                sh "mvn -f ${project_dir}/pom.xml clean"
           }
        }
        stage('install') {
          steps {
            sh "mvn -f ${project_dir}/pom.xml install -Denv.APIGEE_ORG=params.APIGEE_ORG -Denv.APIGEE_USERNAME=params.APIGEE_USERNAME -Denv.APIGEE_PASSWORD=params.APIGEE_PASSWORD -Denv.API_DOMAIN_TEST=params.API_DOMAIN_TEST -Ddeployment.suffix=params.DEPLOYMENT_SUFFIX"
          }
        }
    }
}
