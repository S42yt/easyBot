import { Client, ServerMember} from "revolt.js";
import JoinRole from "./events/joinrole";
import updateMemberCountChannel from "./events/channelUpdate";
import userLeave from "./events/userLeave";
import dotenv from "dotenv";
import { saveUserData } from './database/utils/user';
import { getUserLevel, addExperience } from './database/utils/levelSystem';
import Logger from './utils/logger';

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not defined in the .env file");
}

if (!process.env.SERVER_ID) {
  throw new Error("SERVER_ID is not defined in the .env file");
}

let client = new Client();

const logger = new Logger();

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

    const user = await getUserLevel(member.user.id);

    if (!user) {
      const newUser = {
        userId: member.user.id,
        username: member.user.username,
        discriminator: member.user.discriminator,
        avatar: typeof member.user.avatar === 'string' ? member.user.avatar : '',
        createdAt: new Date(member.user.createdAt),
        experience: 0,
        level: 1
      };

      await addExperience(newUser.userId, 0); 
      await saveUserData(newUser); 
      logger.info(`Initialized new user ${newUser.username} with ID ${newUser.userId}`, true);
    } else {
      user.username = member.user.username;
      user.discriminator = member.user.discriminator;
      user.avatar = typeof member.user.avatar === 'string' ? member.user.avatar : '';
      user.createdAt = new Date(member.user.createdAt);

      await saveUserData(user); 
      logger.info(`Retrieved existing user ${user.username} with ID ${user.userId}`, true);
    }
  }

  console.log('All members have been registered.');
});

client.on('serverMemberJoin', (member) => {
  JoinRole.run(client, member);
});

client.on('serverMemberLeave', (member) => {
  userLeave.run(client, member as unknown as ServerMember);
});

updateMemberCountChannel(client);

export function startClient() {
  client.loginBot(process.env.BOT_TOKEN as string).catch((error) => {
    console.error("Failed to login:", error);
  });
}

export default Client;
