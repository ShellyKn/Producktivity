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
            followerId: followerObjectId,
            followeeId: followeeObjectId,
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

    // Following IDs for a user
    async getFollowingIds(userId) {
        const docs = await this.getFollowing(userId);
        return docs.map(d => d.followeeId);
    }

    // Following user documents
    async getFollowingUsers(userId) {
        const db = await getDatabase();
        const ids = await this.getFollowingIds(userId);
        if (!ids.length) return [];
        return await db.collection('users')
        .find({ _id: { $in: ids } })
        .project({ _id: 1, email: 1, name: 1, userName: 1 })
        .toArray();
    }

    // Friends leaderboard (points = completed tasks in last 7 days)
    async getFriendsLeaderboard(userId, days = 7) {
        const db = await getDatabase();
        const ids = await this.getFollowingIds(userId);
        if (!ids.length) return [];

        const since = new Date();
        since.setDate(since.getDate() - days);

        const agg = await db.collection('tasks').aggregate([
        { $match: {
            ownerId: { $in: ids },
            status: 'completed',
            completedAt: { $gte: since }
        }},
        { $group: { _id: '$ownerId', points: { $sum: 1 } } },
        { $sort: { points: -1 } },
        { $limit: 10 }
        ]).toArray();

        if (!agg.length) return [];

        const byId = new Map(agg.map(a => [String(a._id), a.points]));
        const users = await db.collection('users')
        .find({ _id: { $in: agg.map(a => a._id) } })
        .project({ _id: 1, userName: 1, name: 1, email: 1 })
        .toArray();

        const enriched = users
        .map(u => ({
            userId: String(u._id),
            username: u.userName || u.name || u.email,
            points: byId.get(String(u._id)) || 0
        }))
        .sort((a, b) => b.points - a.points)
        .map((u, i) => ({ ...u, rank: i + 1 }));

        return enriched;
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
