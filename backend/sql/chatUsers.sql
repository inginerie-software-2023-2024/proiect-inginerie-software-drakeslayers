-- Table: public.ChatUsers

-- DROP TABLE IF EXISTS public."ChatUsers";

CREATE TABLE IF NOT EXISTS public."ChatUsers"
(
    "chatId" text COLLATE pg_catalog."default" NOT NULL,
    "userId" text COLLATE pg_catalog."default" NOT NULL,
    "lastRead" timestamp without time zone NOT NULL,
    CONSTRAINT "ChatUsers_pkey" PRIMARY KEY ("chatId", "userId"),
    CONSTRAINT "chatUsers_chatId_fkey" FOREIGN KEY ("chatId")
        REFERENCES public."Chats" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "chatUsers_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public."Users" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."ChatUsers"
    OWNER to brontosaur;