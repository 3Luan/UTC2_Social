import { accessChatAPI, fetchChatsAPI } from "../services/chatService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import { Link, useNavigate } from "react-router-dom";
import CreateChatModal from "./modals/CreateChatModal";
import { getUsersAPI } from "../services/userService";
import TextInput from "./TextInput";

const MyChat = ({ selectedChat, setSelectedChat, fetchAgain }) => {
  const [loadingChat, setLoadingChat] = useState();
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const nav = useNavigate();
  const handleOnClose = () => setShowModal(false);
  const auth = useSelector((state) => state.auth);

  const fetchChats = async () => {
    try {
      const data = await fetchChatsAPI();
      setChats(data);
    } catch (error) {
      // toast({
      //   title: "Error Occured!",
      //   description: "Failed to Load the chats",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom-left",
      // });
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return null;
    }

    try {
      setLoading(true);
      const { users } = await getUsersAPI(query);
      setLoading(false);
      setSearchResult(users);
    } catch (error) {
      // toast({
      //   title: "Error Occured!",
      //   description: "Failed to Load the Search Results",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom-left",
      // });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const data = await accessChatAPI(userId);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      nav(`/message/${data._id}`);
      setLoadingChat(false);
    } catch (error) {
      // toast({
      //   title: "Error fetching the chat",
      //   description: error.message,
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom-left",
      // });
    }
    document.querySelector("[name='searchInput']").value = "";
    setSearch("");
  };

  return (
    <>
      <CreateChatModal
        onClose={handleOnClose}
        visible={showModal}
        setChats={setChats}
        chats={chats}
      />
      <section className="flex flex-col flex-none overflow-auto w-24 lg:max-w-sm md:w-2/5 transition-all duration-300 ease-in-out bg-white rounded-xl">
        <div className="header p-4 flex flex-row justify-between items-center flex-none">
          <p className="text-md font-bold hidden md:block">Đoạn chat</p>
          <button
            className="block rounded-full hover:bg-gray-200 bg-gray-100 w-10 h-10 p-2"
            onClick={() => setShowModal(true)}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path d="M6.3 12.3l10-10a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-10 10a1 1 0 0 1-.7.3H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 .3-.7zM8 16h2.59l9-9L17 4.41l-9 9V16zm10-2a1 1 0 0 1 2 0v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h6a1 1 0 0 1 0 2H4v14h14v-6z" />
            </svg>
          </button>
        </div>
        <div className="search-box p-4 flex-none">
          <form onsubmit="">
            <div className="relative">
              <label>
                <TextInput
                  name="searchInput"
                  onChange={(e) => handleSearch(e.target.value)}
                  styles="rounded-full py-2 pr-6 pl-10 w-full border border-gray-200 bg-gray-200 focus:bg-white focus:outline-none text-gray-600 focus:shadow-md transition duration-300 ease-in"
                  placeholder="Tìm kiếm..."
                />
                <span className="absolute top-0 left-0 mt-2 ml-3 inline-block">
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path
                      fill="#bbb"
                      d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                    />
                  </svg>
                </span>
              </label>
            </div>
          </form>
        </div>
        {search ? (
          <>
            {loading ? (
              <Loading />
            ) : (
              <div className="contacts p-2 flex-1 overflow-y-scroll">
                {searchResult?.map((user) => {
                  return (
                    <Link
                      className="flex justify-between items-center p-3 hover:bg-gray-100 rounded-lg relative cursor-pointer"
                      onClick={() => accessChat(user._id)}
                    >
                      <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img
                          className="shadow-md rounded-full w-full h-full object-cover"
                          src={
                            user?.pic?.startsWith("http")
                              ? user?.pic
                              : `${process.env.REACT_APP_URL_BACKEND}/${user?.pic}`
                          }
                          alt=""
                        />
                      </div>
                      <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block">
                        <p>{user.name}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            {loadingChat && <Loading />}
          </>
        ) : (
          <>
            {chats ? (
              <div className="contacts p-2 flex-1 overflow-y-scroll">
                {chats.map((chat) => {
                  const getSender =
                    chat.users[0]?._id === auth?.id
                      ? chat.users[1]
                      : chat.users[0];

                  // Kiểm tra xem cuộc trò chuyện đã có tin nhắn hay chưa
                  const hasMessages = chat.latestMessage !== undefined;

                  // Kiểm tra xem cuộc trò chuyện có được chọn hay không
                  const isSelectedChat = selectedChat?._id === chat._id;

                  if (hasMessages || isSelectedChat || chat.isGroupChat) {
                    return (
                      <Link
                        onClick={() => setSelectedChat(chat)}
                        to={`/message/${chat._id}`}
                        className={`flex justify-between items-center p-3 hover:bg-gray-100 rounded-lg relative cursor-pointer bg-${
                          selectedChat?._id === chat?._id ? "gray-100" : "white"
                        }`}
                      >
                        <div className="w-16 h-16 relative flex flex-shrink-0">
                          {!chat.isGroupChat ? (
                            <img
                              className="shadow-md rounded-full w-full h-full object-cover"
                              src={
                                getSender?.pic?.startsWith("http")
                                  ? getSender?.pic
                                  : `${process.env.REACT_APP_URL_BACKEND}/${getSender?.pic}`
                              }
                              alt=""
                            />
                          ) : (
                            <>
                              <img
                                className="shadow-md rounded-full w-10 h-10 object-cover absolute ml-6"
                                src={
                                  chat?.users[0]?.pic?.startsWith("http")
                                    ? chat?.users[0]?.pic
                                    : `${process.env.REACT_APP_URL_BACKEND}/${chat?.users[0]?.pic}`
                                }
                                alt=""
                              />
                              <img
                                className="shadow-md rounded-full w-10 h-10 object-cover absolute mt-6"
                                src={
                                  chat?.users[1]?.pic?.startsWith("http")
                                    ? chat?.users[1]?.pic
                                    : `${process.env.REACT_APP_URL_BACKEND}/${chat?.users[1]?.pic}`
                                }
                                alt=""
                              />
                            </>
                          )}
                        </div>
                        <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block">
                          <p>
                            {!chat.isGroupChat ? getSender.name : chat.chatName}
                          </p>
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="min-w-0">
                              {chat.latestMessage && (
                                <p className="truncate">
                                  <b>{chat.latestMessage.sender.name} : </b>
                                  {chat.latestMessage.content.length > 50
                                    ? chat.latestMessage.content.substring(
                                        0,
                                        51
                                      ) + "..."
                                    : chat.latestMessage.content}
                                </p>
                              )}
                            </div>
                            {/* <p className="ml-2 whitespace-no-wrap">Just now</p> */}
                          </div>
                        </div>
                      </Link>
                    );
                  } else {
                    // Nếu cuộc trò chuyện không có tin nhắn và không được chọn, không hiển thị
                    return null;
                  }
                })}
              </div>
            ) : (
              <Loading />
            )}
          </>
        )}

        {/* <div className="flex justify-between items-center p-3 hover:bg-gray-100 rounded-lg relative">
          <div className="w-16 h-16 relative flex flex-shrink-0">
            <img
              className="shadow-md rounded-full w-full h-full object-cover"
              src="https://randomuser.me/api/portraits/men/97.jpg"
              alt=""
            />
            <div className="absolute bg-white p-1 rounded-full bottom-0 right-0">
              <div className="bg-green-500 rounded-full w-3 h-3"></div>
            </div>
          </div>
          <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block">
            <p className="font-bold">Tony Stark</p>
            <div className="flex items-center text-sm font-bold">
              <div className="min-w-0">
                <p className="truncate">Hey, Are you there?</p>
              </div>
              <p className="ml-2 whitespace-no-wrap">10min</p>
            </div>
          </div>
          <div className="bg-blue-500 w-3 h-3 rounded-full flex flex-shrink-0 hidden md:block"></div>
        </div>
        <div className="flex justify-between items-center p-3 hover:bg-gray-100 rounded-lg relative">
          <div className="w-16 h-16 relative flex flex-shrink-0">
            <img
              className="shadow-md rounded-full w-full h-full object-cover"
              src="https://randomuser.me/api/portraits/men/45.jpg"
              alt="User2"
            />
          </div>
          <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block">
            <p>Bruce Lee</p>
            <div className="flex items-center text-sm text-gray-600">
              <div className="min-w-0">
                <p className="truncate">You are a great human being.</p>
              </div>
              <p className="ml-2 whitespace-no-wrap">23 Jan</p>
            </div>
          </div>
          <div className="w-4 h-4 flex flex-shrink-0 hidden md:block">
            <img
              className="rounded-full w-full h-full object-cover"
              alt="user2"
              src="https://randomuser.me/api/portraits/men/45.jpg"
            />
          </div>
        </div> */}
        {/* <div className="flex justify-between items-center p-3 hover:bg-gray-100 rounded-lg relative">
          <div className="w-16 h-16 relative flex flex-shrink-0">
            <img
              className="shadow-md rounded-full w-10 h-10 object-cover absolute ml-6"
              src="https://randomuser.me/api/portraits/men/22.jpg"
              alt="User2"
            />
            <img
              className="shadow-md rounded-full w-10 h-10 object-cover absolute mt-6"
              src="https://randomuser.me/api/portraits/men/55.jpg"
              alt="User2"
            />
            <div className="absolute bg-white p-1 rounded-full bottom-0 right-0">
              <div className="bg-green-500 rounded-full w-3 h-3"></div>
            </div>
          </div>
          <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block">
            <p>TailwindCSS Group</p>
            <div className="flex items-center text-sm text-gray-600">
              <div className="min-w-0">
                <p className="truncate">Adam: Hurray, Version 2 is out now!!.</p>
              </div>
              <p className="ml-2 whitespace-no-wrap">23 Jan</p>
            </div>
          </div>
        </div> */}
      </section>
    </>
  );
};

export default MyChat;
