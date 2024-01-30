#! /bin/bash

# THIS SCRIPT SHOULD BE RUN WITH SUDO PRIVILEGES

# Start Backend

(cd backend && npm install && sudo bash startup.sh)

(cd backend-python && pip install -r requirements.txt && (nohup python3 run.py dev 0<&- 2>&1 >> ./backend-python/python.log &))

# Crate Database

node ./backend/sql/client.js

# Start Frontend

(cd frontend && npm install && npm start)