import {getDatabase} from '../config/database.js';
import { toObjectId, isValidObjectId } from '../utils/objectId.js';

// User Model Operations
export class UserModel {
    constructor() {
        this.collectionName = 'users';
    }

    async getCollection() {
        const db = await getDatabase();
        return db.collection(this.collectionName)
    }

    async create(userData) {
        const collection = await this.getCollection();

        const user = {
            email: userData.email, 
            userName: userData.userName,
            name: userData.name,
            passwordHash: userData.passwordHash,
            streak: { count: 0 },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(user);
        return { ...user, _id: result.insertedId };
    }

    // Find user by email
    async findByEmail(email) {
        const collection = await this.getCollection();
        return await collection.findOne({ email });
    }

    // Find user by ID
    // async findById(userId) {
    //     const collection = await this.getCollection();
    //     return await collection.findOne({ _id: userId });
    // }

    async findById(userId) {
        const collection = await this.getCollection();
        const objectId = toObjectId(userId);

        if (!objectId) {
            throw new Error("Invalid user ID format");
        }

        return await collection.findOne({ _id: userId });
    }

    // Find user by UserName
    async findByUserName(userName) {
        const collection = await this.getCollection();
        return await collection.findOne({ userName });
    }

    // Update user
    async update(userId, updateData) {
        const collection = await this.getCollection();
        const objectId = toObjectId(userId);

        if (!objectId) {
            throw new Error("Invalid user ID format")
        }

        const result = await collection.updateOne(
            { _id: objectId },
            { 
                $set: { 
                    ...updateData, 
                    updatedAt: new Date() 
                } 
            }
        );
        return result;
    }

    async updateStreak(userId, count) {
        const collection = await this.getCollection();
        const objectId = toObjectId(userId);

        if (!objectId) {
            throw new Error("Invalid user ID format")
        }

        const result = await collection.updateOne(
            { _id: objectId },
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

    async delete(userId) {
        const collection = await this.getCollection();
        const objectId = toObjectId(userId);

        if (!objectId) {
            throw new Error("Invalid user ID format")
        }

        const result = await collection.deleteOne({ _id: objectId });
        return result;
    }
}

export const userModel = new UserModel();