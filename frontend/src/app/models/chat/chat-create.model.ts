export interface ChatCreate {
  name?: string | undefined;
  isGroup: boolean;
  pictureUrl?: string | undefined;
  memberIds: string[];
}
