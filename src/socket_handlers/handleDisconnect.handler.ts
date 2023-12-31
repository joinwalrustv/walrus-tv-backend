import { Server, Socket } from "socket.io";

export const handleDisconnect = (io: Server): ((socket: Socket) => void) => {
  return (socket: Socket) => {
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      io.emit("user disconnected", { userId: 1 });
    });
  };
};
