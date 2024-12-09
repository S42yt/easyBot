import { Client, Message, ServerMember } from 'revolt.js';
import { addExperience } from '../database/utils/levelSystem';
import Logger from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const logger = new Logger();
const client = new Client();
const voiceChannelTimers = new Map<string, NodeJS.Timeout>();

// Handle awarding XP for messages
client.on('messageCreate', async (message: Message) => {
    if (!message.author || message.author.bot) return; // Ignore bot messages

    const xp = 10; // XP awarded for sending a message
    try {
        await addExperience(message.author.id, xp);
        logger.info(`Awarded ${xp} XP to ${message.author.username} for sending a message`, true);
    } catch (error: any) {
        logger.error(`Failed to award XP: ${error.message}`, error, true);
    }
});

export default client;
