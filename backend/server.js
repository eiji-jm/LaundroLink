require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Paymongo = require('paymongo-node');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const sgMail = require('@sendgrid/mail');

const app = express();
app.set('trust proxy', true);
app.use(cors());
app.use(express.json());

// =================================================================
// Service Configurations
// =================================================================
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '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');

const paymongo = new Paymongo(process.env.PAYMONGO_SECRET_KEY || 'sk_test_XKokBfcf6whTCziC2MsoiR2p'); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dihmaok1f",
  api_key: process.env.CLOUDINARY_API_KEY || "178955671531398",
  api_secret: process.env.CLOUDINARY_API_SECRET || "pgbPIzuURs2OniTEyKqPf0Y2vLM",
});

const MAYA_PUBLIC_KEY = process.env.MAYA_PUBLIC_KEY || "pk-Hpa1ILZZvEnyzCJm699kizDdCcTYM0M8Dq1ne93unff";
const MAYA_SECRET_KEY = process.env.MAYA_SECRET_KEY || "sk-F6kmlfDE3F77LKEI47B7QrDs3RCjupUHczpPI1UuS1d";
const MAYA_API_URL = "https://pg-sandbox.paymaya.com";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// =================================================================
// Database Connection
// =================================================================
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "LaundroLink",
});

db.getConnection()
  .then((conn) => console.log(`✅ Connected to MySQL database: ${process.env.DB_NAME}`))
  .catch((err) => console.error("❌ Database connection failed:", err));

// =================================================================
// Helper Functions
// =================================================================
function generateOTP() { return Math.floor(100000 + Math.random() * 900000).toString(); }

function splitName(fullName) {
    const nameParts = (fullName || '').trim().split(' ');
    const firstName = nameParts.shift() || 'User';
    const lastName = nameParts.join(' ') || firstName;
    return { firstName, lastName };
}

async function sendEmail(to, subject, html) {
  const msg = {
    to: to,
    from: 'dimpasmj@gmail.com',
    subject: subject,
    html: html,
  };
  try {
    await sgMail.send(msg);
    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error('❌ Error sending email:', error.response ? error.response.body.errors : error);
  }
}

// =================================================================
// API Routes
// =================================================================

// ✅ ADDED BACK: The missing route for image uploads
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) { 
      return res.status(400).json({ success: false, message: "No file uploaded." }); 
    }
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await cloudinary.uploader.upload(dataURI, { 
      folder: "laundrolink_profiles" 
    });
    res.json({ 
      success: true, 
      message: "Image uploaded successfully.", 
      url: result.secure_url 
    });
  } catch (error) {
    console.error("❌ Image upload error:", error);
    res.status(500).json({ success: false, message: "Failed to upload image." });
  }
});

// ✅ RESTORED: The missing profile update route
app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address, picture } = req.body;
    if (!id) { return res.status(400).json({ success: false, message: "User ID is required." }); }
    const fieldsToUpdate = [];
    const values = [];
    if (name !== undefined) { fieldsToUpdate.push("name = ?"); values.push(name); }
    if (phone !== undefined) { fieldsToUpdate.push("phone = ?"); values.push(phone); }
    if (address !== undefined) { fieldsToUpdate.push("address = ?"); values.push(address); }
    if (picture !== undefined) { fieldsToUpdate.push("picture = ?"); values.push(picture); }
    if (fieldsToUpdate.length === 0) { return res.status(400).json({ success: false, message: "No fields to update." }); }
    values.push(id);
    const sql = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) { return res.status(404).json({ success: false, message: "User not found." }); }
    const [updatedUserRows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    res.json({ success: true, message: "Profile updated successfully.", user: updatedUserRows[0] });
  } catch (error) {
    console.error("❌ Profile update error:", error);
    res.status(500).json({ success: false, message: "Failed to update profile." });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) { return res.status(400).json({ message: "Missing fields" }); }

    const [users] = await db.query("SELECT * FROM users WHERE email = ? OR phone = ?", [identifier, identifier]);
    if (users.length === 0) { return res.status(400).json({ message: "User not found" }); }

    const user = users[0];
    
    if (!user.password) {
        return res.status(400).json({ message: "This account was created with Google. Please sign in with Google or set a password in your profile." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) { return res.status(400).json({ message: "Invalid credentials" }); }
    
    const otp = generateOTP();
    await db.query("DELETE FROM otps WHERE user_id = ?", [user.id]);
    await db.query("INSERT INTO otps (user_id, otp_code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))", [user.id, otp]);

    res.json({ success: true, message: "Credentials valid, sending OTP.", userId: user.id });

    sendEmail(user.email, 'Your LaundroLink Login Code', `<strong>Your login code is: ${otp}</strong>`);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/auth/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) { return res.status(400).json({ success: false, message: "User ID and OTP are required." }); }

    const [otpRows] = await db.query("SELECT * FROM otps WHERE user_id = ? AND otp_code = ? AND expires_at > NOW()", [userId, otp]);
    if (otpRows.length === 0) { return res.status(400).json({ success: false, message: "Invalid or expired OTP." }); }

    await db.query("DELETE FROM otps WHERE user_id = ?", [userId]);

    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (users.length === 0) { return res.status(404).json({ success: false, message: "User not found after verification." }); }

    res.json({ success: true, message: "Login successful", user: users[0] });
  } catch (error) {
    console.error("❌ verify-otp error:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP." });
  }
});

