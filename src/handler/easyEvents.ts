import path from "path";
import fs from "fs";
import { Client } from "revolt.js";
import EmbedBuilder from "../types/easyEmbed";
import { EasyMessage } from "../types/easyMessage";
import Logger from '../utils/logger';
import dotenv from 'dotenv';
import UserLeave from '../events/userLeave';


dotenv.config();

class EventHandler {
    public static client: Client;
    private token: string;
    private logger: Logger;
    private events: Map<string, Function[]>;

    constructor() {
        this.token = process.env.BOT_TOKEN || '';
        EventHandler.client = new Client();
        this.logger = new Logger();
        this.events = new Map();

        EventHandler.client.once('ready', async () => {
            await this.logger.info('Event Handler Ready!', true);
        });

        EventHandler.client.on('messageCreate', async (message) => {
            const easyMessage = message as EasyMessage;
            if (!easyMessage.content.startsWith('!')) return;
            await this.handleEvent(easyMessage);
        });

        EventHandler.client.loginBot(this.token);
    }

    async initEvents() {
        const eventFiles = fs.readdirSync(path.join(__dirname, '../events')).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        for (const file of eventFiles) {
            const event = await import(`../events/${file}`);
            if (event.default && event.default.name) {
                if (!this.events.has(event.default.name)) {
                    this.events.set(event.default.name, []);
                }
                this.events.get(event.default.name)?.push(event.default.run);
            } else {
                console.warn(`Invalid event structure in file: ${file}. Skipping registration.`);
            }
        }

        
        try {
            await this.logger.info('Events registered successfully.', true);
        } catch (error: any) {
            await this.logger.error(`Error registering events: ${error.message}`, true);
        }
    }

    private async handleEvent(message: EasyMessage) {
        const args = message.content.slice(1).trim().split(/ +/);
        const eventName = args.shift()?.toLowerCase();

        if (this.events.has(eventName!)) {
            const eventHandlers = this.events.get(eventName!);
            if (eventHandlers) {
                for (const handler of eventHandlers) {
                    try {
                        await handler(EventHandler.client, message, args);
                    } catch (error: any) {
                        await this.logger.error(`Error executing event: ${error.message}`, true);
                    }
                }
            }
        } else {
        }
    }

    public async sendMessageToChannel(channelId: string, content: string, embed?: EmbedBuilder) {
        try {
            this.logger.log(`Fetching channel with ID: ${channelId}`, true);
            const channel = await EventHandler.client.channels.fetch(channelId);
            if (!channel) {
                throw new Error('Channel not found');
            }

            this.logger.info(`Channel found: ${channelId}`, true);

            if (embed) {
                this.logger.log('Sending message with embed', true);
                await channel.sendMessage({ content, embeds: [embed.build()] });
            } else {
                this.logger.log('Sending message without embed', true);
                await channel.sendMessage({ content });
            }

            this.logger.log(`Message sent to channel: ${channelId}`, true);
        } catch (error: any) {
            await this.logger.error(`Failed to send message to channel '${channelId}': ${error.message}`, error, true);
        }
    }
}

export default EventHandler;