"use client";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    sendMessage(message);
  };
  return (
    <div>
      <div>
        <h1>All messages will appear here</h1>
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter message here.."
          className={classes["chat-input"]}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className={classes["send-button"]} onClick={handleSendMessage}>
          Send
        </button>
      </div>
      <div>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </div>
    </div>
  );
}
