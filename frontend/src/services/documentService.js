import backendApi from "../api/backendApi";

export const createDocumentAPI = (formData) => {
  return backendApi.post(`/api/document/createDocument`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateDocumentAPI = (formData) => {
  return backendApi.post(`/api/document/updateDocument`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getDocumentsAPI = (currentPage) => {
  return backendApi.get(`/api/document/getDocuments/${currentPage}`);
};

export const searchDocumentAPI = (currentPage, keyword) => {
  return backendApi.get(`/api/document/getDocuments/${currentPage}/${keyword}`);
};

export const filterDocumentAPI = (currentPage, keyword, categoryId) => {
  return backendApi.get(
    `/api/document/getDocuments/${currentPage}/${keyword}/${categoryId}`
  );
};

export const filterHistoryDocumentAPI = (currentPage, keyword, categoryId) => {
  return backendApi.get(
    `/api/document/getHistoryDocuments/${currentPage}/${keyword}/${categoryId}`
  );
};

export const filterUnapprovedDocumentAPI = (
  currentPage,
  keyword,
  categoryId
) => {
  return backendApi.get(
    `/api/document/getUnapprovedDocuments/${currentPage}/${keyword}/${categoryId}`
  );
};

export const searchHistoryDocumentAPI = (currentPage, keyword) => {
  return backendApi.get(
    `/api/document/getHistoryDocuments/${currentPage}/${keyword}`
  );
};

export const searchUnApprovedDocumentAPI = (currentPage, keyword) => {
  return backendApi.get(
    `/api/document/getUnapprovedDocuments/${currentPage}/${keyword}`
  );
};

export const getUnapprovedDocumentsAPI = (currentPage) => {
  return backendApi.get(`/api/document/getUnapprovedDocuments/${currentPage}`);
};

export const getHistoryDocumentsAPI = (currentPage) => {
  return backendApi.get(`/api/document/getHistoryDocuments/${currentPage}`);
};

export const getDocumentDetailByIdAPI = (documentId) => {
  return backendApi.get(`/api/document/getDocumentDetailById/${documentId}`);
};

export const getDocumentUnApprovedDetailByIdAPI = (documentId) => {
  return backendApi.get(
    `/api/document/getDocumentUnApprovedDetailById/${documentId}`
  );
};

export const toggleLikeDocumentAPI = (documentId) => {
  return backendApi.post(`/api/document/toggleLikeDocument`, { documentId });
};

export const saveDocumentAPI = (documentId) => {
  return backendApi.post(`/api/document/saveDocument`, { documentId });
};

export const UnsaveDocumentAPI = (documentId) => {
  return backendApi.post(`/api/document/UnsaveDocument`, { documentId });
};

export const approvedDocumentAPI = (documentId) => {
  return backendApi.post(`/api/document/approvedDocument`, { documentId });
};

export const deleteDocumentAPI = (documentId) => {
  return backendApi.post(`/api/document/deleteDocument`, { documentId });
};

export const getSaveDocumentAPI = (currentPage) => {
  return backendApi.get(`/api/document/getSavedDocuments/${currentPage}`);
};

export const searchDocumentSavedAPI = (currentPage, keyword) => {
  return backendApi.get(
    `/api/document/getSavedDocuments/${currentPage}/${keyword}`
  );
};

// admin
export const getDeleteDocumentsAPI = (currentPage) => {
  return backendApi.get(`/api/document/getDeleteDocuments/${currentPage}`);
};

export const getDocumentStatisticsAPI = (day, month, year) => {
  return backendApi.get(
    `/api/document/getDocumentStatistics/${day}/${month}/${year}`
  );
};

export const getUnapprovedDocumentStatisticsAPI = (day, month, year) => {
  return backendApi.get(
    `/api/document/getUnapprovedDocumentStatistics/${day}/${month}/${year}`
  );
};

export const getapprovedDocumentStatisticsAPI = (day, month, year) => {
  return backendApi.get(
    `/api/document/getapprovedDocumentStatistics/${day}/${month}/${year}`
  );
};

export const getDocumentDeleteDetailByIdAPI = (documentId) => {
  return backendApi.get(
    `/api/document/getDocumentDeleteDetailById/${documentId}`
  );
};
