import { ServerMember } from 'revolt.js';

interface EasyCommandPerms {
    commandName: string;
    allowedUsers: Set<string>;
    allowedRoles: Set<string>;
}

class EasyPermManager {
    private permissions: Map<string, EasyCommandPerms>;

    constructor() {
        this.permissions = new Map();
    }

    // Add a new permission for a command
    addPermission(commandName: string, userId: string) {
        if (!this.permissions.has(commandName)) {
            this.permissions.set(commandName, { commandName, allowedUsers: new Set(), allowedRoles: new Set() });
        }
        this.permissions.get(commandName)?.allowedUsers.add(userId);
    }

    // Remove a permission for a command
    removePermission(commandName: string, userId: string) {
        this.permissions.get(commandName)?.allowedUsers.delete(userId);
    }

    // Allow a role to use a command
    allowRole(commandName: string, roleId: string) {
        if (!this.permissions.has(commandName)) {
            this.permissions.set(commandName, { commandName, allowedUsers: new Set(), allowedRoles: new Set() });
        }
        this.permissions.get(commandName)?.allowedRoles.add(roleId);
    }

    // Check if a user has permission to use a command
    hasPermission(commandName: string, userId: string, member: ServerMember): boolean {
        const commandPermission = this.permissions.get(commandName);
        if (!commandPermission) return false;

        // Check if the user is directly allowed
        if (commandPermission.allowedUsers.has(userId)) return true;

        // Check if the user has a role that is allowed
        for (const roleId of commandPermission.allowedRoles) {
            if (member.roles.includes(roleId)) return true;
        }

        return false;
    }

    // Initialize permissions (for example purposes)
    static init(): EasyPermManager {
        const permissionManager = new EasyPermManager();
        // Example: Only user with userID '123456' can use the 'ban' command
        permissionManager.addPermission('ban', '123456');
        // Example: Any user can use the 'ping' command (empty set means no restrictions)
        return permissionManager;
    }
}

export { EasyCommandPerms, EasyPermManager };