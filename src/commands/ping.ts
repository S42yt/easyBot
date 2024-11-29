import { Message } from 'revolt.js';
import Logger from '../utils/logger';

const pingCommand = {
    name: 'ping',
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();

        try {
            await message.channel?.sendMessage('Pong! This is a normal text response.');
            await logger.log(`Executed 'ping' command by ${message.author?.username}`, true);
        } catch (error: any) {
            await logger.error(`Failed to execute 'ping' command: ${error.message}`, error, true);
        }
    }
};

export default pingCommand;