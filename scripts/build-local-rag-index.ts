#!/usr/bin/env ts-node
/**
 * Builds a lightweight embeddings cache for the local RAG client.
 * Default source folder: Q:\FakeDesktop\file\create\FlyAndShadow_3D
 * Usage:
 *   npx ts-node scripts/build-local-rag-index.ts
 *   npx ts-node scripts/build-local-rag-index.ts --input "D:\\path\\to\\project" --out public/local-rag-index.json
 */
import "dotenv-flow/config";
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { GoogleGenAI } from "@google/genai";

type RagChunk = {
  id: string;
  text: string;
  source: string;
  embedding: number[];
};

type RagIndex = {
  model: string;
  builtAt: string;
  sourceRoot: string;
  chunks: RagChunk[];
};

const DEFAULT_SOURCE = "Q:\\\\FakeDesktop\\\\file\\\\create\\\\FlyAndShadow_3D";
const DEFAULT_OUTPUT = path.resolve("public", "local-rag-index.json");
const EMBED_MODEL = "text-embedding-004";
const MAX_FILE_SIZE = 250 * 1024; // bytes
const MAX_CHUNK_LEN = 1200;
const CHUNK_OVERLAP = 200;

const EXCLUDED_DIRS = new Set([
  "Library",
  "Logs",
  "Temp",
  "Packages",
  "ProjectSettings",
  "UserSettings",
  "GeneratedAssets",
  ".git",
  ".svn",
  ".idea",
  ".vscode",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".md",
  ".txt",
  ".log",
  ".json",
  ".yaml",
  ".yml",
  ".cs",
  ".shader",
  ".cginc",
  ".uxml",
  ".uss",
  ".asmdef",
]);

const argv = process.argv.slice(2);
const getArg = (flag: string) => {
  const idx = argv.findIndex((a) => a === flag);
  if (idx === -1) return undefined;
  return argv[idx + 1];
};

const SOURCE_ROOT = path.resolve(getArg("--input") || DEFAULT_SOURCE);
const OUTPUT_FILE = path.resolve(getArg("--out") || DEFAULT_OUTPUT);
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Missing REACT_APP_GEMINI_API_KEY in environment/.env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const shouldSkip = (filePath: string, size: number) => {
  const ext = path.extname(filePath).toLowerCase();
  return !ALLOWED_EXTENSIONS.has(ext) || size === 0 || size > MAX_FILE_SIZE;
};

const chunkText = (text: string) => {
  const cleaned = text.replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];

  const chunks: string[] = [];
  let start = 0;
  while (start < cleaned.length) {
    const end = Math.min(start + MAX_CHUNK_LEN, cleaned.length);
    const slice = cleaned.slice(start, end);
    chunks.push(slice);
    if (end === cleaned.length) break;
    start = end - CHUNK_OVERLAP;
  }
  return chunks;
};

const embedText = async (text: string) => {
  const res = await ai.models.embedContent({
    model: EMBED_MODEL,
    contents: [text],
  });
  const embedding = res.embeddings?.[0]?.values;
  if (!Array.isArray(embedding)) {
    throw new Error("No embedding returned");
  }
  return embedding;
};

const walk = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      files.push(...(await walk(path.join(dir, entry.name))));
    } else {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
};

async function buildIndex() {
  console.log(`Building local RAG index...`);
  console.log(`Source: ${SOURCE_ROOT}`);
  console.log(`Output: ${OUTPUT_FILE}`);

  const filePaths = await walk(SOURCE_ROOT);
  const usableFiles: string[] = [];

  for (const filePath of filePaths) {
    try {
      const stat = await fs.stat(filePath);
      if (stat.isFile() && !shouldSkip(filePath, stat.size)) {
        usableFiles.push(filePath);
      }
    } catch (err) {
      console.warn(`Skipping ${filePath}: ${(err as Error).message}`);
    }
  }

  console.log(`Found ${usableFiles.length} candidate files`);

  const chunks: RagChunk[] = [];

  for (const filePath of usableFiles) {
    const relPath = path.relative(SOURCE_ROOT, filePath);
    const content = await fs.readFile(filePath, "utf8");
    const fileChunks = chunkText(content);
    if (!fileChunks.length) continue;

    for (const text of fileChunks) {
      const embedding = await embedText(text);
      chunks.push({
        id: nanoid(),
        text,
        source: relPath,
        embedding,
      });
    }
  }

  const index: RagIndex = {
    model: EMBED_MODEL,
    builtAt: new Date().toISOString(),
    sourceRoot: SOURCE_ROOT,
    chunks,
  };

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(index, null, 2), "utf8");

  console.log(
    `Indexed ${chunks.length} chunks from ${usableFiles.length} files -> ${OUTPUT_FILE}`
  );
}

buildIndex().catch((err) => {
  console.error(err);
  process.exit(1);
});
