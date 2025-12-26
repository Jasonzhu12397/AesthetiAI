
export interface Chapter {
  id: string;
  title: string;
  description: string;
  sections: string[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  retrievedContext?: string[];
  citations?: string[];
  timestamp: number;
}

export type VectorDB = 'Milvus' | 'Pinecone' | 'Qdrant' | 'Chroma';
export type RAGFramework = 'LangChain' | 'LlamaIndex' | 'Native Python';
export type RetrievalStrategy = 'Simple' | 'Hybrid' | 'Rerank' | 'GraphRAG';

export interface ProjectConfig {
  name: string;
  vectorDB: VectorDB;
  framework: RAGFramework;
  strategy: RetrievalStrategy;
}
