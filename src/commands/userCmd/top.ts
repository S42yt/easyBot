import { Message } from 'revolt.js';
import Logger from '../../utils/logger';
import { getTopUsers } from '../../utils/levelSystem';
import EmbedBuilder from '../../types/easyEmbed';

const topCommand = {
    name: 'top',
    reply: true,
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();
        const page = parseInt(args[0]) || 1;

        try {
            const topUsers = await getTopUsers(page);
            if (topUsers.length === 0) {
                throw new Error('Page not found');
            }

            const embed = new EmbedBuilder()
                .setTitle(`Top Users - Page ${page}`)
                .setDescription(topUsers.map((user, index) => `${index + 1}. ${user.userId} - Level: ${user.level}, XP: ${user.experience}`).join('\n'))
                .setColour('#00FF00');

            await message.reply({ embeds: [embed.build()] });
        } catch (error: any) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(error.message)
                .setColour('#FF0000');

            await message.reply({ embeds: [errorEmbed.build()] });
            await logger.error(`Failed to execute 'top' command: ${error.message}`, error, true);
        }
    }
};

export default topCommand;