import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase, closeDatabase } from './config/database.js';

// Routes
import userRoutes from './routes/User.routes.js';
import taskRoutes from './routes/Task.routes.js';
import followRoutes from './routes/Follow.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB when the server starts
let db;
try {
  const { db: database } = await connectToDatabase();
  db = database;
  console.log("Database connection established");
} catch (error) {
  console.error("Failed to connect to database:", error);
  process.exit(1);
}

// Health check
app.get("/api/health", async (req, res) => {
    try {
      await db.admin().ping();
      res.json({ 
        status: "healthy", 
        database: "connected",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ 
        status: "unhealthy", 
        database: "disconnected",
        error: error.message 
      });
    }
});

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", followRoutes); //! follow routes SHOULD alr include their own paths

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await closeDatabase();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await closeDatabase();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

export default app;