import { Message } from 'revolt.js';
import Logger from '../../utils/logger';
import { EasyPermManager } from '../../types/easyPermissons';
import dotenv from 'dotenv';

dotenv.config();

const botMSGCommand = {
    name: 'botMSG',
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();

        const adminRoleId = process.env.ADMIN_ROLE;

        if (!adminRoleId) {
            throw new Error('ADMIN_ROLE is not defined in the environment.');
        }

        const member = message.member;
        const permissionManager = EasyPermManager.init();
        permissionManager.allowRole('botMSG', adminRoleId);

        if (!message.author || !member || !permissionManager.hasPermission('botMSG', message.author.id, member)) {
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

        if (args.length === 0) {
            const replyMessage = await message.reply('Usage: !botMSG <message>');

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

        const botMessage = args.join(' ');

        try {
            await message.channel?.sendMessage(botMessage);
            await message.delete(); // Instantly delete the user's command message
            await logger.log(`Bot sent message: ${botMessage} by ${message.author?.username}`, true);
        } catch (error: any) {
            await logger.error(`Failed to send bot message: ${error.message}`, error, true);

            const replyMessage = await message.reply('Failed to send message.');

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

export default botMSGCommand;