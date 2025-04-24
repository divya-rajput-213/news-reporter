// src/pages/api/news.js
export default async function handler(req, res) {
    const { query = '', count = 10 } = req.query;
    
    // Load API key from environment variables
    const WORLD_NEWS_API_KEY = "4f49e902b3a3d131b0d43204f1868cff"
    
    if (!WORLD_NEWS_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    try {
      const url = `https://gnews.io/api/v2/search?q=${encodeURIComponent(query)}&token=${WORLD_NEWS_API_KEY}&lang=en&max=${count}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`News API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ error: 'Failed to fetch news' });
    }
  }