import { startClient } from './client';
import CommandHandler from './handler/cmdHandler';
import EventHandler from './handler/eventHandler';

const commandHandler = new CommandHandler();
commandHandler.registerCommands();

const eventHandler = new EventHandler();
eventHandler.initEvents();

startClient();
