import { Server } from 'revolt.js';

export interface memberCount {
    getMemberCount: (server: Server) => Promise<number>;
}

export const memberCounter: memberCount = {
    getMemberCount: async (server: Server) => {
        const { members } = await server.fetchMembers();
        return members.length;
    }
};