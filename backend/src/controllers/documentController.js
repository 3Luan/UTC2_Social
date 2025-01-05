const userModel = require("../models/userModel");
const postModel = require("../models/postModel");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fileUploadPath = path.join("uploads/files");
const imageUploadPath = path.join("uploads/images");
const NotificationModel = require("../models/notificationModel");
const DocumentCategoryModel = require("../models/documentCategoryModel");

let createDocument = async (req, res) => {
  try {
    const { title, content, categoryName } = req.body;
    const files = req.files?.files[0] || "";
    const userId = req.userId;

    if (!content || !title || !files || !categoryName) {
      throw {
        status: 400,
        message: "Không được bỏ trống thông tin",
      };
    }

    const category = await DocumentCategoryModel.findOne({
      name: categoryName,
    });

    if (!category || !category?.isActive) {
      throw {
        status: 401,
        message: "Danh mục không tồn tại",
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

    const fileName = generateUniqueFileName(files.originalname);
    const filePath = path.join(fileUploadPath, fileName);
    fs.writeFileSync(filePath, files.buffer);
    const fileData = { name: files.originalname, path: fileName };

    let newDocument;
    let message;

    if (user.isAdmin) {
      newDocument = await postModel.create({
        user: userId,
        category: category?._id,
        title,
        content,
        files: fileData,
        isDisplay: true,
        isDoc: true,
      });
      message = "Đăng tài liệu thành công";

      // Gửi thông báo cho những người theo dõi người tạo bài viết
      const followers = user.followers;
      const messageNoti = `đăng tài liệu mới.`;

      if (followers.length > 0) {
        followers.map(async (followerId) => {
          // Tạo thông báo
          const notification = new NotificationModel({
            sender: user._id,
            receiver: followerId,
            message: messageNoti,
            link: `/tai-lieu/${newDocument._id}`,
          });

          // Lưu thông báo vào cơ sở dữ liệu
          await notification.save();
        });
      }
    } else {
      newDocument = await postModel.create({
        user: userId,
        category: category?._id,
        title,
        content,
        files: fileData,
        isDoc: true,
      });

      message = "Tạo tài liệu thành công. Chờ duyệt!";
    }

    document = await postModel
      .findById(newDocument._id)
      .populate("user", "name pic")
      .select("_id title createdAt updatedAt likes");

    res.status(200).json({
      message: message,
      data: document,
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

const updateDocument = async (req, res) => {
  try {
    const { title, content, documentId, fileOld, categoryName } = req.body;
    const files = req.files?.files || null;
    const userId = req.userId;

    // Kiểm tra xem nội dung và tiêu đề có được cung cấp không
    if (
      !documentId ||
      !content ||
      !title ||
      (!files && !fileOld) ||
      !categoryName
    ) {
      throw {
        status: 400,
        message: "Không được bỏ trống thông tin",
      };
    }

    const category = await DocumentCategoryModel.findOne({
      name: categoryName,
    });

    if (!category || !category?.isActive) {
      throw {
        status: 401,
        message: "Danh mục không tồn tại",
      };
    }

    const documentOld = await postModel.findById(documentId);

    if (!documentOld || documentOld?.isDelete || !documentOld?.isDoc) {
      return res.status(404).json({
        status: 404,
        message: "Tài liệu không tồn tại",
      });
    }

    const user = await userModel.findById(userId);

    // Tạo một hàm để tạo tên file mới (uuid + timestamp)
    const generateUniqueFileName = (originalName) => {
      const extname = path.extname(originalName);
      const timestamp = Date.now();
      const uniqueFilename = `${uuidv4()}_${timestamp}${extname}`;
      return uniqueFilename;
    };

    // Xác định các ID của các hình ảnh cũ từ đối tượng imagesOld
    let updateData;
    if (fileOld) {
      updateData = {
        user: userId,
        title,
        content,
        category: category?._id,
        isDisplay: false,
      };
    } else {
      // Tạo đường dẫn và lưu trữ các tệp và hình ảnh
      const fileName = generateUniqueFileName(files[0].originalname);
      const filePath = path.join(fileUploadPath, fileName);
      fs.writeFileSync(filePath, files[0].buffer);
      const fileData = { name: files[0].originalname, path: fileName };

      updateData = {
        user: userId,
        title,
        content,
        isDisplay: false,
        files: fileData,
      };
    }

    if (user.isAdmin) {
      updateData.isDisplay = true;
    }

    await postModel.updateOne({ _id: documentId }, updateData);

    // Lấy tài liệu đã cập nhật và trả về
    const updatedDocument = await postModel
      .findById(documentId)
      .populate("user", "name pic")
      .select("_id title createdAt updatedAt likes");

    const message = user.isAdmin
      ? "Sửa tài liệu thành công"
      : "Sửa tài liệu thành công. Chờ duyệt!";

    res.status(200).json({
      message: message,
      data: updatedDocument,
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getDocumentDetailById = async (req, res) => {
  try {
    const documentId = req.params.documentId;

    const documentDetail = await postModel
      .find({ _id: documentId, isDelete: false, isDoc: true, isDisplay: true })
      .select("-comments")
      .populate("user", "name pic");

    if (!documentDetail[0]) {
      throw {
        status: 404,
        message: "Không tìm thấy tài liệu",
      };
    }

    res.status(200).json({
      message: "Lấy thông tin tài liệu thành công",
      documentDetail: documentDetail[0],
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getDocumentUnApprovedDetailById = async (req, res) => {
  try {
    const documentId = req.params.documentId;
    const userId = req.userId;

    const document = await postModel
      .find({ _id: documentId, isDelete: false, isDoc: true, isDisplay: false })
      .select("-comments")
      .populate("user", "name pic");

    if (!document[0]) {
      throw {
        status: 404,
        message: "Không tìm thấy tài liệu",
      };
    }

    let user = await userModel.findById(userId);

    if (!user.isAdmin && document[0].user._id !== userId) {
      throw {
        status: 404,
        message: "Không tìm thấy tài liệu",
      };
    }

    res.status(200).json({
      message: "Lấy thông tin tài liệu thành công",
      data: document[0],
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let toggleLikeDocument = async (req, res) => {
  try {
    const { documentId } = req.body;
    const userId = req.userId;

    if (!documentId) {
      throw {
        status: 404,
        message: "Không tìm thấy documentId",
      };
    }

    let document = await postModel
      .findOne({
        _id: documentId,
        isDoc: true,
        isDelete: false,
        isDisplay: true,
      })
      .populate("user", "name pic followers");

    if (!document) {
      throw {
        status: 404,
        message: "Không tìm thấy tài liệu",
      };
    }

    // Tìm user like trong post của người dùng
    const existingUserIndex = document.likes.findIndex(
      (item) => item.user === userId
    );

    if (existingUserIndex !== -1) {
      // Nếu user đã tồn tại - xóa user đó ra
      document.likes.splice(existingUserIndex, 1);

      res.status(200).json({
        message: "Hủy thích tài liệu thành công",
        data: document.likes,
      });

      await document.save();
      return;
    } else {
      // Nếu user chưa có trong likes, thêm mới vào
      document.likes.unshift({ user: userId });

      res.status(200).json({
        message: "Thích tài liệu thành công",
        data: document.likes,
      });

      await document.save();

      // Gửi thông báo cho người chủ tài liệu
      if (userId !== document.user._id) {
        const notification = await NotificationModel.create({
          sender: userId, // Người gửi là người đã comment
          receiver: document.user._id, // Người nhận là chủ tài liệu
          message: `đã thích tài liệu của bạn`,
          link: `/tai-lieu/${documentId}`, // Đường dẫn đến tài liệu
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

let approvedDocument = async (req, res) => {
  try {
    const { documentId } = req.body;
    const userId = req.userId;

    if (!documentId) {
      throw {
        status: 400,
        message: "Không tìm thấy documentId",
      };
    }

    let user = await userModel.findById(userId);

    const document = await postModel
      .findById(documentId)
      .populate("user", "name pic followers");
    if (!document || !document.isDoc || document.isDelete) {
      throw {
        status: 404,
        message: "Không tìm thấy tài liệu",
      };
    }

    if (document.isDisplay) {
      throw {
        status: 409,
        message: "Tài liệu đã được duyệt trước đó",
      };
    }

    await postModel.findByIdAndUpdate(
      documentId,
      { isDisplay: true },
      { new: true }
    );

    // Gửi thông báo cho người đăng bài
    const notificationToAuthor = new NotificationModel({
      sender: user._id, // Không cần thông tin người gửi, có thể để null
      receiver: document.user._id,
      message: "đã duyệt tài liệu của bạn",
      link: `/tai-lieu/${documentId}`,
    });
    await notificationToAuthor.save();

    // Gửi thông báo cho những người theo dõi người tạo tài liệu
    const followers = document.user.followers; // Danh sách người theo dõi người dùng
    const message = `đăng tài liệu mới.`;

    if (followers.length > 0) {
      followers.map(async (followerId) => {
        // Tạo thông báo
        const notification = new NotificationModel({
          sender: document.user._id,
          receiver: followerId,
          message: message,
          link: `/tai-lieu/${documentId}`,
        });

        // Lưu thông báo vào cơ sở dữ liệu
        await notification.save();
      });
    }

    res.status(200).json({
      message: "Duyệt tài liệu thành công",
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.body;
    const userId = req.userId;

    if (!documentId) {
      throw {
        status: 404,
        message: "Không tìm thấy documentId",
      };
    }

    let user = await userModel.findById(userId);

    const document = await postModel.findById(documentId);

    if (!document || !document.isDoc) {
      throw {
        status: 404,
        message: "Không tìm thấy tài liệu",
      };
    }

    if (document.isDelete) {
      throw {
        status: 409,
        message: "Tài liệu đã được xóa trước đó",
      };
    }

    if (!user.isAdmin && !(user._id === document.user)) {
      throw {
        status: 403,
        message: "Người dùng không có quyền",
      };
    }

    await postModel.findByIdAndUpdate(
      documentId,
      { isDelete: true },
      { new: true }
    );

    res.status(200).json({
      message: "Xóa tài liệu thành công",
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getDocuments = async (req, res) => {
  try {
    const currentPage = req.params.currentPage || 1;
    let keyword = req.params.keyword || null;
    const categoryId = req.params.categoryId || null;

    if (keyword === "null") {
      keyword = null;
    }

    let query = {
      isDisplay: true,
      isDelete: false,
      isDoc: true,
    };

    if (keyword) {
      const regex = new RegExp(keyword, "i"); // Tạo biểu thức chính quy từ keyword
      query.title = regex; // Thêm điều kiện tìm kiếm tiêu đề
    }

    if (categoryId) {
      query.category = categoryId; // Thêm điều kiện tìm kiếm tiêu đề
    }

    const count = await postModel.countDocuments(query);

    const offset = 10 * (currentPage - 1);

    const documents = await postModel
      .find(query)
      .limit(10)
      .skip(offset)
      .populate("user", "name pic")
      .select("_id title createdAt updatedAt likes")
      .sort({ createdAt: -1 });

    if (!documents || documents.length === 0) {
      throw {
        status: 404,
        message: "Không có tài liệu nào",
      };
    }

    res.status(200).json({
      message: "Tìm kiếm tài liệu thành công",
      data: {
        count,
        documents,
      },
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getHistoryDocuments = async (req, res) => {
  try {
    const currentPage = req.params.currentPage || 1;
    const keyword = req.params.keyword || null;
    const userId = req.userId;
    const categoryId = req.params.categoryId || null;

    if (keyword === "null") {
      keyword = null;
    }

    let query = {
      isDisplay: true,
      isDelete: false,
      isDoc: true,
      user: userId,
    };

    if (keyword) {
      const regex = new RegExp(keyword, "i"); // Tạo biểu thức chính quy từ keyword
      query.title = regex; // Thêm điều kiện tìm kiếm tiêu đề
    }

    if (categoryId) {
      query.category = categoryId; // Thêm điều kiện tìm kiếm tiêu đề
    }

    const count = await postModel.countDocuments(query);

    const offset = 10 * (currentPage - 1);

    const documents = await postModel
      .find(query)
      .limit(10)
      .skip(offset)
      .populate("user", "name pic")
      .select("_id title createdAt updatedAt likes")
      .sort({ createdAt: -1 });

    if (!documents || documents.length === 0) {
      throw {
        status: 404,
        message: "Không có tài liệu nào",
      };
    }

    res.status(200).json({
      message: "Tìm kiếm tài liệu thành công",
      data: {
        count,
        documents,
      },
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getUnApprovedDocuments = async (req, res) => {
  try {
    const currentPage = req.params.currentPage || 1;
    const keyword = req.params.keyword || null;
    const userId = req.userId;
    let user = await userModel.findById(userId);
    const categoryId = req.params.categoryId || null;

    if (keyword === "null") {
      keyword = null;
    }

    let query = {
      isDisplay: false,
      isDelete: false,
      isDoc: true,
    };

    if (keyword) {
      const regex = new RegExp(keyword, "i"); // Tạo biểu thức chính quy từ keyword
      query.title = regex; // Thêm điều kiện tìm kiếm tiêu đề
    }
    if (categoryId) {
      query.category = categoryId; // Thêm điều kiện tìm kiếm tiêu đề
    }
    let documents, count;

    if (user.isAdmin) {
      count = await postModel.countDocuments(query);

      const offset = 10 * (currentPage - 1);

      documents = await postModel
        .find(query)
        .limit(10)
        .skip(offset)
        .populate("user", "name pic")
        .select("_id title createdAt updatedAt likes")
        .sort({ createdAt: -1 });
    } else {
      query.user = userId; // Thêm điều kiện người dùng vào query

      count = await postModel.countDocuments(query);

      const offset = 10 * (currentPage - 1);

      documents = await postModel
        .find(query)
        .limit(10)
        .skip(offset)
        .populate("user", "name pic")
        .select("_id title createdAt updatedAt likes")
        .sort({ createdAt: -1 });
    }

    if (!documents || documents.length === 0) {
      throw {
        status: 404,
        message: "Không có tài liệu nào",
      };
    }

    res.status(200).json({
      message: "Tìm kiếm tài liệu thành công",
      data: {
        count,
        documents,
      },
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getSavedDocuments = async (req, res) => {
  try {
    const currentPage = req.params.currentPage || 1;
    const keyword = req.params.keyword || null;
    const userId = req.userId;
    let user = await userModel.findById(userId);

    let query = {
      _id: { $in: user.postsSaved }, // Chỉ lấy các bài viết có ID trong danh sách postsSaved của user
      isDisplay: true,
      isDelete: false,
      isDoc: true,
    };

    if (keyword) {
      const regex = new RegExp(keyword, "i"); // Tạo biểu thức chính quy từ keyword
      query.title = regex; // Thêm điều kiện tìm kiếm theo tiêu đề bài viết
    }

    const count = await postModel.countDocuments(query);

    const offset = 10 * (currentPage - 1);

    // Truy vấn các bài viết mà người dùng đã lưu
    const documents = await postModel
      .find(query)
      .limit(10)
      .skip(offset)
      .populate("user", "name pic")
      .select("_id title createdAt updatedAt likes")
      .sort({ createdAt: -1 });

    if (!documents || documents.length === 0) {
      throw {
        status: 404,
        message: "Không có dữ liệu nào",
      };
    }

    res.status(200).json({
      message: "Tìm kiếm thành công",
      data: {
        count,
        documents,
      },
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

// Lưu tài liệu
let saveDocument = async (req, res) => {
  try {
    const userId = req.userId;
    const documentId = req.body.documentId;

    const user = await userModel.findById(userId);

    const document = await postModel.findOne({
      _id: documentId,
      isDoc: true,
      isDelete: false,
      isDisplay: true,
    });

    if (!document) {
      throw {
        status: 404,
        message: "Tài liệu không tồn tại",
      };
    }

    if (!user.postsSaved.includes(documentId)) {
      await userModel.findOneAndUpdate(
        { _id: userId },
        { $push: { postsSaved: documentId } }
      );
    } else {
      throw {
        status: 409,
        message: "Tài liệu này đã tồn tại trong danh sách lưu",
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
let UnsaveDocument = async (req, res) => {
  try {
    const userId = req.userId;
    const documentId = req.body.documentId;

    const user = await userModel.findById(userId);

    const document = await postModel.findOne({
      _id: documentId,
      isDoc: true,
      isDelete: false,
      isDisplay: true,
    });

    if (!document) {
      throw {
        status: 404,
        message: "Tài liệu không tồn tại",
      };
    }

    if (user.postsSaved.includes(documentId)) {
      await userModel.findOneAndUpdate(
        { _id: userId },
        { $pull: { postsSaved: documentId } }
      );
    } else {
      throw {
        status: 404,
        message: "Tài liệu này không tồn tại trong danh sách lưu",
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

/////////////////////////// ADMIN MANAGER ///////////////////////////

let getDeleteDocuments = async (req, res) => {
  try {
    const currentPage = req.params.currentPage || 1;

    let documents, count;

    count = await postModel.countDocuments({
      isDelete: true,
      isDoc: true,
    });

    const offset = 10 * (currentPage - 1);

    documents = await postModel
      .find({ isDelete: true, isDoc: true })
      .limit(10)
      .skip(offset)
      .populate("user", "name pic")
      .select("_id title createdAt updatedAt likes")
      .sort({ createdAt: -1 });

    if (!documents || documents.length === 0) {
      throw {
        status: 404,
        message: "Không có tài liệu đã xóa nào",
      };
    }

    res.status(200).json({
      message: "Lấy tài liệu đã xóa thành công",
      data: {
        count,
        documents,
      },
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};
let getDocumentStatistics = async (req, res) => {
  try {
    const { day, month, year } = req.params;

    let query = {
      isDelete: false,
      isDoc: true,
    };

    if (day !== "null" && month !== "null" && year) {
      const startDate = new Date(`${year}-${month}-${day}`);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.updatedAt = { $gte: startDate, $lt: endDate };
    } else if (month !== "null" && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
      const nextYear = parseInt(month) === 12 ? parseInt(year) + 1 : year;
      const endDate = new Date(`${nextYear}-${nextMonth}-01`);
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

let getUnapprovedDocumentStatistics = async (req, res) => {
  try {
    const { day, month, year } = req.params;

    let query = {
      isDelete: false,
      isDoc: true,
      isDisplay: false,
    };

    if (day !== "null" && month !== "null" && year) {
      const startDate = new Date(`${year}-${month}-${day}`);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.updatedAt = { $gte: startDate, $lt: endDate };
    } else if (month !== "null" && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
      const nextYear = parseInt(month) === 12 ? parseInt(year) + 1 : year;
      const endDate = new Date(`${nextYear}-${nextMonth}-01`);
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

let getApprovedDocumentStatistics = async (req, res) => {
  try {
    const { day, month, year } = req.params;

    let query = {
      isDelete: false,
      isDoc: true,
      isDisplay: true,
    };

    if (day !== "null" && month !== "null" && year) {
      const startDate = new Date(`${year}-${month}-${day}`);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.updatedAt = { $gte: startDate, $lt: endDate };
    } else if (month !== "null" && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
      const nextYear = parseInt(month) === 12 ? parseInt(year) + 1 : year;
      const endDate = new Date(`${nextYear}-${nextMonth}-01`);
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

let getDocumentDeleteDetailById = async (req, res) => {
  try {
    const documentId = req.params.documentId;

    const documentDetail = await postModel
      .findById(documentId)
      .select("-comments")
      .populate("user", "name pic");

    if (!documentDetail || !documentDetail.isDoc) {
      throw {
        status: 404,
        message: "Không tìm thấy tài liệu",
      };
    }

    if (!documentDetail.isDelete) {
      throw {
        status: 404,
        message: "Tài liệu chưa được xóa",
      };
    }

    res.status(200).json({
      message: "Lấy thông tin tài liệu thành công",
      data: documentDetail,
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

module.exports = {
  createDocument,
  deleteDocument,
  updateDocument,

  getDocuments,
  getUnApprovedDocuments,
  getHistoryDocuments,
  getSavedDocuments,

  getDocumentDetailById,
  getDocumentUnApprovedDetailById,

  toggleLikeDocument,
  approvedDocument,
  saveDocument,
  UnsaveDocument,

  /////////////////////////// ADMIN MANAGER ///////////////////////////

  getDeleteDocuments,
  getDocumentStatistics,
  getUnapprovedDocumentStatistics,
  getApprovedDocumentStatistics,
  getDocumentDeleteDetailById,
};
