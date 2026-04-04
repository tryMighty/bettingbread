const express = require('express');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();

const { pool } = require('./db/index');

const { initCronJobs } = require('./services/cronJobs');
const logger = require('./utils/logger');
const { doubleCsrfProtection, generateToken } = require('./middleware/csrf');

const app = express();

// Use structured logger for request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Initialize background cron tasks
initCronJobs();

app.set('trust proxy', 1); // Trust first proxy for Render/Vercel load balancers
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(session({
  store: new PgSession({ pool }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true, // Required for secure cookies to work behind Render/Vercel proxies
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/auth'));

// CSRF Protected API Routes
app.get('/api/csrf-token', (req, res) => {
  const token = generateToken(req, res);
  res.json({ token });
});

app.use('/api/dashboard', doubleCsrfProtection, require('./routes/dashboard'));
app.use('/api/payment', doubleCsrfProtection, require('./routes/payment'));
app.use('/api/admin', doubleCsrfProtection, require('./routes/admin'));

app.get('/', (req, res) => res.send('BettingBread Backend is running'));

// Global Error Handler (must be last)
const errorHandler = (err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
};

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));