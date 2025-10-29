import { getDatabase } from './database.js';
import bcrypt from 'bcrypt';
// User Model Operations
export class UserModel {
  constructor() {
    this.collectionName = 'users';
  }

  async getCollection() {
    const db = await getDatabase();
    return db.collection(this.collectionName);
  }

  // Create a new user 
  // Added bcrypt to hash password for the frontend
  async create(userData) {
    const collection = await this.getCollection();
    
    // Hash the password before storing
    const passwordHash = await bcrypt.hash(userData.password, 10);
    
    const user = {
      email: userData.email,
      userName: userData.userName,
      name: userData.name,
      passwordHash: passwordHash,
      streak: { count: 0 },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  // Verify password during login
  async verifyPassword(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (isValid) {
      return user;
    }
    return null;
  }

  // Find user by email
  async findByEmail(email) {
    const collection = await this.getCollection();
    return await collection.findOne({ email });
  }

  // Find user by ID
  async findById(userId) {
    const collection = await this.getCollection();
    return await collection.findOne({ _id: userId });
  }

  // Update user
  async update(userId, updateData) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { _id: userId },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    );
    return result;
  }

  // Update user streak
  async updateStreak(userId, count) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { _id: userId },
      { 
        $set: { 
          'streak.count': count,
          updatedAt: new Date() 
        } 
      }
    );
    return result;
  }

  // Get all users (for admin purposes)
  async findAll() {
    const collection = await this.getCollection();
    return await collection.find({}).toArray();
  }
}

// Task Model Operations
export class TaskModel {
  constructor() {
    this.collectionName = 'tasks';
  }

  async getCollection() {
    const db = await getDatabase();
    return db.collection(this.collectionName);
  }

  // Create a new task
  async create(taskData) {
    const collection = await this.getCollection();
    const task = {
      ownerId: taskData.ownerId,
      title: taskData.title,
      status: taskData.status || 'pending',
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      priority: taskData.priority || 1,
      notes: taskData.notes || '',
      labels: taskData.labels || [],
      checklist: taskData.checklist || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null
    };
    
    const result = await collection.insertOne(task);
    return { ...task, _id: result.insertedId };
  }

  // Find tasks by owner
  async findByOwner(ownerId, options = {}) {
    const collection = await this.getCollection();
    const query = { ownerId };
    
    // Add optional filters
    if (options.status) query.status = options.status;
    if (options.priority) query.priority = options.priority;
    if (options.labels && options.labels.length > 0) {
      query.labels = { $in: options.labels };
    }

    const sort = options.sort || { createdAt: -1 };
    const limit = options.limit || 0;

    return await collection.find(query).sort(sort).limit(limit).toArray();
  }

  // Find task by ID
  async findById(taskId) {
    const collection = await this.getCollection();
    return await collection.findOne({ _id: taskId });
  }

  // Update task
  async update(taskId, updateData) {
    const collection = await this.getCollection();
    const updateFields = { 
      ...updateData, 
      updatedAt: new Date() 
    };

    // Set completedAt if status is being changed to completed
    if (updateData.status === 'completed') {
      updateFields.completedAt = new Date();
    } else if (updateData.status && updateData.status !== 'completed') {
      updateFields.completedAt = null;
    }

    const result = await collection.updateOne(
      { _id: taskId },
      { $set: updateFields }
    );
    return result;
  }

  // Delete task
  async delete(taskId) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: taskId });
    return result;
  }

  // Get task statistics for a user
  async getStats(ownerId) {
    const collection = await this.getCollection();
    
    const pipeline = [
      { $match: { ownerId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ];

    const stats = await collection.aggregate(pipeline).toArray();
    return stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});
  }
}

// Follow Model Operations (for friends/following)
export class FollowModel {
  constructor() {
    this.collectionName = 'follows';
  }

  async getCollection() {
    const db = await getDatabase();
    return db.collection(this.collectionName);
  }

  // Follow a user
  async follow(followerId, followeeId) {
    const collection = await this.getCollection();
    const follow = {
      followerId,
      followeeId,
      createdAt: new Date()
    };
    
    // Check if already following
    const existing = await collection.findOne({ followerId, followeeId });
    if (existing) {
      return { message: 'Already following this user' };
    }

    const result = await collection.insertOne(follow);
    return { ...follow, _id: result.insertedId };
  }

  // Unfollow a user
  async unfollow(followerId, followeeId) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ followerId, followeeId });
    return result;
  }

  // Get followers of a user
  async getFollowers(userId) {
    const collection = await this.getCollection();
    return await collection.find({ followeeId: userId }).toArray();
  }

  // Get users that a user is following
  async getFollowing(userId) {
    const collection = await this.getCollection();
    return await collection.find({ followerId: userId }).toArray();
  }

  // Check if user A follows user B
  async isFollowing(followerId, followeeId) {
    const collection = await this.getCollection();
    const result = await collection.findOne({ followerId, followeeId });
    return !!result;
  }
}

// Export instances
export const userModel = new UserModel();
export const taskModel = new TaskModel();
export const followModel = new FollowModel();
