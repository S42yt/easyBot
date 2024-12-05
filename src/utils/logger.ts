import dotenv from 'dotenv';


dotenv.config();

class Logger {
    private static readonly resetColor = '\x1b[0m';
    private ignoredMessages: Set<string>;

    constructor() {
        this.ignoredMessages = new Set();
        this.ignoreLogs([
            'Skipping key user during hydration!',
            'Skipping key member during hydration!'
        ]);
    }

    public async log(message: string, logToConsole: boolean = false) {
        if (this.ignoredMessages.has(message)) return;
        if (logToConsole) {
            console.log(message);
        }
    }

    public async info(message: string, logToConsole: boolean = false) {
        if (this.ignoredMessages.has(message)) return;
        const infoMessage = `Info: ${message}`;
        const greenColor = '\x1b[32m'; // ANSI escape code for green

        if (logToConsole) {
            console.info(`${greenColor}${infoMessage}${Logger.resetColor}`);
        }
    }

    public async error(message: string, error?: any, logToConsole: boolean = false) {
        if (this.ignoredMessages.has(message)) return;
        const errorMessage = `Error: ${message}` + (error ? ` - ${error}` : '');
        const redColor = '\x1b[31m'; // ANSI escape code for red

        if (logToConsole) {
            console.error(`${redColor}${errorMessage}${Logger.resetColor}`);
        }
    }

    public async warn(message: string, logToConsole: boolean = false) {
        if (this.ignoredMessages.has(message)) return;
        const warningMessage = `Warning: ${message}`;
        const yellowColor = '\x1b[33m'; // ANSI escape code for yellow

        if (logToConsole) {
            console.warn(`${yellowColor}${warningMessage}${Logger.resetColor}`);
        }
    }

    public ignoreLogs(messages: string[]) {
        messages.forEach(message => this.ignoredMessages.add(message));
    }
}

export default Logger;