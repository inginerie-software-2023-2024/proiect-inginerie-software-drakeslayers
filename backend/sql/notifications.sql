-- Table: public.Notifications

-- DROP TABLE IF EXISTS public."Notifications";

CREATE TABLE IF NOT EXISTS public."Notifications"
(
	id text COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp NOT NULL,
    "userId" text COLLATE pg_catalog."default" NOT NULL,
    type public."NotificationType" NOT NULL,
	content jsonb NULL,
	CONSTRAINT "Notifications_pkey" PRIMARY KEY (id),
	CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId")
		REFERENCES public."Users" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public."Notifications"
    OWNER to brontosaur;

COMMENT ON CONSTRAINT "notifications_userId_fkey" ON public."Notifications"
    IS 'One notification has one user';
