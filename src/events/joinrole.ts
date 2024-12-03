import { Client, ServerMember } from 'revolt.js';
import { ClientEvent } from '../types/easyClientEvent';
import Logger from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

class JoinRole implements ClientEvent {
    name = 'JoinRole';
    description = 'Assigns a role to new users when they join the server.';

    async run(client: Client, member: ServerMember) {
        const logger = new Logger();
        logger.log('Running joinRole event', true);

        try {
            // Ensure that JOIN_ROLE is defined in the environment file
            const roleId = process.env.JOIN_ROLE;

            if (!roleId) {
                throw new Error('JOIN_ROLE is not defined in the environment.');
            }

            // Check if the member's roles array is defined, if not, initialize it
            const currentRoles = member.roles || [];

            // Check if the member already has the role
            if (!currentRoles.includes(roleId)) {
                // Use the addRole method to assign the new role
                 member.orderedRoles?(roleId):[];

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