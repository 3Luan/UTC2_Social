const DocumentCategoryModel = require("../models/documentCategoryModel");

let addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      throw {
        status: 400,
        message: "Không được bỏ trống thông tin",
      };
    }

    const category = await DocumentCategoryModel.findOne({ name: name });

    if (category) {
      if (!category?.isActive) {
        await category.updateOne({ isActive: true });

        return res.status(200).json({
          message: "Thêm danh mục thành công",
          data: category,
        });
      } else {
        throw {
          status: 401,
          message: "Danh mục đã tồn tại",
        };
      }
    } else {
      const newCategory = await DocumentCategoryModel.create({ name: name });

      return res.status(200).json({
        message: "Thêm danh mục thành công",
        data: newCategory,
      });
    }
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let editCategory = async (req, res) => {
  try {
    const { idCategory, name } = req.body;

    if (!name || name.trim() === "") {
      throw {
        status: 400,
        message: "Không được bỏ trống thông tin",
      };
    }

    let category = await DocumentCategoryModel.findById(idCategory);

    if (!category || !category.isActive) {
      throw {
        status: 401,
        message: "Danh mục không tồn tại",
      };
    }

    if (category?.name == name) {
      throw {
        status: 401,
        message: "Đã trùng với tên danh mục cũ",
      };
    }

    let checkCategoryName = await DocumentCategoryModel.findOne({ name: name });

    if (checkCategoryName?.name == name) {
      throw {
        status: 401,
        message: "Danh mục đã tồn tại",
      };
    }

    await category.updateOne({ name: name });

    res.status(200).json({
      message: "Sửa danh mục thành công",
      data: name,
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let deleteCategory = async (req, res) => {
  try {
    const { idCategory } = req.body;

    if (!idCategory) {
      throw {
        status: 400,
        message: "Không được bỏ trống thông tin",
      };
    }

    let category = await DocumentCategoryModel.findById(idCategory);

    if (!category) {
      throw {
        status: 401,
        message: "Danh mục không tồn tại",
      };
    }

    if (!category?.isActive) {
      throw {
        status: 401,
        message: "Danh mục đã xóa trước đó",
      };
    }

    await category.updateOne({ isActive: false });

    res.status(200).json({
      message: "Xóa danh mục thành công",
      data: category,
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getCategorys = async (req, res) => {
  try {
    const currentPage = req.params.currentPage || 1;
    const keyword = req.params.keyword || null;

    let query = {
      isActive: true,
    };

    if (keyword) {
      const regex = new RegExp(keyword, "i"); // Tạo biểu thức chính quy từ keyword
      query.title = regex; // Thêm điều kiện tìm kiếm
    }

    // Đếm số lượng
    const count = await DocumentCategoryModel.countDocuments(query);

    const offset = 10 * (currentPage - 1);

    const categorys = await DocumentCategoryModel.find(query)
      .limit(10)
      .skip(offset)
      .sort({ createdAt: -1 });

    if (!categorys || categorys.length === 0) {
      throw {
        status: 404,
        message: "Không có danh mục nào",
      };
    }

    res.status(200).json({
      message: "Lấy danh mục thành công",
      data: {
        count,
        categorys,
      },
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

module.exports = {
  addCategory,
  editCategory,
  deleteCategory,
  getCategorys,
};
