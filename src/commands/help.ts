import { Message } from 'revolt.js';
import Logger from '../utils/logger';
import EmbedBuilder from '../types/easyEmbed';
import fs from 'fs';
import path from 'path';

const helpCommand = {
    name: 'help',
    reply: true,
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();

        try {
            const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
            const commandNames = commandFiles.map(file => file.replace(/\.(ts|js)$/, ''));

            const helpMessage = `Available Commands:\n${commandNames.map(name => `- ${name}`).join('\n')}`;

            await message.reply(helpMessage);
            await logger.log(`Executed 'help' command by ${message.author?.username}`, true);
        } catch (error: any) {
            await logger.error(`Failed to execute 'help' command: ${error.message}`, error, true);

            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('Failed to retrieve commands.')
                .setColour('#FF0000');

            await message.reply({ embeds: [errorEmbed.build()] });
        }
    }
};

export default helpCommand;