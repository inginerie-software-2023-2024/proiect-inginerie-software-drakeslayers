const { Client } = require('pg');

const pgclient = new Client({
    host: 'localhost',
    port: 5432,
    user: 'brontosaur',
    password: '1234',
    database: 'dbMDS'
});

pgclient.connect();

const table = 'CREATE TABLE IF NOT EXISTS public."Users" (id TEXT COLLATE pg_catalog."default" NOT NULL, email TEXT COLLATE pg_catalog."default" NOT NULL, "passwordHash" TEXT COLLATE pg_catalog."default" NOT NULL, CONSTRAINT "User_pkey" PRIMARY KEY (id)) TABLESPACE pg_default; ALTER TABLE IF EXISTS public."Users" OWNER TO brontosaur; COMMENT ON TABLE public."Users" IS \'Stores user credentials\';\n'

pgclient.query(table, (err, res) => {
    if (err) throw err
});