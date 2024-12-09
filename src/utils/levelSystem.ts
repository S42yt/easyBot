import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('MONGODB_URI is not defined');
}
const client = new MongoClient(uri);
const dbName = 'easyBotDB';
const collectionName = 'userLevels';

interface UserLevel {
    userId: string;
    experience: number;
    level: number;
}

async function connectToCollection() {
    await client.connect();
    const db = client.db(dbName);
    return db.collection<UserLevel>(collectionName);
}

export async function addExperience(userId: string, experience: number) {
    const collection = await connectToCollection();
    const user = await collection.findOne({ userId });

    if (!user) {
        await collection.insertOne({ userId, experience, level: 1 });
    } else {
        const newExperience = user.experience + experience;
        const newLevel = calculateLevel(newExperience);
        await collection.updateOne({ userId }, { $set: { experience: newExperience, level: newLevel } });
    }
}

export async function getUserLevel(userId: string): Promise<UserLevel | null> {
    const collection = await connectToCollection();
    return collection.findOne({ userId });
}

export async function getTopUsers(page: number, pageSize: number = 10): Promise<UserLevel[]> {
    const collection = await connectToCollection();
    return collection.find().sort({ experience: -1 }).skip((page - 1) * pageSize).limit(pageSize).toArray();
}

function calculateLevel(experience: number): number {
    let level = 1;
    let requiredExperience = 20;

    while (experience >= requiredExperience) {
        experience -= requiredExperience;
        level++;
        requiredExperience = Math.min(100, requiredExperience + 10);
    }

    return level;
}

export default connectToCollection;