import { startClient } from './client';
import CommandHandler from './handler/easyCmd';
import EventHandler from './handler/easyEvents';
import Logger from './utils/logger';
import { Client } from 'revolt.js';
import './utils/messageLogger';
import { connectToDatabase } from './database/mongodb';
import './database/utils/levelSystem';
import './handler/easyXPHandler';

const logger = new Logger();

const commandHandler = new CommandHandler();
commandHandler.registerCommands();

const eventHandler = new EventHandler();
eventHandler.initEvents();

const client = new Client();

process.on("uncaughtException", function (err) {
    const text = "Caught exception: " + err + "\n" + err.stack;
    logger.error(text);
});

connectToDatabase().then(() => {
    startClient();
});