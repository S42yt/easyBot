import { connectToDatabase } from '../mongodb';
import User from '../models/user';

async function connectToCollection() {
    const db = await connectToDatabase();
    return db.collection<User>('users');
}

export async function addExperience(userId: string, experience: number) {
    const collection = await connectToCollection();
    const user = await collection.findOne({ userId });

    if (!user) {
        const newUser: User = {
            userId,
            username: '', // You should set this value appropriately
            discriminator: '', // You should set this value appropriately
            avatar: '', // You should set this value appropriately
            createdAt: new Date(),
            experience,
            level: calculateLevel(experience)
        };
        await collection.insertOne(newUser);
    } else {
        const newExperience = user.experience + experience;
        const newLevel = calculateLevel(newExperience);
        await collection.updateOne({ userId }, { $set: { experience: newExperience, level: newLevel } });
    }
}

export async function getUserLevel(userId: string): Promise<User | null> {
    const collection = await connectToCollection();
    return collection.findOne({ userId });
}

export async function getTopUsers(page: number, pageSize: number = 10): Promise<User[]> {
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