import { Message } from 'revolt.js';
import Logger from '../../utils/logger';
import EmbedBuilder from '../../types/easyEmbed';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { EasyPermManager } from '../../types/easyPermissons';

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

            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('Failed to retrieve commands.')
                .setColour('#FF0000');

            await message.reply({ embeds: [errorEmbed.build()] });
        }
    }
};

export default teamHelpCommand;