type AckCallback = (respone: { status: "ok" | "error"; message: string }) => void;

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  userConnected: (callback: AckCallback) => void;
  userDisconnected: (callback: AckCallback) => void;
}

export interface SocketAuth {
  userId: string | undefined;
}
