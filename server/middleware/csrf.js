const { doubleCsrf } = require('csrf-csrf');

const {
  invalidCsrfTokenError, // This is just a helpful export to handle the error in your error handler
  generateToken, // Use this in your routes to generate a token for the client
  doubleCsrfProtection, // This is the middleware
} = doubleCsrf({
  getSecret: (req) => req.secret || process.env.SESSION_SECRET, // Use session secret
  cookieName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Must match session sameSite
    secure: process.env.NODE_ENV === 'production',
  },
  size: 64, // The size of the generated tokens in bits
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'], // Standard methods that don't need CSRF
  getTokenFromRequest: (req) => req.headers['x-csrf-token'], // The header where the token will be provided
});

module.exports = {
  invalidCsrfTokenError,
  generateToken,
  doubleCsrfProtection,
};
