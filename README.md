# Software Architecture Report

### What the purpose of the software project is:
- It’s a social media application meant to connect people around the globe.
- It offers capabilities similar to other popular social media apps, such as creating posts, uploading pictures, leaving comments, liking content, getting recommendations, chatting, sending follow requests etc.


### Guides on how to: 
- clone repository
```bash
git clone https://github.com/inginerie-software-2023-2024/proiect-inginerie-software-drakeslayers
```

*make sure you have docker installed and you have 2 containers, one with a Redis image and one with a Postgres image. For backend, npm install packages and then run startup.sh (this automatically starts docker containers and runs nodejs server in watch mode) and you can stop it with shutdown.sh(this also stops frontend). For frontend, npm install and ng serve. Bonus, for recommendation system (flask server), pip install -r requirements.txt and then run python run.py.
npm install + npm build

- backend (express server)
```bash
cd ./backend
npm install
./startup.sh
```

- backend (python server)
```bash
cd ./backend-python
pip install -r requirements.txt
python run.py
```

- frontend (angular server)
```bash
cd ./frontend
npm install
ng serve
```

- it can be deployed to remote server (Digital Ocean) with the same flow as above. Changes are automatically made here by pushing to production branch.
For backend it is similar to MVC architecture, we have separated controllers, routers and models. Models are usually found in globals as interfaces

### Application entry points:
- Redis database for session management and Postgres database for all entities in the application
- Pictures and text content provided by users
- Configuration files for github actions, typescript config files, package.json

## High level diagrams of the architecture  
**Most valuable output** - the application itself, which is a web application that can be accessed from any browser. It is a social media application that allows users to create posts, upload pictures, leave comments, like content, get recommendations, chat, send follow requests. 

## Deployment plan 
- We utilized a DigitalOcean Droplet (a Virtual Machine farm located in Frankfurt) to deploy both our FrontEnd and BackEnd solutions. With the assistance of Nginx and its valuable reverse-proxy functionality, we successfully made our product accessible to all. Additionally, Nginx enables us to scale this project using its load balancing system
- We implemented the CI/CD pipelines using Github Actions. The action is triggered when code is being pushed to the production branch. The FrontEnd Angular solution is built and stored as artifacts on Github's servers before deployment via SFTP. The BackEnd code is uploaded to the Virtual Machine (VM) via SFTP. Subsequently, the action logs into the VM and executes scripts to initiate the site

## Description of the QA process 
Our application mainly performs CRUD operations, so we have built integration tests to ensure that our API endpoints work correctly. (user login, signup, create post etc.)

## External dependencies included in the project 
- langchain as a wrapper for GPT to promt it with messages and get responses
- ChatGPT API for hashtags extraction from post's description
- socket.io for WebSockets which helps us ensure real time communication between users chatting or for receiving notifications when certain events occur 
- express framework for web application itself (helps set routes, controllers, middlewares)
- knex is a query builder that simplifies access to Postgres database
- bycrypt is used for password hashing and encryption to ensure protection of private data
-  multer is a middleware that helps with file upload (pictures posted by users)


