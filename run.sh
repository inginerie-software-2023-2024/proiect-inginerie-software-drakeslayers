#! /bin/bash

# THIS SCRIPT SHOULD BE RUN WITH SUDO PRIVILEGES

# Start Backend

(cd backend && npm install && sudo bash startup.sh)


# Crate Database

node ./backend/sql/client.js

# Start Frontend

(cd frontend && npm install && npm start)