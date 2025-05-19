require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const sequelize = require("./config/dbConfig");
const calendarRoute = require("./src/routes/calendarRoute");
const jobRoute = require("./src/routes/jobRoute");
const path = require("path");
const fs = require("fs");

const app = express();

// Middleware cơ bản
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

// CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/api/v1/calendar", calendarRoute);
app.use("/api/v1/jobs", jobRoute);

// Serve static frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.resolve(__dirname, "../frontend/dist");

  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));

    // Serve index.html for any unmatched route
    app.get("/*", (req, res) => {
      const indexPath = path.join(frontendPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        console.error(`index.html not found at: ${indexPath}`);
        res.status(404).send("Frontend not found");
      }
    });
  } else {
    app.get("/*", (req, res) => {
      res.status(404).send("Frontend not found");
    });
  }
} else {
  // Development: fallback for unmatched API routes
  app.get("/*", (req, res) => {
    res.status(404).json({ message: "API route not found" });
  });
}

// Connect to database
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
