import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('MONGODB_URI is not defined');
}

const client = new MongoClient(uri);
let dbInstance: Db | null = null;

async function connectToDatabase(): Promise<Db> {
    if (dbInstance) {
        return dbInstance;
    }

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        dbInstance = client.db('easyBotDB');
        return dbInstance;
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        throw error;
    }
}

export { connectToDatabase };