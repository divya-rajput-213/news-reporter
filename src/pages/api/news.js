export default async function handler(req, res) {
  const { query = '', count = 10 } = req.query;

  const WORLD_NEWS_API_KEY = process.env.WORLD_NEWS_API_KEY;

  if (!WORLD_NEWS_API_KEY) {
    return res.status(500).json({ error: 'Missing WORLD_NEWS_API_KEY' });
  }

  try {
    // Construct the URL to fetch news articles from the GNews API
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&token=${WORLD_NEWS_API_KEY}&lang=en&max=${count}`;
    
    // Fetch news data from the GNews API
    const response = await fetch(url);
    
    // Parse the response into JSON
    const data = await response.json();

    // Check if articles are present in the response
    if (!data.articles) {
      return res.status(400).json({ error: 'No articles found.' });
    }

    // Return the articles in the response
    res.status(200).json({ articles: data.articles });
  } catch (error) {
    console.error("🔥 News fetch error:", error);
    res.status(500).json({ error: "Failed to fetch or process news." });
  }
}
