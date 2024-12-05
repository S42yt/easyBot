import { Message } from 'revolt.js';
import Logger from '../../utils/logger';
import EmbedBuilder from '../../types/easyEmbed';
import ErrorEmbed from '../../types/easyErrorEmbed'; 
import CommandHandler from '../../handler/easyCmd'; 
import { EasyPermManager } from '../../types/easyPermissons';

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const teamHelpCommand = {
    name: 'teamHelp',
    reply: true,
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();

        const moderatorRoleId = process.env.MODERATOR_ROLE;
        const adminRoleId = process.env.ADMIN_ROLE;

        if (!moderatorRoleId || !adminRoleId) {
            throw new Error('MODERATOR_ROLE or ADMIN_ROLE is not defined in the environment.');
        }

        const member = message.member;
        const permissionManager = EasyPermManager.init();
        permissionManager.allowRole('teamHelp', moderatorRoleId);
        permissionManager.allowRole('teamHelp', adminRoleId);

        if (!message.author || !member || !permissionManager.hasPermission('teamHelp', message.author.id, member)) {
            const embed = new ErrorEmbed()
                .setTitle('Permission Denied')
                .setDescription('You don\'t have permission to use this command.')
                .setColour('#FF0000'); // Red color for error

            const replyMessage = await message.reply({ embeds: [embed.build()] });

            // Delete the error message and the user's message after 3 seconds
            setTimeout(async () => {
                try {
                    if (replyMessage) {
                        await replyMessage.delete();
                    }
                    if (message) {
                        await message.delete();
                    }
                } catch (error: any) {
                    await logger.error(`Error deleting messages: ${error.message}`, true);
                }
            }, 3000);

            return;
        }

        try {
            const commandFiles = fs.readdirSync(path.join(__dirname, '../adminCmd')).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
            const commandNames = commandFiles.map(file => file.replace(/\.(ts|js)$/, ''));

            const helpEmbed = new EmbedBuilder()
                .setTitle('Available Team Commands')
                .setDescription(commandNames.map(name => `- ${name}`).join('\n'))
                .setColour('#00FF00');

            const helpMessage = { embeds: [helpEmbed.build()] };

            await message.reply(helpMessage);
            await logger.log(`Executed 'teamHelp' command by ${message.author?.username}`, true);
        } catch (error: any) {
            await logger.error(`Failed to execute 'teamHelp' command: ${error.message}`, error, true);

            const errorEmbed = new ErrorEmbed()
                .setTitle('Error')
                .setDescription('Failed to retrieve commands.');

            await CommandHandler.prototype.sendResponse(message, '', errorEmbed, true); // Use sendResponse with isError set to true
        }
    }
};

export default teamHelpCommand;