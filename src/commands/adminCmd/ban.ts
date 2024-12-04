import { Message } from 'revolt.js';
import Logger from '../../utils/logger';
import EmbedBuilder from '../../types/easyEmbed';
import ErrorEmbed from '../../types/easyErrorEmbed';
import { EasyPermManager } from '../../types/easyPermissons';
import { EasyMember } from '../../types/easyMember';
import dotenv from 'dotenv';

dotenv.config();

const banCommand = {
    name: 'ban',
    reply: true,
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();

        const moderatorRoleId = process.env.MODERATOR_ROLE;
        const adminRoleId = process.env.ADMIN_ROLE;

        if (!moderatorRoleId || !adminRoleId) {
            throw new Error('MODERATOR_ROLE or ADMIN_ROLE is not defined in the environment.');
        }

        const member = message.member as EasyMember;
        const permissionManager = EasyPermManager.init();
        permissionManager.allowRole('ban', moderatorRoleId);
        permissionManager.allowRole('ban', adminRoleId);

        if (!message.author || !member || !permissionManager.hasPermission('ban', message.author.id, member)) {
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

        if (args.length !== 1) {
            const embed = new ErrorEmbed()
                .setTitle('Invalid Command')
                .setDescription('Usage: !ban <username>')
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

        const username = args[0];

        if (!message.server || !message.server.member) {
            const embed = new ErrorEmbed()
                .setTitle('Server Error')
                .setDescription('Unable to fetch server member.')
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

        const user = await message.server?.getMember(username);

        if (!user) {
            const embed = new ErrorEmbed()
                .setTitle('User Not Found')
                .setDescription(`User ${username} not found.`)
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
            await user.ban({ reason: `Banned by ${message.author?.username}` });
            const embed = new EmbedBuilder()
                .setTitle('User Banned')
                .setDescription(`User ${username} has been banned.`)
                .setColour('#00FF00'); // Green color for success

            await message.reply({ embeds: [embed.build()] });
            await logger.log(`User ${username} banned by ${message.author?.username}`, true);
        } catch (error: any) {
            await logger.error(`Failed to ban user: ${error.message}`, error, true);

            const errorEmbed = new ErrorEmbed()
                .setTitle('Error')
                .setDescription('Failed to ban user.')
                .setColour('#FF0000'); // Red color for error

            const replyMessage = await message.reply({ embeds: [errorEmbed.build()] });

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

export default banCommand;