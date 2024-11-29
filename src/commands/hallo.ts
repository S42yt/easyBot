import { Message } from 'revolt.js';
import Logger from '../utils/logger';

const halloCommand = {
    name: 'hallo',
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();

        try {
            await message.channel?.sendMessage('Hallo und Herzlich Wilkommen.');
            await logger.log(`Executed 'hallo' command by ${message.author?.username}`, true);
        } catch (error: any) {
            await logger.error(`Failed to execute 'hallo' command: ${error.message}`, error, true);
        }
    }
};

export default halloCommand;