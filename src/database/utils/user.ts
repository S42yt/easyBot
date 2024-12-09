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
        console.log(`User data for ${user.username} saved successfully.`);
    } catch (error) {
        console.error('Failed to save user data', error);
        throw error;
    }
}

export { saveUserData };