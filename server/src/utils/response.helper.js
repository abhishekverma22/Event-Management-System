export const sendError = (res, error, statusCode) => {
  return res.status(statusCode).json({
    message: error?.message || error || "Something went wrong",
    success: false,
    error: true,
  });
};

export const sendSuccess = (res, message, statusCode)=>{
    return res.status(statusCode).json({
        message: message,
        success: true,
        error:false
    })
}