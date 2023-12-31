import { Server, Socket } from "socket.io";

export const handleChatMessages = (io: Server): ((socket: Socket) => void) => {
  return (socket: Socket) => {
    socket.on("chat message", (data) => {
      console.log(`Got a chat message: ${data}`);
    });
  };
};
