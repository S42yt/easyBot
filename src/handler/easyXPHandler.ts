import { Client, Message } from 'revolt.js';
import { connectToDatabase } from '../database/mongodb';
import User from '../database/models/user';
import Logger from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const logger = new Logger();
const client = new Client();

async function connectToCollection() {
    const db = await connectToDatabase();
    return db.collection<User>('users');
}

async function addExperience(userId: string, experience: number) {
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
        logger.info(`Created new user with ID ${userId} and added ${experience} XP.`);
    } else {
        const newExperience = (user.experience || 0) + experience; // Ensure experience is always a number
        const newLevel = calculateLevel(newExperience);
        
        const updateResult = await collection.updateOne(
            { userId },
            { 
                $set: { 
                    experience: newExperience, 
                    level: newLevel 
                } 
            }
        );

        if (updateResult.matchedCount === 0) {
            logger.error(`Failed to update user with ID ${userId}: user not found.`);
            return;
        }
        
        logger.info(`Updated user with ID ${userId}: added ${experience} XP, new level is ${newLevel}.`);

        if (newLevel % 20 === 0 && newLevel <= 100) {
            const roleEnvVar = `LEVEL_${newLevel}_ROLE`;
            const roleId = process.env[roleEnvVar];
            if (roleId) {
                await assignRole(userId, roleId);
                logger.info(`Assigned role ${roleId} to user ${userId} for reaching level ${newLevel}`);
            }
        }
    }
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
    // Implement role assignment logic here
}

client.on('messageCreate', async (message: Message) => {
    if (message.author?.bot) return; // Ignore bot messages

    const userId = message.author?.id;
    if (!userId) {
        logger.error('User ID not found for the message author.');
        return;
    }

    try {
        await addExperience(userId, 5); // Add 5 XP for each message
        logger.info(`Added 5 XP to user ${message.author?.username}`, true);
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Failed to add XP to user ${message.author?.username}: ${error.message}`, error, true);
        } else {
            logger.error(`Failed to add XP to user ${message.author?.username}: ${String(error)}`, error, true);
        }
    }
});

export default client;