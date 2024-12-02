import { Message } from 'revolt.js';
import Logger from '../utils/logger';
import EmbedBuilder from '../types/embedType';
import fs from 'fs';
import path from 'path';

const eventCommand = {
    name: 'event',
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();

        if (args.length < 2) {
            const helpEmbed = new EmbedBuilder()
                .setTitle('Event Command Help')
                .setDescription('Usage: !event {eventname} {user}')
                .setColour('#FF0000');
            await message.channel?.sendMessage({ embeds: [helpEmbed.build()] });
        } else {
            const [eventname, user] = args;
            const eventEmbed = new EmbedBuilder()
                .setTitle('Event Triggered')
                .setDescription(`Event: ${eventname}\nUser: ${user}`)
                .setColour('#00FF00');
            await message.channel?.sendMessage({ embeds: [eventEmbed.build()] });

            // Trigger the event logic here
            try {
                const eventPathTs = path.join(__dirname, '../events', `${eventname}.ts`);
                const eventPathJs = path.join(__dirname, '../events', `${eventname}.js`);
                let event;

                if (fs.existsSync(eventPathTs)) {
                    event = await import(eventPathTs);
                } else if (fs.existsSync(eventPathJs)) {
                    event = await import(eventPathJs);
                } else {
                    await message.channel?.sendMessage(`Event ${eventname} not found.`);
                    return;
                }

                if (event.default && typeof event.default.run === 'function') {
                    await event.default.run(message, user);
                } else {
                    await message.channel?.sendMessage(`Event ${eventname} does not have a valid run function.`);
                }
            } catch (error: any) {
                await logger.error(`Failed to trigger event '${eventname}': ${error.message}`, error, true);
            }
        }

        try {
            await logger.log(`Executed 'event' command by ${message.author?.username}`, true);
        } catch (error: any) {
            await logger.error(`Failed to execute 'event' command: ${error.message}`, error, true);
        }
    }
};

export default eventCommand;