import { Message } from 'revolt.js';
import Logger from '../utils/logger';
import EmbedBuilder from '../types/embedType';
import fs from 'fs';
import path from 'path';

const eventCommand = {
    name: 'startEvent',
    reply: true,
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();

        if (args.length < 2) {
            const helpEmbed = new EmbedBuilder()
                .setTitle('Event Command Help')
                .setDescription('Usage: !startEvent {Event Name} {User Name}')
                .setColour('#FF0000');
            await message.reply({ embeds: [helpEmbed.build()] });
            return;
        }

        const [eventName, userName] = args;
        const eventEmbed = new EmbedBuilder()
            .setTitle('Event Triggered')
            .setDescription(`Event: ${eventName}\nUser: ${userName}`)
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
                await event.default.run(message, userName);
                await logger.log(`Executed 'startEvent' command for event: ${eventName} by ${message.author?.username}`, true);
            } else {
                throw new Error(`Event file for ${eventName} is not properly structured.`);
            }
        } catch (error: any) {
            await logger.error(`Failed to execute 'startEvent' command: ${error.message}`, error, true);

            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(`Failed to trigger event: ${error.message}`)
                .setColour('#FF0000');
            await message.reply({ embeds: [errorEmbed.build()] });
        }
    }
};

export default eventCommand;