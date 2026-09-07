import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const knowledgeDirectory = path.join(currentDirectory, "..", "knowledge");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey.includes("your_")) {
  throw new Error("Add a valid GEMINI_API_KEY to server/.env");
}

if (process.env.GEMINI_FILE_SEARCH_STORE?.trim()) {
  throw new Error(
    "GEMINI_FILE_SEARCH_STORE already exists. Do not create a duplicate store.",
  );
}

const filenames = fs
  .readdirSync(knowledgeDirectory)
  .filter((filename) => filename.endsWith(".md"));

if (filenames.length === 0) {
  throw new Error("No Markdown knowledge files were found.");
}

const ai = new GoogleGenAI({ apiKey });

async function ingestKnowledge() {
  console.log(`Found ${filenames.length} knowledge files.`);

  const store = await ai.fileSearchStores.create({
    config: {
      displayName: "Sadeepa Portfolio Knowledge",
      embeddingModel: "models/gemini-embedding-001",
    },
  });

  console.log(`Created Gemini File Search store: ${store.name}`);

  for (const filename of filenames) {
    const filePath = path.join(knowledgeDirectory, filename);

    let operation = await ai.fileSearchStores.uploadToFileSearchStore({
      file: filePath,
      fileSearchStoreName: store.name,
      config: {
        displayName: filename,
        mimeType: "text/markdown",
      },
    });

    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      operation = await ai.operations.get({ operation });
    }

    if (operation.error) {
      throw new Error(
        `Failed to upload ${filename}: ${JSON.stringify(operation.error)}`,
      );
    }

    console.log(`Uploaded: ${filename}`);
  }

  console.log("\nAdd this value to server/.env:");
  console.log(`GEMINI_FILE_SEARCH_STORE=${store.name}`);
}

ingestKnowledge().catch((error) => {
  console.error("Gemini ingestion failed:", error.message);
  process.exitCode = 1;
});