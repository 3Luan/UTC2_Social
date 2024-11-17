import { useEffect, useState } from "react";
import { getAllUsersAPI } from "../../services/userService";
import Loading from "../Loading";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { renameGroupChatAPI } from "../../services/chatService";
import TextInput from "../TextInput";

export default function CreateChatModal({
  visible,
  onClose,
  setSelectedChat,
  selectedChat,
  fetchAgain,
  setFetchAgain,
}) {
  const [groupChatName, setGroupChatName] = useState();

  const handleRename = async () => {
    if (!groupChatName) {
      toast.error("Hãy điền tên đoạn chat");
      return;
    }

    try {
      const data = await renameGroupChatAPI(groupChatName, selectedChat);
      //   console.log(data._id);
      //   setSelectedChat("");
      setSelectedChat(data);
      // console.log(data);
      setFetchAgain(!fetchAgain);
      onClose();
    } catch (error) {
      // toast({
      //   title: "Error Occured!",
      //   description: error.response.data.message,
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom",
      // });
    }
    setGroupChatName("");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex justify-center items-center">
      <div className="absolute inset-0 bg-gray-500 opacity-75 backdrop-filter blur-sm"></div>
      <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
        <div className="bg-gray-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900 text-center flex-grow pl-4">
            Đổi tên đoạn chat
          </h3>
          <button
            onClick={() => {
              setGroupChatName();
              onClose();
            }}
            type="button"
            className="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent disabled:opacity-50 disabled:pointer-events-none bg-gray-400 text-white dark:hover:bg-gray-600"
            data-hs-overlay="#hs-focus-management-modal"
          >
            <span className="sr-only">Close</span>
            <svg
              className="flex-shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <div className="mb-4">
                <div className="search-box flex-none">
                  <div>
                    <label>
                      <TextInput
                        onChange={(e) => {
                          setGroupChatName(e.target.value);
                        }}
                        defaultValue={selectedChat?.chatName || ""}
                        styles="py-2 pr-6 pl-4 w-full border border-gray-200 bg-gray-200 focus:bg-white focus:outline-none text-gray-600 focus:shadow-md transition duration-300 ease-in"
                        placeholder="Tên nhóm"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            disabled={
              !groupChatName || selectedChat?.chatName === groupChatName
            }
            onClick={handleRename}
            type="button"
            className={`${
              !groupChatName || selectedChat?.chatName === groupChatName
                ? "bg-gray-200"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            } w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm`}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
