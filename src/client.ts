import { Client } from "revolt.js";
import JoinRole from "./events/joinrole";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not defined in the .env file");
}

let client = new Client();

client.on("ready", async () =>
  console.info(`Logged in as ${client.user?.username}!`)
);


client.on('serverMemberJoin', (member) => {
  JoinRole.run(client, member);
});


  
export function startClient() {
  client.loginBot(process.env.BOT_TOKEN as string).catch((error) => {
    console.error("Failed to login:", error);
  });
}





export default Client;
