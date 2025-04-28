export default async function handler(req, res) {
  const { query = ''} = req.query;

  const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY;

  if (!SERPAPI_API_KEY) {
    return res.status(500).json({ error: 'Missing SERPAPI_API_KEY' });
  }

  try {
    // Build the SerpAPI URL
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&tbm=nws&api_key=${SERPAPI_API_KEY}`;
    
    // Fetch news from SerpAPI
    const response = await fetch(url);
    const data = await response.json();

    if (!data.news_results) {
      return res.status(400).json({ error: 'No news articles found.' });
    }

    // Return only news articles
    res.status(200).json({ articles: data.news_results });
  } catch (error) {
    console.error("🔥 News fetch error from SerpAPI:", error);
    res.status(500).json({ error: "Failed to fetch or process news." });
  }
}
