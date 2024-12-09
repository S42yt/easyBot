import { Message } from 'revolt.js';
import Logger from '../../utils/logger';
import { getUserLevel } from '../../utils/levelSystem';
import EmbedBuilder from '../../types/easyEmbed';

const levelCommand = {
    name: 'level',
    reply: true,
    execute: async (message: Message) => {
        const logger = new Logger();
        const userId = message.author?.id;

        if (!userId) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('Could not determine the user.')
                .setColour('#FF0000');
            const errorMessage = await message.reply({ embeds: [errorEmbed.build()] });
            setTimeout(async () => {
                try {
                    if (errorMessage) {
                        await errorMessage.delete();
                    }
                    if (message) {
                        await message.delete();
                    }
                } catch (error: any) {
                    await logger.error(`Error deleting messages: ${error.message}`, true);
                }
            }, 3000);
            return;
        }

        try {
            logger.info(`Fetching level for user ID: ${userId}`);
            const userLevel = await getUserLevel(userId);
            if (!userLevel) {
                throw new Error('User not found');
            }

            const embed = new EmbedBuilder()
                .setTitle(`Your Level`)
                .setDescription(`Level: ${userLevel.level}\nExperience: ${userLevel.experience}`)
                .setColour('#00FF00');

            await message.reply({ embeds: [embed.build()] });
        } catch (error: any) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(error.message)
                .setColour('#FF0000');
            const errorMessage = await message.reply({ embeds: [errorEmbed.build()] });
            setTimeout(async () => {
                try {
                    if (errorMessage) {
                        await errorMessage.delete();
                    }
                    if (message) {
                        await message.delete();
                    }
                } catch (error: any) {
                    await logger.error(`Error deleting messages: ${error.message}`, true);
                }
            }, 3000);
            await logger.error(`Failed to execute 'level' command: ${error.message}`, error, true);
        }
    }
};

export default levelCommand;