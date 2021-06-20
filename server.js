require("dotenv").config();
const express = require("express");
const GitHubStrategy = require("passport-github").Strategy;
const passport = require("passport");
const session = require("express-session");
const path = require("path");

const app = express();

app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
		cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

app.use("/style.css", express.static("public"));

app.use(express.static("public"));

app.use(express.static(path.join(__dirname, "public")));

passport.serializeUser(function (user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
	cb(null, id);
});

passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
			callbackURL: "http://localhost:3000/auth/github/callback",
		},
		function (accessToken, refreshToken, profile, cb) {
			// console.log(profile);
			cb(null, profile);
		}
	)
);

const isAuth = (req, res, next) => {
	if (req.user) {
		next();
	} else {
		res.redirect("/login");
	}
};

app.get("/", isAuth, (req, res) => {
	res.sendFile(__dirname + "/dashboard.html");
});

app.get("/login", (req, res) => {
	if (req.user) {
		return res.redirect("/");
	}
	res.sendFile(__dirname + "/login.html");
});

app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/login");
});

// Passport Middleware

app.get("/auth/github", passport.authenticate("github"));

app.get(
	"/auth/github/callback",
	passport.authenticate("github", { failureRedirect: "/login" }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect("/");
	}
);

app.listen(3000, () => {
	console.log("Server listening on port 3000 ");
});
