import backendApi from "../api/backendApi";

export const fetchChatsAPI = () => {
  return backendApi.get("/api/chat");
};

export const accessChatAPI = (userId) => {
  return backendApi.post(`/api/chat`, { userId });
};

export const createGroupChatAPI = (groupChatName, selectedUsers) => {
  return backendApi.post(`/api/chat/group`, {
    name: groupChatName,
    users: JSON.stringify(selectedUsers.map((u) => u._id)),
  });
};

export const renameGroupChatAPI = (groupChatName, selectedChat) => {
  return backendApi.put(`/api/chat/rename`, {
    chatId: selectedChat._id,
    chatName: groupChatName,
  });
};

export const addUserGroupChatAPI = (user, selectedChat) => {
  return backendApi.put(`/api/chat/groupadd`, {
    chatId: selectedChat._id,
    userId: user._id,
  });
};

export const removeUserGroupChatAPI = (user, selectedChat) => {
  return backendApi.put(`/api/chat/groupremove`, {
    chatId: selectedChat._id,
    userId: user._id || user.id,
  });
};
