import { Client, Message } from 'revolt.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Logger from '../utils/logger';
import EmbedBuilder from '../types/embedType';

dotenv.config();

class CommandHandler {
    public static client: Client;
    private token: string;
    private logger: Logger;

    constructor() {
        this.token = process.env.BOT_TOKEN || '';
        CommandHandler.client = new Client();

        this.logger = new Logger();

        CommandHandler.client.once('ready', async () => {
            await this.logger.log('Command Handler Ready: Command Handler ist Bereit!', true);
        });

        CommandHandler.client.on('messageCreate', async (message) => {
            if (!message.content.startsWith('!')) return;
            await this.handleCommand(message);
        });

        CommandHandler.client.loginBot(this.token);
    }

    async registerCommands() {
        const commands: any[] = [];
        const commandNames = new Set<string>();

        const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = await import(`../commands/${file}`);
            if (commandNames.has(command.default.name)) {
                console.warn(`Duplicate command name found: ${command.default.name}. Skipping registration.`);
                continue;
            }
            commandNames.add(command.default.name);
            commands.push(command.default);
        }

        try {
            await this.registerRevoltCommands(commands);
            await this.logger.log('Commands registered successfully.', true);
        } catch (error: any) {
            await this.logger.log(`Error registering commands: ${error.message}`, true);
        }
    }

    private async handleCommand(message: Message) {
        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        try {
            const command = await import(`../commands/${commandName}`);

            if (command.default.execute) {
                await command.default.execute(message, args, this.sendResponse);
            } else {
                await message.channel?.sendMessage('Unknown command.');
            }
        } catch (error: any) {
            await this.logger.log(`Error executing command: ${error.message}`, true);
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