import { env } from "./env";
import PocketBase from "pocketbase";
import { Collections } from "./types";
import fs from "fs";
import { type DefaultEventsMap } from "node_modules/socket.io/dist/typed-events";
import { RemoteSocket, Socket } from "socket.io";

interface ClientToServerEvents {
  auth: (token: string) => void;
  command: (command: string) => void;
  requestResendLog: () => void;
}

interface ServerToClientEvents {
  line: (line: string) => void;
  clear: () => void;
  auth: (status: "success" | "invalid") => void;
}

interface SocketData {
  isAuthed: boolean;
}

export const startWSServer = async () => {
  const http = await import("http");

  console.log("Starting WS Server");
  const server = http.createServer((req, res) => {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "This server is configured to only handle websockets!" }));
  });

  const { Server } = await import("socket.io");
  const { Rcon } = await import("rcon-client");
  const { Tail } = await import("tail");
  const Chat = (await import("prismarine-chat")).default;
  const ANSIParser = (await import("ansi-to-html")).default;

  const ChatMessage = Chat("1.19.2");
  const parseAnsi = new ANSIParser({
    colors: {},
  });

  const tail = new Tail(env.SERVER_LOG_LOCATION, { flushAtEOF: true });
  const io = new Server<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  const rcon = await Rcon.connect({
    host: env.RCON_HOST,
    port: env.RCON_PORT,
    password: env.RCON_PASSWORD,
  });

  const parseAndSendLine = (
    line: string,
    socket?:
      | Socket<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketData>
      | RemoteSocket<ServerToClientEvents, SocketData>
  ) => {
    const message = new ChatMessage(line);

    if (socket) {
      return socket.emit("line", message.toHTML());
    }

    return io.emit("line", message.toHTML());
  };

  tail.on("error", () => {
    parseAndSendLine("§cError reading server log!");
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  tail.on("line", async (line: string) => {
    const sockets = await io.fetchSockets();
    console.log(sockets.length);
    for (const socket of sockets) {
      if (socket.data.isAuthed) {
        parseAndSendLine(line, socket);
      }
    }
  });

  io.on("connection", (socket) => {
    socket.on("command", async (command) => {
      const response = await rcon.send(command);
      for (const line of response.split("\n")) {
        parseAndSendLine(line, socket);
      }
    });

    socket.on("auth", async (token) => {
      const pb = new PocketBase(env.NEXT_PUBLIC_POCKETBASE_HOST);

      try {
        pb.authStore.save(token);
        const res = await pb.collection(Collections.Admins).authRefresh();
        if (res.token) {
          socket.emit("auth", "success");
          socket.data.isAuthed = true;
          try {
            const log = fs.readFileSync(env.SERVER_LOG_LOCATION, "utf-8");
            for (const line of log.split("\n")) {
              socket.emit("line", parseAnsi.toHtml(line));
            }
          } catch {
            parseAndSendLine("§cError reading server log!", socket);
          }
        } else {
          socket.emit("auth", "invalid");
        }
      } catch (err) {
        socket.emit("auth", "invalid");
      }
    });

    socket.on("requestResendLog", () => {
      if (!socket.data.isAuthed) {
        return parseAndSendLine("§cSocket tried to request full logs but is not authenticated!", socket);
      }

      socket.emit("clear");
      const log = fs.readFileSync(env.SERVER_LOG_LOCATION, "utf-8");
      for (const line of log.split("\n")) {
        socket.emit("line", parseAnsi.toHtml(line));
      }
    });
  });

  server.listen(parseInt(process.env.wsPort ?? "3001"), () => {
    console.log(`WS Server started on ${process.env.wsPort ?? 3001}`);
  });
};
