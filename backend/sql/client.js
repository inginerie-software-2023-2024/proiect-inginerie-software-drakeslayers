const { Client } = require('pg');

const pgclient = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB_NAME
});

pgclient.connect();

const table = 'CREATE TABLE IF NOT EXISTS public."Users" (id TEXT COLLATE pg_catalog."default" NOT NULL, email TEXT COLLATE pg_catalog."default" NOT NULL, "passwordHash" TEXT COLLATE pg_catalog."default" NOT NULL, CONSTRAINT "User_pkey" PRIMARY KEY (id)) TABLESPACE pg_default; ALTER TABLE IF EXISTS public."Users" OWNER TO brontosaur; COMMENT ON TABLE public."Users" IS \'Stores user credentials\';\n'

pgclient.query(table, (err, res) => {
    if (err) throw err
});