import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase, closeDatabase } from "./database/database.js";
import { userModel, taskModel, followModel } from "./database/models.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

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

// Health check route that also checks database connection
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

// ==================== USER ROUTES ====================

// Register a new user (now accepts plain password)
app.post("/api/users/register", async (req, res) => {
  try {
    const { email, userName, name, password } = req.body;
    
    if (!email || !userName || !name || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const user = await userModel.create({
      email,
      userName,
      name,
      password 
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        email: user.email,
        userName: user.userName,
        name: user.name,
        streak: user.streak,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user (with email and password authentication)
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await userModel.verifyPassword(email, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        userName: user.userName,
        name: user.name,
        streak: user.streak,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
app.get("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      _id: user._id,
      email: user.email,
      userName: user.userName,
      name: user.name,
      streak: user.streak,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user streak
app.patch("/api/users/:userId/streak", async (req, res) => {
  try {
    const { userId } = req.params;
    const { count } = req.body;
    
    if (typeof count !== 'number') {
      return res.status(400).json({ error: "Count must be a number" });
    }

    const result = await userModel.updateStreak(userId, count);
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Streak updated successfully", count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== TASK ROUTES ====================

// Create a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const taskData = req.body;
    
    if (!taskData.ownerId || !taskData.title) {
      return res.status(400).json({ error: "ownerId and title are required" });
    }

    const task = await taskModel.create(taskData);
    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tasks for a user
app.get("/api/tasks/user/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { status, priority, labels, sort, limit } = req.query;
    
    const options = {};
    if (status) options.status = status;
    if (priority) options.priority = parseInt(priority);
    if (labels) options.labels = labels.split(',');
    if (sort) options.sort = JSON.parse(sort);
    if (limit) options.limit = parseInt(limit);

    const tasks = await taskModel.findByOwner(ownerId, options);
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific task
app.get("/api/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await taskModel.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a task
app.patch("/api/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;
    
    const result = await taskModel.update(taskId, updateData);
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a task
app.delete("/api/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await taskModel.delete(taskId);
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get task statistics for a user
app.get("/api/tasks/user/:ownerId/stats", async (req, res) => {
  try {
    const { ownerId } = req.params;
    const stats = await taskModel.getStats(ownerId);
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Follow a user
app.post("/api/follow", async (req, res) => {
  try {
    const { followerId, followeeId } = req.body;
    
    if (!followerId || !followeeId) {
      return res.status(400).json({ error: "followerId and followeeId are required" });
    }

    if (followerId === followeeId) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    const result = await followModel.follow(followerId, followeeId);
    res.json({ message: "Successfully followed user", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unfollow a user
app.delete("/api/follow", async (req, res) => {
  try {
    const { followerId, followeeId } = req.body;
    
    if (!followerId || !followeeId) {
      return res.status(400).json({ error: "followerId and followeeId are required" });
    }

    const result = await followModel.unfollow(followerId, followeeId);
    res.json({ message: "Successfully unfollowed user" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get followers of a user
app.get("/api/users/:userId/followers", async (req, res) => {
  try {
    const { userId } = req.params;
    const followers = await followModel.getFollowers(userId);
    res.json({ followers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get users that a user is following
app.get("/api/users/:userId/following", async (req, res) => {
  try {
    const { userId } = req.params;
    const following = await followModel.getFollowing(userId);
    res.json({ following });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await closeDatabase();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await closeDatabase();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;