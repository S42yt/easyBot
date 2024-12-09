import { Client, Message } from 'revolt.js';
import { addExperience } from '../database/utils/levelSystem';
import Logger from '../utils/logger';

const logger = new Logger();
const client = new Client();

client.on('messageCreate', async (message: Message) => {
    if (message.author?.bot) return; // Ignore bot messages

    const userId = message.author?.id;
    if (!userId) {
        logger.error('User ID not found for the message author.');
        return;
    }

    try {
        await addExperience(userId, 5); // Add 5 XP to the user
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