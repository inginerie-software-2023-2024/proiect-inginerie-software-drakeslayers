-- Table: public.Chats

-- DROP TABLE IF EXISTS public."Chats";

CREATE TABLE IF NOT EXISTS public."Chats"
(
    id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "isGroup" boolean NOT NULL,
    "pictureUrl" text COLLATE pg_catalog."default",
    CONSTRAINT "Chats_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Chats"
    OWNER to brontosaur;