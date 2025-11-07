import express from 'express';
import fetch from 'node-fetch'; // or just use global fetch if you're on Node 18+

const router = express.Router();

router.get('/quote', async (req, res) => {
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();
    if (!data || !data[0]) return res.status(500).json({ error: 'No quote found' });

    const { q: quote, a: author } = data[0];
    res.json({ quote, author });
  } catch (err) {
    console.error('Quote fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

export default router;
