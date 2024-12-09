import { Message } from 'revolt.js';
import Logger from '../../utils/logger';
import { getUserLevel } from '../../database/utils/levelSystem';
import EmbedBuilder from '../../types/easyEmbed';

const levelCommand = {
    name: 'level',
    reply: true,
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();
        const userId = args[0] || message.author?.id;

        try {
            const userLevel = await getUserLevel(userId);
            if (!userLevel) {
                throw new Error('User not found');
            }

            const embed = new EmbedBuilder()
                .setTitle(`Level for ${userLevel.username}`)
                .setDescription(`Level: ${userLevel.level}\nExperience: ${userLevel.experience}`)
                .setColour('#00FF00')
                .setIconUrl(userLevel.avatar);

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

export default levelCommand;