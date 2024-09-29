import { backendURL } from "@/public/config";
import { io } from "socket.io-client";

let socket;

export const useSocket = (jwt: string) => {
    if (!socket) {
        socket = io(`${backendURL}`, { auth: { token: jwt } })
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocketInstance = () => socket;
