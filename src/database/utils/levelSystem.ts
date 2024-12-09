import { connectToDatabase } from '../mongodb';
import { ServerMember } from 'revolt.js';
import User from '../models/user';
import dotenv from 'dotenv';
import Logger from '../../utils/logger';

dotenv.config();
const logger = new Logger();

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
            username: '', 
            discriminator: '', 
            avatar: '', 
            createdAt: new Date(),
            experience,
            level: calculateLevel(experience)
        };
        await collection.insertOne(newUser);
    } else {
        const newExperience = user.experience + experience;
        const newLevel = calculateLevel(newExperience);
        await collection.updateOne({ userId }, { $set: { experience: newExperience, level: newLevel } });

        if (newLevel % 20 === 0 && newLevel <= 100) {
            const roleEnvVar = `LEVEL_${newLevel}_ROLE`;
            const roleId = process.env[roleEnvVar];
            if (roleId) {
                await assignRole(userId, roleId);
                logger.info(`Assigned role ${roleId} to user ${userId} for reaching level ${newLevel}`, true);
            }
        }
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

    while (experience >= requiredExperience && level < 100) {
        experience -= requiredExperience;
        level++;
        requiredExperience = Math.min(100, requiredExperience + 10);
    }

    return level;
}

async function assignRole(userId: string, roleId: string) {
}