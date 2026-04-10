const { doubleCsrf } = require('csrf-csrf');

const {
  invalidCsrfTokenError,
  generateCsrfToken,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: (req) => req.secret || process.env.SESSION_SECRET,
  getSessionIdentifier: (req) => req.session.id, // v4 check: mandatory
  cookieName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'], // v4 rename
});

module.exports = {
  invalidCsrfTokenError,
  generateCsrfToken,
  doubleCsrfProtection,
};
