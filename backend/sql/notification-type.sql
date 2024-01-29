-- TYPE: public.NotificationType

-- DROP TYPE IF EXISTS public."NotificationType";
-- ALTER TYPE public."NotificationType" ADD VALUE 'NewFollower';

CREATE TYPE public."NotificationType" AS ENUM ('FollowRequest', 'NewFollower', 'PostLike', 'CommentLike', 'NewComment', 'NewReply');