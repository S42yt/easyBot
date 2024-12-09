import { Client, Message, VoiceState } from 'revolt.js';
import { addExperience } from './database/utils/levelSystem';

const client = new Client();

client.on('message', async (message: Message) => {
    if (message.author?.bot) return; // Ignore bots

    const userId = message.author?.id;
    if (userId) {
        await addExperience(userId, 1); // Add 1 XP per message
    }
});


client.on('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {
    if (newState.user?.bot) return; 

    const userId = newState.user?.id;
    if (userId) {
        const timeSpent = 5; 
        await addExperience(userId, timeSpent);
    }
});