"use server";

import Chat from "prismarine-chat";

const ChatMessage = Chat("1.19.2");

const getHTML = async (msg: string) => {
  const message = new ChatMessage(msg);

  return message.toHTML();
};

export default getHTML;
