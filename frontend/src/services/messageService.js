import backendApi from "../api/backendApi";

export const fetchMessagesAPI = (chatId, displayedMessagesCount) => {
  return backendApi.get(
    `/api/message/${chatId}?limit=${displayedMessagesCount}`
  );
};

export const sendMessageAPI = (formData) => {
  return backendApi.post(`/api/message`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
