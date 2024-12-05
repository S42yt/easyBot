import { Message } from 'revolt.js';
import Logger from '../../utils/logger';
import fs from 'fs';
import path from 'path';
import CommandHandler from '../../handler/easyCmd'; // Import the CommandHandler to use sendResponse
import ErrorEmbed from '../../types/easyErrorEmbed';

const helpCommand = {
    name: 'help',
    reply: true,
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();

        try {
            const commandFiles = fs.readdirSync(path.join(__dirname, '../userCmd')).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
            const commandNames = commandFiles.map(file => file.replace(/\.(ts|js)$/, ''));

            const helpMessage = `Available Commands:\n${commandNames.map(name => `- ${name}`).join('\n')}`;

            await message.reply(helpMessage);
            await logger.log(`Executed 'help' command by ${message.author?.username}`, true);
        } catch (error: any) {
            await logger.error(`Failed to execute 'help' command: ${error.message}`, error, true);

            const errorEmbed = new ErrorEmbed()
                .setTitle('Error')
                .setDescription('Failed to retrieve commands.');

            await CommandHandler.prototype.sendResponse(message, '', errorEmbed, true); // Use sendResponse with isError set to true
        }
    }
};

export default helpCommand;