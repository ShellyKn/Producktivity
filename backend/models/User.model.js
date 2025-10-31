import {getDatabase} from '../config/database.js';
import { toObjectId, isValidObjectId } from '../utils/objectId.js';
import bcrypt from 'bcrypt';

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

        return await collection.findOne({ _id: objectId });
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