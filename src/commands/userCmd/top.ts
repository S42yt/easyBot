import { Message } from 'revolt.js';
import Logger from '../../utils/logger';
import { getTopUsers } from '../../database/utils/levelSystem';
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
                .setDescription(topUsers.map((user, index) => `${index + 1}. ${user.username} - Level: ${user.level}, XP: ${user.experience}`).join('\n'))
                .setColour('#00FF00');

            await message.reply({ embeds: [embed.build()] });
        } catch (error: any) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(error.message)
                .setColour('#FF0000');

            const replyMessage = await message.reply({ embeds: [errorEmbed.build()] });

            setTimeout(async () => {
                try {
                    if (replyMessage) {
                        await replyMessage.delete();
                    }
                    if (message) {
                        await message.delete();
                    }
                } catch (error: any) {
                    await logger.error(`Error deleting messages: ${error.message}`, true);
                }
            }, 3000);
        }
    }
};

export default topCommand;