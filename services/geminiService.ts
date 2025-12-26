
import { MEDICAL_AESTHETIC_KNOWLEDGE, BRAND_CONFIG } from "../constants";

// 配置 API 终端
// DeepSeek 官方: https://api.deepseek.com/v1
// Ollama 本地: http://localhost:11434/v1
const BASE_URL = "https://api.deepseek.com/v1";
const API_KEY = process.env.API_KEY;

export async function processRAGQuery(query: string) {
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
    3. 必须提及项目品牌名（如果知识库中有）。
    4. 结尾需包含温馨的术后建议或注意事项。
  `;

  const prompt = `
    检索到的参考资料：
    ${context.map((c, i) => `[资料${i+1}]: ${c}`).join('\n')}
    
    用户咨询问题：${query}
  `;

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat", // 可切换为 deepseek-reasoner 或 ollama 中的模型名
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    return {
      text: text || "抱歉，我暂时无法处理您的咨询。",
      context: context
    };
  } catch (error) {
    console.error("AI Service Error:", error);
    return {
      text: "非常抱歉，咨询系统目前正在维护，请稍后再试或联系人工客服。",
      context: []
    };
  }
}
