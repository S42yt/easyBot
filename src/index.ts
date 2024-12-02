import { startClient } from './client';
import CommandHandler from './handler/cmdHandler';
import EventHandler from './handler/eventHandler';
import Logger from './utils/logger';

const logger = new Logger();

const commandHandler = new CommandHandler();
commandHandler.registerCommands();

const eventHandler = new EventHandler();
eventHandler.initEvents();

process.on("uncaughtException", function (err) {
    const text = "Caught exception: " + err + "\n" + err.stack
    logger.error(text)
})

startClient();
