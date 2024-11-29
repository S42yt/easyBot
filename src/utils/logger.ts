import dotenv from 'dotenv';

dotenv.config();

class Logger {
    constructor() {}

    public async log(message: string, logToConsole: boolean = false) {
        if (logToConsole) {
            console.log(message);
        }
    }

    public async info(message: string, logToConsole: boolean = false) {
        const infoMessage = `Info: ${message}`;
        if (logToConsole) {
            console.info(message);
        }
    }

    public async error(message: string, error?: any, logToConsole: boolean = false) {
        const errorMessage = `Error: ${message}` + (error ? ` - ${error}` : '');
        if (logToConsole) {
            console.error(errorMessage);
        }
    }

    public async warn(message: string, logToConsole: boolean = false) {
        const warningMessage = `Warning: ${message}`;
        if (logToConsole) {
            console.warn(warningMessage);
        }
    }

    public async logMessage(messageContent: string, author: string, channel: string, logToConsole: boolean = false) {
        const maxFieldLength = 1024;
        const truncatedMessage = messageContent && messageContent.length > maxFieldLength
            ? messageContent.substring(0, maxFieldLength - 3) + '...'
            : messageContent || 'No content';

        const authorValue = author || 'Unknown';
        const channelValue = channel || 'Unknown';

        const logMessage = `Logged Message:\nAuthor: ${authorValue}\nChannel: ${channelValue}\nMessage: ${truncatedMessage}`;

        if (logToConsole) {
            console.log(logMessage);
        }
    }

    public async logMessageEdit(oldMessageContent: string, newMessageContent: string, author: string, channel: string, logToConsole: boolean = false) {
        const maxFieldLength = 1024;
        const truncatedOldMessage = oldMessageContent && oldMessageContent.length > maxFieldLength
            ? oldMessageContent.substring(0, maxFieldLength - 3) + '...'
            : oldMessageContent || 'No content';
        const truncatedNewMessage = newMessageContent && newMessageContent.length > maxFieldLength
            ? newMessageContent.substring(0, maxFieldLength - 3) + '...'
            : newMessageContent || 'No content';

        const authorValue = author || 'Unknown';
        const channelValue = channel || 'Unknown';

        const logMessage = `Message Edited:\nAuthor: ${authorValue}\nChannel: ${channelValue}\nOld Message: ${truncatedOldMessage}\nNew Message: ${truncatedNewMessage}`;

        if (logToConsole) {
            console.log(logMessage);
        }
    }

    public async logMessageDelete(messageContent: string, author: string, channel: string, executor?: string, logToConsole: boolean = false) {
        const maxFieldLength = 1024;
        const truncatedMessage = messageContent && messageContent.length > maxFieldLength
            ? messageContent.substring(0, maxFieldLength - 3) + '...'
            : messageContent || 'No content';

        const authorValue = author || 'Unknown';
        const channelValue = channel || 'Unknown';
        const executorValue = executor || 'Unknown';

        const logMessage = `Message Deleted:\nAuthor: ${authorValue}\nChannel: ${channelValue}\nMessage: ${truncatedMessage}\nDeleted by: ${executorValue}`;

        if (logToConsole) {
            console.log(logMessage);
        }
    }

    public async logSlashCommand(interaction: any) {
        if (interaction.isCommand()) {
            const commandName = interaction.commandName;
            const user = interaction.user.tag;
            const channel = interaction.channel?.id;
            if (channel) {
                await this.logMessage(`Slash command executed: ${commandName}`, user, channel, true);
            } else {
                console.warn('Channel not found for interaction.');
            }
        }
    }
}

export default Logger;