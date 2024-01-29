-- Table: public.ChatMessages

-- DROP TABLE IF EXISTS public."ChatMessages";

CREATE TABLE IF NOT EXISTS public."ChatMessages"
(
    id text COLLATE pg_catalog."default" NOT NULL,
    "chatId" text COLLATE pg_catalog."default" NOT NULL,
    "authorId" text COLLATE pg_catalog."default" NOT NULL,
    text text COLLATE pg_catalog."default" NOT NULL,
    "sentAt" timestamp without time zone NOT NULL,
    CONSTRAINT "ChatMessages_authorId_fkey" FOREIGN KEY ("authorId")
        REFERENCES public."Users" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "ChatMessages_chatId_fkey" FOREIGN KEY ("chatId")
        REFERENCES public."Chats" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."ChatMessages"
    OWNER to brontosaur;