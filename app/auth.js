const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { db } = require("./db");
const { sendMagicLink } = require("./mailer");

const router = express.Router();

router.post("/request", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.send("Email required");

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = Date.now() + Number(process.env.MAGIC_TOKEN_TTL_MIN) * 60 * 1000;

  db.run(
    `INSERT INTO magic_links (email, token_hash, expires_at, created_at)
     VALUES (?, ?, ?, ?)`,
    [email, tokenHash, expiresAt, Date.now()]
  );

  const link = `${process.env.APP_BASE_URL}/auth/verify?token=${rawToken}`;
  await sendMagicLink(email, link);

  res.send("Magic link sent. Check your email.");
});

router.get("/verify", (req, res) => {
  const { token } = req.query;
  if (!token) return res.redirect("/login");

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  db.get(
    `SELECT * FROM magic_links WHERE token_hash = ? AND used = 0`,
    [tokenHash],
    (err, row) => {
      if (!row || row.expires_at < Date.now()) {
        return res.redirect("/login");
      }

      db.run(`UPDATE magic_links SET used = 1 WHERE id = ?`, [row.id]);

      const jwtToken = jwt.sign({ email: row.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.cookie("token", jwtToken, { httpOnly: true });
      res.redirect("/calculator");
    }
  );
});

module.exports = router;
