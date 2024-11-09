import axios from "axios";

const instance = axios.create({
  baseURL: "https://utc2.edu.vn/api/v1.0/",
  // withCredentials: true,
});

instance.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    if (error.response) {
      // Xử lý lỗi từ response HTTP
      const { status, data } = error.response;

      // Thông báo lỗi cho người dùng nếu cần thiết
      if (status === 401) {
        // Xử lý lỗi xác thực, chẳng hạn chuyển hướng đến trang đăng nhập
        console.log("Unauthorized error:", data);
      } else {
        // Hiển thị thông báo lỗi cho người dùng
        console.log("An error occurred:", data);
      }
    } else if (error.request) {
      // Xử lý lỗi không có response từ server
      console.log("No response received from server:", error.request);
    } else {
      // Xử lý lỗi khác (lỗi trong quá trình gửi request)
      console.log("Error in request:", error.message);
    }

    // Ghi log hệ thống
    // logErrorToServer(error);

    // Trả về một object chứa thông tin lỗi
    return {
      data: error.response ? error.response.data : null,
      status: error.response ? error.response.status : null,
      headers: error.response ? error.response.headers : null,
    };
  }
);

export default instance;
