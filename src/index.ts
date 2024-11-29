import { startClient } from './client';
import CommandHandler from './handler/cmdHandler';

const commandHandler = new CommandHandler();
commandHandler.registerCommands();


startClient();
