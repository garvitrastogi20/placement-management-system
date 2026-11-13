const Groq = require("groq-sdk");

let groqClient = null;

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    const error = new Error("GROQ_API_KEY is missing from .env.");
    error.status = 500;
    throw error;
  }

  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  return groqClient;
};

const generateJSON = async ({
  systemPrompt,
  userPrompt,
  temperature = 0.3,
  maxTokens = 3000,
}) => {
  const groq = getGroqClient();

  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    response_format: {
      type: "json_object",
    },
    temperature,
    max_tokens: maxTokens,
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned an empty response.");
  }

  const cleaned = String(content)
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  return JSON.parse(cleaned);
};

module.exports = {
  generateJSON,
};
