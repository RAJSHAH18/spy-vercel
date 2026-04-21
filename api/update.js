import { Redis } from '@upstash/redis';

// Vercel automatically injects these if you connected the database
const redis = Redis.fromEnv();

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
        const data = req.body;
        await redis.set('game_state', JSON.stringify(data));
        return res.status(200).json({ success: true });
    } 

    if (req.method === 'GET') {
        const state = await redis.get('game_state');
        return res.status(200).json(state || {});
    }

    return res.status(405).json({ error: 'Method not allowed' });
}