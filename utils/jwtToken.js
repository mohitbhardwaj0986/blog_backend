export const sendToken = async (user, statusCode, res, message) => {
  const token = await user.generatejwtToken();
  const option = {
    expire: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };
  res.status(statusCode).cookie("token", token, option).json({
    success: true,
    token,
    message,
    user,
  });
};
