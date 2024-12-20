import backendApi from "../api/backendApi";

export const getNotificationsAPI = (currentPage) => {
  return backendApi.get(`/api/notification/getNotifications/${currentPage}`);
};
export const readNotificationAPI = (notificationId) => {
  return backendApi.post(`/api/notification/readNotification`, {
    notificationId,
  });
};

export const readAllNotificationAPI = () => {
  return backendApi.post(`/api/notification/readAllNotification`, {});
};

export const getUnreadNotificationAPI = () => {
  return backendApi.get(`/api/notification/getUnreadNotification`);
};
