import { Client } from "revolt.js";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not defined in the .env file");
}

let client = new Client();

client.on("ready", async () =>
  console.info(`Logged in as ${client.user?.username}!`)
);

client.on("messageCreate", async (message) => {
  if (message.content === "pic") {
    message.channel?.sendMessage("sensin pic oruspu çocuğu seni embesis ayri");
  }
});

client.loginBot(process.env.BOT_TOKEN as string).catch((error) => {
  console.error("Failed to login:", error);
});

export default client;
