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

    stage('Trivy - rapport') {
      steps {
        sh '''
          trivy image --skip-db-update --scanners vuln \
            --format json -o trivy-report.json $IMAGE:$TAG
          trivy image --skip-db-update --scanners vuln \
            --severity HIGH,CRITICAL -o trivy-report.txt $IMAGE:$TAG
        '''
        archiveArtifacts artifacts: 'trivy-report.*', allowEmptyArchive: true
      }
    }

    stage('Trivy - contrôle de sécurité') {
      steps {
        // Échoue (code 1) si une faille HIGH ou CRITICAL est trouvée
        sh '''
          trivy image --skip-db-update --scanners vuln \
            --severity HIGH,CRITICAL --exit-code 1 $IMAGE:$TAG
        '''
      }
    }

    stage('Push Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                         usernameVariable: 'USER', passwordVariable: 'PASS')]) {
          sh '''
            echo $PASS | docker login -u $USER --password-stdin
            docker push $IMAGE:$TAG
          '''
        }
      }
    }

    stage('Deploy Minikube') {
      steps {
        sh '''
          sed "s|IMAGE_PLACEHOLDER|$IMAGE:$TAG|" k8s/deployment.yaml | kubectl apply -f -
          kubectl apply -f k8s/service.yaml
          kubectl rollout status deployment/monapp --timeout=600s
        '''
      }
    }
  }

  post {
    always { sh 'docker logout || true' }
    success { echo "Pipeline réussi : $IMAGE:$TAG déployée" }
    failure { echo "Pipeline en échec : voir les logs et trivy-report.txt" }
  }
}