app.post("/auth/google-login", async (req, res) => {
  try {
    const { google_id, email, name, picture } = req.body;
    if (!google_id || !email || !name) { return res.status(400).json({ success: false, message: "Missing Google data" }); }
    const [existingUser] = await db.query("SELECT * FROM users WHERE google_id = ? OR email = ?", [google_id, email]);
    let user;
    if (existingUser.length > 0) {
      user = existingUser[0];
    } else {
      const { firstName, lastName } = splitName(name);
      const customer = await paymongo.customers.create({ first_name: firstName, last_name: lastName, email: email });
      const [insert] = await db.query(
        "INSERT INTO users (google_id, name, email, picture, is_verified, paymongo_customer_id) VALUES (?, ?, ?, ?, ?, ?)",
        [google_id, name, email, picture, 1, customer.data.id]
      );
      const [newUser] = await db.query("SELECT * FROM users WHERE id = ?", [insert.insertId]);
      user = newUser[0];
    }
    return res.json({ success: true, message: "Google login successful", user: user });
  } catch (error) {
    console.error("❌ Google login error:", error);
    res.status(500).json({ success: false, message: "Server error during Google login" });
  }
});

app.post("/api/users/set-password", async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        if (!userId || !newPassword) { return res.status(400).json({ success: false, message: "User ID and new password are required." }); }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const [result] = await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);
        if (result.affectedRows === 0) { return res.status(404).json({ success: false, message: "User not found." }); }
        res.json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        console.error("❌ Set password error:", error);
        res.status(500).json({ success: false, message: "Failed to update password." });
    }
});

app.post("/auth/forgot-password", async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ success: false, message: "Email or phone is required" });
    const [users] = await db.query("SELECT id, email FROM users WHERE email = ? OR phone = ?", [identifier, identifier]);
    if (users.length === 0) {
      return res.json({ success: true, message: "If an account with this email exists, an OTP will be sent." });
    }
    const user = users[0];
    const otp = generateOTP();
    await db.query("DELETE FROM otps WHERE user_id = ?", [user.id]);
    await db.query("INSERT INTO otps (user_id, otp_code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))", [user.id, otp]);
    res.json({ success: true, message: "OTP is being sent to your email.", email: user.email });
    sendEmail(user.email, 'Your LaundroLink Password Reset Code', `<strong>Your password reset code is: ${otp}</strong><p>This code will expire in 10 minutes.</p>`);
  } catch (error) {
    console.error("Forgot password error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
});

app.post("/auth/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) { return res.status(400).json({ success: false, message: "Missing required fields" }); }
    const [users] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (users.length === 0) { return res.status(400).json({ success: false, message: "User not found" }); }
    const userId = users[0].id;
    const [otpRows] = await db.query("SELECT * FROM otps WHERE user_id = ? AND otp_code = ? AND expires_at > NOW()", [userId, otp]);
    if (otpRows.length === 0) { return res.status(400).json({ success: false, message: "Invalid or expired OTP" }); }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);
    await db.query("DELETE FROM otps WHERE user_id = ?", [userId]);
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// =================================================================
// CUSTOMER SELECTS LAUNDRY SERVICES
// =================================================================

// ✅ NEW: Endpoint to create and save a new order
app.post("/api/orders", async (req, res) => {
  try {
    const {
      orderId,
      userId,
      shopId,
      shopName,
      services,
      fabrics,
      addons,
      instructions,
      deliveryOption
    } = req.body;

    if (!userId || !shopId || !orderId) {
      return res.status(400).json({ success: false, message: "Missing required order information." });
    }

    // Convert arrays to JSON strings for database storage
    const servicesJson = JSON.stringify(services);
    const fabricsJson = JSON.stringify(fabrics);
    const addonsJson = JSON.stringify(addons);

    const [result] = await db.query(
      "INSERT INTO orders (order_uid, user_id, shop_id, shop_name, services, fabrics, addons, instructions, delivery_option) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [orderId, userId, shopId, shopName, servicesJson, fabricsJson, addonsJson, instructions, deliveryOption]
    );

    if (result.insertId) {
      res.status(201).json({ success: true, message: "Order created successfully.", orderId: result.insertId });
    } else {
      throw new Error("Failed to save order to the database.");
    }

  } catch (error) {
    console.error("❌ Create order error:", error);
    res.status(500).json({ success: false, message: "Failed to create order." });
  }
});

app.get("/api/test", (req, res) => {
  res.status(200).send("Server connection is working!");
});

app.get("/api/shops/nearby", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ success: false, message: "Latitude and longitude are required." });
    }
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    const query = `
      SELECT id, name, image_url, address, description, addDescription, contact, hours, availability, rating,
             ( 6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ) AS distance
      FROM shops
      HAVING distance < 10
      ORDER BY distance
      LIMIT 20;
    `;
    const [shops] = await db.query(query, [latitude, longitude, latitude]);
    res.json({ success: true, shops });
  } catch (error) {
    console.error("❌ Get nearby shops error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch nearby shops." });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});