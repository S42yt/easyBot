import Logger from './logger';
import { Message, Channel, Client } from 'revolt.js';
import dotenv from 'dotenv';
import EmbedBuilder from '../types/embedType';

dotenv.config();

const logger = new Logger();
const logChannelId = process.env.LOG_CHANNEL_ID!;
const client = new Client();

client.on('messageCreate', async (message: Message) => {
    if (excludedChannels.has(message.channelId)) return;
    try {
        await MessageLogger.logMessage(message);
        logger.log
    } catch (error) {
        logger.error('Error logging new message.', error, true);
    }
});

client.on('messageUpdate', async (message: Message) => {
    if (excludedChannels.has(message.channelId)) return;
    try {
        await MessageLogger.logMessageEdit(message);
    } catch (error) {
        logger.error('Error logging edited message.', error, true);
    }
});


class MessageLogger {
    static async logMessage(message: Message) {
        logger.log(`Message: ${message.content}`, true);
        const embed = new EmbedBuilder()
            .setTitle("New Message")
            .setDescription(message.content)
            .setColour("#00FF00")
            .setFooter(`Author: ${message.author?.username}`);

        await this.sendEmbed(embed);
    }

    static async logMessageEdit(message: Message) {
        logger.log(`Message Edited: ${message.content}`, true);
        const embed = new EmbedBuilder()
            .setTitle("Message Edited")
            .setDescription(message.content)
            .setColour("#FFFF00")
            .setFooter(`Author: ${message.author?.username}`);

        await this.sendEmbed(embed);
    }

    static async logMessageDelete(message: Message) {
        logger.log(`Message Deleted: ${message.content || 'No content'}`, true);
        const embed = new EmbedBuilder()
            .setTitle("Message Deleted")
            .setDescription(message.content || 'Content not available')
            .setColour("#FF0000")
            .setFooter(`Author: ${message.author?.username}`);

        await this.sendEmbed(embed);
    }

    static async sendEmbed(embed: EmbedBuilder) {
        const logChannel = await client.channels.fetch(logChannelId) as Channel;
        if (logChannel) {
            await logChannel.sendMessage({ embeds: [embed.build()] });
        } else {
            logger.warn('Log channel not found.', true);
        }
    }
}

const excludedChannels = new Set<string>([
    // Add channel IDs to exclude from logging
]);

client.on('ready', () => {
    logger.log('MessageLogger is ready.', true);
});

client.on('error', (error) => {
    logger.error('Client encountered an error.', error, true);
});

export default MessageLogger;