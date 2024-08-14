"use client";

import { pbAuth } from "@/atoms";
import { Button, Container, Paper, TextField } from "@mui/material";
import { type NextPage } from "next";
import { useRouter } from "next/navigation";
import { type ChangeEventHandler, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import io, { type Socket } from "socket.io-client";

const Admin: NextPage = () => {
  const router = useRouter();
  const [auth] = useRecoilState(pbAuth);
  const [messages, setMessages] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const [showFullLogs, setShowFullLogs] = useState(false);
  const socket = useRef<Socket>();

  useEffect(() => {
    if (!auth.token) {
      router.replace("/admin/login");
    }
  }, [auth, router]);

  const handleLine = (line: string) => {
    console.log(line);
    setMessages((messages) => {
      const newMessages = [...messages];
      newMessages.unshift(line);
      if (newMessages.length > 1000 && !showFullLogs) {
        newMessages.pop();
      }
      return newMessages;
    });
  };

  const handleAuth = (status: "success" | "invalid") => {
    if (status === "success") {
      console.info("Successfully logged in to socket.io");
    } else {
      handleLine("Error logging in!");
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  useEffect(() => {
    console.log("running use effect");
    socket.current = io("http://localhost:3001");

    if (auth.token) {
      setMessages([]);
      socket.current.on("line", handleLine);

      socket.current.emit("auth", auth.token);

      socket.current.on("auth", handleAuth);

      socket.current.on("clear", handleClear);
    } else {
      handleLine("Not logged in!");
    }

    return () => {
      if (socket.current) {
        socket.current.close();
        socket.current = undefined;
      }
    };
  }, []);

  const handleCommandChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setCommand(evt.target.value);
  };

  const sendCommand = () => {
    if (socket.current) {
      setCommand("");
      socket.current.emit("command", command);
    }
  };

  const handleShowFullLogs = () => {
    console.log("asdf");
    if (socket.current) {
      setShowFullLogs(true);
      socket.current.emit("requestResendLog");
    }
  };

  return (
    <Container>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column-reverse",
          fontFamily: "monospace",
          maxHeight: "90vh",
          overflowY: "scroll",
        }}
      >
        {messages.map((message, i) => {
          return <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: message }} key={i} />;
        })}
        {messages.length >= 1000 && (
          <p>
            Server log has been truncated!{" "}
            <a href="#" onClick={handleShowFullLogs} style={{ color: "#ffffff" }}>
              View the full log
            </a>{" "}
            (this may cause your browser to lag)
          </p>
        )}
      </Paper>
      <TextField label="command" sx={{ fontFamily: "monospace" }} value={command} onChange={handleCommandChange} />
      <Button onClick={sendCommand}>Send Command</Button>
    </Container>
  );
};

export default Admin;
