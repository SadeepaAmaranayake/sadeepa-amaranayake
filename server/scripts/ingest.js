import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const knowledgeDirectory = path.join(currentDirectory, "..", "knowledge");

if (
  !process.env.OPENAI_API_KEY ||
  process.env.OPENAI_API_KEY.includes("your_")
) {
  throw new Error("Add a valid OPENAI_API_KEY to server/.env");
}

if (process.env.OPENAI_VECTOR_STORE_ID?.trim()) {
  throw new Error(
    "OPENAI_VECTOR_STORE_ID already exists. Do not create duplicate vector stores.",
  );
}

const filenames = fs
  .readdirSync(knowledgeDirectory)
  .filter((filename) => filename.endsWith(".md"));

if (filenames.length === 0) {
  throw new Error("No Markdown knowledge files were found.");
}

for (const filename of filenames) {
  const filePath = path.join(knowledgeDirectory, filename);
  const fileSize = fs.statSync(filePath).size;

  if (fileSize === 0) {
    throw new Error(`${filename} is empty.`);
  }
}

const openai = new OpenAI();

async function ingestKnowledge() {
  console.log(`Found ${filenames.length} knowledge files.`);

  const vectorStore = await openai.vectorStores.create({
    name: "Sadeepa Portfolio Knowledge",
  });

  console.log(`Created vector store: ${vectorStore.id}`);

  const files = filenames.map((filename) =>
    fs.createReadStream(path.join(knowledgeDirectory, filename)),
  );

  const batch = await openai.vectorStores.fileBatches.uploadAndPoll(
    vectorStore.id,
    { files },
  );

  if (batch.status !== "completed" || batch.file_counts.failed > 0) {
    throw new Error(
      `Ingestion failed. Status: ${batch.status}, failed files: ${batch.file_counts.failed}`,
    );
  }

  console.log(`Uploaded ${batch.file_counts.completed} files.`);
  console.log("");
  console.log("Add this value to server/.env:");
  console.log(`OPENAI_VECTOR_STORE_ID=${vectorStore.id}`);
}

ingestKnowledge().catch((error) => {
  console.error("Ingestion failed:", error.message);
  process.exitCode = 1;
});