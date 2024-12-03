import { Message } from 'revolt.js';
import Logger from '../utils/logger';
import EmbedBuilder from '../types/embedType';
import dotenv from 'dotenv';
import { EasyMember, addRoleToMember } from '../types/easyMember';

dotenv.config();

const standartRoleCommand = {
    name: 'standartRole',
    reply: true,
    execute: async (message: Message) => {
        const logger = new Logger();
        const joinRoleId = process.env.JOIN_ROLE;

        if (!joinRoleId) {
            throw new Error('JOIN_ROLE is not defined in the environment.');
        }

        if (!message.server) {
            throw new Error('This command can only be used in a server.');
        }

        const server = message.server;

        // Fetch members in the server
        try {
            const { members } = await server.fetchMembers();

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
            await message.reply({ embeds: [errorEmbed.build()] });
        }
    }
};

export default standartRoleCommand;