-- Table: public.Profiles

-- DROP TABLE IF EXISTS public."Profiles";

CREATE TABLE IF NOT EXISTS public."Profiles"
(
    id text COLLATE pg_catalog."default" NOT NULL,
    "userId" text COLLATE pg_catalog."default" NOT NULL,
    username text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    "profilePictureURL" text COLLATE pg_catalog."default" NOT NULL,
    bio text COLLATE pg_catalog."default",
    "isPrivate" boolean NOT NULL DEFAULT false,
    "hashtags" text[] COLLATE pg_catalog."default" NOT NULL DEFAULT array[]::text[],
    CONSTRAINT "Profiles_pkey" PRIMARY KEY (id),
    CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public."Users" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Profiles"
    OWNER to brontosaur;

COMMENT ON TABLE public."Profiles"
    IS 'Stores user information';