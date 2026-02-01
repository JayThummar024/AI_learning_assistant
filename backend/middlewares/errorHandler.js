const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Mongoose validation errors
  if (err.name === "castError") {
    statusCode = 400;
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 400;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 400;
    message = `Duplicate value for field: ${field}`;
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((value) => value.message)
      .join(", ");
  }

  //Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = `File size is too large. Maximum limit is 10MB bytes.`;
  }

  //jwt error
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = `Invalid token. Please log in again.`;
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = `Your token has expired. Please log in again.`;
  }

  console.error("Error :", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode: statusCode,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
