import { Button, TextField } from "@mui/material";
import { type ChangeEventHandler, type MutableRefObject, useState } from "react";
import { type Socket } from "socket.io-client";

interface IProps {
  socket: MutableRefObject<Socket | undefined>;
}

const SendCommand: React.FC<IProps> = ({ socket }) => {
  const [command, setCommand] = useState("");

  const handleCommandChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setCommand(evt.target.value);
  };

  const sendCommand = () => {
    if (socket.current) {
      socket.current.emit("command", command);
      setCommand("");
    }
  };

  return (
    <>
      <TextField label="command" sx={{ fontFamily: "monospace" }} value={command} onChange={handleCommandChange} />
      <Button onClick={sendCommand}>Send Command</Button>
    </>
  );
};

export default SendCommand;
