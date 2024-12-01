import { Client, User } from 'revolt.js';
import Canvas from 'canvas';
import path from 'path';
import EventHandler from '../handler/eventHandler';
import EmbedBuilder from '../types/embedType';
import Logger from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

class UserJoinedHandler extends EventHandler {
    constructor() {
        super();
    }

    async run(client: Client, user: User) {
        const logger = new Logger();
        try {
            const welcomeChannelId = process.env.WELCOME_CHANNEL_ID!;
            const channel = client.channels.get(welcomeChannelId);
            if (!channel || !channel.sendMessage) {
                logger.error('Welcome channel not found or not sendable.', undefined, true);
                return;
            }

            // Create Canvas
            const canvas = Canvas.createCanvas(800, 360);
            const ctx = canvas.getContext('2d');

            // Load background image
            const backgroundImagePath = path.join(__dirname, '../../assets/images/welcome_bg.jpg');
            const background = await Canvas.loadImage(backgroundImagePath);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            // Overlay
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // User Avatar
            const avatarURL = user.avatar?.url ? user.avatar.url : '';
            const avatar = await Canvas.loadImage(avatarURL);
            ctx.save();
            ctx.beginPath();
            ctx.arc(canvas.width / 2, 100, 80, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, canvas.width / 2 - 80, 20, 160, 160);
            ctx.restore();

            // Welcome Text
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';

            ctx.font = '40px "Rubik"';
            ctx.fillText(`Welcome to the server,`, canvas.width / 2, 230);

            ctx.font = '55px "Rubik"';
            ctx.fillText(user.username, canvas.width / 2, 310);

            // Convert to buffer
            const buffer = canvas.toBuffer();

            // Create Embed
            const embed = new EmbedBuilder()
                .setColour('#5A09C1')
                .setTitle(`Welcome, ${user.username}!`)
                .setDescription('Glad to have you here!')
                .setMedia('attachment://welcome-image.png');

            // Send Message
            await channel.sendMessage({
                content: '',
                embeds: [embed.build()],
            });

            logger.log(`Sent welcome message to ${user.username}`, true);
        } catch (error) {
            logger.error('Error sending welcome message.', error, true);
        }
    }
}

export default new UserJoinedHandler();