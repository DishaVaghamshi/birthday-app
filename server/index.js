import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Enhanced logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve static files from the React app
const clientBuildPath = path.join(__dirname, "..", "client", "build");

// Check if build directory exists
if (!fs.existsSync(clientBuildPath)) {
  console.error(`❌ Client build directory not found: ${clientBuildPath}`);
} else {
  console.log(`✅ Client build directory found: ${clientBuildPath}`);
}

app.use(express.static(clientBuildPath));

// API routes
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Birthday app server is running!",
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Serve React app for all other routes
app.get("*", (req, res) => {
  const indexPath = path.join(clientBuildPath, "index.html");
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ 
      error: "Frontend not found", 
      message: "The React app build files are missing. Please ensure the client has been built." 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🎂 Birthday app server running on port ${PORT}`);
  console.log(`🚀 Frontend served from: ${clientBuildPath}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
});
