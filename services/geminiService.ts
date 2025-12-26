
import { MEDICAL_AESTHETIC_KNOWLEDGE, BRAND_CONFIG } from "../constants";

export interface LLMConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

// 默认配置（如果用户未自定义）
const DEFAULT_CONFIG: LLMConfig = {
  baseUrl: "https://api.deepseek.com/v1",
  apiKey: process.env.API_KEY || "",
  model: "deepseek-chat"
};

export async function processRAGQuery(query: string, customConfig?: Partial<LLMConfig>) {
  const config = { ...DEFAULT_CONFIG, ...customConfig };
  
  // --- 模拟后端 RAG 检索逻辑 ---
  const words = query.toLowerCase().split(/[^\w\u4e00-\u9fa5]/).filter(w => w.length > 1);
  const retrieved = MEDICAL_AESTHETIC_KNOWLEDGE.filter(k => 
    words.some(word => k.toLowerCase().includes(word))
  );
  
  const context = retrieved.length > 0 ? retrieved : MEDICAL_AESTHETIC_KNOWLEDGE.slice(0, 3);

  const systemInstruction = `
    你是一名来自【${BRAND_CONFIG.name}】的专业医美顾问助理。
    请严格基于以下【检索到的医学知识】来回答用户的问题。
    如果知识库中没有相关信息，请礼貌地告知用户需咨询执业医师。
    
    规则：
    1. 语气专业、温和、客观。
    2. 严禁捏造医学事实。
    3. 必须提及项目品牌名。
    4. 结尾需包含温馨的术后建议。
  `;

  const prompt = `
    检索到的参考资料：
    ${context.map((c, i) => `[资料${i+1}]: ${c}`).join('\n')}
    
    用户咨询问题：${query}
  `;

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API 请求失败 (${response.status}): ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    return {
      text: text || "抱歉，我暂时无法处理您的咨询。",
      context: context
    };
  } catch (error: any) {
    console.error("AI Service Error:", error);
    return {
      text: `服务异常: ${error.message || "未知错误"}。请检查设置中的 Endpoint 和 API Key 是否正确。`,
      context: []
    };
  }
}
