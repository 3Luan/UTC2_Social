import React from "react";
import Header from "../components/Header";
import MyChat from "../components/MyChat";
import ChatBox from "../components/ChatBox";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const Message = () => {
  const { chatId } = useParams();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [selectedChat, setSelectedChat] = useState(() => {
    // Lấy dữ liệu từ local storage khi component khởi tạo
    const savedSelectedChat = localStorage.getItem("selectedChat");
    return savedSelectedChat ? JSON.parse(savedSelectedChat) : null;
  });

  // Cập nhật local storage mỗi khi selectedChat thay đổi
  useEffect(() => {
    localStorage.setItem("selectedChat", JSON.stringify(selectedChat));
  }, [selectedChat]);

  return (
    <div className="w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-gray-100 lg:rounded-lg h-screen overflow-hidden">
      <Header />
      {/* CENTER */}
      <div className="w-full mt-24 flex gap-2 lg:gap-4 pt-3 h-full">
        <MyChat
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          fetchAgain={fetchAgain}
        />
        <ChatBox
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          chatId={chatId}
        />
      </div>
    </div>
  );
};

export default Message;
