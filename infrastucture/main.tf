


variable "a_key" {
  type        = "string"
  description = "Enter Access Key:"
}

variable "s_key" {
  type        = "string"
  description = "Enter Secret Key:"
}

provider "aws" {
  access_key = var.a_key
  secret_key = var.s_key
  region     = "us-east-1"
}


resource "aws_vpc" "aws_demo" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support = true
  enable_classiclink_dns_support = true
  assign_generated_ipv6_cidr_block = false
  tags = {
      Name = "aws_demo"
      Tag2 = "new tag"
  }
}

resource "aws_security_group" "allow_ssh" {
    name = "allow_ssh"
    description = "Allow inbound SSH traffic from my IP"
    vpc_id = "${aws_vpc.aws_demo.id}"
    ingress {
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/32"] 
    }
    tags ={
        Name = "allow_ssh" 
    }
}   
resource "aws_security_group" "security_backend" {
    name = "security_backend"
    description = "Web Security Group"
    vpc_id = "${aws_vpc.aws_demo.id}"

    ingress {
        from_port = 22
        to_port = 22
        protocol = "tcp" 
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port = 5000
        to_port = 5000
        protocol = "tcp" 
        cidr_blocks = ["0.0.0.0/0"]
    }
    egress { 
        from_port = 0
        to_port = 0
        protocol = "-1" 
        cidr_blocks = ["0.0.0.0/0"]
    }
    tags ={
        Name = "security_backend" 
    }
}
resource "aws_security_group" "security_frontend" {
    name = "security_frontend"
    description = "Web Security Group"
    vpc_id = "${aws_vpc.aws_demo.id}"

    ingress {
        from_port = 22
        to_port = 22
        protocol = "tcp" 
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port = 3000
        to_port = 3000
        protocol = "tcp" 
        cidr_blocks = ["0.0.0.0/0"]
    }
    egress { 
        from_port = 0
        to_port = 0
        protocol = "-1" 
        cidr_blocks = ["0.0.0.0/0"]
    }
    tags ={
        Name = "security_frontend" 
    }
}

resource "aws_instance" "frontend" {
    # ami = "ami-2757f631"
    ami = "ami-042e8287309f5df03"
    instance_type = "t2.micro"
    vpc_security_group_ids = ["${aws_security_group.security_frontend.id}","${aws_security_group.allow_ssh.id}"] 
    # security_groups = ["${aws_security_group.tenable.name}"]
    key_name = "yash"
    subnet_id = "${aws_subnet.subnet-2.id}"
    tags ={
        Name = "frontend"
    }
    connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = "${file("yash.pem")}"
    host = "${self.public_ip}"
    timeout = "3m"
  } 
    provisioner "file" {
        source      = "script-fe.sh"
        destination = "/home/ubuntu/script-fe.sh"
    }

    provisioner "remote-exec" {
        inline = [
            "chmod +x /home/ubuntu/script-fe.sh",
            "/home/ubuntu/script-fe.sh args",
        ]
    }
}


resource "aws_instance" "backend" {
    # ami = "ami-2757f631"
    ami = "ami-042e8287309f5df03"
    instance_type = "t2.micro"
    vpc_security_group_ids = ["${aws_security_group.security_backend.id}","${aws_security_group.allow_ssh.id}"] 
    # security_groups = ["${aws_security_group.tenable.name}"]
    key_name = "yash"
    subnet_id = "${aws_subnet.subnet-2.id}"
    tags ={
        Name = "backend"
    }
    connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = "${file("yash.pem")}"
    host = "${self.public_ip}"
    timeout = "3m"
  } 
    provisioner "file" {
        source      = "script-be.sh"
        destination = "/home/ubuntu/script-be.sh"
    }

    provisioner "remote-exec" {
        inline = [
            "chmod +x /home/ubuntu/script-be.sh",
            "/home/ubuntu/script-be.sh args",
        ]
    }
}


resource "aws_eip_association" "eip_assoc_frontend" {
  instance_id   = aws_instance.frontend.id
  allocation_id = "eipalloc-0509567aaa55769fb"
}
resource "aws_eip_association" "eip_assoc_backend" {
  instance_id   = aws_instance.backend.id
  allocation_id = "eipalloc-0456ad303202816cf"
}

resource "aws_subnet" "subnet-2" {
  cidr_block = "10.0.2.0/24"
  vpc_id     = "${aws_vpc.aws_demo.id}"
  availability_zone = "us-east-1a"
  map_public_ip_on_launch = true
  tags = {
    Name = "subnet-2"
  }
}
resource "aws_internet_gateway" "main-gw" { 
    vpc_id = "${aws_vpc.aws_demo.id}"
    tags ={
        Name = "main" 
        }
}
resource "aws_route_table" "main-public" { 
    vpc_id = "${aws_vpc.aws_demo.id}"
    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = "${aws_internet_gateway.main-gw.id}" 
        }
    tags ={
        Name = "main-public-1" 
        }
}
resource "aws_route_table_association" "main-public-1-a" { 
    subnet_id = "${aws_subnet.subnet-2.id}" 
    route_table_id = "${aws_route_table.main-public.id}"
}
