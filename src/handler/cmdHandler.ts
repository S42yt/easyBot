import path from 'path';
import fs from 'fs';
import { Client, Message } from 'revolt.js';
import ClientEvent from '../types/easyClientEvent';
import Logger from '../utils/logger';
import EmbedBuilder from '../types/easyEmbed';

class CommandHandler {
    public static client: Client;
    private token: string;
    private logger: Logger;
    private commands: Map<string, any>;

    constructor() {
        this.token = process.env.BOT_TOKEN || '';
        CommandHandler.client = new Client();
        this.logger = new Logger();
        this.commands = new Map();

        CommandHandler.client.once('ready', async () => {
            await this.logger.info('Command Handler Ready!', true);
        });

        CommandHandler.client.on('messageCreate', async (message: Message) => {
            if (!message.content.startsWith('!')) return;
            await this.handleCommand(message);
        });

        CommandHandler.client.loginBot(this.token);
    }

    async registerCommands() {
        const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = await import(`../commands/${file}`);
            // Store commands in lowercase to ensure case-insensitivity
            this.commands.set(command.default.name.toLowerCase(), command.default);
        }
        this.logger.info('Commands registered successfully!', true);
    }

    private async handleCommand(message: Message) {
        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase(); // Always convert command name to lowercase

        if (commandName && this.commands.has(commandName)) {
            const command = this.commands.get(commandName);
            try {
                await command.execute(message, args);
            } catch (error: any) {
                await this.logger.error(`Error executing command: ${error.message}`, true);
            }
        } else {
            const embed = new EmbedBuilder()
                .setTitle('Command Not Found')
                .setDescription('This Command doesn\'t exist')
                .setColour('#00FF00'); // Green

            const replyMessage = await message.reply({ embeds: [embed.build()] });

            // Change color from green to yellow to red
            setTimeout(async () => {
                embed.setColour('#FFFF00'); // Yellow
                await replyMessage?.edit({ embeds: [embed.build()] });
            }, 1000);

            setTimeout(async () => {
                embed.setColour('#FF0000'); // Red
                await replyMessage?.edit({ embeds: [embed.build()] });
            }, 2000);

            // Delete the user's message and the bot's reply after 3 seconds
            setTimeout(async () => {
                try {
                    CommandHandler.client.emit('messageDelete', message);
                    if (replyMessage) {
                        CommandHandler.client.emit('messageDelete', replyMessage);
                    }
                } catch (error: any) {
                    await this.logger.error(`Error deleting messages: ${error.message}`, true);
                }
            }, 3000);

            // Log the event
            await this.logger.warn(`Command not found: ${commandName}`, true);
        }
    }

    private async registerRevoltCommands(commands: any[]) {
        // Implement the method to register commands in Revolt.js
    }

    private async sendResponse(message: Message, content: string, embed?: EmbedBuilder) {
        if (embed) {
            await message.channel?.sendMessage({ embeds: [embed.build()] });
        } else {
            await message.channel?.sendMessage(content);
        }
    }
}

export default CommandHandler;
