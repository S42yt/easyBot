import { Message } from 'revolt.js';
import connectToCollection from '../../utils/levelSystem';
import Logger from '../../utils/logger';
import EmbedBuilder from '../../types/easyEmbed';
import { EasyPermManager } from '../../types/easyPermissons';
import dotenv from 'dotenv';

dotenv.config();

const setXPCommand = {
    name: 'setXP',
    reply: true,
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();
        const userId = args[0];
        const amount = parseInt(args[1]);

        const adminRoleId = process.env.ADMIN_ROLE;
        if (!adminRoleId) {
            throw new Error('ADMIN_ROLE is not defined in the environment.');
        }

        const member = message.member;
        const permissionManager = EasyPermManager.init();
        permissionManager.allowRole('setXP', adminRoleId);

        if (!message.author || !member || !permissionManager.hasPermission('setXP', message.author.id, member)) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('You do not have permission to use this command.')
                .setColour('#FF0000');
            const replyMessage = await message.reply({ embeds: [errorEmbed.build()] });

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

        if (!userId || isNaN(amount)) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('Invalid arguments. Usage: !setXP <user> <amount>')
                .setColour('#FF0000');
            const replyMessage = await message.reply({ embeds: [errorEmbed.build()] });

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
            const collection = await connectToCollection();
            await collection.updateOne({ userId }, { $set: { experience: amount } });

            const successEmbed = new EmbedBuilder()
                .setTitle('Success')
                .setDescription(`Set XP of user ${userId} to ${amount}`)
                .setColour('#00FF00');
            const replyMessage = await message.reply({ embeds: [successEmbed.build()] });

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
        } catch (error: any) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(error.message)
                .setColour('#FF0000');
            const replyMessage = await message.reply({ embeds: [errorEmbed.build()] });

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

            await logger.error(`Failed to execute 'setXP' command: ${error.message}`, error, true);
        }
    }
};

export default setXPCommand;