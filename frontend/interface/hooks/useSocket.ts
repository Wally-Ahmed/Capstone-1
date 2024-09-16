import { backendURL } from "@/public/config";
import { io } from "socket.io-client";

let socket;

export const useSocket = (jwt: string, namespace: 'tablemap' | 'kitchen' | 'shift' | 'tab') => {
    if (!socket) {
        socket = io(`${backendURL}${namespace}`, { auth: { token: jwt } })
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
