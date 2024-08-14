"use client";

import { pbAuth } from "@/atoms";
import { Container, Paper } from "@mui/material";
import { type NextPage } from "next";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import io, { type Socket } from "socket.io-client";
import SendCommand from "./_sendCommand";

const Admin: NextPage = () => {
  const router = useRouter();
  const [auth] = useRecoilState(pbAuth);
  const [messages, setMessages] = useState<string[]>([]);
  const [showFullLogs, setShowFullLogs] = useState(false);
  const socket = useRef<Socket>();

  useEffect(() => {
    if (!auth.token) {
      router.replace("/admin/login");
    }
  }, [auth, router]);

  const handleLine = useCallback(
    (line: string) => {
      setMessages((messages) => {
        const newMessages = [...messages];
        newMessages.unshift(line);
        if (newMessages.length > 1000 && !showFullLogs) {
          newMessages.pop();
        }
        return newMessages;
      });
    },
    [showFullLogs]
  );

  const handleAuth = useCallback(
    (status: "success" | "invalid") => {
      if (status === "success") {
        console.info("Successfully logged in to socket.io");
      } else {
        handleLine("Error logging in!");
      }
    },
    [handleLine]
  );

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
  }, [auth.token, handleAuth, handleLine]);

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
          height: "90vh",
          overflowY: "scroll",
        }}
      >
        {messages.map((message, i) => {
          return <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: message }} key={i} />;
        })}
        {messages.length >= 1000 && showFullLogs === false && (
          <p>
            Server log has been truncated!{" "}
            <a href="#" onClick={handleShowFullLogs} style={{ color: "#ffffff" }}>
              View the full log
            </a>{" "}
            (this may cause your browser to lag)
          </p>
        )}
      </Paper>
      <SendCommand socket={socket} />
    </Container>
  );
};

export default Admin;
