import Redis from "ioredis";
import { Server } from "socket.io";

const publisher = new Redis({
  host: "valkey-299c2962-rohan-d489.i.aivencloud.com",
  port: 24064,
  username: "default",
  password: "AVNS_XwPX5l9mdJDoFUrE3Dg",
});
const subscriber = new Redis({
  host: "valkey-299c2962-rohan-d489.i.aivencloud.com",
  port: 24064,
  username: "default",
  password: "AVNS_XwPX5l9mdJDoFUrE3Dg",
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Initializing SocketService...");
    this._io = new Server({
      cors: {
        origin: "*",
      },
    });
    subscriber.subscribe("MESSAGES");
  }
  get io() {
    return this._io;
  }
  public initListeners() {
    const io = this._io;
    console.log("Initializing socket listeners...");

    io.on("connection", (socket) => {
      console.log("A user connected", socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("Message received: ", message);
        // publish this message to Redis
        await publisher.publish("MESSAGES", JSON.stringify({ message }));
      });

      socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
      });
    });

    subscriber.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        io.emit("message", message);
      }
    });
  }
}
export default SocketService;
