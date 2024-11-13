const userModel = require("../models/userModel");
const postModel = require("../models/postModel");
const NotificationModel = require("../models/notificationModel");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fileUploadPath = path.join("uploads/files");
const imageUploadPath = path.join("uploads/images");

let createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const images = req.files?.images || [];
    const files = req.files?.files || [];
    const userId = req.userId;

    if (!content || !title) {
      throw {
        status: 400,
        message: "Không được bỏ trống thông tin",
      };
    }

    let user = await userModel.findById(userId);

    // Tạo một hàm để tạo tên file mới (uuid + timestamp)
    const generateUniqueFileName = (originalName) => {
      const extname = path.extname(originalName);
      const timestamp = Date.now();
      const uniqueFilename = `${uuidv4()}_${timestamp}${extname}`;
      return uniqueFilename;
    };

    const filePaths = files.map((file) => {
      const fileName = generateUniqueFileName(file.originalname);
      const filePath = path.join(fileUploadPath, fileName);
      fs.writeFileSync(filePath, file.buffer);
      return { name: file.originalname, path: fileName };
    });

    const imagePaths = images.map((image) => {
      const fileName = generateUniqueFileName(image.originalname);
      const imagePath = path.join(imageUploadPath, fileName);
      fs.writeFileSync(imagePath, image.buffer);
      return { name: image.originalname, path: fileName };
    });

    let newPost;
    let message;

    if (user.isAdmin) {
      newPost = await postModel.create({
        user: userId,
        title,
        content,
        images: imagePaths,
        files: filePaths,
        isDisplay: true,
      });

      message = "Đăng bài viết thành công";

      // Gửi thông báo cho những người theo dõi người tạo bài viết
      const followers = user.followers;
      const messageNoti = `đăng bài viết mới.`;

      if (followers.length > 0) {
        followers.map(async (followerId) => {
          // Tạo thông báo
          const notification = new NotificationModel({
            sender: user._id,
            receiver: followerId,
            message: messageNoti,
            link: `/community/post/${newPost._id}`, // Đường dẫn đến bài viết
          });

          // Lưu thông báo vào cơ sở dữ liệu
          await notification.save();
        });
      }
    } else {
      newPost = await postModel.create({
        user: userId,
        title,
        content,
        images: imagePaths,
        files: filePaths,
      });

      message = "Tạo bài viết thành công. Chờ duyệt!";
    }

    post = await postModel
      .findById(newPost._id)
      .populate("user", "name pic")
      .select("_id title createdAt updatedAt likes");

    res.status(200).json({
      message: message,
      data: {
        post,
      },
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content, postId, imagesOld, filesOld } = req.body;
    const images = req.files?.images || [];
    const files = req.files?.files || [];
    const userId = req.userId;

    // Kiểm tra xem nội dung và tiêu đề có được cung cấp không
    if (!postId || !content || !title) {
      throw {
        status: 400,
        message: "Không được bỏ trống thông tin",
      };
    }

    // Kiểm tra xem bài viết có tồn tại không
    const postOld = await postModel.findById(postId);
    if (!postOld) {
      throw {
        status: 404,
        message: "Bài viết không tồn tại",
      };
    }

    if (postOld.isDelete) {
      throw {
        status: 410,
        message: "Bài viết đã bị xóa trước đó",
      };
    }

    // Kiểm tra xem người dùng có tồn tại không
    const user = await userModel.findById(userId);

    // Tạo một hàm để tạo tên file mới (uuid + timestamp)
    const generateUniqueFileName = (originalName) => {
      const extname = path.extname(originalName);
      const timestamp = Date.now();
      const uniqueFilename = `${uuidv4()}_${timestamp}${extname}`;
      return uniqueFilename;
    };

    // Xác định các ID của các hình ảnh cũ từ đối tượng imagesOld
    if (imagesOld) {
      if (!Array.isArray(imagesOld)) {
        const imagesToRemove = postOld.images.filter(
          (image) => !imagesOld.includes(image._id)
        );

        imagesToRemove.forEach(async (image) => {
          await postModel.updateOne(
            { _id: postId },
            { $pull: { images: { _id: image._id } } }
          );
        });
      } else {
        const imagesToRemove = postOld.images.filter(
          (image) => !imagesOld.includes(image._id)
        );

        imagesToRemove.forEach(async (image) => {
          await postModel.updateOne(
            { _id: postId },
            { $pull: { images: { _id: image._id } } }
          );
        });
      }
    }

    if (filesOld) {
      if (!Array.isArray(filesOld)) {
        const filesToRemove = postOld.files.filter(
          (file) => !filesOld.includes(file._id)
        );

        filesToRemove.forEach(async (file) => {
          await postModel.updateOne(
            { _id: postId },
            { $pull: { files: { _id: file._id } } }
          );
        });
      } else {
        const filesToRemove = postOld.files.filter(
          (file) => !filesOld.includes(file._id)
        );

        filesToRemove.forEach(async (file) => {
          await postModel.updateOne(
            { _id: postId },
            { $pull: { files: { _id: file._id } } }
          );
        });
      }
    }

    // Tạo đường dẫn và lưu trữ các tệp và hình ảnh
    const filePaths = files.map((file) => {
      const fileName = generateUniqueFileName(file.originalname);
      const filePath = path.join(fileUploadPath, fileName);
      fs.writeFileSync(filePath, file.buffer);
      return { name: file.originalname, path: fileName };
    });

    const imagePaths = images.map((image) => {
      const fileName = generateUniqueFileName(image.originalname);
      const imagePath = path.join(imageUploadPath, fileName);
      fs.writeFileSync(imagePath, image.buffer);
      return { name: image.originalname, path: fileName };
    });

    // Cập nhật bài viết
    const updateData = {
      user: userId,
      title,
      content,
      isDisplay: false,
      $push: { images: { $each: imagePaths }, files: { $each: filePaths } },
    };

    if (user.isAdmin) {
      updateData.isDisplay = true;
    }

    await postModel.updateOne({ _id: postId }, updateData);

    // Lấy bài viết đã cập nhật và trả về
    const updatedPost = await postModel
      .findById(postId)
      .populate("user", "name pic")
      .select("_id title createdAt updatedAt likes");

    const message = user.isAdmin
      ? "Sửa bài viết thành công"
      : "Sửa bài viết thành công. Chờ duyệt!";

    res.status(200).json({
      message: message,
      data: { updatedPost },
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getPosts = async (req, res) => {
  try {
    console.log("2");

    const currentPage = req.params.currentPage || 1;
    const keyword = req.params.keyword || null;

    let query = {
      isDisplay: true,
      isDelete: false,
      isDoc: false,
    };

    if (keyword) {
      const regex = new RegExp(keyword, "i"); // Tạo biểu thức chính quy từ keyword
      query.title = regex; // Thêm điều kiện tìm kiếm tiêu đề
    }

    // Đếm số lượng bài viết thỏa mãn điều kiện
    const count = await postModel.countDocuments(query);

    const offset = 10 * (currentPage - 1);

    // Lấy bài viết theo điều kiện và phân trang
    const posts = await postModel
      .find(query)
      .limit(10)
      .skip(offset)
      .populate("user", "name pic")
      .select("_id title createdAt updatedAt likes")
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      throw {
        status: 404,
        message: "Không có bài viết nào",
      };
    }

    res.status(200).json({
      message: "Lấy bài viết thành công",
      data: {
        count,
        posts,
      },
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getUnapprovedPosts = async (req, res) => {
  try {
    const currentPage = req.params.currentPage || 1;
    const keyword = req.params.keyword || null;
    const userId = req.userId;

    let user = await userModel.findById(userId);

    // Nếu không có keyword, không yêu cầu nhập nội dung tìm kiếm
    let query = {
      isDisplay: false,
      isDelete: false,
      isDoc: false,
    };

    if (keyword) {
      const regex = new RegExp(keyword, "i"); // Tạo biểu thức chính quy từ keyword
      query.title = regex; // Thêm điều kiện tìm kiếm theo tiêu đề
    }

    let count, posts;

    if (user.isAdmin) {
      // Nếu người dùng là admin, tìm tất cả bài viết thỏa mãn điều kiện
      count = await postModel.countDocuments(query);

      const offset = 10 * (currentPage - 1);

      posts = await postModel
        .find(query)
        .limit(10)
        .skip(offset)
        .populate("user", "name pic")
        .select("_id title createdAt updatedAt likes")
        .sort({ createdAt: -1 });
    } else {
      // Nếu người dùng không phải là admin, chỉ tìm bài viết của chính họ
      query.user = userId; // Thêm điều kiện người dùng vào query

      count = await postModel.countDocuments(query);

      const offset = 10 * (currentPage - 1);

      posts = await postModel
        .find(query)
        .limit(10)
        .skip(offset)
        .populate("user", "name pic")
        .select("_id title createdAt updatedAt likes")
        .sort({ createdAt: -1 });
    }

    if (!posts || posts.length === 0) {
      throw {
        status: 404,
        message: "Không có bài viết nào",
      };
    }

    res.status(200).json({
      message: "Lấy bài viết thành công",
      data: {
        count,
        posts,
      },
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getHistoryPosts = async (req, res) => {
  try {
    const currentPage = req.params.currentPage || 1;
    const keyword = req.params.keyword || null;
    const userId = req.userId;

    let user = await userModel.findById(userId);

    let query = {
      isDisplay: true,
      isDelete: false,
      user: userId,
      isDoc: false,
    };

    if (keyword) {
      const regex = new RegExp(keyword, "i"); // Tạo biểu thức chính quy từ keyword
      query.title = regex; // Thêm điều kiện tìm kiếm tiêu đề
    }

    const count = await postModel.countDocuments(query);

    const offset = 10 * (currentPage - 1);

    const posts = await postModel
      .find(query)
      .limit(10)
      .skip(offset)
      .populate("user", "name pic")
      .select("_id title createdAt updatedAt likes")
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      throw {
        status: 404,
        message: "Không có bài viết nào",
      };
    }

    res.status(200).json({
      message: "Tìm kiếm bài viết thành công",
      data: {
        count,
        posts,
      },
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getPostDetailById = async (req, res) => {
  try {
    const postId = req.params.postId;

    const postDetail = await postModel
      .find({ _id: postId, isDelete: false, isDoc: false, isDisplay: true })
      .select("-comments")
      .populate("user", "name pic");

    if (!postDetail[0]) {
      throw {
        status: 404,
        message: "Không tìm thấy bài viết",
      };
    }

    res.status(200).json({
      message: "Lấy thông tin bài viết thành công",
      data: postDetail[0],
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getPostUnApprovedDetailById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;

    const postDetail = await postModel
      .findById(postId)
      .select("-comments")
      .populate("user", "name pic");

    if (!postDetail) {
      throw {
        status: 404,
        message: "Không tìm thấy bài viết",
      };
    }

    if (postDetail.isDelete || postDetail.isDisplay || postDetail.isDoc) {
      throw {
        status: 404,
        message: "Không tìm thấy bài viết",
      };
    }

    let user = await userModel.findById(userId);

    if (!user.isAdmin && postDetail.user._id !== userId) {
      if (postDetail.isDelete || !postDetail.isDisplay || postDetail.isDoc) {
        throw {
          status: 404,
          message: "Không tìm thấy bài viết",
        };
      }
    }

    res.status(200).json({
      message: "Lấy thông tin bài viết thành công",
      data: postDetail,
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.userId;

    if (!postId) {
      throw {
        status: 404,
        message: "không tìm thấy postId",
      };
    }

    let user = await userModel.findById(userId);

    let post = await postModel
      .findOne({
        _id: postId,
        isDoc: false,
        isDelete: false,
        isDisplay: true,
      })
      .populate("user", "name pic followers");

    if (!post) {
      throw {
        status: 404,
        message: "Không tìm thấy bài viết",
      };
    }

    // Tìm user like trong post của người dùng
    const existingUserIndex = post.likes.findIndex(
      (item) => item.user === userId
    );

    if (existingUserIndex !== -1) {
      // Nếu user đã tồn tại - xóa user đó ra
      post.likes.splice(existingUserIndex, 1);

      res.status(200).json({
        message: "Hủy thích bài viết thành công",
        data: post.likes,
      });

      await post.save();
      return;
    } else {
      // Nếu user chưa có trong likes, thêm mới vào
      post.likes.unshift({ user: userId });

      res.status(200).json({
        message: "Thích bài viết thành công",
        data: post.likes,
      });

      await post.save();

      // Gửi thông báo cho người chủ bài viết
      if (userId !== post.user._id) {
        const notification = await NotificationModel.create({
          sender: userId, // Người gửi là người đã comment
          receiver: post.user._id, // Người nhận là chủ bài viết
          message: `đã thích bài viết của bạn`,
          link: `/community/post/${postId}`, // Đường dẫn đến bài viết
        });

        await notification.save();
      }

      return;
    }
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

const approvedPost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.userId;

    if (!postId) {
      throw {
        status: 404,
        message: "không tìm thấy postId",
      };
    }

    const user = await userModel.findById(userId);

    const post = await postModel
      .findById(postId)
      .populate("user", "name pic followers");

    if (!post) {
      throw {
        status: 404,
        message: "Không tìm thấy bài viết",
      };
    }

    if (post.isDisplay) {
      throw {
        status: 409,
        message: "Bài viết đã được duyệt trước đó",
      };
    }

    // Cập nhật trạng thái bài viết
    await postModel.findByIdAndUpdate(
      postId,
      { isDisplay: true },
      { new: true }
    );

    // Gửi thông báo cho người đăng bài
    const notificationToAuthor = new NotificationModel({
      sender: user._id, // Không cần thông tin người gửi, có thể để null
      receiver: post.user._id,
      message: "đã duyệt bài viết của bạn",
      link: `/community/post/${postId}`, // Đường dẫn đến bài viết
    });
    await notificationToAuthor.save();

    // Gửi thông báo cho những người theo dõi người tạo bài viết
    const followers = post.user.followers; // Danh sách người theo dõi người dùng
    const message = `đăng bài viết mới.`;

    if (followers.length > 0) {
      followers.map(async (followerId) => {
        // Tạo thông báo
        const notification = new NotificationModel({
          sender: post.user._id,
          receiver: followerId,
          message: message,
          link: `/community/post/${postId}`, // Đường dẫn đến bài viết
        });

        // Lưu thông báo vào cơ sở dữ liệu
        await notification.save();
      });
    }

    res.status(200).json({
      message: "Duyệt bài viết thành công",
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.userId;

    if (!postId) {
      throw {
        status: 404,
        message: "Không tìm thấy postId",
      };
    }

    let user = await userModel.findById(userId);

    const post = await postModel.findById(postId);

    if (!post) {
      throw {
        status: 404,
        message: "Không tìm thấy bài viết",
      };
    }

    if (post.isDelete) {
      throw {
        status: 409,
        message: "Bài viết đã được xóa trước đó",
      };
    }

    if (!user.isAdmin && !(user._id === post.user)) {
      throw {
        status: 403,
        message: "Người dùng không có quyền",
      };
    }

    await postModel.findByIdAndUpdate(
      postId,
      { isDelete: true },
      { new: true }
    );

    res.status(200).json({
      message: "Xóa bài viết thành công",
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

// Lưu bài viết
let savePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.body.postId;

    const user = await userModel.findById(userId);

    const post = await postModel.findOne({
      _id: postId,
      isDoc: false,
      isDelete: false,
      isDisplay: true,
    });

    if (!post) {
      throw {
        status: 404,
        message: "Bài viết không tồn tại",
      };
    }

    if (!user.postsSaved.includes(postId)) {
      await userModel.findOneAndUpdate(
        { _id: userId },
        { $push: { postsSaved: postId } }
      );
    } else {
      throw {
        status: 409,
        message: "Bài viết này đã tồn tại trong danh sách lưu",
      };
    }

    res.status(200).json({
      message: "Lưu thành công",
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

// Hủy lưu bài viết
let unSavePost = async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.body.postId;

    const user = await userModel.findById(userId);

    const post = await postModel.findOne({
      _id: postId,
      isDoc: false,
      isDelete: false,
      isDisplay: true,
    });

    if (!post) {
      throw {
        status: 404,
        message: "Bài viết không tồn tại",
      };
    }

    if (user.postsSaved.includes(postId)) {
      await userModel.findOneAndUpdate(
        { _id: userId },
        { $pull: { postsSaved: postId } }
      );
    } else {
      throw {
        status: 404,
        message: "Bài viết này không tồn tại trong danh sách lưu",
      };
    }

    res.status(200).json({
      message: "Hủy lưu thành công",
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getSavedPosts = async (req, res) => {
  try {
    const currentPage = req.params.currentPage || 1;
    const keyword = req.params.keyword || null;
    const userId = req.userId;
    let user = await userModel.findById(userId);

    let query = {
      _id: { $in: user.postsSaved }, // Chỉ lấy các bài viết có ID trong danh sách postsSaved của user
      isDisplay: true,
      isDelete: false,
      isDoc: false,
    };

    if (keyword) {
      const regex = new RegExp(keyword, "i"); // Tạo biểu thức chính quy từ keyword
      query.title = regex; // Thêm điều kiện tìm kiếm theo tiêu đề bài viết
    }

    // Đếm số lượng bài viết thỏa mãn điều kiện
    const count = await postModel.countDocuments(query);

    const offset = 10 * (currentPage - 1);

    // Truy vấn các bài viết mà người dùng đã lưu
    const posts = await postModel
      .find(query)
      .limit(10)
      .skip(offset)
      .populate("user", "name pic")
      .select("_id title createdAt updatedAt likes")
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      throw {
        status: 404,
        message: "Không có bài viết nào",
      };
    }

    res.status(200).json({
      message: "Tìm kiếm bài viết thành công",
      data: {
        count,
        posts, // Sửa data thành posts
      },
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getSavedPostId = async (req, res) => {
  try {
    const userId = req.userId;

    let user = await userModel.findById(userId);

    // Lấy danh sách các ID của các bài viết mà người dùng đã lưu
    const postsSavedIds = user.postsSaved;

    if (!postsSavedIds || postsSavedIds.length === 0) {
      throw {
        status: 404,
        message: "Không có bài viết",
      };
    }

    res.status(200).json({
      message: "Lấy thành công",
      data: postsSavedIds,
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

/////////////////////////// ADMIN MANAGER ///////////////////////////

let getDeletePosts = async (req, res) => {
  try {
    const currentPage = req.params.currentPage || 1;

    let posts, count;

    count = await postModel.countDocuments({
      isDelete: true,
      isDoc: false,
    });

    const offset = 10 * (currentPage - 1);

    posts = await postModel
      .find({ isDelete: true, isDoc: false })
      .limit(10)
      .skip(offset)
      .populate("user", "name pic")
      .select("_id title createdAt updatedAt likes")
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      throw {
        status: 404,
        message: "Không có bài viết nào",
      };
    }

    res.status(200).json({
      message: "Lấy bài viết thành công",
      data: {
        count,
        posts,
      },
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getPostsStatistics = async (req, res) => {
  try {
    const { day, month, year } = req.params;

    let query = {
      isDelete: false,
      isDoc: false,
    };

    if (day !== "null" && month && year) {
      const startDate = new Date(`${year}-${month}-${day}`);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.updatedAt = { $gte: startDate, $lt: endDate };
    } else if (month !== "null" && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const nextMonth = parseInt(month) + 1;
      const endDate = new Date(`${year}-${nextMonth}-01`);
      query.updatedAt = { $gte: startDate, $lt: endDate };
    } else if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${parseInt(year) + 1}-01-01`);
      query.updatedAt = { $gte: startDate, $lt: endDate };
    }

    const count = await postModel.countDocuments(query);

    res.status(200).json({
      message: "Thống kê thành công",
      data: count,
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getUnapprovedPostsStatistics = async (req, res) => {
  try {
    const { day, month, year } = req.params;

    let query = {
      isDisplay: false,
      isDelete: false,
      isDoc: false,
    };

    if (day !== "null" && month && year) {
      const startDate = new Date(`${year}-${month}-${day}`);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.updatedAt = { $gte: startDate, $lt: endDate };
    } else if (month !== "null" && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const nextMonth = parseInt(month) + 1;
      const endDate = new Date(`${year}-${nextMonth}-01`);
      query.updatedAt = { $gte: startDate, $lt: endDate };
    } else if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${parseInt(year) + 1}-01-01`);
      query.updatedAt = { $gte: startDate, $lt: endDate };
    }

    const count = await postModel.countDocuments(query);

    res.status(200).json({
      message: "Thống kê thành công",
      data: count,
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getapprovedPostsStatistics = async (req, res) => {
  try {
    const { day, month, year } = req.params;

    let query = {
      isDisplay: true,
      isDelete: false,
      isDoc: false,
    };

    if (day !== "null" && month && year) {
      const startDate = new Date(`${year}-${month}-${day}`);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.updatedAt = { $gte: startDate, $lt: endDate };
    } else if (month !== "null" && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const nextMonth = parseInt(month) + 1;
      const endDate = new Date(`${year}-${nextMonth}-01`);
      query.updatedAt = { $gte: startDate, $lt: endDate };
    } else if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${parseInt(year) + 1}-01-01`);
      query.updatedAt = { $gte: startDate, $lt: endDate };
    }

    const count = await postModel.countDocuments(query);

    res.status(200).json({
      message: "Thống kê thành công",
      data: count,
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getPostDeleteDetailById = async (req, res) => {
  try {
    const postId = req.params.postId;

    const postDetail = await postModel
      .findById(postId)
      .select("-comments")
      .populate("user", "name pic");

    if (!postDetail || postDetail.isDoc) {
      throw {
        status: 404,
        message: "Không tìm thấy bài viết",
      };
    }

    if (!postDetail.isDelete) {
      throw {
        status: 404,
        message: "Bài viết chưa được xóa",
      };
    }

    res.status(200).json({
      message: "Lấy thông tin bài viết thành công",
      data: postDetail,
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

module.exports = {
  createPost,
  deletePost,
  updatePost,

  getPosts,
  getHistoryPosts,
  getUnapprovedPosts,
  getSavedPosts,

  getPostDetailById,
  getPostUnApprovedDetailById,
  getSavedPostId,

  toggleLikePost, // like, hủy like
  approvedPost, // duyệt bài
  savePost,
  unSavePost,

  /////////////////////////// ADMIN MANAGER ///////////////////////////

  getDeletePosts,
  getPostsStatistics,
  getUnapprovedPostsStatistics,
  getapprovedPostsStatistics,
  getPostDeleteDetailById,
};
