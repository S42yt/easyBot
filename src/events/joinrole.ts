import { Client, ServerMember } from 'revolt.js';
import { ClientEvent } from '../types/clientEvent';
import Logger from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

class JoinRole implements ClientEvent {
    name = 'serverMemberJoin';
    description = 'Assigns a role to new users when they join the server.';

    async run(client: Client, member: ServerMember) {
        const logger = new Logger();
        logger.log('Running joinRole event', true);
        try {
            const joinRoleId = process.env.JOIN_ROLE!;
            logger.log(`Fetched join role ID: ${joinRoleId}`, true);

            await member.edit({ roles: [...member.roles, joinRoleId] });
            logger.log(`Assigned role ${joinRoleId} to user ${member.displayName}`, true);
        } catch (error) {
            logger.error(`Error assigning role: ${(error as Error).message}`, error, true);
        }
    }
}

export default new JoinRole();