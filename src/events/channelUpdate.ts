import { Client, ServerMember, Channel } from 'revolt.js';
import Logger from '../utils/logger';
import { memberCounter } from '../types/easyMemberCounter';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client();
const logger = new Logger();

const updateMemberCountChannel = async (client: Client) => {
    client.on('serverMemberJoin', async (member: ServerMember) => {
        try {
            const server = (member as ServerMember).server;
            if (!server) {
                throw new Error('Server is undefined');
            }
            const count = await memberCounter.getMemberCount(server);
            const channelName = `👤•Members: ${count}`;

            const userCountChannel: Channel | undefined = server.channels.find((channel: Channel) => channel.name.startsWith('👤•'));
            if (userCountChannel) {
                await userCountChannel.edit({ name: channelName });
                await logger.info(`Updated channel ${userCountChannel.name} to ${channelName} after member joined`, true);
            }
        } catch (error: any) {
            await logger.error(`Failed to update member count channel on member join: ${error.message}`, true);
        }
    });

    client.on('serverMemberLeave', async (user) => {
        try {
            // Fetch the server where the user left
            const server = await client.servers.fetch(process.env.SERVER_ID!); // Replace with your server ID
            if (!server) {
                throw new Error('Server is undefined');
            }
            
            // Get the updated member count
            const count = await memberCounter.getMemberCount(server);
            const channelName = `👤•Members: ${count}`;
    
            // Find the channel to update
            const userCountChannel: Channel | undefined = server.channels.find(
                (channel: Channel) => channel.name.startsWith('👤•Members:')
            );
    
            if (userCountChannel) {
                await userCountChannel.edit({ name: channelName });
                await logger.info(`Updated channel ${userCountChannel.name} to ${channelName} after member left`, true);
            }
        } catch (error: any) {
            await logger.error(`Failed to update member count channel on member leave: ${error.message}`, true);
        }
    })};
    
export default updateMemberCountChannel;