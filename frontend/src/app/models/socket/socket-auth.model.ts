import { SocketTypeEnum } from './socket-type.enum';

export interface SocketAuth {
  userId: string | undefined;
  socketType: SocketTypeEnum;
}
