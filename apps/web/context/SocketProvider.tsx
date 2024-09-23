"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children: React.ReactNode;
}
interface ISocketContext {
  sendMessage: (message: string) => void;
  messages: string[];
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (message) => {
      if (socket) socket.emit("event:message", { message });
    },
    [socket]
  );

  const getMessage = useCallback(
    (msg: string) => {
      try {
        const { message } = JSON.parse(msg) as { message: string };
        setMessages((prev) => [...prev, message]);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    },
    [socket]
  );

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("message", getMessage);
    setSocket(_socket);

    return () => {
      _socket.disconnect();
      _socket.off("message", getMessage);
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("Socket context not found");
  return state;
};
