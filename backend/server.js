const mysql = require('mysql2');
const express = require('express');

const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const app=express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("uploads")); // Serve uploaded images
const db = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'waste_management'
}); 
db.connect((err)=>{
  if(err){
    console.error("database connection failed:"+err);
    return ;
  }
  console.log("connected to mysql database");
});

module.exports=db;

app.use(express.json());

// Ensure "uploads" directory exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// Set up Multer for image uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file
  },
});
const upload = multer({ storage });
// // =========== API ROUTES =========== //
// 📌 **1. Submit Waste Report (With Image Upload)**
app.post("/submit", upload.single("image"), (req, res) => {
  const { address, quantity, latitude, longitude } = req.body;
  const imagePath = req.file ? req.file.filename : null; // Store filename

  const sql = `INSERT INTO waste_reports (image_path, address, quantity, latitude, longitude) 
               VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [imagePath, address, quantity, latitude, longitude], function (err) {
    if (err) {
      console.error("Error inserting data:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Data stored successfully", id: this.lastID });
  });
});

// 📌 **2. Admin Login**
app.post("/Login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM credentials WHERE email = ?", [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0 || results[0].password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      admin: { id: results[0].id, name: results[0].name, email: results[0].email },
    });
  });
});

// // 📌 **3. Fetch Waste Reports**
app.get("/reports", (req, res) => {
  db.query("SELECT * FROM waste_reports", [], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
});

// // 📌 **4. Delete a Waste Report**
app.delete("/reports/:id", (req, res) => {
  const { id } = req.params;

  // First, fetch the image path before deleting the record
  db.query("SELECT image_path FROM waste_reports WHERE id = ?", [id], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: "Report not found" });
    }

    const deleteQuery = "DELETE FROM waste_reports WHERE id = ?";
    db.query(deleteQuery, [id], function (err) {
      if (err) return res.status(500).json({ error: "Failed to delete report" });

      // Delete the image file if it exists
      if (row.image_path) {
        fs.unlink(`./uploads/${row.image_path}`, (err) => {
          if (err) console.error("Error deleting image:", err);
        });
      }

      res.json({ message: "Report deleted successfully" });
    });
  });
});

// 📌 **5. Admin Signup**
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  db.query("SELECT * FROM credentials WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length > 0) return res.status(400).json({ error: "Admin already exists" });
    db.query("INSERT INTO credentials (name, email, password) VALUES (?, ?, ?)", [name, email, password], (err) => {
      if (err) return res.status(500).json({ error: "Database error" });

      res.status(201).json({ message: "Admin registered successfully" });
    });
  });
});
//update progress
app.post("/api/update_progress", (req, res) => {
  const { fieldValue } = req.body; // Get updated value
  const sql = "UPDATE admin_progress SET progress = ? "; // Update specific row

  db.query(sql, [fieldValue], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Field updated successfully!" });
  });
});
//update processed
app.post("/api/update_processed", (req, res) => {
  const { fieldValue } = req.body; // Get updated value
  const sql = "UPDATE admin_processed SET processed = ? "; // Update specific row

  db.query(sql, [fieldValue], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Field updated successfully!" });
  });
});


// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// //fetch progress
app.get("/progress", (req, res) => {
  db.query("SELECT progress FROM admin_progress LIMIT 1", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({ progress: results.length > 0 ? results[0].progress : 2 }); // Default to 0 if no data
  });
});
// processed
app.get("/processed", (req, res) => {
  db.query("SELECT processed FROM admin_processed LIMIT 1", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({ processed: results.length > 0 ? results[0].processed : 2 }); // Default to 0 if no data
  });
});
//total count
app.get("/total", (req, res) => {
  db.query("SELECT COUNT(*) AS total_records FROM waste_reports", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ total_records: results[0].total_records }); // Extract the count properly
  });
});
//update_status
app.post("/update_status", (req, res) => {
  const { fieldValue } = req.body; // Get updated value
  const sql = "UPDATE waste_reports SET status = 'In progress' WHERE id = ?"; // Update specific row

  db.query(sql, [fieldValue], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows > 0) {
      res.json({ message: "Field updated successfully!" });
    } else {
      res.status(404).json({ message: "No record found with given ID" });
    }
  });
});
// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// //fetch rewards
app.get("/fetch_rewards", (req, res) => {
  db.query("SELECT rewards FROM admin_progress LIMIT 1", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ rewards: results.length > 0 ? results[0].rewards : 0 }); // Default to 0 if no data
  });
});
//update rewards
app.post("/api/update_rewards", (req, res) => {
  const { fieldValue } = req.body; // Get updated value
  const sql = "UPDATE admin_progress SET rewards = ? "; // Update specific row

  db.query(sql, [fieldValue], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Field updated successfully!" });
  });
});



app.listen(5000, () => {
  console.log("Server running on port 5000");
});