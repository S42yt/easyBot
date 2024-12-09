import { connectToDatabase } from '../mongodb';
import User from '../models/user';

async function saveUserData(user: User) {
    const db = await connectToDatabase();
    const collection = db.collection<User>('users');

    try {
        await collection.updateOne(
            { userId: user.userId },
            { $set: user },
            { upsert: true }
        );
        console.log(`User data for ${user.username} saved successfully.`);
    } catch (error) {
        console.error('Failed to save user data', error);
        throw error;
    }
}

export { saveUserData };