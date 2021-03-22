# Uber Bus Application on AWS Cloud

![Architecture](https://github.com/PARTHSONI95/UberBusApp/blob/main/readme_image.png)

Following Micro-service architecture by running loosely coupled services on different EC2 instances have added following functionalities:

1) allow a user to search and book a bus between Start destination and End destination for a given date
2) a page to retrieve all the books

## Technology stack used 

* Front End - [React](https://reactjs.org/)
* Back End  - [Flask](https://palletsprojects.com/p/flask/)
* Database  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* Cloud     - [AWS](https://aws.amazon.com/)
* IaaS      - [Terraform](https://www.terraform.io/)

## How to run the project

Go to infrastucture folder and run the below steps:-

```bash
$ terraform init
```

```bash
$ terraform apply -auto-approve 
```

As we are attaching elastic IP to AWS EC2 instance - we can directly run it using http://<elastic-ip>:<port>

Moreover, React code will run in EC2 instance named 'frontend' and Python flask code in 'backend'.

To stop the application -

```bash
$ terraform destroy -auto-approve 
```

### THANK YOU :)