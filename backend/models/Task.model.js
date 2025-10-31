import { getDatabase } from '../config/database.js';
import { toObjectId, isValidObjectId } from '../utils/objectId.js';

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

      const ownerObjectId = toObjectId(taskData.ownerId);
      if (!ownerObjectId) {
        throw new Error("Invalid owner ID format");
      }

      const task = {
        ownerId: ownerObjectId,
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

      const ownerObjectId = toObjectId(ownerId);
      if (!ownerObjectId) {
        throw new Error('Invalid ownerId format');
      }

      const query = { ownerId: ownerObjectId };
      
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
      const objectId = toObjectId(taskId);
    
        if (!objectId) {
            throw new Error('Invalid task ID format');
        }

      return await collection.findOne({ _id: objectId });
    }
  
    // Update task
    async update(taskId, updateData) {
      const collection = await this.getCollection();
      const objectId = toObjectId(taskId);
    
      if (!objectId) {
        throw new Error('Invalid task ID format');
      }

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
        { _id: objectId },
        { $set: updateFields }
      );
      return result;
    }
  
    // Delete task
    async delete(taskId) {
      const collection = await this.getCollection();
      const objectId = toObjectId(taskId);

      if (!objectId) {
        throw new Error('Invalid task ID format');
      }

      const result = await collection.deleteOne({ _id: objectId });
      return result;
    }
  
    // Get task statistics for a user
    async getStats(ownerId) {
      const collection = await this.getCollection();

      const ownerObjectId = toObjectId(ownerId);
      if (!ownerObjectId) {
        throw new Error('Invalid owner ID format');
      }
      
      const pipeline = [
        { $match: { ownerId: ownerObjectId } },
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

    async updateChecklistItem(taskId, checklistIndex, checklistItem) {
      const collection = await this.getCollection();
      const objectId = toObjectId(taskId);
      if (!objectId) {
        throw new Error('Invalid task ID format');
      }

      const result = await collection.updateOne(
        { _id: objectId },
        {
            $set: {
                [`checklist.${checklistIndex}`]: checklistItem,
                updatedAt: new Date()
            }
        }
      );
      return result;
    }
  }

  export const taskModel = new TaskModel();