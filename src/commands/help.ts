import { Message } from 'revolt.js';
import Logger from '../utils/logger';

const helpCommand = {
    name: 'help',
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();

        try {
            await message.channel?.sendMessage('Help Command: This is a normal text response.');
            await logger.log(`Executed 'help' command by ${message.author?.username}`, true);
        } catch (error: any) {
            await logger.error(`Failed to execute 'help' command: ${error.message}`, error, true);
        }
    }
};

export default helpCommand;