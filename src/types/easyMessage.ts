import { Message, User, ServerMember } from 'revolt.js';

interface EasyMessage extends Message {
    client: {
        users: {
            get: (id: string) => User | undefined;
        };
    };
    customProperty?: string;
    customMethod?(): void;
    customAuthor?: User;
    customMember?: ServerMember;
    deleteMessage(): Promise<void>;
    hydrateMessage(): void;
}

const deleteMessage = async (message: EasyMessage) => {
    try {
        await message.delete();
        console.log(`Message ${message.id} deleted successfully`);
    } catch (error) {
        console.error(`Failed to delete message ${message.id}:`, error);
    }
};

const hydrateMessage = (message: EasyMessage) => {
    try {
        if (!message.customAuthor) {
            message.customAuthor = message.authorId ? message.client.users.get(message.authorId) as User : undefined;
            if (!message.customAuthor) {
                console.warn('Skipping key user during hydration!');
            }
        }

        if (!message.customMember) {
            message.customMember = message.member as ServerMember;
            if (!message.customMember) {
                console.warn('Skipping key member during hydration!');
            }
        }
    } catch (error) {
        console.error(`Failed to hydrate message ${message.id}:`, error);
    }
};

export { EasyMessage, deleteMessage, hydrateMessage };