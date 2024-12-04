import { Message } from "revolt.js";
import Logger from "../../utils/logger";
import EmbedBuilder from "../../types/easyEmbed";
import dotenv from 'dotenv';
import { EasyPermManager } from "../../types/easyPermissons";

dotenv.config();

const pingCommand = {
    name: "ping",
    reply: true,
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();
        const startTime = Date.now();

        const moderatorRoleId = process.env.MODERATOR_ROLE;
        const adminRoleId = process.env.ADMIN_ROLE;

        if (!moderatorRoleId || !adminRoleId) {
            throw new Error('MODERATOR_ROLE or ADMIN_ROLE is not defined in the environment.');
        }

        const member = message.member;
        const permissionManager = EasyPermManager.init();
        permissionManager.allowRole('ping', moderatorRoleId);
        permissionManager.allowRole('ping', adminRoleId);

        if (!message.author || !member || !permissionManager.hasPermission('ping', message.author.id, member)) {
            const embed = new EmbedBuilder()
                .setTitle('Permission Denied')
                .setDescription('You don\'t have permission to use this command.')
                .setColour('#FF0000'); // Red color for error

            const replyMessage = await message.reply({ embeds: [embed.build()] });

            // Delete the error message and the user's message after 5 seconds
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
            const embed = new EmbedBuilder()
                .setTitle("Pong!")
                .setDescription("Calculating latency...")
                .setColour("#fcdb03");

            const sentMessage = await message.reply({ embeds: [embed.build()] });
            const latency = Date.now() - startTime;

            const updatedEmbed = new EmbedBuilder()
                .setTitle("Pong!")
                .setDescription(`Latency: ${latency}ms`)
                .setColour("#03fc1c");

            await sentMessage?.edit({ embeds: [updatedEmbed.build()] });
            await logger.log(`Executed 'ping' command by ${message.author?.username}`, true);
        } catch (error: any) {
            await logger.error(`Failed to execute 'ping' command: ${error.message}`, error, true);

            const errorEmbed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription("Failed to calculate latency.")
                .setColour("#fc0303");

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

export default pingCommand;