require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");

const authRoutes = require("./auth");
const { initDB } = require("./db");

const app = express();
const PORT = 3000;

// init db
initDB();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// auth routes
app.use("/auth", authRoutes);

// auth middleware
function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.redirect("/login");
  }
}

// pages
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/calculator", requireAuth, (req, res) => {
  res.render("calculator");
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
