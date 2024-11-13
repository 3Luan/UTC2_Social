const User = require("../models/userModel");
const NotificationModel = require("../models/notificationModel");

let getNotifications = async (req, res) => {
  try {
    const currentPage = parseInt(req.params.currentPage) || 1;
    const userId = req.userId;

    const count = await NotificationModel.countDocuments({ receiver: userId });

    const limit = 10; // Số lượng thông báo tối đa trả về trong mỗi lần yêu cầu
    const skip = limit * (currentPage - 1);

    const notifications = await NotificationModel.find({ receiver: userId })
      .limit(limit)
      .skip(skip)
      .populate("receiver", "name pic")
      .populate("sender", "name pic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Lấy thông báo thành công",
      count,
      notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Lỗi: getNotifications",
    });
  }
};

let readNotification = async (req, res) => {
  try {
    const notificationId = req.body.notificationId;

    const notification = await NotificationModel.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        message: "Lỗi: Không tìm thấy thông báo",
      });
    }

    if (notification.isRead) {
      return res.status(200).json({
        message: "Thông báo đã được đọc trước đó",
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      message: "Đọc thông báo thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Lỗi: readNotification",
    });
  }
};

let readAllNotification = async (req, res) => {
  try {
    const userId = req.userId;

    await NotificationModel.updateMany(
      { receiver: userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      message: "Đọc tất cả thông báo thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Lỗi: readAllNotification",
    });
  }
};

let getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const count = await NotificationModel.countDocuments({
      receiver: userId,
      isRead: false,
    });

    res.status(200).json({
      message: "Lấy thông báo chưa đọc thành công",
      count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Lỗi: getUnreadNotifications",
    });
  }
};

module.exports = {
  getNotifications,
  readNotification,
  readAllNotification,
  getUnreadNotifications,
};
