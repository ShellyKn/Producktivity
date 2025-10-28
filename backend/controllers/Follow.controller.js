import { followModel } from '../models/Follow.model.js';

export const followUser = async (req, res) => {
  try {
    const { followerId, followeeId } = req.body;
    
    if (!followerId || !followeeId) {
      return res.status(400).json({ error: "followerId and followeeId are required!" });
    }

    if (followerId === followeeId) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    const result = await followModel.follow(followerId, followeeId);
    res.json({ message: "Successfully followed user: ", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { followerId, followeeId } = req.body;
    
    if (!followerId || !followeeId) {
      return res.status(400).json({ error: "followerId and followeeId are required!" });
    }

    const result = await followModel.unfollow(followerId, followeeId);
    res.json({ message: "Successfully unfollowed user: ", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const followers = await followModel.getFollowers(userId);
    res.json({ followers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const following = await followModel.getFollowing(userId);
    res.json({ following });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};