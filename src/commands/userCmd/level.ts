import { Message } from 'revolt.js';
import Logger from '../../utils/logger';
import { getUserLevel } from '../../database/utils/levelSystem';
import EmbedBuilder from '../../types/easyEmbed';

const levelCommand = {
    name: 'level',
    reply: true,
    execute: async (message: Message) => {
        const logger = new Logger();

        try {
            const userId = message.author?.id;
            if (!userId) {
                throw new Error('User ID not found.');
            }

            const user = await getUserLevel(userId);
            if (!user) {
                throw new Error('User not found in the database.');
            }

            const currentLevel = user.level;
            const currentXP = user.experience;
            const nextLevelXP = (currentLevel + 1) * 20; // Example calculation for next level XP
            const xpNeeded = nextLevelXP - currentXP;

            const embed = new EmbedBuilder()
                .setTitle('Your Level Information')
                .setDescription(`**Level:** ${currentLevel}\n**Current XP:** ${currentXP}\n**XP Needed for Next Level:** ${xpNeeded}`)
                .setColour('#00FF00'); // Green color for the embed

            await message.reply({ embeds: [embed.build()] });
            await logger.log(`Executed 'level' command by ${message.author?.username}`, true);
        } catch (error: any) {
            await logger.error(`Failed to execute 'level' command: ${error.message}`, error, true);

            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('Failed to retrieve level information.')
                .setColour('#FF0000'); // Red color for error

            await message.reply({ embeds: [errorEmbed.build()] });
        }
    }
};

export default levelCommand;