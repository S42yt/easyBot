import { Message } from 'revolt.js';
import Logger from '../../utils/logger';
import EmbedBuilder from '../../types/easyEmbed';
import ErrorEmbed from '../../types/easyErrorEmbed';
import { EasyPermManager } from '../../types/easyPermissons';
import dotenv from 'dotenv';

dotenv.config();

const botEmbedCommand = {
    name: 'botEmbed',
    reply: true,
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();

        const adminRoleId = process.env.ADMIN_ROLE;

        if (!adminRoleId) {
            throw new Error('ADMIN_ROLE is not defined in the environment.');
        }

        const member = message.member;
        const permissionManager = EasyPermManager.init();
        permissionManager.allowRole('botEmbed', adminRoleId);

        if (!message.author || !member || !permissionManager.hasPermission('botEmbed', message.author.id, member)) {
            const replyMessage = await message.reply('You don\'t have permission to use this command.');

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

        const input = args.join(' ');
        const matches = input.match(/<([^>]+)>/g);

        if (!matches || matches.length < 2) {
            const replyMessage = await message.reply('Usage: !botEmbed <title> <description>');

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

        const title = matches[0].slice(1, -1);
        const description = matches[1].slice(1, -1);
        const footerText = 'EasyBot';
        const footerIcon = 'URL_TO_BOT_ICON'; // Replace with the actual URL to the bot's icon

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setFooter(footerText, footerIcon)
            .setColour('#800080'); // Purple color for the embed

        try {
            await message.channel?.sendMessage({ embeds: [embed.build()] });
            await message.delete(); // Instantly delete the user's command message
            await logger.log(`Bot sent embed with title: ${title}, description: ${description}, footer: ${footerText} by ${message.author?.username}`, true);
        } catch (error: any) {
            await logger.error(`Failed to send bot embed: ${error.message}`, error, true);

            const replyMessage = await message.reply('Failed to send embed.');

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
        }
    }
};

export default botEmbedCommand;