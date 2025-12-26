
import { Chapter } from './types';

// 品牌定制配置中心
export const BRAND_CONFIG = {
  name: "AesthetiAI",         // 品牌名称
  subName: "智研医美中心",     // 副标题
  slogan: "遇见更完美的自己",  // 核心标语
  description: "您的 AI 私人医美助理，基于海量临床数据与专业医学库，为您提供精准、安全、定制化的美丽升级建议。",
  footerNote: "Excellence in Aesthetic Intelligence",
  riskNotice: "*风险提示：AI 生成的建议仅供参考。任何医疗行为请严格遵医嘱并在专业医美机构进行。"
};

export const TUTORIAL_DATA: Chapter[] = [
  {
    id: 'part1',
    title: '医美AI核心架构',
    description: '深入了解垂直行业LLM应用开发。',
    sections: ['合规性与边界处理', '医疗文档清洗流水线', '高精度Embedding选择']
  },
  {
    id: 'part2',
    title: '知识图谱与RAG',
    description: '结合Neo4j处理复杂的医美方案逻辑。',
    sections: ['手术项目关联建模', '术后护理知识库', '多模态病历检索']
  }
];

export const MEDICAL_AESTHETIC_KNOWLEDGE = [
  "玻尿酸（Hyaluronic Acid）主要用于填充和保湿，品牌包括乔雅登、瑞蓝等。禁忌：过敏体质慎用。",
  "肉毒素（Botulinum Toxin）通过阻断神经冲动来减少动态纹，主要品牌有保妥适、衡力。注意事项：注射后4小时内避免平卧。",
  "光子嫩肤（IPL）利用强脉冲光改善皮肤红血丝、色斑及毛孔问题。建议周期：3-4周一次。",
  "热玛吉（Thermage）通过射频技术刺激胶原蛋白再生，达到提拉紧致效果。最新型号：FLX。",
  "皮秒激光（Picosure）主要针对色素性病变，如祛斑、去纹身。恢复期：约3-7天。",
  "水光针（Mesotherapy）是将营养成分注入真皮层，起到深层补水的作用。常见配方：玻尿酸+肉毒+VC。"
];

export const generateScaffoldCode = (config: any) => {
  return `
# ${config.name} - Project Scaffold
# Stack: ${config.framework} + ${config.vectorDB} + ${config.strategy}

# 1. docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    environment:
      - API_KEY=\${API_KEY}
      - VDB_HOST=${config.vectorDB.toLowerCase()}
    depends_on:
      - vdb
  vdb:
    image: ${config.vectorDB === 'Milvus' ? 'milvusdb/milvus:latest' : config.vectorDB.toLowerCase()}
    ports: ["19530:19530"]

# 2. main.py (Logic Sketch)
from ${config.framework.toLowerCase()} import VectorStore, RetrievalChain
# Strategy: ${config.strategy} Implementation here...
`;
};
