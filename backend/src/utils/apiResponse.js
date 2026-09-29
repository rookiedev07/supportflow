export const sendSuccess = (res, data = {}, statusCode = 200, message = null, meta = null) => {
  const payload = {
    success: true,
    data
  };

  if (message) {
    payload.message = message;
  }

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

export const sendError = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    message
  };

  if (errors) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};
