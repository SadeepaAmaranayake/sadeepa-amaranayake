import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { GoogleGenAI } from "@google/genai";

const app = express();
const port = process.env.PORT || 5050;

const apiKey = process.env.GEMINI_API_KEY;
const fileSearchStore = process.env.GEMINI_FILE_SEARCH_STORE;
const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";

const ai = new GoogleGenAI({ apiKey });

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

  if (!apiKey || !fileSearchStore) {
    return response.status(500).json({
      error: "The Gemini knowledge base is not configured.",
    });
  }

  try {
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
Keep answers concise and factual.
      `.trim(),
      input: message,
      tools: [
        {
          type: "file_search",
          file_search_store_names: [fileSearchStore],
        },
      ],
    });

    const sources = (result.steps || [])
      .filter((step) => step.type === "model_output")
      .flatMap((step) => step.content || [])
      .filter((content) => content.type === "text")
      .flatMap((content) => content.annotations || [])
      .filter((annotation) => annotation.type === "file_citation")
      .map((annotation) => annotation.file_name)
      .filter(Boolean);

    return response.json({
      answer:
        result.output_text ||
        "The assistant could not find an answer in the knowledge base.",
      sources: [...new Set(sources)],
    });
  } catch (error) {
    console.error("Gemini chat request failed:", error.status, error.message);

    const status = error.status === 429 ? 429 : 500;

    return response.status(status).json({
      error:
        status === 429
          ? "The assistant has reached its temporary usage limit."
          : "The assistant could not generate a response.",
    });
  }
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

server.on("error", (error) => {
  console.error("Server failed to start:", error.message);
});