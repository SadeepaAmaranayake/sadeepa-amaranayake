import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 5050;
const vectorStoreId = process.env.OPENAI_VECTOR_STORE_ID;
const openai = new OpenAI();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
  }),
);

app.use(express.json({ limit: "10kb" }));

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
  }),
);

app.get("/api/health", (request, response) => {
  response.json({ status: "ok" });
});

app.post("/api/chat", async (request, response) => {
  const message = request.body?.message?.trim();

  if (!message) {
    return response.status(400).json({
      error: "A message is required.",
    });
  }

  if (message.length > 1000) {
    return response.status(400).json({
      error: "The message must be 1000 characters or fewer.",
    });
  }

  if (!vectorStoreId) {
    return response.status(500).json({
      error: "The knowledge base is not configured.",
    });
  }

  try {
    const result = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      instructions: `
You are Sadeepa Amaranayake's portfolio assistant.

Answer using only information retrieved from the portfolio knowledge base.
Do not invent skills, experience, employers, dates, qualifications, project
results, or personal information.

If the knowledge base does not contain the answer, clearly say that the
information is not available.

Politely refuse questions unrelated to Sadeepa's portfolio.
Keep answers concise and factual.
      `.trim(),
      input: message,
      tools: [
        {
          type: "file_search",
          vector_store_ids: [vectorStoreId],
          max_num_results: 5,
        },
      ],
      include: ["file_search_call.results"],
      max_output_tokens: 500,
    });

    const sources = result.output
      .filter((item) => item.type === "message")
      .flatMap((item) => item.content)
      .filter((content) => content.type === "output_text")
      .flatMap((content) => content.annotations || [])
      .filter((annotation) => annotation.type === "file_citation")
      .map((annotation) => annotation.filename);

    return response.json({
      answer: result.output_text,
      sources: [...new Set(sources)],
    });
  } catch (error) {
    console.error("Chat request failed:", error.status, error.message);

    return response.status(500).json({
      error: "The assistant could not generate a response.",
    });
  }
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

server.on("error", (error) => {
  console.error("Server failed to start:", error.message);
});