# Analytics Dashboard DevOps Setup Guide

This guide provides step-by-step instructions for setting up the complete DevOps pipeline for the Analytics Dashboard project.

## Table of Contents
1. [Version Control & Collaboration](#version-control--collaboration)
2. [Jenkins CI/CD Pipeline](#jenkins-cicd-pipeline)
3. [Infrastructure as Code](#infrastructure-as-code)
4. [Monitoring & Logging](#monitoring--logging)
5. [Security & DevSecOps](#security--devsecops)

## Version Control & Collaboration

### Branching Strategy
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature branches
- `hotfix/*`: Emergency fixes
- `release/*`: Release preparation

### GitHub Settings
1. Enable branch protection for `main`:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date
   - Include administrators

2. Configure GitHub Actions:
   - Enable automatic branch deletion
   - Enable automatic merge on PR approval

## Jenkins CI/CD Pipeline

### Prerequisites
1. Install Jenkins on an EC2 instance
2. Install required plugins:
   - Docker Pipeline
   - GitHub Integration
   - SSH Agent
   - Slack Notification
   - SonarQube Scanner
   - OWASP Dependency-Check
   - JUnit

### Jenkins Setup
1. Configure credentials:
   ```bash
   # AWS Credentials
   aws-access-key-id
   aws-secret-access-key

   # Docker Registry
   docker-credentials

   # EC2 SSH Key
   ec2-ssh-key

   # Slack Webhook
   slack-webhook-url
   ```

2. Configure GitHub webhook:
   - Payload URL: `http://your-jenkins-url/github-webhook/`
   - Content type: `application/json`
   - Events: `Just the push event`

3. Create a new Pipeline job:
   - Select "Pipeline script from SCM"
   - Choose Git
   - Repository URL: `https://github.com/KeshavAgrawal2903/Analytics-Dashboard`
   - Branch: `*/main`
   - Script path: `Jenkinsfile`

## Infrastructure as Code

### Terraform Setup
1. Initialize Terraform:
   ```bash
   cd terraform
   terraform init
   ```

2. Create `terraform.tfvars`:
   ```hcl
   aws_region = "us-east-1"
   key_name = "your-key-name"
   db_username = "your-db-username"
   db_password = "your-db-password"
   ```

3. Apply Terraform:
   ```bash
   terraform plan
   terraform apply
   ```

### Ansible Setup
1. Create inventory file:
   ```ini
   [webservers]
   your-ec2-public-ip ansible_user=ubuntu
   ```

2. Run Ansible playbook:
   ```bash
   ansible-playbook -i inventory playbook.yml
   ```

## Monitoring & Logging

### Prometheus & Grafana
1. Access Prometheus: `http://your-ec2-ip:9090`
2. Access Grafana: `http://your-ec2-ip:3000`
   - Default credentials: admin/admin
   - Change password on first login

### ELK Stack
1. Access Kibana: `http://your-ec2-ip:5601`
2. Configure index patterns:
   - Pattern: `analytics-dashboard-*`
   - Time field: `@timestamp`

## Security & DevSecOps

### SonarQube
1. Install SonarQube server
2. Configure Jenkins integration:
   - Add SonarQube server in Jenkins
   - Configure quality gates

### Trivy
1. Install Trivy:
   ```bash
   wget https://github.com/aquasecurity/trivy/releases/download/v0.18.3/trivy_0.18.3_Linux-64bit.deb
   sudo dpkg -i trivy_0.18.3_Linux-64bit.deb
   ```

### OWASP ZAP
1. Install ZAP:
   ```bash
   docker pull owasp/zap2docker-stable
   ```

2. Run baseline scan:
   ```bash
   docker run -t owasp/zap2docker-stable zap-baseline.py -t http://your-ec2-ip
   ```

## Troubleshooting

### Common Issues
1. Jenkins pipeline fails:
   - Check Jenkins logs
   - Verify credentials
   - Check GitHub webhook configuration

2. Deployment fails:
   - Check EC2 instance status
   - Verify Docker containers
   - Check application logs

3. Monitoring issues:
   - Verify Prometheus targets
   - Check Grafana data sources
   - Verify ELK stack connectivity

### Support
For additional support, please create an issue in the GitHub repository. 