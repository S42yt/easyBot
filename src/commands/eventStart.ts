import { Message } from 'revolt.js';
import Logger from '../utils/logger';
import EmbedBuilder from '../types/easyEmbed';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const eventCommand = {
    name: 'eventStart',
    reply: true,
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();

        if (args.length < 1) {
            const helpEmbed = new EmbedBuilder()
                .setTitle('Event Command Help')
                .setDescription('Usage: !event {Event Name}')
                .setColour('#FF0000');
            await message.reply({ embeds: [helpEmbed.build()] });
            return;
        }

        const [eventName] = args;
        const s42UserId = process.env.S42_USER_ID;

        if (!s42UserId) {
            throw new Error('S42_USER_ID is not defined in the environment.');
        }

        const eventEmbed = new EmbedBuilder()
            .setTitle('Event Triggered')
            .setDescription(`Event: ${eventName}\nUser: S42`)
            .setColour('#00FF00');
        const sentMessage = await message.reply({ embeds: [eventEmbed.build()] });

        // Trigger the event logic here
        try {
            const eventPathTs = path.join(__dirname, '../events', `${eventName}.ts`);
            const eventPathJs = path.join(__dirname, '../events', `${eventName}.js`);
            let event;

            if (fs.existsSync(eventPathTs)) {
                event = await import(eventPathTs);
            } else if (fs.existsSync(eventPathJs)) {
                event = await import(eventPathJs);
            } else {
                throw new Error(`Event file for ${eventName} not found.`);
            }

            if (event && event.default && typeof event.default.run === 'function') {
                await event.default.run(message, s42UserId);
                await logger.log(`Executed 'startEvent' command for event: ${eventName} by ${message.author?.username}`, true);
            } else {
                throw new Error(`Event file for ${eventName} is not properly structured.`);
            }
        } catch (error: any) {
            await logger.error(`Failed to execute 'startEvent' command: ${error.message}`, error, true);
        }
    }
};

export default eventCommand;