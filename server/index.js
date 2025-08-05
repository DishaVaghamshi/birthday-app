import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
const clientBuildPath = path.join(__dirname, "..", "client", "build");
app.use(express.static(clientBuildPath));

// API routes (if any)
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Birthday app server is running!" });
});

// Serve React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`🎂 Birthday app server running on http://localhost:${PORT}`);
  console.log(`🚀 Frontend served from: ${clientBuildPath}`);
});
