const {Client} = require('pg');

const client = new Client({
    host: '127.0.0.1',
    user: 'brontosaur',
    database: 'dbMDS',
    password: '1234',
    port: 5432
});

client.connect()
    .then(() => {
        console.log('Connected to the PostgreSQL database');

        // const createDB = 'DROP DATABASE IF EXISTS "dbMDS"; CREATE DATABASE "dbMDS" WITH OWNER = brontosaur ENCODING = \'UTF8\' LC_COLLATE = \'en_US.utf8\' LC_CTYPE = \'en_US.utf8\' TABLESPACE = pg_default CONNECTION LIMIT = -1 IS_TEMPLATE = False;\n';
        //
        // client.database(createDB, (err, res) => {
        //     if (err) {
        //         console.error('Error creating DB', err);
        //     } else {
        //         console.log('DB create successfully');
        //     }
        // });

        return client.end();
    })
    .then(() => {
        console.log('Connection to PostgreSQL closed');
    })
    .catch(err => {
        console.error('Error connecting to PostgreSQL database', err);
    });