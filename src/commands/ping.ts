import { Message } from "revolt.js";
import Logger from "../utils/logger";
import EmbedBuilder from "../types/embedType";

const pingCommand = {
  name: "ping",
  execute: async (message: Message, args: string[]) => {
    const logger = new Logger();

    try {
      const embed = new EmbedBuilder()
        .setTitle("Pong!")
        .setDescription("This is a response to the ping command.")
        .setColour("#00FF00");

      await message.channel?.sendMessage({ embeds: [embed.build()] });
      await logger.log(`Executed 'ping' command by ${message.author?.username}`, false);
    } catch (error: any) {
      await logger.error(`Failed to execute 'ping' command: ${error.message}`, error, true);
    }
  }
};

export default pingCommand;