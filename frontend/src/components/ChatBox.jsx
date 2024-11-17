import { fetchMessagesAPI, sendMessageAPI } from "../services/messageService";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import io from "socket.io-client";
import toast from "react-hot-toast";
import UpdateChatModal from "./modals/UpdateChatModal";
import RenameGroupChatModal from "./modals/RenameGroupChatModal";
import LargeImageModal from "./modals/LargeImageModal";

const ENDPOINT = `${process.env.REACT_APP_URL_BACKEND}`;
var socket, selectedChatCompare;

const ChatBox = ({
  selectedChat,
  setSelectedChat,
  chatId,
  fetchAgain,
  setFetchAgain,
}) => {
  const [init, setInit] = useState();
  const [initMessages, setInitMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sender, setSender] = useState("");
  const [displayedMessagesCount, setDisplayedMessagesCount] = useState(10);
  const auth = useSelector((state) => state.auth);
  const [scrollPosition, setScrollPosition] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [chats, setChats] = useState();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showRenameGroupModal, setShowRenameGroupModal] = useState(false);
  const [showUpdateGroupModal, setShowUpdateGroupModal] = useState(false);
  const menuRef = useRef();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleOnCloseRenameGroupModal = () => setShowRenameGroupModal(false);
  const handleOnCloseUpdateGroupModal = () => setShowUpdateGroupModal(false);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      let limit = displayedMessagesCount;
      if (limit !== 0) {
        const data = await fetchMessagesAPI(selectedChat._id, limit);
        if (data.length === 0) {
          setDisplayedMessagesCount(0);
          setInit(true);
        } else {
          if (!init) {
            setInitMessages(data);
            setMessages(data);
            setInit(true);
            setScrollPosition(0);
          } else {
            setScrollPosition(
              document.querySelector(".chat-body").scrollHeight
            );
            setMessages((prevMessages) => [...data, ...prevMessages]);
          }
        }
      }

      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      // toast({
      //   title: "Error Occured!",
      //   description: "Failed to Load the Messages",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom",
      // });
    }
  };

  const sendMessage = async (event) => {
    if ((event?.key === "Enter" && newMessage) || !event) {
      // socket.emit("stop typing", selectedChat._id);
      try {
        // setLoadCreatePost(true);
        const formData = new FormData();
        formData.append("content", newMessage);
        formData.append("chatId", selectedChat._id);

        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }

        let data;
        try {
          data = await sendMessageAPI(formData);
        } catch (error) {
          toast.error(error.data.message);
        }

        socket.emit("new message", data);

        setMessages([...messages, data]);
        setScrollPosition(0);

        setFetchAgain(!fetchAgain);
        setNewMessage("");
        setImages([]);
        setFiles([]);
        // setLoadCreatePost(false);
      } catch (error) {
        // toast({
        //   title: "Error Occured!",
        //   description: "Failed to send the Message",
        //   status: "error",
        //   duration: 5000,
        //   isClosable: true,
        //   position: "bottom",
        // });
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleScroll(event, displayedMessagesCount) {
    if (init) {
      const element = event.target;
      if (element.scrollTop === 0 && displayedMessagesCount !== 0) {
        setDisplayedMessagesCount((prevCount) => prevCount + 10); // Tăng số lượng tin nhắn hiển thị
      }
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", auth);
    socket.on("connected", () => setSocketConnected(true));
    // socket.on("typing", () => setIsTyping(true));
    // socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (init) {
      // Thêm init vào điều kiện kiểm tra
      const chatBody = document.querySelector(".chat-body");

      const handleScrollWithCount = (event) => {
        handleScroll(event, displayedMessagesCount);
      };

      chatBody.addEventListener("scroll", handleScrollWithCount);

      return () => {
        chatBody.removeEventListener("scroll", handleScrollWithCount);
      };
    }
  }, [displayedMessagesCount, init]);

  useEffect(() => {
    if (init) {
      const chatBody = document.querySelector(".chat-body");
      chatBody.scrollTop = chatBody.scrollHeight - scrollPosition;
    }
  }, [initMessages, scrollPosition, messages]);

  useEffect(() => {
    if (auth.id && selectedChat) {
      if (!selectedChat.isGroupChat)
        setSender(
          selectedChat?.users[0]._id === auth.id
            ? selectedChat?.users[1]
            : selectedChat?.users[0]
        );
      setInit(false);
      setDisplayedMessagesCount(10);
      setMessages([]);

      selectedChatCompare = selectedChat;
    }
  }, [selectedChat, auth.id]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // if (!notification.includes(newMessageRecieved)) {
        //   setNotification([newMessageRecieved, ...notification]);
        setFetchAgain(!fetchAgain);
        // }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  useEffect(() => {
    if (init) fetchMessages();
  }, [displayedMessagesCount]);

  useEffect(() => {
    if (!init) {
      fetchMessages();
    }
  }, [init]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // if (!socketConnected) return;

    // if (!typing) {
    //   setTyping(true);
    //   socket.emit("typing", selectedChat._id);
    // }
    // let lastTypingTime = new Date().getTime();
    // var timerLength = 3000;
    // setTimeout(() => {
    //   var timeNow = new Date().getTime();
    //   var timeDiff = timeNow - lastTypingTime;
    //   if (timeDiff >= timerLength && typing) {
    //     socket.emit("stop typing", selectedChat._id);
    //     setTyping(false);
    //   }
    // }, timerLength);
  };

  /////////////////////////update upload image////////////////////

  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleImageUpload = (e) => {
    const selectedImages = Array.from(e.target.files);
    if (selectedImages.length + images.length > 10) {
      toast.error("Chỉ có thể tải lên tối đa 10 ảnh.");
      return;
    }
    setImages((prevImages) => [...prevImages, ...selectedImages]);
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 10) {
      toast.error("Chỉ có thể tải lên tối đa 10 tệp.");
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const [openModalImage, setOpenModalImage] = useState(false);
  const [urlLargeImage, setUrlLargeImage] = useState("");

  const openLargeImage = (url) => {
    setOpenModalImage(true);
    setUrlLargeImage(url);
  };

  return (
    <>
      <RenameGroupChatModal
        onClose={handleOnCloseRenameGroupModal}
        visible={showRenameGroupModal}
        setSelectedChat={setSelectedChat}
        selectedChat={selectedChat}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
      <UpdateChatModal
        onClose={handleOnCloseUpdateGroupModal}
        visible={showUpdateGroupModal}
        fetchMessages={fetchMessages}
        setSelectedChat={setSelectedChat}
        selectedChat={selectedChat}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
      {selectedChat ? (
        <section className="flex flex-col flex-auto bg-white rounded-xl">
          <div className="chat-header px-6 py-4 flex flex-row flex-none justify-between items-center shadow">
            <div className="flex">
              <div className="w-12 h-12 mr-4 relative flex flex-shrink-0">
                {!selectedChat.isGroupChat ? (
                  <img
                    className="shadow-md rounded-full w-full h-full object-cover"
                    src={
                      sender?.pic?.startsWith("http")
                        ? sender?.pic
                        : `${process.env.REACT_APP_URL_BACKEND}/${sender?.pic}`
                    }
                    alt=""
                  />
                ) : (
                  <>
                    <img
                      className="shadow-md rounded-full w-8 h-8 object-cover absolute ml-4"
                      src={
                        selectedChat?.users[0]?.pic?.startsWith("http")
                          ? selectedChat?.users[0]?.pic
                          : `${process.env.REACT_APP_URL_BACKEND}/${selectedChat?.users[0]?.pic}`
                      }
                      alt=""
                    />
                    <img
                      className="shadow-md rounded-full w-8 h-8 object-cover absolute mt-4"
                      src={
                        selectedChat?.users[1]?.pic?.startsWith("http")
                          ? selectedChat?.users[1]?.pic
                          : `${process.env.REACT_APP_URL_BACKEND}/${selectedChat?.users[1]?.pic}`
                      }
                      alt=""
                    />
                  </>
                )}
              </div>
              <div className="text-sm flex items-center">
                {!selectedChat.isGroupChat ? (
                  <p className="font-bold">{sender?.name}</p>
                ) : (
                  <p className="font-bold">{selectedChat?.chatName}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end" ref={menuRef}>
              <button className=" px-3 rounded-md" onClick={toggleMenu}>
                <i className="fa-solid fa-ellipsis" />
              </button>
              {menuOpen && (
                <>
                  {selectedChat.isGroupChat ? (
                    <div className=" bg-white shadow-xl border rounded-md z-10 mr-2">
                      <button
                        className="block px-4 py-2 text-gray-800"
                        onClick={() => {
                          setShowRenameGroupModal(true);
                          setMenuOpen(false);
                        }}
                      >
                        Đổi tên đoạn chat
                      </button>
                      <button
                        className="block px-4 py-2 text-gray-800"
                        onClick={() => {
                          setShowUpdateGroupModal(true);
                          setMenuOpen(false);
                        }}
                      >
                        Thành viên trong đoạn chat
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="chat-body p-4 flex-1 overflow-y-auto flex flex-col">
            {messages &&
              messages.map((m, i) => {
                const isSameSender = (messages, m, i, userId) => {
                  return (
                    i < messages.length - 1 &&
                    (messages[i + 1].sender._id !== m.sender._id ||
                      messages[i + 1].sender._id === undefined) &&
                    messages[i].sender._id !== userId
                  );
                };

                const isLastMessage = (messages, i, userId) => {
                  return (
                    i === messages.length - 1 &&
                    messages[messages.length - 1].sender._id !== userId &&
                    messages[messages.length - 1].sender._id
                  );
                };

                const isSameUser = (messages, m, i) => {
                  return i > 0 && messages[i - 1].sender._id === m.sender._id;
                };

                return (
                  <div
                    className={`messages text-sm flex items-end group ${
                      m.sender._id === auth.id
                        ? "flex-row-reverse text-white"
                        : ""
                    } ${isSameUser(messages, m, i, auth.id) ? "mt-3" : "mt-5"}`}
                    key={i}
                  >
                    {m.sender._id !== auth.id && (
                      <div className="w-12 h-12">
                        {(isSameSender(messages, m, i, auth.id) ||
                          isLastMessage(messages, i, auth.id)) && (
                          <img
                            className="shadow-md rounded-full w-12 h-12"
                            src={
                              m?.sender?.pic?.startsWith("http")
                                ? m?.sender?.pic
                                : `${process.env.REACT_APP_URL_BACKEND}/${m?.sender?.pic}`
                            }
                            alt=""
                          />
                        )}
                      </div>
                    )}

                    <div className="flex flex-col ml-2">
                      {m?.images?.length > 0 &&
                        m.images.map((image, index) => (
                          <div
                            key={index}
                            className={`flex mb-1 overflow-hidden ${
                              m.sender._id === auth.id ? "justify-end" : ""
                            }`}
                          >
                            <img
                              onClick={() => {
                                openLargeImage(image.path);
                              }}
                              src={`${process.env.REACT_APP_URL_BACKEND}/${image.path}`}
                              alt={`Image ${index}`}
                              className="max-w-full max-h-48 rounded cursor-pointer  "
                            />
                          </div>
                        ))}
                      {m?.files?.length > 0 &&
                        m.files.map((file, index) => (
                          <div
                            key={index}
                            className={`flex mb-1 overflow-hidden ${
                              m.sender._id === auth.id ? "justify-end" : ""
                            }`}
                          >
                            <a
                              href={`${process.env.REACT_APP_URL_BACKEND}/${file?.path}`}
                              key={index}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-2 text-blue-700 text-lg text-center border rounded-full"
                            >
                              <i className="fa-solid fa-file pr-2"></i>
                              {file?.name}
                            </a>
                          </div>
                        ))}
                      <div
                        className={`flex ${
                          m.sender._id === auth.id ? "justify-end" : ""
                        }`}
                      >
                        <p
                          className={`px-6 py-3 max-w-xs lg:max-w-md ${
                            m.sender._id === auth.id
                              ? "rounded-full bg-blue-600"
                              : "rounded-full bg-yellow-300"
                          }`}
                        >
                          {m.content}
                        </p>{" "}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="chat-footer flex-none">
            <div className="flex items-center bg-gray-200 ml-24 mr-4 rounded-t-xl relative top-3 overflow-x-auto">
              {/* Hiển thị danh sách hình ảnh */}
              <div className="flex flex-wrap gap-1 pl-2 bg-transparent">
                {/* Hiển thị cả ảnh đã có và ảnh mới được thêm */}
                {images.map((image, index) => {
                  return (
                    <div key={index} className="relative mt-2 mb-4 mr-1">
                      <img
                        src={
                          image._id
                            ? `${process.env.REACT_APP_URL_BACKEND}/${image.path}`
                            : URL.createObjectURL(image)
                        }
                        alt={`Image ${index}`}
                        className=" h-16 w-16 rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute w-4 h-4 top-1 right-1 bg-black text-white rounded-full hover:bg-gray-700 focus:outline-none leading-4"
                        onClick={() => handleRemoveImage(index)}
                      >
                        &times;
                      </button>
                    </div>
                  );
                })}
              </div>
              {/* Hiển thị danh sách các file được thêm */}
              <div className="flex flex-wrap gap-1 pl-1 bg-transparent my-2">
                {files.map((file, index) => (
                  <>
                    <div
                      key={index}
                      className="relative bg-white py-5 px-2 mr-1 mb-2 rounded-xl"
                    >
                      <a
                        href={
                          file._id
                            ? `${process.env.REACT_APP_URL_BACKEND}/${file.path}`
                            : URL.createObjectURL(file)
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fa-solid fa-file-lines mr-2"></i>
                        <span className="font-semibold">{file.name}</span>
                      </a>
                      <button
                        type="button"
                        className="absolute w-4 h-4 top-1 right-1 bg-black text-white rounded-full hover:bg-gray-700 focus:outline-none leading-4"
                        onClick={() => handleRemoveFile(index)}
                      >
                        &times;
                      </button>
                    </div>
                  </>
                ))}
              </div>
            </div>
            <div className="flex flex-row items-center p-4 pt-0">
              <div className="flex">
                <label
                  for="image-upload"
                  className="flex-shrink-0 mx-2 block text-blue-600 hover:text-blue-700 w-6 h-6 cursor-pointer"
                >
                  <i className="fa-solid fa-image text-xl"></i>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  onChange={handleImageUpload}
                  className="hidden"
                  accept=".jpg, .png, .jpeg, image/*"
                  multiple
                />
              </div>

              <div className="flex">
                <label
                  for="file-upload"
                  className="flex-shrink-0 mx-2 block text-blue-600 hover:text-blue-700 w-6 h-6 cursor-pointer"
                >
                  <i className="fa-solid fa-file text-xl"></i>{" "}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf, .doc, .docx"
                  multiple
                />
              </div>

              {/* <button
                type="button"
                className="flex flex-shrink-0 focus:outline-none mx-2 block text-blue-600 hover:text-blue-700 w-6 h-6"
              >
                <svg viewBox="0 0 20 20" className="w-full h-full fill-current">
                  <path d="M9,18 L9,16.9379599 C5.05368842,16.4447356 2,13.0713165 2,9 L4,9 L4,9.00181488 C4,12.3172241 6.6862915,15 10,15 C13.3069658,15 16,12.314521 16,9.00181488 L16,9 L18,9 C18,13.0790094 14.9395595,16.4450043 11,16.9378859 L11,18 L14,18 L14,20 L6,20 L6,18 L9,18 L9,18 Z M6,4.00650452 C6,1.79377317 7.79535615,0 10,0 C12.209139,0 14,1.79394555 14,4.00650452 L14,8.99349548 C14,11.2062268 12.2046438,13 10,13 C7.790861,13 6,11.2060545 6,8.99349548 L6,4.00650452 L6,4.00650452 Z" />
                </svg>
              </button> */}
              <div className="relative flex-grow">
                <label>
                  <input
                    className="rounded-xl py-2 pl-3 pr-10 w-full border border-gray-200 bg-gray-200 focus:outline-none text-gray-600 transition duration-300 ease-in"
                    type="text"
                    value={newMessage}
                    onKeyDown={sendMessage}
                    placeholder="Aa"
                    onChange={typingHandler}
                    required
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 mt-2 mr-3 flex-shrink-0 focus:outline-none block text-blue-600 hover:text-blue-700 w-6 h-6"
                    onClick={() => sendMessage()}
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </label>
              </div>
              {/* <button
                type="button"
                className="flex flex-shrink-0 focus:outline-none mx-2 block text-blue-600 hover:text-blue-700 w-6 h-6"
              >
                <svg viewBox="0 0 20 20" className="w-full h-full fill-current">
                  <path d="M11.0010436,0 C9.89589787,0 9.00000024,0.886706352 9.0000002,1.99810135 L9,8 L1.9973917,8 C0.894262725,8 0,8.88772964 0,10 L0,12 L2.29663334,18.1243554 C2.68509206,19.1602453 3.90195042,20 5.00853025,20 L12.9914698,20 C14.1007504,20 15,19.1125667 15,18.000385 L15,10 L12,3 L12,0 L11.0010436,0 L11.0010436,0 Z M17,10 L20,10 L20,20 L17,20 L17,10 L17,10 Z" />
                </svg>
              </button> */}
            </div>
          </div>
        </section>
      ) : (
        <div className="h-full flex flex-auto justify-center items-center bg-white rounded-xl">
          <div className="text-center items-center flex flex-col">
            <h3 className="mt-2 text-2xl font-semibold text-gray-900">
              Chọn đoạn chat để bắt đầu nhắn tin
            </h3>
          </div>
        </div>
      )}

      {openModalImage && (
        <LargeImageModal
          urlImage={urlLargeImage}
          openModal={openModalImage}
          setOpenModal={setOpenModalImage}
        />
      )}
    </>
  );
};

export default ChatBox;
