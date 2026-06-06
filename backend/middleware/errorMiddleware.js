export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`❌ Error [${statusCode}]:`, err.message);
  console.error("Full error:", err);
  res.status(statusCode).json({
    message: err.message || "Server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
