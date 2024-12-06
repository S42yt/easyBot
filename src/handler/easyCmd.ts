import path from 'path';
import fs from 'fs';
import { Client, Message } from 'revolt.js';
import { deleteMessage, EasyMessage } from '../types/easyMessage';
import Logger from '../utils/logger';
import EmbedBuilder from '../types/easyEmbed';
import ErrorEmbed from '../types/easyErrorEmbed';

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
        const commandFolders = ['userCmd', 'adminCmd'];
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(path.join(__dirname, '../commands', folder)).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = await import(`../commands/${folder}/${file}`);
                // Store commands in lowercase to ensure case-insensitivity
                this.commands.set(command.default.name.toLowerCase(), command.default);
            }
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
            const embed = new ErrorEmbed()
                .setTitle('Command Not Found')
                .setDescription('This Command doesn\'t exist')
                .setColour('#00FF00'); // Green color for the embed

            await this.sendResponse(message, '', embed, true);
        }
    }

    public async sendResponse(message: Message, content: string, embed?: EmbedBuilder, isError: boolean = false) {
        let replyMessage;
        if (embed) {
            replyMessage = await message.reply({ embeds: [embed.build()] });
        } else {
            replyMessage = await message.reply(content);
        }

        if (isError && replyMessage) {
            // Change the embed color to yellow after 3 seconds, then to red after another 3 seconds, then delete both messages
            setTimeout(async () => {
                try {
                    if (embed) {
                        embed.setColour('#FFFF00'); // Yellow color for the embed
                        await replyMessage.edit({ embeds: [embed.build()] });
                    }
                } catch (error: any) {
                    await this.logger.error(`Error updating embed color to yellow: ${error.message}`, true);
                }
            }, 3000);

            setTimeout(async () => {
                try {
                    if (embed) {
                        embed.setColour('#FF0000'); // Red color for the embed
                        await replyMessage.edit({ embeds: [embed.build()] });
                    }
                } catch (error: any) {
                    await this.logger.error(`Error updating embed color to red: ${error.message}`, true);
                }
            }, 6000);

            setTimeout(async () => {
                try {
                    await deleteMessage(replyMessage as EasyMessage);
                    await deleteMessage(message as EasyMessage);
                } catch (error: any) {
                    await this.logger.error(`Error deleting messages: ${error.message}`, true);
                }
            }, 9000);
        }
    }

    private async registerRevoltCommands(commands: any[]) {
        // Implement the method to register commands in Revolt.js
    }
}

export default CommandHandler;