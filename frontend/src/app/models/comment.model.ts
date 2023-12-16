import { SessionUser } from "./session-user.model";

export interface Comment {
  id: string;
  createdAt: string;
  userId: string;
  postId: string;
  content: string;
  parentId: string | null;
}

export interface CommentShow {
  metadata: Partial<Comment>,
  author: Partial<SessionUser>,
}
