import { startClient } from './client';
import CommandHandler from './handler/easyCmd';
import EventHandler from './handler/eventHandler';
import Logger from './utils/logger';
import { Client } from 'revolt.js';

const logger = new Logger();

const commandHandler = new CommandHandler();
commandHandler.registerCommands();

const eventHandler = new EventHandler();
eventHandler.initEvents();

const client = new Client();


+
process.on("uncaughtException", function (err) {
    const text = "Caught exception: " + err + "\n" + err.stack;
    logger.error(text);
});

startClient();