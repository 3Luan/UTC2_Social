import { useEffect, useState } from "react";
import { getUsersAPI } from "../../services/userService";
import Loading from "../Loading";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { createGroupChatAPI } from "../../services/chatService";
import TextInput from "../TextInput";

export default function CreateChatModal({ visible, onClose, setChats, chats }) {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const handleGroup = (userToAdd) => {
    if (selectedUsers.find((user) => user._id === userToAdd._id)) {
      toast.error("Người này đã được chọn thêm");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

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

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName) {
      toast.error("Hãy điền hết thông tin");
      return;
    }

    try {
      let data = await createGroupChatAPI(groupChatName, selectedUsers);

      setChats([data.data, ...chats]);
      setSearchResult([]);
      setSelectedUsers([]);
      onClose();
      toast.success("Tạo nhóm thành công");
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex justify-center items-center">
      <div className="absolute inset-0 bg-gray-500 opacity-75 backdrop-filter blur-sm"></div>
      <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
        <div className="bg-gray-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900 text-center flex-grow pl-4">
            Tạo nhóm chat
          </h3>
          <button
            onClick={() => {
              onClose();
              setSearchResult([]);
              setSelectedUsers([]);
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
                  <form onsubmit="">
                    <label>
                      <TextInput
                        onChange={(e) => setGroupChatName(e.target.value)}
                        styles=" py-2 pr-6 pl-4 w-full border border-gray-200 bg-gray-200 focus:bg-white focus:outline-none text-gray-600 focus:shadow-md transition duration-300 ease-in"
                        placeholder="Tên nhóm"
                      />
                    </label>
                  </form>
                </div>
              </div>
              <div className="mb-2">
                <div className="search-box flex-none">
                  <form onsubmit="">
                    <label>
                      <TextInput
                        onChange={(e) => handleSearch(e.target.value)}
                        styles=" py-2 pr-6 pl-4 w-full border border-gray-200 bg-gray-200 focus:bg-white focus:outline-none text-gray-600 focus:shadow-md transition duration-300 ease-in"
                        placeholder="Thêm các thành viên (Tên hoặc email của người dùng)"
                      />
                    </label>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center">
          {selectedUsers.map((u) => (
            <span
              id="badge-dismiss-yellow"
              className="inline-flex items-center px-2 py-1 me-2 mb-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded dark:bg-yellow-900 dark:text-yellow-300"
            >
              {u.name}
              <button
                type="button"
                onClick={() => handleDelete(u)}
                className="inline-flex items-center p-1 ms-2 text-sm text-yellow-400 bg-transparent rounded-sm hover:bg-yellow-200 hover:text-yellow-900 dark:hover:bg-yellow-800 dark:hover:text-yellow-300"
                data-dismiss-target="#badge-dismiss-yellow"
                aria-label="Remove"
              >
                <svg
                  className="w-2 h-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Remove badge</span>
              </button>
            </span>
          ))}
        </div>
        {search && (
          <>
            {loading ? (
              <Loading />
            ) : (
              <div className="contacts p-2 flex-1 overflow-y-scroll max-h-[300px]">
                {searchResult?.map((user) => {
                  return (
                    <Link
                      className="flex justify-between items-center p-3 hover:bg-gray-100 rounded-lg relative cursor-pointer"
                      onClick={() => handleGroup(user)}
                    >
                      <div className="w-16 h-16 relative flex flex-shrink-0">
                        <img
                          className="shadow-md rounded-full w-full h-full object-cover"
                          src={user.pic}
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
          </>
        )}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            onClick={() => handleSubmit()}
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
}
