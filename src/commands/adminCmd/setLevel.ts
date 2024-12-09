import { Message } from 'revolt.js';
import  connectToCollection  from '../../utils/levelSystem';
import Logger from '../../utils/logger';
import EmbedBuilder from '../../types/easyEmbed';
import { EasyPermManager } from '../../types/easyPermissons';
import dotenv from 'dotenv';

dotenv.config();

const setLevelCommand = {
    name: 'setLevel',
    reply: true,
    execute: async (message: Message, args: string[]) => {
        const logger = new Logger();
        const userId = args[0];
        const amount = parseInt(args[1]);

        const adminRoleId = process.env.ADMIN_ROLE;
        if (!adminRoleId) {
            throw new Error('ADMIN_ROLE is not defined in the environment.');
        }

        const member = message.member;
        const permissionManager = EasyPermManager.init();
        permissionManager.allowRole('setLevel', adminRoleId);

        if (!message.author || !member || !permissionManager.hasPermission('setLevel', message.author.id, member)) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('You do not have permission to use this command.')
                .setColour('#FF0000');
            await message.reply({ embeds: [errorEmbed.build()] });
            return;
        }

        if (!userId || isNaN(amount)) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('Invalid arguments. Usage: !setLevel <user> <amount>')
                .setColour('#FF0000');
            await message.reply({ embeds: [errorEmbed.build()] });
            return;
        }

        try {
            const collection = await connectToCollection();
            await collection.updateOne({ userId }, { $set: { level: amount } });

            const successEmbed = new EmbedBuilder()
                .setTitle('Success')
                .setDescription(`Set level of user ${userId} to ${amount}`)
                .setColour('#00FF00');
            await message.reply({ embeds: [successEmbed.build()] });
        } catch (error: any) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription(error.message)
                .setColour('#FF0000');
            await message.reply({ embeds: [errorEmbed.build()] });
            await logger.error(`Failed to execute 'setLevel' command: ${error.message}`, error, true);
        }
    }
};

export default setLevelCommand;