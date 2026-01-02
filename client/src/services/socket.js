import { io } from "socket.io-client";

let socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      auth: {
        token: localStorage.getItem("token"), 
      },
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error("Socket not connected");
  return socket;
};
