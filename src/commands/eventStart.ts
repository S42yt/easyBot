import { Message } from 'revolt.js';
import Logger from '../utils/logger';
import EmbedBuilder from '../types/embedType';
import fs from 'fs';
import path from 'path';

const eventCommand = {
    name: 'startEvent',
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();
        const startTime = Date.now();

        if (args.length < 2) {
            const helpEmbed = new EmbedBuilder()
                .setTitle('Event Command Help')
                .setDescription('Usage: !startEvent {Event Name} {User Name}')
                .setColour('#FF0000');
            await message.channel?.sendMessage({ embeds: [helpEmbed.build()] });
        } else {
            const [eventName, userName] = args;
            const eventEmbed = new EmbedBuilder()
                .setTitle('Event Triggered')
                .setDescription(`Event: ${eventName}\nUser: ${userName}`)
                .setColour('#00FF00');
            const sentMessage = await message.channel?.sendMessage({ embeds: [eventEmbed.build()] });

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
                    const notFoundEmbed = new EmbedBuilder()
                        .setTitle('Event Not Found')
                        .setDescription(`Event ${eventName} not found.`)
                        .setColour('#FF0000');
                    await sentMessage?.edit({ embeds: [notFoundEmbed.build()] });
                    return;
                }

                if (event.default && typeof event.default.run === 'function') {
                    await event.default.run(message, { displayName: userName });
                } else {
                    const invalidEventEmbed = new EmbedBuilder()
                        .setTitle('Invalid Event')
                        .setDescription(`Event ${eventName} does not have a valid run function.`)
                        .setColour('#FF0000');
                    await sentMessage?.edit({ embeds: [invalidEventEmbed.build()] });
                }
            } catch (error: any) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription(`Failed to trigger event '${eventName}': ${error.message}`)
                    .setColour('#FF0000');
                await sentMessage?.edit({ embeds: [errorEmbed.build()] });
                await logger.error(`Failed to trigger event '${eventName}': ${error.message}`, true);
            }
        }

        try {
            await logger.log(`Executed 'startEvent' command by ${message.author?.username}`, true);
        } catch (error: any) {
            const logErrorEmbed = new EmbedBuilder()
                .setTitle('Logging Error')
                .setDescription(`Failed to log execution of 'startEvent' command: ${error.message}`)
                .setColour('#FF0000');
            await message.channel?.sendMessage({ embeds: [logErrorEmbed.build()] });
            await logger.error(`Failed to execute 'startEvent' command: ${error.message}`, true);
        }
    }
};

export default eventCommand;