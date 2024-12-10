import User from '../models/user';
import { connectToDatabase } from '../mongodb';

async function saveUserData(user: User) {
    const db = await connectToDatabase();
    const collection = db.collection<User>('users');

    try {
        await collection.updateOne(
            { userId: user.userId },
            {
                $set: {
                    username: user.username,
                    discriminator: user.discriminator,
                    avatar: user.avatar,
                    createdAt: user.createdAt,
                    experience: user.experience,
                    level: user.level
                }
            },
            { upsert: true }
        );
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

async function getAllUserData() {
    const db = await connectToDatabase();
    const collection = db.collection<User>('users');

    try {
        const allUserData = await collection.find({}).toArray();
        return allUserData;
    } catch (error) {
        console.error('Error fetching all user data:', error);
        throw error;
    }
}

async function getUserData({ userId, username, discriminator }: { userId?: string; username?: string; discriminator?: string }) {
    const db = await connectToDatabase();
    const collection = db.collection<User>('users');

    try {
        let query = {};
        if (userId) {
            query = { userId };
        } else if (username && discriminator) {
            query = { username, discriminator };
        } else {
            throw new Error('Either userId or both username and discriminator must be provided.');
        }

        const userData = await collection.findOne(query);
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

async function deleteUserData(userId: string) {
    const db = await connectToDatabase();
    const collection = db.collection<User>('users');

    try {
        await collection.deleteOne({ userId });
    } catch (error) {
        console.error('Error deleting user data:', error);
        throw error;
    }
}

export { saveUserData, getAllUserData, getUserData, deleteUserData };