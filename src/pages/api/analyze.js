// pages/api/analyze.ts

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, content, url } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'AI API key not configured' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an expert news analyst. Analyze the given news article and provide: 1) A concise summary (2-3 sentences), 2) Key insights or implications, 3) Potential biases or perspectives to consider, 4) Related context the reader should know. Format with clear headings.'
          },
          {
            role: 'user',
            content: `Title: ${title}\n\nContent: ${content}\n\nURL: ${url}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json({
      analysis: data.choices[0].message.content
    });
  } catch (error) {
    console.error('🔥 Error analyzing article:', error);
    res.status(500).json({ error: 'Failed to analyze article' });
  }
}
