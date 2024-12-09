import { Client, ServerMember } from 'revolt.js';
import { ClientEvent } from '../types/easyClientEvent';
import Logger from '../utils/logger';
import dotenv from 'dotenv';
import { saveUserData } from '../database/utils/user';

dotenv.config();

class JoinRole implements ClientEvent {
    name = 'JoinRole';
    description = 'Assigns a role to new users when they join the server.';

    async run(client: Client, member: ServerMember) {
        const logger = new Logger();
        logger.log('Running joinRole event', true);

        try {
            const roleId = process.env.JOIN_ROLE;
            if (!roleId) {
                throw new Error('JOIN_ROLE is not defined in the environment.');
            }

            if (!member.user) {
                throw new Error('Member user is undefined.');
            }

            const user = {
                userId: member.user.id,
                username: member.user.username,
                discriminator: member.user.discriminator,
                avatar: typeof member.user.avatar === 'string' ? member.user.avatar : '',
                createdAt: new Date(member.user.createdAt),
                experience: 0,
                level: 1
            };

            await saveUserData(user);

            if (!member.roles.includes(roleId)) {
                // Use the edit method to add the role
                await member.edit({
                    roles: [...member.roles, roleId]
                });
                logger.info(`Assigned role ${roleId} to user ${member.displayName}`, true);
            } else {
                logger.warn(`User ${member.displayName} already has the role ${roleId}`, true);
            }
        } catch (error) {
            logger.error(`Error assigning role: ${(error as Error).message}`, error, true);
        }
    }
}

export default new JoinRole();
