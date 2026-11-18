const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {config} = require('dotenv')
config()
const app = express();
const port = process.env.port;
const ClientID = process.env.ClientID;
const ClientSecret = process.env.ClientSecret;

app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: ClientID,
      clientSecret: ClientSecret,
      callbackURL: "http://localhost:3000/callback",
    },
    (accessToken, refreshToken, profile, next) => {
      console.log(accessToken, profile);
      next(null, profile);
    },
  ),
);

app.get("/", (req, res) => {
  res.send(`<a href="/login">Login with google</a>`);
});

app.get("/login", passport.authenticate("google", { scope: ["profile"] }));

app.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    session: false,
  }),
  (req, res) => {
    console.log(req.user);
    res.send(`Hi ${req.user.displayName}`);
  },
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});