import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'
import pool from '../db.js'
import nodemailer from 'nodemailer'

const router = express.Router()
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });
}

router.post('/checkEmail', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'email is required' });
  }

  try {
    // Query the user by email
    const result = await pool.query(
      `SELECT email, google_id, password 
            FROM users 
            WHERE email = $1`,
      [email]
    );

    // 1. Email does NOT exist → Register
    if (result.rowCount === 0) {
      return res.json({ status: 'register' });
    }

    const user = result.rows[0];

    // 2. If both exist
    if (user.google_id && user.password) {
      return res.json({ status: 'all_login' });
    }

    // 3. If google_id exists → Google login
    if (user.google_id) {
      return res.json({ status: 'google_login' });
    }

    // 4. If password exists → Password login
    if (user.password) {
      return res.json({ status: 'password_login' });
    }

    // 5. Fallback (rare case)
    return res.json({ status: 'unknown' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

router.post("/register", async (req, res) => {
  const { type } = req.body;

  try {
    // ---------------------------
    // MANUAL REGISTRATION
    // ---------------------------
    if (type === "manual") {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email & password required" });
      }

      // Check if email exists
      const existing = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Hash password
      const hashed = await bcrypt.hash(password, 10);

      // Insert new user
      const newUser = await pool.query(
        `INSERT INTO users (email, password, name, create_date)
         VALUES ($1, $2, $3, NOW())
         RETURNING id, email, name`,
        [email, hashed, name]
      );

      const user = newUser.rows[0];

      // Generate token
      const token = generateToken(user.id);

      return res.json({ token, user });
    }

    // ---------------------------
    // GOOGLE REGISTRATION
    // ---------------------------
    else if (type === "google") {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({ error: "Google ID token required" });
      }

      // Verify ID token with Google
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      const { sub: googleId, email, name, picture } = payload;

      // Check if already registered
      let existing = await pool.query(
        "SELECT * FROM users WHERE google_id = $1 OR email = $2",
        [googleId, email]
      );

      if (existing.rows.length > 0) {
        // If user exists, login instead
        const user = existing.rows[0];
        const token = generateToken(user.id);
        return res.json({ token, user });
      }

      // Register new google user
      const newUser = await pool.query(
        `INSERT INTO users (google_id, email, name)
         VALUES ($1, $2, $3)
         RETURNING id, email, name`,
        [googleId, email, name, picture]
      );

      const user = newUser.rows[0];
      const token = generateToken(user.id);

      return res.json({ token, user });
    }

    // ---------------------------
    // INVALID TYPE
    // ---------------------------
    else {
      return res.status(400).json({ error: "Invalid register type" });
    }
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { type } = req.body;

  try {
    // =====================================================================
    // 1️⃣ MANUAL LOGIN (email + password)
    // =====================================================================
    if (type === "manual") {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ message: "Email and password required" });

      // find user
      const userResult = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (userResult.rowCount === 0) {
        return res.status(404).json({ message: "Account not found" });
      }

      const user = userResult.rows[0];

      // compare password
      const match = await bcrypt.compareSync(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Invalid password" });
      }

      await pool.query(
        `UPDATE users
        SET last_login = NOW()
        WHERE id = $1`,[user.id]
      )
      
      // create JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "24h" }
      );

      return res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    }

    // =====================================================================
    // 2️⃣ GOOGLE LOGIN (ID Token verification)
    // =====================================================================
    if (type === "google") {
      const { idToken } = req.body;

      if (!idToken)
        return res.status(400).json({ message: "Google ID token required" });

      // Verify Google token
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const googleId = payload.sub;
      const email = payload.email;
      const username = payload.name;

      // Check if user exists
      let userResult = await pool.query(
        "SELECT * FROM users WHERE google_id = $1 OR email = $2",
        [googleId, email]
      );

      // If not exists, auto-register
      if (userResult.rowCount === 0) {
        const insertResult = await pool.query(
          `INSERT INTO users (google_id, email, username, create_date)
           VALUES ($1, $2, $3, NOW())
           RETURNING *`,
          [googleId, email, username]
        );
        userResult = insertResult;
      }

      const user = userResult.rows[0];

      await pool.query(
        `UPDATE users
        SET last_login = NOW()
        WHERE id = $1`,[user.id]
      )

      // create JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "24h" }
      );

      return res.json({
        message: "Google login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    }

    // If no type matched
    return res.status(400).json({ message: "Invalid login type" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Find user by email
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    // Send generic success response even if user not found (security)
    if (userResult.rowCount === 0) {
      return res.json({ message: "If email exists, link sent" });
    }

    const user = userResult.rows[0];

    // 2️⃣ Create JWT reset token (no DB column needed)
    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_RESET_SECRET,
      { expiresIn: "10m" }
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 3️⃣ Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Cash Track" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>Hello ${user.username ?? ''},</p>
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      message: "If the email is registered, a reset link has been sent",
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
})

router.put("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);

    // Now you know who the user is (decoded.id)
    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password = $1, mod_date = NOW() WHERE id = $2",
      [hashed, decoded.id]
    );

    return res.json({ message: "Password reset successful" });

  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
})





export default router