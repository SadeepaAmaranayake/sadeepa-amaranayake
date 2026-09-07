const { GoogleGenAI } = require("@google/genai");

const MAX_MESSAGE_LENGTH = 1000;

function getSources(interaction) {
  return [
    ...new Set(
      (interaction.steps || [])
        .filter((step) => step.type === "model_output")
        .flatMap((step) => step.content || [])
        .filter((content) => content.type === "text")
        .flatMap((content) => content.annotations || [])
        .filter((annotation) => annotation.type === "file_citation")
        .map((annotation) => annotation.file_name)
        .filter(Boolean),
    ),
  ];
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  const message = request.body?.message?.trim();

  if (!message) {
    return response.status(400).json({ error: "A message is required." });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return response.status(400).json({
      error: `The message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const fileSearchStore = process.env.GEMINI_FILE_SEARCH_STORE;
  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";

  if (!apiKey || !fileSearchStore) {
    console.error("Missing Gemini environment variables.");
    return response.status(500).json({
      error: "The portfolio assistant is not configured.",
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.interactions.create({
      model,
      system_instruction: `
You are Sadeepa Amaranayake's portfolio assistant.

Answer using only information retrieved from the portfolio knowledge base.
Do not invent skills, experience, employers, dates, qualifications, project
results, or personal information.

If the knowledge base does not contain the answer, clearly say that the
information is not available.

Politely refuse questions unrelated to Sadeepa's portfolio.
Keep answers concise, factual, and in plain text.
      `.trim(),
      input: message,
      tools: [
        {
          type: "file_search",
          file_search_store_names: [fileSearchStore],
        },
      ],
    });

    return response.status(200).json({
      answer:
        result.output_text ||
        "The assistant could not find an answer in the knowledge base.",
      sources: getSources(result),
    });
  } catch (error) {
    console.error("Gemini request failed:", error.status, error.message);

    if (error.status === 429) {
      return response.status(429).json({
        error: "The assistant has reached its temporary usage limit.",
      });
    }

    return response.status(500).json({
      error: "The assistant could not generate a response.",
    });
  }
};
