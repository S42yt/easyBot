import { Message } from 'revolt.js';
import Logger from '../../utils/logger';
import EmbedBuilder from '../../types/easyEmbed';
import fs from 'fs';
import path from 'path';
import { EasyPermManager } from '../../types/easyPermissons';
import dotenv from 'dotenv';
import ErrorEmbed from '../../types/easyErrorEmbed';
import CommandHandler from '../../handler/cmdHandler';

dotenv.config();

const eventCommand = {
    name: 'eventStart',
    reply: true,
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();

        const adminRoleId = process.env.ADMIN_ROLE;

        if ( !adminRoleId) {
            throw new Error('MODERATOR_ROLE or ADMIN_ROLE is not defined in the environment.');
        }

        const member = message.member;
        const permissionManager = EasyPermManager.init();
        permissionManager.allowRole('eventStart', adminRoleId);

        if (!message.author || !member || !permissionManager.hasPermission('eventStart', message.author.id, member)) {
            const embed = new EmbedBuilder()
                .setTitle('Permission Denied')
                .setDescription('You don\'t have permission to use this command.')
                .setColour('#FF0000'); // Red color for error

            const replyMessage = await message.reply({ embeds: [embed.build()] });

            // Delete the error message and the user's message after 3 seconds
            setTimeout(async () => {
                try {
                    if (replyMessage) {
                        await replyMessage.delete();
                    }
                    if (message) {
                        await message.delete();
                    }
                } catch (error: any) {
                    await logger.error(`Error deleting messages: ${error.message}`, true);
                }
            }, 3000);

            return;
        }

        // Command logic here
        try {
            const eventEmbed = new EmbedBuilder()
                .setTitle('Event Triggered')
                .setDescription(`Event: ${args[0]}\nUser: ${message.author?.username}`)
                .setColour('#00FF00');
            await message.reply({ embeds: [eventEmbed.build()] });

            // Trigger the event logic here
            const eventPathTs = path.join(__dirname, '../../events', `${args[0]}.ts`);
            const eventPathJs = path.join(__dirname, '../../events', `${args[0]}.js`);
            let event;

            if (fs.existsSync(eventPathTs)) {
                event = await import(eventPathTs);
            } else if (fs.existsSync(eventPathJs)) {
                event = await import(eventPathJs);
            } else {
                throw new Error(`Event file for ${args[0]} not found.`);
            }

            if (event && event.default && typeof event.default.run === 'function') {
                await event.default.run(message, message.author?.id);
                await logger.log(`Executed 'eventStart' command for event: ${args[0]} by ${message.author?.username}`, true);
            } else {
                throw new Error(`Event file for ${args[0]} is not properly structured.`);
            }
        } catch (error: any) {
            await logger.error(`Failed to execute 'eventStart' command: ${error.message}`, error, true);

            const errorEmbed = new ErrorEmbed()
                .setTitle('Error')
                .setDescription('Failed to start the event.')
                .setColour('#FF0000');
            await CommandHandler.prototype.sendResponse(message, '', errorEmbed, true); // Use sendResponse with isError set to true
        }
    }
};

export default eventCommand;