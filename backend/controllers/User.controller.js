import { userModel } from '../models/User.model.js'

export const registerUser = async (req, res) => {
    try {
        const { email, userName, name, passwordHash } = req.body;

        if (!email || !userName || !name || ! passwordHash) {
            return res.status(400).json({ error: "Missing required fields!" })
        }

        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return res.status(409).jason({ error: "User already exists!" })
        }

        const user = await userModel.create({ email, userName, name, passwordHash});

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
  
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials!" });
      }
  
      //! RETURNS USER WITHOUT PASSWORD HASH
      // password logic here? 

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
        const { userID } = req.params;
        const { count } = req.body;

        const result = await userModel.updateStreak(userId, count);
        res.json({ message: "Streak updated successfully: ", count });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}