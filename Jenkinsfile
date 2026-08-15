pipeline {
    agent {
        label 'docker-agent'
    }

    environment {
        FRONTEND_IMAGE = 'smarttask-frontend'
        BACKEND_IMAGE = 'smarttask-backend'
        DOCKER_REGISTRY = 'docker.io/manadlm'
        DOCKER_CREDENTIALS = 'docker-hub-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Récupération du code depuis GitHub...'
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Construction de l\'image Frontend...'
                script {
                    docker.build("${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:${env.BRANCH_NAME}", "./frontend")
                }
            }
        }

        stage('Build Backend') {
            steps {
                echo 'Construction de l\'image Backend...'
                script {
                    docker.build("${DOCKER_REGISTRY}/${BACKEND_IMAGE}:${env.BRANCH_NAME}", "./backend")
                }
            }
        }

        stage('Login Docker Hub') {
            steps {
                echo 'Connexion à Docker Hub avec le token...'
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS) {
                        // Login automatique
                    }
                }
            }
        }

        stage('Push Images') {
            steps {
                echo 'Publication des images sur Docker Hub...'
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS) {
                        docker.image("${DOCKER_REGISTRY}/${FRONTEND_IMAGE}:${env.BRANCH_NAME}").push()
                        docker.image("${DOCKER_REGISTRY}/${BACKEND_IMAGE}:${env.BRANCH_NAME}").push()
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline terminé avec succès !'
        }
        failure {
            echo 'Pipeline échoué. Vérifiez les logs.'
        }
    }
}
