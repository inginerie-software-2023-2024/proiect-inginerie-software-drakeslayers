import { AckCallback } from 'app/models/socket.model';

export const ackCallback = (functionName: string): AckCallback => {
  return (response) => console.log(`[${functionName}] ${response.status}: ${response.message}`);
};
