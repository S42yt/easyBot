import { Message } from 'revolt.js';
import Logger from '../../utils/logger';
import EmbedBuilder from '../../types/easyEmbed';
import dotenv from 'dotenv';
import { EasyMember, addRoleToMember } from '../../types/easyMember';
import { EasyPermManager } from '../../types/easyPermissons';

dotenv.config();

const standartRoleCommand = {
    name: 'standartRole',
    reply: true,
    execute: async (message: Message) => {
        const logger = new Logger();
        const joinRoleId = process.env.JOIN_ROLE;
        const adminRoleId = process.env.ADMIN_ROLE; // Assuming ADMIN_ROLE is defined in the environment

        if (!joinRoleId) {
            throw new Error('JOIN_ROLE is not defined in the environment.');
        }

        if (!adminRoleId) {
            throw new Error('ADMIN_ROLE is not defined in the environment.');
        }

        // Check if the user has the admin role
        const member = message.member as EasyMember;
        const permissionManager = EasyPermManager.init();
        permissionManager.allowRole('standartRole', adminRoleId);

        if (!message.author || !permissionManager.hasPermission('standartRole', message.author.id, member)) {
            const embed = new EmbedBuilder()
                .setTitle('Permission Denied')
                .setDescription('You don\'t have permission to use this command.')
                .setColour('#FF0000'); // Red color for error

            const replyMessage = await message.reply({ embeds: [embed.build()] });

            // Delete the error message and the user's message after 3 seconds
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

            return;
        }

        // Fetch members in the server
        try {
            if (!message.server) {
                throw new Error('Server is not defined in the message.');
            }
            const { members } = await message.server.fetchMembers();

            const embed = new EmbedBuilder()
                .setTitle('Assigning Standard Role')
                .setDescription('Assigning the role to all online members in the server...')
                .setColour('#00FF00');

            await message.reply({ embeds: [embed.build()] });

            let assignedCount = 0;  // Counter for successfully assigned roles

            for (const member of members) {
                // Only assign the role if the member doesn't already have the role
                if (!member.roles.includes(joinRoleId)) {
                    await addRoleToMember(member as EasyMember, joinRoleId); // Add the role to the member
                    assignedCount++;
                    logger.info(`Assigned role ${joinRoleId} to user ${member.displayName}`, true);
                }
            }

            // Success Embed
            const successEmbed = new EmbedBuilder()
                .setTitle('Role Assignment Complete')
                .setDescription(`The role has been assigned to ${assignedCount} online members in the server.`)
                .setColour('#00FF00');
            await message.reply({ embeds: [successEmbed.build()] });

        } catch (error) {
            // Handle errors and reply with an error message
            logger.error(`Error assigning role: ${(error as Error).message}`, error, true);

            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('There was an error assigning the role to all online members.')
                .setColour('#FF0000');
            const replyMessage = await message.reply({ embeds: [errorEmbed.build()] });

            // Delete the error message and the user's message after 3 seconds
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

export default standartRoleCommand;