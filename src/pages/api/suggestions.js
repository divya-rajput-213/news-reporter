import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'No query provided' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ API key is missing' });
  }

  try {
    // Initialize ChatGroq model with the Llama model and set temperature
    const model = new ChatGroq({
      model: "llama-3.3-70b-versatile", // Specify the model to use
      temperature: 0, // Set temperature to 0 for more deterministic responses
      openAIApiKey: GROQ_API_KEY,
    });

    // Generate suggestions using ChatGroq by providing a system and user message
    const response = await model.call([
      new SystemMessage("You are a helpful assistant that provides only relevant search suggestions without additional context or interpretation. Provide suggestions related to the query."),
      new HumanMessage(`Query: ${query}`)
    ]);

    // Extract the suggestions text from the response and split them into an array
    const suggestionsText = response.content || '';
    const suggestions = suggestionsText.split('\n').filter(suggestion => suggestion.trim());

    // Return suggestions to the frontend
    res.status(200).json({ suggestions });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
}
