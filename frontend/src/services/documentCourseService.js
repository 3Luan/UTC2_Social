import backendApi from "../api/backendApi";

export const addCourseAPI = (name) => {
  return backendApi.post(`/api/course/addCourse`, { name });
};

export const editCourseAPI = (idCourse, name) => {
  return backendApi.post(`/api/course/editCourse`, {
    idCourse,
    name,
  });
};

export const deleteCourseAPI = (idCourse) => {
  return backendApi.post(`/api/course/deleteCourse`, {
    idCourse,
  });
};

export const getCoursesAPI = () => {
  return backendApi.get(`/api/course/getCourses`);
};
