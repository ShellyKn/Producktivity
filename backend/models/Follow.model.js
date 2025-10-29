import { getDatabase } from '../config/database.js';
import { toObjectId, isValidObjectId } from '../utils/objectId.js';

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
        const followerObjectId = toObjectId(followerId);
        const followeeObjectId = toObjectId(followeeId);

        if (!followerObjectId || !followeeObjectId) {
            throw new Error('Invalid user ID format');
        }

        const follow = {
            followerId,
            followeeId,
            createdAt: new Date()
        };
        
        // Check if already following
        const existing = await collection.findOne({ 
            followerId: followerObjectId,
            followeeId: followeeObjectId
        });

        if (existing) {
            return { message: 'Already following this user', follow: existing };
        }

        const result = await collection.insertOne(follow);
        return { ...follow, _id: result.insertedId };
    }

    // Unfollow a user
    async unfollow(followerId, followeeId) {
        const collection = await this.getCollection();
        const followerObjectId = toObjectId(followerId);
        const followeeObjectId = toObjectId(followeeId);

        if (!followerObjectId || !followeeObjectId) {
            throw new Error('Invalid user ID format');
        }

        const result = await collection.deleteOne({
             followerId: followerObjectId,
             followeeId: followeeObjectId
        });

        return result;
    }

    // Get followers of a user
    async getFollowers(userId) {
        const collection = await this.getCollection();
        const userObjectId = toObjectId(userId);

        if (!userObjectId) {
            throw new Error('Invalid user ID format');
        }

        return await collection.find({ followeeId: userObjectId }).toArray();
    }

    // Get users that a user is following
    async getFollowing(userId) {
        const collection = await this.getCollection();
        const userObjectId = toObjectId(userId);
        if (!userObjectId) {
            throw new Error('Invalid user ID format');
        }
        return await collection.find({ followerId: userObjectId }).toArray();
    }

    // Check if user A follows user B
    async isFollowing(followerId, followeeId) {
        const collection = await this.getCollection();
        const followerObjectId = toObjectId(followerId);
        const followeeObjectId = toObjectId(followeeId);

        if (!followerObjectId || !followeeObjectId) {
            throw new Error('Invalid user ID format');
        }

        const result = await collection.findOne({ 
            followerId: followerObjectId,
            followeeId: followeeObjectId
        });

        return !!result;
    }

    async getFollowerCount(userId) {
        const collection = await this.getCollection();
        const userObjectId = toObjectId(userId);

        if (!userObjectId) {
            throw new Error('Invalid user ID format');
        }

        return await collection.countDocuments({ followerId: userObjectId });
    }
}

export const followModel = new FollowModel();