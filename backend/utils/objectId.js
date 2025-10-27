import { ObjectId } from 'mongodb';

// Converts string to MongoDB ObjectId
// else return null if not valid 
export function toObjectId(id) {
    if (!id) return null;
    // If id is already an ObjectId, return it
    if (id instanceof ObjectId) return id;
    if (typeof id === 'string' && ObjectId.isValid(id)) {
        return new ObjectId(id);
    }

    return null;
}

// Checks if string is valid ObjectId
export function isValidObjectId(id) {
    if (!id) return false;
    if (id instanceof ObjectId) return true;
    return ObjectId.isValid(id);
}

// Converts array of strings to array of ObjectIds
// (skips invalid ones)
export function toObjectIds(ids) {
    if (!Array.isArray(ids)) return [];
    return ids.map(toObjectId).filter(id => id !== null);
  }