import { Message } from "revolt.js";
import Logger from "../utils/logger";
import EmbedBuilder from "../types/embedType";

const pingCommand = {
  name: "ping",
  execute: async (message: Message, args: string[]) => {
    const logger = new Logger();
    const startTime = Date.now();

    try {
      const embed = new EmbedBuilder()
        .setTitle("Pong!")
        .setDescription("Calculating latency...")
        .setColour("#fcdb03");

      const sentMessage = await message.channel?.sendMessage({ embeds: [embed.build()] });
      const latency = Date.now() - startTime;

      const updatedEmbed = new EmbedBuilder()
        .setTitle("Pong!")
        .setDescription(`Latency: ${latency}ms`)
        .setColour("#03fc1c");

      await sentMessage?.edit({ embeds: [updatedEmbed.build()] });
      await logger.log(`Executed 'ping' command by ${message.author?.username}`, true);
    } catch (error: any) {
      await logger.error(`Failed to execute 'ping' command: ${error.message}`, error, true);

        const errorEmbed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription("Failed to calculate latency.")
            .setColour("#fc0303");
    }
  }
};

export default pingCommand;