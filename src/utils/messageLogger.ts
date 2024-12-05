import { Client, Message } from 'revolt.js';
import dotenv from 'dotenv';
import EasyEmbed from '../types/easyEmbed';
import Logger from '../utils/logger';

dotenv.config();

const logger = new Logger();
const client = new Client();


client.on('messageCreate', async (message: Message) => {
    if (message.author?.bot) return; // Ignore bot messages

    const logChannelId = process.env.LOGGING_CHANNEL_ID;
    if (!logChannelId) {
        throw new Error('LOGGING_CHANNEL_ID is not defined in the environment.');
    } 

    if (message.channelId === logChannelId) {
        return; // Ignore messages in the logging channel
    }

    const logChannel = await client.channels.fetch(logChannelId);
    if (!logChannel) {
        throw new Error('Log channel not found');
    }

    const embed = new EasyEmbed()
        .setTitle('Message Logged')
        .setDescription(
            `**Time:** ${new Date(message.createdAt).toLocaleString()}\n` +
            `**User:** <@${message.author?.id}>\n` +
            `**Channel:** <#${message.channelId}>\n` +
            `**Message:** ${message.content || 'No content'}`
        )
        .setColour('#00FF00') // Green color for the embed
        .setTimestamp(new Date(message.createdAt).toISOString());

    // Log to console
    console.log(`[${new Date(message.createdAt).toLocaleString()}] ${message.author?.username || 'Unknown'} in ${message.channel?.name || 'Unknown'}: ${message.content || 'No content'}`);

    // Send embed to log channel
    await logChannel.sendMessage({ embeds: [embed.build()] });
});

client.loginBot(process.env.BOT_TOKEN as string).catch((error) => {
    console.error("Failed to login:", error);
});