import { ServerMember } from 'revolt.js';
import Logger from '../utils/logger';

const logger = new Logger();

interface EasyMember extends ServerMember {
    addRole: (roleId: string) => Promise<void>;
    removeRole: (roleId: string) => Promise<void>;
    hasRole: (roleId: string) => boolean;
    kick: () => Promise<void>;
    ban: () => Promise<void>;
    unban: () => Promise<void>;
}

// Example implementations of the methods
const addRoleToMember = async (member: EasyMember, roleId: string) => {
    try {
        await member.addRole(roleId);
        logger.info(`Role ${roleId} added to member ${member.displayName}`);
    } catch (error) {
        logger.error(`Failed to add role ${roleId} to member ${member.displayName}:`, error);
    }
};

const removeRoleFromMember = async (member: EasyMember, roleId: string) => {
    try {
        await member.removeRole(roleId);
        logger.info(`Role ${roleId} removed from member ${member.displayName}`);
    } catch (error) {
        logger.error(`Failed to remove role ${roleId} from member ${member.displayName}:`, error);
    }
};

const hasRole = (member: EasyMember, roleId: string): boolean => {
    return member.roles.includes(roleId);
};

const kickMember = async (member: EasyMember) => {
    try {
        await member.kick();
        logger.info(`Member ${member.displayName} kicked`);
    } catch (error) {
        logger.error(`Failed to kick member ${member.displayName}:`, error);
    }
};

const banMember = async (member: EasyMember) => {
    try {
        await member.ban();
        logger.info(`Member ${member.displayName} banned`);
    } catch (error) {
        logger.error(`Failed to ban member ${member.displayName}:`, error);
    }
};

const unbanMember = async (member: EasyMember) => {
    try {
        await member.unban();
        logger.info(`Member ${member.displayName} unbanned`);
    } catch (error) {
        logger.error(`Failed to unban member ${member.displayName}:`, error);
    }
};

export { EasyMember, addRoleToMember, removeRoleFromMember, hasRole, kickMember, banMember, unbanMember };