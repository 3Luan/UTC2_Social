// sendResponse.js
const sendResponse = (res, status, message, data = null) => {
  return res.status(status).json({
    message,
    ...(data && { data }),
  });
};

module.exports = sendResponse;
