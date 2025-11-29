import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../../config";

export type RagChunk = {
  id: string;
  text: string;
  source: string;
  embedding: number[];
};

export type RagIndex = {
  chunks: RagChunk[];
  model: string;
  builtAt: string;
  sourceRoot: string;
};

const DEFAULT_INDEX_URL = "/local-rag-index.json";

const dotProduct = (a: number[], b: number[]) =>
  a.reduce((sum, val, idx) => sum + val * (b[idx] || 0), 0);

const magnitude = (vec: number[]) =>
  Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));

const cosineSimilarity = (a: number[], b: number[]) => {
  const denom = magnitude(a) * magnitude(b);
  if (!denom) return 0;
  return dotProduct(a, b) / denom;
};

export class LocalRagClient {
  private api = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  private indexUrl: string;
  private indexPromise: Promise<RagIndex | null> | null = null;

  constructor(indexUrl: string = DEFAULT_INDEX_URL) {
    this.indexUrl = indexUrl;
  }

  async loadIndex(): Promise<RagIndex | null> {
    if (this.indexPromise) {
      return this.indexPromise;
    }
    this.indexPromise = fetch(this.indexUrl)
      .then(async (res) => {
        if (!res.ok) {
          console.warn(
            `[local-rag] Could not load index (${res.status} ${res.statusText})`
          );
          return null;
        }
        const data: RagIndex = await res.json();
        if (!Array.isArray(data.chunks)) {
          console.warn("[local-rag] index missing chunks");
          return null;
        }
        return data;
      })
      .catch((err) => {
        console.warn("[local-rag] failed to load index", err);
        return null;
      });
    return this.indexPromise;
  }

  async embedQuery(query: string, model: string): Promise<number[] | null> {
    try {
      const response = await this.api.models.embedContent({
        model,
        contents: [query],
      });
      const embedding = response.embeddings?.[0]?.values;
      return Array.isArray(embedding) ? embedding : null;
    } catch (err) {
      console.warn("[local-rag] embedding failed", err);
      return null;
    }
  }

  async search(
    query: string,
    topK: number = 4
  ): Promise<Array<RagChunk & { score: number }>> {
    const index = await this.loadIndex();
    if (!index || !index.chunks.length) {
      return [];
    }
    const embedding = await this.embedQuery(query, index.model);
    if (!embedding) {
      return [];
    }

    const scored = index.chunks
      .map((chunk) => ({
        ...chunk,
        score: cosineSimilarity(chunk.embedding, embedding),
      }))
      .filter((item) => Number.isFinite(item.score))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return scored;
  }
}
