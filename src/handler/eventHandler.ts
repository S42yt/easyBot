import path from "path";
import fs from "fs";
import { Client } from "revolt.js";
import Logger from '../utils/logger';

interface ClientEvent {
    name: string;
    run: Function;
}

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

            logger.log("Loading event file: " + file, true);

            const event: ClientEvent = require(path.join(__dirname, "../events", file)).default;

            if (!event || !event.name) {
                logger.error(`Invalid event structure in file: ${file}`, true);
                continue;
            }

            if (!EventHandler.events.has(event.name)) {
                EventHandler.events.set(event.name, []);
                logger.log(`Registering new event: ${event.name}`, true);
            }

            EventHandler.events.get(event.name)!.push(event.run);
            logger.log(`Event ${event.name} loaded successfully from file: ${file}`, true);
        }

        logger.log("EventHandler is ready and all events have been initialized.", true);
        console.log("EventHandler is ready and all events have been initialized.");
    }
}