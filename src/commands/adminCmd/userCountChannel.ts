import { Message, ServerMember, Client } from 'revolt.js';
import Logger from '../../utils/logger';
import { memberCounter } from '../../types/easyMemberCounter';
import { EasyPermManager } from '../../types/easyPermissons';
import EmbedBuilder from '../../types/easyEmbed';
import ErrorEmbed from '../../types/easyErrorEmbed';
import dotenv from 'dotenv';
import EasyChannelPermManager from '../../types/easyChannelPermissons';

dotenv.config();

const userCountChannelCommand = {
    name: 'userCountChannel',
    reply: true,
    execute: async (message: Message) => {
        const logger = new Logger();

        const adminRoleId = process.env.ADMIN_ROLE;

        if (!adminRoleId) {
            const errorEmbed = new ErrorEmbed()
                .setTitle('Configuration Error')
                .setDescription('ADMIN_ROLE is not defined in the environment.')
                .setColour('#FF0000'); // Red color for error

            await message.reply({ embeds: [errorEmbed.build()] });
            return;
        }

        const member = message.member;
        const permissionManager = EasyPermManager.init();
        permissionManager.allowRole('userCountChannel', adminRoleId);

        if (!message.author || !member || !permissionManager.hasPermission('userCountChannel', message.author.id, member)) {
            const errorEmbed = new ErrorEmbed()
                .setTitle('Permission Denied')
                .setDescription('You don\'t have permission to use this command.')
                .setColour('#FF0000'); // Red color for error

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
            if (!message.channel || !message.server) {
                throw new Error('Server or channel not found.');
            }

            const count = await memberCounter.getMemberCount(message.server);
            const channelName = `👤•Members: ${count}`;

            try {
                const newChannel = await message.server.createChannel({
                    name: channelName,
                    type: 'Voice',
                });

                const successEmbed = new EmbedBuilder()
                    .setTitle('Channel Created')
                    .setDescription(`Channel created: ${newChannel.name}`)
                    .setColour('#00FF00'); // Green color for success

                await message.reply({ embeds: [successEmbed.build()] });
                await logger.log(`Created channel ${newChannel.name} with member count ${count}`, true);

                const clientInstance = new Client();
                clientInstance.on('serverMemberJoin', async (member: ServerMember) => {
                    if (member.server && member.server.id === message.server?.id) {
                        const newCount = await memberCounter.getMemberCount(message.server!);
                        await newChannel.edit({ name: `👤•Members: ${newCount}` });
                        await logger.log(`Updated channel name to ${newChannel.name} with new member count ${newCount}`, true);
                    }
                });
            } catch (error: any) {
                if (error.response?.status !== 422) {
                    console.error(`Error: ${error.message}`, error.stack);
                    await logger.error(`Failed to create user count channel: ${error.message}`, true);

                    const errorEmbed = new ErrorEmbed()
                        .setTitle('Error')
                        .setDescription(`Failed to create user count channel: ${error.message}`)
                        .setColour('#FF0000'); // Red color for error

                    const replyMessage = await message.reply({ embeds: [errorEmbed.build()] });
                    setTimeout(async () => {
                        try {
                            if (replyMessage) {
                                await replyMessage.delete();
                            }
                            if (message) {
                                await message.delete();
                            }
                        } catch (deleteError: any) {
                            console.error(`Error deleting messages: ${deleteError.message}`, deleteError.stack);
                            await logger.error(`Error deleting messages: ${deleteError.message}`, true);
                        }
                    }, 3000);
                }
            }
        } catch (error: any) {
            logger.error(`Error: ${error.message}`, error.stack);
            await logger.error(`Failed to create user count channel: ${error.message}`, true);

            const errorEmbed = new ErrorEmbed()
                .setTitle('Error')
                .setDescription(`Failed to create user count channel: ${error.message}`)
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
                } catch (deleteError: any) {
                    logger.error(`Error deleting messages: ${deleteError.message}`, deleteError.stack);
                    await logger.error(`Error deleting messages: ${deleteError.message}`, true);
                }
            }, 3000);
        }
    }
};

async function retry(fn: () => Promise<any>, retries: number, delay: number): Promise<any> {
    try {
        return await fn();
    } catch (error: any) {
        if (retries > 0 && error.response?.status === 429) {
            await new Promise(res => setTimeout(res, delay));
            return retry(fn, retries - 1, delay * 2);
        } else {
            throw error;
        }
    }
}

export default userCountChannelCommand;