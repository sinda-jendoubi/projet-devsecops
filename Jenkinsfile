pipeline {
  agent any
  environment {
    IMAGE = "sinda020/ubuntu-nodejs"
    TAG   = "${BUILD_NUMBER}"
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build image') {
      steps { sh 'docker build -t $IMAGE:$TAG .' }
    }
  }
}
