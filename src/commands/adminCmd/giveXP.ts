import { Message } from 'revolt.js';
import Logger from '../../utils/logger';
import { addExperience, getUserLevel } from '../../database/utils/levelSystem';
import EmbedBuilder from '../../types/easyEmbed';
import ErrorEmbed from '../../types/easyErrorEmbed';
import { EasyPermManager } from '../../types/easyPermissons';
import dotenv from 'dotenv';

dotenv.config();

const giveXPCommand = {
    name: 'giveXP',
    reply: true,
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();

        const adminRoleId = process.env.ADMIN_ROLE;

        if (!adminRoleId) {
            throw new Error('ADMIN_ROLE is not defined in the environment.');
        }

        const member = message.member;
        const permissionManager = EasyPermManager.init();
        permissionManager.allowRole('giveXP', adminRoleId);

        if (!message.author || !member || !permissionManager.hasPermission('giveXP', message.author.id, member)) {
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

        if (args.length !== 2) {
            const embed = new ErrorEmbed()
                .setTitle('Invalid Command')
                .setDescription('Usage: !giveXP <user> <amount>')
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

        const userId = args[0].replace(/[<@!>]/g, ''); // Extract user ID from mention
        const amount = parseInt(args[1]);

        if (isNaN(amount) || amount <= 0) {
            const embed = new ErrorEmbed()
                .setTitle('Invalid Amount')
                .setDescription('The amount of XP must be a positive number.')
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
            await addExperience(userId, amount);
            const user = await getUserLevel(userId);

            const embed = new EmbedBuilder()
                .setTitle('XP Given')
                .setDescription(`Successfully given ${amount} XP to <@${userId}>.\n**New Level:** ${user?.level}\n**Current XP:** ${user?.experience}`)
                .setColour('#00FF00'); // Green color for success

            await message.reply({ embeds: [embed.build()] });
            await logger.log(`Executed 'giveXP' command by ${message.author?.username}`, true);
        } catch (error: any) {
            await logger.error(`Failed to execute 'giveXP' command: ${error.message}`, error, true);

            const errorEmbed = new ErrorEmbed()
                .setTitle('Error')
                .setDescription('Failed to give XP.')
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

export default giveXPCommand;