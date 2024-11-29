import { Message } from 'revolt.js';
import Logger from '../utils/logger';
import { createEmbed, EmbedOptions } from '../types/embedType';

const pingCommand = {
    name: 'ping',
    execute: async (message: Message, args: string[], sendResponse: Function) => {
        const logger = new Logger();

        try {
            const useEmbed = args.includes('--embed');
            if (useEmbed) {
                const embedOptions: EmbedOptions = {
                    title: 'Pong!',
                    description: 'This is a response in an embed.',
                    color: '#00FF00'
                };
                await sendResponse(message, embedOptions, true);
            } else {
                await sendResponse(message, 'Pong! This is a normal text response.');
            }
            await logger.log(`Executed 'ping' command by ${message.author?.username}`, true);
        } catch (error: any) {
            await logger.error(`Failed to execute 'ping' command: ${error.message}`, error, true);
        }
    }
};

export default pingCommand;