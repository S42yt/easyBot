import { Client } from "revolt.js";
import JoinRole from "./events/joinrole";
import dotenv from "dotenv";
import { saveUserData } from './database/utils/user';
import Logger from './utils/logger';
import CommandHandler from './handler/easyCmd';
import EventHandler from './handler/easyEvents';

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not defined in the .env file");
}

if (!process.env.SERVER_ID) {
  throw new Error("SERVER_ID is not defined in the .env file");
}

let client = new Client();

client.on("ready", async () => {
  console.info(`Logged in as ${client.user?.username}!`);

  const serverId = process.env.SERVER_ID;
  if (!serverId) {
    throw new Error("SERVER_ID is not defined in the .env file");
  }
  const server = client.servers.get(serverId);
  if (!server) {
    throw new Error(`Server with ID ${serverId} not found.`);
  }

  const { members } = await server.fetchMembers();
  for (const member of members) {
    if (!member.user) {
      console.warn(`Member ${member.id} does not have a user object.`);
      continue;
    }

    const user = {
      userId: member.user.id,
      username: member.user.username,
      discriminator: member.user.discriminator,
      avatar: typeof member.user.avatar === 'string' ? member.user.avatar : '',
      createdAt: new Date(member.user.createdAt),
      experience: 0, // Initialize experience
      level: 0 // Initialize level
    };

    await saveUserData(user);
  }

  console.log('All members have been registered.');
});

client.on('serverMemberJoin', (member) => {
  JoinRole.run(client, member);
});

export function startClient() {
  client.loginBot(process.env.BOT_TOKEN as string).catch((error) => {
    console.error("Failed to login:", error);
  });
}

export default Client;