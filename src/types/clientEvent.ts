import { Client } from 'revolt.js';

// Define the ClientEvent interface
export interface ClientEvent {
    name: string; // Event name as a string
    description: string; 
    run: (client: Client, ...args: any[]) => Promise<void>; // Event handler function with client and event arguments
}

export default ClientEvent;