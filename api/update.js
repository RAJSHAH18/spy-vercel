import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        if (req.method === 'POST') {
            await redis.set('game_state', JSON.stringify(req.body));
            return res.status(200).json({ success: true });
        } 

        if (req.method === 'GET') {
            const state = await redis.get('game_state');
            return res.status(200).json(state ? JSON.parse(state) : {});
        }
    } catch (error) {
        return res.status(500).json({ 
            error: "Redis Connection Failed",
            details: error.message 
        });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}