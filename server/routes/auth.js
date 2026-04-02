const express = require('express');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const { pool } = require('../db/index');

const router = express.Router();

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_REDIRECT_URI,
  scope: ['identify', 'email', 'guilds.join'],
  passReqToCallback: true
}, async (req, accessToken, refreshToken, params, profile, done) => {
  const { id, username, avatar, email } = profile;
  const avatarUrl = avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png` : null;

  try {
    await pool.query(`
      INSERT INTO profiles (discord_id, username, avatar, email)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (discord_id) DO UPDATE SET 
        username = $2, 
        avatar = $3, 
        email = $4,
        updated_at = now()
    `, [id, username, avatarUrl, email]);

    const expiresIn = params.expires_in || 604800; // Default to 7 days if not provided
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    await pool.query(`
      INSERT INTO discord_auth (discord_id, access_token, refresh_token, expires_at)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (discord_id) DO UPDATE SET 
        access_token = $2, 
        refresh_token = $3, 
        expires_at = $4
    `, [id, accessToken, refreshToken, expiresAt]);


    return done(null, { discord_id: id, username, avatar: avatarUrl, email });
  } catch (err) {
    console.error('Error in Discord strategy:', err);
    return done(err);
  }
}));

router.get('/discord', (req, res, next) => {
  console.log('--- [AUTH PING] FRONTEND HIT THE DISCORD LOGIN ENDPOINT ---');
  next();
}, passport.authenticate('discord'));
router.get('/discord/callback', (req, res, next) => {
  passport.authenticate('discord', (err, user, info) => {
    if (err) {
      console.error('Passport Auth Error:', err);
      return res.redirect(`${process.env.CLIENT_URL}?auth_error=oauth_failed`);
    }
    if (!user) {
      console.error('Passport Auth Failed (No user returned, likely bad Client ID/Secret or invalid token exchange). Info:', info);
      return res.redirect(`${process.env.CLIENT_URL}?auth_error=no_user`);
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Session Login Error:', loginErr);
        return res.redirect(`${process.env.CLIENT_URL}?auth_error=session_failed`);
      }
      return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect(process.env.CLIENT_URL);
    });
  });
});

module.exports = router;