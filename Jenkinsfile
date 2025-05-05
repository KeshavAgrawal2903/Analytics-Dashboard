pipeline {
    agent any
    
    environment {
        // AWS Credentials
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        AWS_REGION = 'us-east-1'
        
        // Docker Registry
        DOCKER_REGISTRY = 'your-docker-registry'
        DOCKER_CREDENTIALS = credentials('docker-credentials')
        
        // EC2 Deployment
        EC2_HOST = 'your-ec2-host'
        EC2_SSH_KEY = credentials('ec2-ssh-key')
        
        // Slack Notifications
        SLACK_WEBHOOK_URL = credentials('slack-webhook-url')
        
        // Application
        APP_NAME = 'analytics-dashboard'
        FRONTEND_PORT = '3000'
        BACKEND_PORT = '5001'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('client') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Run Backend Tests') {
            steps {
                dir('server') {
                    sh 'npm install'
                    sh 'npm test'
                    junit 'test-results/**/*.xml'
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    // Build frontend image
                    docker.build("${DOCKER_REGISTRY}/${APP_NAME}-frontend:${env.BUILD_NUMBER}", 'client')
                    
                    // Build backend image
                    docker.build("${DOCKER_REGISTRY}/${APP_NAME}-backend:${env.BUILD_NUMBER}", 'server')
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                script {
                    // Scan frontend image
                    sh 'trivy image --severity HIGH,CRITICAL ${DOCKER_REGISTRY}/${APP_NAME}-frontend:${env.BUILD_NUMBER}'
                    
                    // Scan backend image
                    sh 'trivy image --severity HIGH,CRITICAL ${DOCKER_REGISTRY}/${APP_NAME}-backend:${env.BUILD_NUMBER}'
                }
            }
        }
        
        stage('Deploy to EC2') {
            steps {
                script {
                    // SSH into EC2 and deploy using Docker Compose
                    sshagent(['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                                cd /opt/${APP_NAME} &&
                                docker-compose pull &&
                                docker-compose up -d
                            '
                        """
                    }
                }
            }
        }
        
        stage('OWASP ZAP Scan') {
            steps {
                script {
                    // Run ZAP scan on deployed application
                    sh 'docker run -t owasp/zap2docker-stable zap-baseline.py -t http://${EC2_HOST}:${FRONTEND_PORT}'
                }
            }
        }
    }
    
    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        success {
            // Send success notification
            slackSend(
                color: 'good',
                message: "Build ${currentBuild.displayName} succeeded!"
            )
        }
        failure {
            // Send failure notification
            slackSend(
                color: 'danger',
                message: "Build ${currentBuild.displayName} failed!"
            )
        }
    }
} 