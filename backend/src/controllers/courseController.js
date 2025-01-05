const CourseModel = require("../models/courseModel");

let addCourse = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      throw {
        status: 400,
        message: "Không được bỏ trống thông tin",
      };
    }

    const course = await CourseModel.findOne({ name: name });

    if (course) {
      if (!course?.isActive) {
        await course.updateOne({ isActive: true });

        return res.status(200).json({
          message: "Thêm ngành học thành công",
          data: course,
        });
      } else {
        throw {
          status: 401,
          message: "Khóa học đã tồn tại",
        };
      }
    } else {
      const newCourse = await CourseModel.create({ name: name });

      return res.status(200).json({
        message: "Thêm ngành học thành công",
        data: newCourse,
      });
    }
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let editCourse = async (req, res) => {
  try {
    const { idCourse, name } = req.body;

    if (!name || name.trim() === "") {
      throw {
        status: 400,
        message: "Không được bỏ trống thông tin",
      };
    }

    let course = await CourseModel.findById(idCourse);

    if (!course || !course.isActive) {
      throw {
        status: 401,
        message: "Khóa học không tồn tại",
      };
    }

    if (course?.name == name) {
      throw {
        status: 401,
        message: "Đã trùng với tên ngành học cũ",
      };
    }

    let checkCourseName = await CourseModel.findOne({ name: name });

    if (checkCourseName?.name == name) {
      throw {
        status: 401,
        message: "Khóa học đã tồn tại",
      };
    }

    await course.updateOne({ name: name });

    course = await CourseModel.findById(idCourse);

    res.status(200).json({
      message: "Sửa ngành học thành công",
      data: course,
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let deleteCourse = async (req, res) => {
  try {
    const { idCourse } = req.body;

    if (!idCourse) {
      throw {
        status: 400,
        message: "Không được bỏ trống thông tin",
      };
    }

    let course = await CourseModel.findById(idCourse);

    if (!course) {
      throw {
        status: 401,
        message: "Khóa học không tồn tại",
      };
    }

    if (!course?.isActive) {
      throw {
        status: 401,
        message: "Khóa học đã xóa trước đó",
      };
    }

    await course.updateOne({ isActive: false });

    res.status(200).json({
      message: "Xóa ngành học thành công",
      data: course,
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

let getCourses = async (req, res) => {
  try {
    const keyword = req.params.keyword || null;

    let query = {
      isActive: true,
    };

    if (keyword) {
      const regex = new RegExp(keyword, "i"); // Tạo biểu thức chính quy từ keyword
      query.title = regex; // Thêm điều kiện tìm kiếm
    }

    const courses = await CourseModel.find(query).sort({
      createdAt: -1,
    });

    if (!courses || courses.length === 0) {
      throw {
        status: 404,
        message: "Không có ngành học nào",
      };
    }

    res.status(200).json({
      message: "Lấy ngành học thành công",
      data: courses,
    });
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

module.exports = {
  addCourse,
  editCourse,
  deleteCourse,
  getCourses,
};
