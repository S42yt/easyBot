import { Client, ServerMember } from 'revolt.js';
import { ClientEvent } from '../types/easyClientEvent';
import { getUserData, deleteUserData } from '../database/utils/user';
import Logger from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

class UserLeave implements ClientEvent {
    name = 'userLeave';
    description = 'Deletes user data from the database when they leave, get kicked, or get banned.';

    async run(client: Client, member: ServerMember) {
        const logger = new Logger();
        logger.info(`Running userLeave event for user ${member.user?.username}`, true);

        try {
            if (!member.user) {
                throw new Error('Member user is undefined.');
            }

            // Fetch user data from the database
            const userData = await getUserData({ userId: member.user.id });
            if (!userData) {
                logger.info(`No data found for user ${member.user.username} with ID ${member.user.id}`, true);
                return;
            }

            logger.info(`Fetched data for user ${member.user.username}: ${JSON.stringify(userData)}`, true);

            // Delete user data from the database
            await deleteUserData(member.user.id);
            logger.info(`Deleted data for user ${member.user.username} with ID ${member.user.id}`, true);
        } catch (error) {
            logger.error(`Error deleting user data: ${(error as Error).message}`, error, true);
        }
    }
}

export default new UserLeave();