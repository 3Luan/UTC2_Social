const User = require("../models/userModel");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const imageUploadPath = path.join("uploads/images");
const NotificationModel = require("../models/notificationModel");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
let getUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.userId } });

    res.status(200).json({
      message: "Lấy tất cả User thành công",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Đã có lỗi xảy ra: getUsers",
    });
  }
};

// Theo dõi
let followUser = async (req, res) => {
  try {
    const userIdOne = req.userId; // Người đăng nhập
    const userIdTwo = req.body.userId; // Người còn lại

    const userTwoData = await User.findById(userIdTwo);

    if (!userTwoData) {
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    }

    if (!userTwoData.followers.includes(userIdOne)) {
      await User.findOneAndUpdate(
        { _id: userIdTwo },
        { $push: { followers: userIdOne } }
      );
      await User.findOneAndUpdate(
        { _id: userIdOne },
        { $push: { followings: userIdTwo } }
      );
    } else {
      return res.status(400).json({
        message: "Người dùng này đã tồn tại trong danh sách theo dõi",
      });
    }

    // Gửi thông báo cho người được theo dõi
    const notification = new NotificationModel({
      sender: userIdOne,
      receiver: userIdTwo,
      message: "đã theo dõi bạn",
      link: `/profile/${userIdOne}`, // Đường dẫn đến hồ sơ
    });
    await notification.save();

    res.status(200).json({
      message: "Theo dõi thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Đã có lỗi xảy ra: followUser",
    });
  }
};

// Hủy theo dõi
let unfollowUser = async (req, res) => {
  try {
    const userIdOne = req.userId; // Người đăng nhập
    const userIdTwo = req.body.userId; // Người còn lại

    const userTwoData = await User.findById(userIdTwo);

    if (!userTwoData) {
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    }

    if (userTwoData.followers.includes(userIdOne)) {
      await User.findOneAndUpdate(
        { _id: userIdTwo },
        { $pull: { followers: userIdOne } }
      );
      await User.findOneAndUpdate(
        { _id: userIdOne },
        { $pull: { followings: userIdTwo } }
      );
    } else {
      return res.status(400).json({
        message: "Người dùng này chưa tồn tại trong danh sách theo dõi",
      });
    }

    res.status(200).json({
      message: "Hủy theo dõi thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Đã có lỗi xảy ra: unfollowUser",
    });
  }
};

// Lấy thông tin người dùng thông qua ID
let getUserInfoById = async (req, res) => {
  try {
    const userId = req.params.userId;

    let user = await User.findById(userId).select(
      "_id name pic email isAdmin gender birth followings followers"
    );

    const countFollowings = await User.find({
      _id: { $in: user.followings, $ne: userId },
      isBan: false,
    }).countDocuments();

    const countFollowers = await User.find({
      _id: { $in: user.followers, $ne: userId },
      isBan: false,
    }).countDocuments();

    res.status(200).json({
      message: "Lấy thông tin user thành công",
      data: { user, countFollowings, countFollowers },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Đã có lỗi xảy ra: getUserInfoById",
    });
  }
};

let updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, gender, birth, picOld } = req.body;
    const pic = req.files.pic || "";

    if (!name || !gender || !birth || (!pic && !picOld)) {
      return res.status(400).json({
        message: "Lỗi: Thông tin không đủ",
      });
    }

    // Tạo một hàm để tạo tên file mới (uuid + timestamp)
    const generateUniqueFileName = (originalName) => {
      const extname = path.extname(originalName);
      const timestamp = Date.now();
      const uniqueFilename = `${uuidv4()}_${timestamp}${extname}`;
      return uniqueFilename;
    };

    // Xác định các ID của các hình ảnh cũ từ đối tượng imagesOld
    let updateData;
    if (picOld) {
      updateData = {
        user: userId,
        name,
        gender,
        birth,
      };
    } else {
      // Tạo đường dẫn và lưu trữ các tệp và hình ảnh
      const fileName = generateUniqueFileName(pic[0].originalname);
      const filePath = path.join(imageUploadPath, fileName);
      fs.writeFileSync(filePath, pic[0].buffer);
      const fileData = { name: pic[0].originalname, path: fileName };

      updateData = {
        user: userId,
        name,
        gender,
        birth,
        pic: fileData.path,
      };
    }

    await User.updateOne({ _id: userId }, updateData);

    res.status(200).json({
      message: "Lưu thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Đã có lỗi xảy ra: updateProfile",
    });
  }
};

let getUnfollowedUsers = async (req, res) => {
  try {
    const currentPage = req.params.currentPage || 1;
    const keyword = req.params.keyword || null;
    const userId = req.userId;

    const user = await User.findById(userId);

    // If no keyword is provided, return all users that are not followed by the current user
    const query = {
      _id: { $nin: user.followings, $ne: userId },
      isBan: false,
    };

    // If keyword is provided, add it to the query
    if (keyword) {
      const regex = new RegExp(keyword, "i");
      query.name = regex;
    }

    // Count users based on the query
    const count = await User.countDocuments(query);

    const offset = 12 * (currentPage - 1);

    // Fetch users based on the query
    const users = await User.find(query)
      .limit(12)
      .skip(offset)
      .sort({ createdAt: -1 });

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "Không có data nào",
      });
    }

    res.status(200).json({
      message: "Tìm kiếm thành công",
      count: count,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Lỗi: getUnfollowedUsers",
    });
  }
};

let getFollowers = async (req, res) => {
  try {
    const currentPage = req.params.currentPage || 1;
    const keyword = req.params.keyword || null;
    const userId = req.userId;

    const user = await User.findById(userId);

    // If no keyword is provided, return all followers
    const query = {
      _id: { $in: user.followers, $ne: userId },
      isBan: false,
    };

    // If keyword is provided, add it to the query
    if (keyword) {
      const regex = new RegExp(keyword, "i");
      query.name = regex;
    }

    // Count followers based on the query
    const count = await User.countDocuments(query);

    const offset = 12 * (currentPage - 1);

    // Fetch followers based on the query
    const users = await User.find(query)
      .limit(12)
      .skip(offset)
      .sort({ createdAt: -1 });

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "Không có data nào",
      });
    }

    res.status(200).json({
      message: "Tìm kiếm thành công",
      count: count,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Lỗi: getFollowers",
    });
  }
};

let getFollowings = async (req, res) => {
  try {
    const currentPage = req.params.currentPage || 1;
    const keyword = req.params.keyword || null;
    const userId = req.userId;

    const user = await User.findById(userId);

    // If no keyword is provided, return all followings
    const query = {
      _id: { $in: user.followings, $ne: userId },
      isBan: false,
    };

    // If keyword is provided, add it to the query
    if (keyword) {
      const regex = new RegExp(keyword, "i");
      query.name = regex;
    }

    // Count followings based on the query
    const count = await User.countDocuments(query);

    const offset = 12 * (currentPage - 1);

    // Fetch followings based on the query
    const users = await User.find(query)
      .limit(12)
      .skip(offset)
      .sort({ createdAt: -1 });

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "Không có data nào",
      });
    }

    res.status(200).json({
      message: "Tìm kiếm thành công",
      count: count,
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Lỗi: getFollowings",
    });
  }
};

module.exports = {
  getUsers,
  followUser,
  unfollowUser,
  getUnfollowedUsers,
  getFollowings,
  getFollowers,
  getUserInfoById,
  updateProfile,
};
