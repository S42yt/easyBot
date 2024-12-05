import { Client, User } from 'revolt.js';
import { ClientEvent } from '../types/easyClientEvent';
import EmbedBuilder from '../types/easyEmbed';
import Logger from '../utils/logger';
import EventHandler from '../handler/eventHandler';
import dotenv from 'dotenv';

dotenv.config();

class welcomeMSG implements ClientEvent {
    name = 'welcomeMSG';
    description = 'Welcome message for new users.';

    async run(client: Client, user: User) {
        const logger = new Logger();
        logger.info('Running welcomeMSG event', true);
        try {
            const welcomeChannelId = process.env.WELCOME_CHANNEL_ID!;
            logger.log(`Fetched welcome channel ID: ${welcomeChannelId}`, true);

            // Create Embed
            const embed = new EmbedBuilder()
                .setColour('#5A09C1')
                .setTitle(`Welcome, ${user.username}!`)
                .setDescription('Glad to have you here!')
                .setMedia('assets/images/welcome_bg.gif');
            logger.log('Created welcome embed', true);

            // Send Message using EventHandler's sendMessageToChannel method
            logger.log('Attempting to send welcome message...', true);
            await EventHandler.prototype.sendMessageToChannel(welcomeChannelId, '', embed);
            logger.log(`Sent welcome message to channel ID: ${welcomeChannelId}`, true);

            logger.info(`Sent welcome message to ${user.username}`, true);
        } catch (error) {
            logger.error(`Error sending welcome message: ${(error as any).message}`, true);
            logger.error(`Failed to send welcome message to channel ID: ${process.env.WELCOME_CHANNEL_ID}`, true);
        }
    }
}

export default new welcomeMSG();