import { Message } from 'revolt.js';

interface MessageType extends Message {
    // Add any additional properties or methods here
    customProperty?: string;
    customMethod?(): void;
}

export default MessageType;