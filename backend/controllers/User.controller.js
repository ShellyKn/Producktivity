import { userModel } from '../models/User.model.js'
import { getDatabase } from '../config/database.js';
import { toObjectId } from '../utils/objectId.js';
export const registerUser = async (req, res) => {
    try {
        const { email, userName, name, password } = req.body;

        if (!email || !userName || !name || !password) {
            return res.status(400).json({ error: "Missing required fields!" })
        }

        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: "User already exists!" })
        }

        const user = await userModel.create({ email, userName, name, password});

        res.status(201).json({
            message: "User created successfully!",
            user: { 
                _id: user._id, 
                email: user.email, 
                userName: user.userName,
                name: user.name, 
                streak: user.streak, 
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
};

export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required!" });
      }
  
      const user = await userModel.verifyPassword(email, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password!" });
      }

      res.json({
        message: "Login successful",
        user: {
          _id: user._id,
          email: user.email,
          userName: user.userName,
          name: user.name,
          streak: user.streak
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

export const getUserProfile = async (req, res) => {
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
        createdAt: user.createdAt
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

export const updateUserStreak = async (req, res) => {
  try {
    const { userId } = req.params;
    const { current, best } = req.body;

    if (typeof current !== "number" || typeof best !== "number") {
      return res.status(400).json({ error: "Current and best must be numbers" });
    }

    await userModel.updateStreak(userId, { current, best });
    res.json({ message: "Streak updated successfully", streak: { current, best } });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Searching users in the database
export const searchUsers = async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    const excludeSelf = String(req.query.excludeSelf || '').trim();

    if (!q) return res.json({ users: [] });

    const db = await getDatabase();
    const usersCol = db.collection('users');

    const filter = {
      $and: [
        excludeSelf && toObjectId(excludeSelf)
          ? { _id: { $ne: toObjectId(excludeSelf) } }
          : {},
        {
          $or: [
            { email: { $regex: q, $options: 'i' } },
            { name: { $regex: q, $options: 'i' } },
            { userName: { $regex: q, $options: 'i' } },
          ],
        },
      ],
    };

    const users = await usersCol
      .find(filter)
      .project({ _id: 1, email: 1, name: 1, userName: 1 })
      .limit(10)
      .toArray();

    res.json({ users });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
