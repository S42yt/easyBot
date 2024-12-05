import { Client, Message } from 'revolt.js';
import dotenv from 'dotenv';
import EasyEmbed from '../types/easyEmbed';
import Logger from '../utils/logger';
import { HydratedMessage } from 'revolt.js/lib/esm/hydration';

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

    // Handle attachments
    if (message.attachments && message.attachments.length > 0) {
        for (const attachment of message.attachments) {
            await logChannel.sendMessage({ content: attachment.url });
            console.log(`[${new Date(message.createdAt).toLocaleString()}] ${message.author?.username || 'Unknown'} sent an image: ${attachment.url}`);
        }
    }
});

client.on('messageUpdate', async (newMessage: Message, oldMessage: HydratedMessage) => {
    if (newMessage.author?.bot) return; // Ignore bot messages

    const logChannelId = process.env.LOGGING_CHANNEL_ID;
    if (!logChannelId) {
        throw new Error('LOGGING_CHANNEL_ID is not defined in the environment.');
    }

    if (newMessage.channelId === logChannelId) {
        return; // Ignore messages in the logging channel
    }

    const logChannel = await client.channels.fetch(logChannelId);
    if (!logChannel) {
        throw new Error('Log channel not found');
    }

    const embed = new EasyEmbed()
        .setTitle('Message Edited')
        .setDescription(
            `**Time:** ${new Date(newMessage.createdAt).toLocaleString()}\n` +
            `**User:** <@${newMessage.author?.id}>\n` +
            `**Channel:** <#${newMessage.channelId}>\n` +
            `**Old Message:** ${oldMessage.content || 'No content'}\n` +
            `**New Message:** ${newMessage.content || 'No content'}`
        )
        .setColour('#FFA500') // Orange color for the embed
        .setTimestamp(new Date(newMessage.createdAt).toISOString());

    // Log to console
    console.log(`[${new Date(newMessage.createdAt).toLocaleString()}] ${newMessage.author?.username || 'Unknown'} edited in ${newMessage.channel?.name || 'Unknown'}: ${oldMessage.content || 'No content'} -> ${newMessage.content || 'No content'}`);

    // Send embed to log channel
    await logChannel.sendMessage({ embeds: [embed.build()] });

    // Handle attachments
    if (newMessage.attachments && newMessage.attachments.length > 0) {
        for (const attachment of newMessage.attachments) {
            await logChannel.sendMessage({ content: attachment.url });
            console.log(`[${new Date(newMessage.createdAt).toLocaleString()}] ${newMessage.author?.username || 'Unknown'} sent an image: ${attachment.url}`);
        }
    }
});

client.on('messageDelete', async (message: HydratedMessage) => {
    if (!message.authorId) return; // Ignore bot messages or missing message data

    const logChannelId = process.env.LOGGING_CHANNEL_ID;
    if (!logChannelId) {
        console.error('LOGGING_CHANNEL_ID is not defined in the environment.');
        return;
    }

    if (message.channelId === logChannelId) {
        return; // Ignore messages in the logging channel
    }

    const logChannel = await client.channels.fetch(logChannelId);
    if (!logChannel) {
        console.error('Log channel not found');
        return;
    }

    // Try to fetch the deleted message (if it was cached before deletion)
    let fullMessage = message;
    if (!message.content) {
        try {
            fullMessage = await client.messages.fetch(message.channelId, message.id); // Fetch the deleted message
        } catch (error) {
            console.error(`Failed to fetch deleted message: ${error}`);
        }
    }

    const currentTime = new Date();

    const embed = new EasyEmbed()
        .setTitle('Message Deleted')
        .setDescription(
            `**Time:** ${currentTime.toLocaleString()}\n` +
            `**User:** <@${fullMessage.authorId}>\n` + // Use authorId here
            `**Channel:** <#${fullMessage.channelId}>\n` + // Use channelId here
            `**Message:** ${fullMessage.content || 'No content'}`
        )
        .setColour('#FF0000') // Red color for the embed
        .setTimestamp(currentTime.toISOString());

    // Log to console
    console.log(`[${currentTime.toLocaleString()}] ${fullMessage.authorId || 'Unknown'} deleted in ${fullMessage.channelId}: ${fullMessage.content || 'No content'}`);

    // Send embed to log channel
    await logChannel.sendMessage({ embeds: [embed.build()] });

    // Handle attachments
    if (fullMessage.attachments && fullMessage.attachments.length > 0) {
        for (const attachment of fullMessage.attachments) {
            await logChannel.sendMessage({ content: attachment.url });
            console.log(`[${currentTime.toLocaleString()}] ${fullMessage.authorId || 'Unknown'} deleted an image: ${attachment.url}`);
        }
    }
});

client.loginBot(process.env.BOT_TOKEN as string).catch((error) => {
    console.error("Failed to login:", error);
});