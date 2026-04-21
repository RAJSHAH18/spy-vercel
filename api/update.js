import { Redis } from '@upstash/redis';

// This version checks for BOTH 'KV' and 'UPSTASH' variable names
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        if (req.method === 'POST') {
            const data = req.body;
            await redis.set('game_state', data);
            return res.status(200).json({ success: true });
        } 

        if (req.method === 'GET') {
            const state = await redis.get('game_state');
            return res.status(200).json(state || {});
        }
    } catch (error) {
        // This will tell us EXACTLY what is wrong in the browser
        return res.status(500).json({ 
            error: "Redis Connection Failed",
            details: error.message 
        });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}