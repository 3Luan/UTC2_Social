import backendApi from "../api/backendApi";

export const addCategoryAPI = (name) => {
  return backendApi.post(`/api/documentCategory/addCategory`, { name });
};

export const editCategoryAPI = (idCategory, name) => {
  return backendApi.post(`/api/documentCategory/editCategory`, {
    idCategory,
    name,
  });
};

export const deleteCategoryAPI = (idCategory) => {
  return backendApi.post(`/api/documentCategory/deleteCategory`, {
    idCategory,
  });
};

export const getCategoriesAPI = () => {
  return backendApi.get(`/api/documentCategory/getCategories`);
};
