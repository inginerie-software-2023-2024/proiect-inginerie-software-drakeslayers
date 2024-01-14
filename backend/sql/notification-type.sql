-- TYPE: public.NotificationType

-- DROP TYPE IF EXISTS public."NotificationType";

CREATE TYPE public."NotificationType" AS ENUM ('FollowRequest', 'PostLike', 'CommentLike', 'NewComment', 'NewReply');