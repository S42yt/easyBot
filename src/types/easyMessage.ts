import { Message } from 'revolt.js';

interface EasyMessage extends Message {
    customProperty?: string;
    customMethod?(): void;
    deleteMessage(): Promise<void>;
}

const deleteMessage = async (message: EasyMessage) => {
    try {
        await message.delete();
        console.log(`Message ${message} deleted successfully`);
    } catch (error) {
        console.error(`Failed to delete message ${message}:`, error);
    }
};

export {   EasyMessage, deleteMessage };