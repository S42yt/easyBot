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
            this.commands.set(command.default.name, command.default);
        }
    }

    private async handleCommand(message: Message) {
        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        if (this.commands.has(commandName!)) {
            const command = this.commands.get(commandName!);
            try {
                await command.execute(message, args);
            } catch (error: any) {
                await this.logger.error(`Error executing command: ${error.message}`, true);
            }
        } else {
            const embed = new EmbedBuilder()
                .setTitle('Command Not Found')
                .setDescription('This Command doesn\'t exist')
                .setColour('#FF0000');

            const replyMessage = await message.channel?.sendMessage({ embeds: [embed.build()] });

            // Delete the user's message and the bot's reply after 5 seconds
            setTimeout(async () => {
                try {
                    await message.delete();
                    if (replyMessage) {
                        await replyMessage.delete();
                    }
                } catch (error: any) {
                    await this.logger.error(`Error deleting messages: ${error.message}`, true);
                }
            }, 5000);
        }
    }
}

export default CommandHandler;