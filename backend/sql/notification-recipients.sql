-- Table: public.NotificationRecipients

DROP TABLE IF EXISTS public."NotificationRecipients";

CREATE TABLE IF NOT EXISTS public."NotificationRecipients"
(
	"notificationId" text COLLATE pg_catalog."default" NOT NULL,
	"userId" text COLLATE pg_catalog."default" NOT NULL,
	"readAt" timestamp NULL,
	CONSTRAINT "NotificationRecipients_pkey" PRIMARY KEY ("notificationId", "userId"),
	CONSTRAINT "notificationRecipients_notificationId_fkey" FOREIGN KEY ("notificationId")
		REFERENCES public."Notifications" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
	CONSTRAINT "notificationRecipients_userId_fkey" FOREIGN KEY ("userId")
		REFERENCES public."Users" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public."NotificationRecipients"
    OWNER to brontosaur;

COMMENT ON CONSTRAINT "notificationRecipients_notificationId_fkey" ON public."NotificationRecipients"
    IS 'One notification recipient has one notification';
COMMENT ON CONSTRAINT "notificationRecipients_userId_fkey" ON public."NotificationRecipients"
    IS 'One notification recipient has one user';
