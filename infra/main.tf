provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "app_server" {
  ami           = "ami-0c55b159cbfafe1f0" # Ubuntu AMI
  instance_type = "t2.micro"
  key_name      = "mykey"
  
  tags = {
    Name = "Analytics-Dashboard-Server"
  }
}
