export type ChannelPermission = 'ViewChannel' | 'VoiceConnect' | 'SendMessages' | 'ManageChannel' | 'ManagePermissions';

export interface EasyChannelPermissions {
    role: string;
    allow: ChannelPermission[];
    deny: ChannelPermission[];
}

export class EasyChannelPermManager {
    private permissions: EasyChannelPermissions[] = [];

    public addPermission(role: string, allow: ChannelPermission[] = [], deny: ChannelPermission[] = []): void {
        const existingPermission = this.permissions.find(perm => perm.role === role);
        if (existingPermission) {
            existingPermission.allow = [...new Set([...existingPermission.allow, ...allow])];
            existingPermission.deny = [...new Set([...existingPermission.deny, ...deny])];
        } else {
            this.permissions.push({ role, allow, deny });
        }
    }

    public getPermissions(): EasyChannelPermissions[] {
        return this.permissions;
    }

    public clearPermissions(): void {
        this.permissions = [];
    }
}

export default EasyChannelPermManager;