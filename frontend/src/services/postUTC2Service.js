import utc2Api from "../api/utc2Api";

export const getPostUTC2API = (currentPage) => {
  return utc2Api.get("/post", {
    params: {
      currentPage: currentPage,
      // pageSize: 20,
      sortField: "created_at",
      sortOrder: "DESC",
      filters: "type==STUDENT_ANNOUNCEMENT,display==true",
    },
  });
};

export const getSearchPostUTC2API = (currentPage, keyword) => {
  return utc2Api.get("/post", {
    params: {
      currentPage: currentPage,
      sortField: "created_at",
      sortOrder: "DESC",
      filters: `type==STUDENT_ANNOUNCEMENT,display==true,(title|sub_title)@=${keyword}`,
    },
  });
};

// https://utc2.edu.vn/api/v1.0/post?currentPage=2&pageSize=10&sortField=created_at&sortOrder=DESC&filters=type%3D%3DSTUDENT_ANNOUNCEMENT%2Cdisplay%3D%3Dtrue%2C%20%20(title%7Csub_title)%40%3Dd%E1%BB%B1%20ki%E1%BA%BFn&subCategorys=

export const getNewsUTC2API = (currentPage) => {
  return utc2Api.get("/post", {
    params: {
      currentPage: currentPage,
      sortField: "created_at",
      sortOrder: "DESC",
      filters: "type==NEWS, display==true, featured=true",
    },
  });
};

export const getSearchNewsUTC2API = (currentPage, keyword) => {
  return utc2Api.get("/post", {
    params: {
      currentPage: currentPage,
      pageSize: 10,
      sortField: "created_at",
      sortOrder: "DESC",
      filters: `type==NEWS, display==true, featured=true,(title|sub_title)@=${keyword}`,
      subCategorys: "",
    },
  });
};

export const getPostByIdAPI = (postId) => {
  return utc2Api.get(`/post/${postId}`);
};
