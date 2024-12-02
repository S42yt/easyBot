import path from "path";
import fs from "fs";
import { Client } from "revolt.js";
import { ClientEvent } from "../types/clientEvent";
import EmbedBuilder from "../types/embedType";
import MessageType from "../types/messageType";
import Logger from '../utils/logger';

export default class EventHandler {
    private static events: Map<string, Function[]> = new Map();

    public static initEvents(client: Client, logger: Logger) {
        const files = fs.readdirSync(path.join(__dirname, "../events"));

        for (const file of files) {
            if (
                (!file.endsWith(".ts") && !file.endsWith(".js")) ||
                file.startsWith("_")
            ) {
                logger.log("Skipping event file: " + file, true);
                continue;
            }

            const event: ClientEvent = require(path.join(__dirname, "../events", file)).default;

            if (!event || !event.name) {
                logger.log(`Invalid event structure in file: ${file}`, true);
                continue;
            }

            const funcsInEvent = this.events.get(event.name);

            if (funcsInEvent) {
                funcsInEvent.push(event.run);
                this.events.set(event.name, funcsInEvent);
            } else {
                this.events.set(event.name, [event.run]);
            }
        }

        this.setupHandlers(client, logger);
    }

    private static setupHandlers(client: Client, logger: Logger) {
        client.on('messageCreate', (message: MessageType) => {
            logger.log(`Message event triggered.`, true);
            const handlers = this.events.get('message');
            if (handlers) {
                for (const handler of handlers) {
                    try {
                        handler(client, message);
                        logger.log(`Message event handled successfully.`, true);
                    } catch (error: any) {
                        logger.error(`Error handling message event: ${error.message}`, error, true);
                    }
                }
            }
        });

        client.on('ready', () => {
            logger.log(`Ready event triggered.`, true);
            const handlers = this.events.get('ready');
            if (handlers) {
                for (const handler of handlers) {
                    try {
                        handler(client);
                        logger.log(`Ready event handled successfully.`, true);
                    } catch (error: any) {
                        logger.error(`Error handling ready event: ${error.message}`, error, true);
                    }
                }
            }
        });

        // Add more specific event handlers as needed
    }
}