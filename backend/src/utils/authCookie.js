const { config } = require("../config/env");

const AUTH_COOKIE_NAME = "bybs_admin_session";

const cookieOptions = () => ({
  httpOnly: true,
  secure: config.isProduction,
  sameSite: "strict",
  maxAge: config.authCookieMaxAgeMs,
  path: "/api",
});

const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, cookieOptions());
};

const clearAuthCookie = (res) => {
  const { maxAge: _maxAge, ...options } = cookieOptions();
  res.clearCookie(AUTH_COOKIE_NAME, options);
};

module.exports = {
  AUTH_COOKIE_NAME,
  clearAuthCookie,
  setAuthCookie,
};
