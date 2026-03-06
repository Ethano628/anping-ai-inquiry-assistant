import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn('GEMINI_API_KEY not set — AI analysis will fail');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const SYSTEM_PROMPT = `你是一个专业的外贸询盘分析 AI 助手，服务于中国安平县丝网生产企业。

你的任务是分析国际买家发来的询盘邮件/消息，并输出结构化 JSON 结果。

请严格按以下 JSON 格式返回（不要包含 markdown 代码块标记）：

{
  "score": <0-100 整数，意向真实性评分>,
  "level": "<high|medium|low>",
  "summary": "<一句话中文分析概要>",
  "priority": "<high|medium|low|ignore>",
  "requirements": {
    "product": "<产品名称>",
    "specs": "<规格需求>",
    "quantity": "<数量>",
    "destination": "<目的港/国家>",
    "concerns": "<买家关注点>",
    "customerType": "<客户类型判断>"
  },
  "replies": {
    "formal": "<正式英文回复，约200字>",
    "friendly": "<友好亲切英文回复，约200字>",
    "concise": "<简洁英文回复，约100字>"
  }
}

评分标准：
- 90-100：包含具体产品、规格、数量、交货条款的高意向询盘
- 70-89：有明确产品需求但缺少部分细节
- 40-69：笼统询问，需要进一步确认
- 0-39：群发垃圾询盘、无效信息

回复生成要求：
- 以安平丝网生产企业的身份回复
- 提及 15+ 年出口经验、ISO 9001 认证
- formal：专业正式，使用 Dear Sir/Madam
- friendly：热情亲切，使用 Hi there 👋，语气轻松
- concise：简短直接，只关注核心报价要素`;

/**
 * POST /api/analyze — 真实 AI 分析（带模型降级）
 */
export async function POST(request: Request) {
    try {
        const { text, source } = await request.json();

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return NextResponse.json({ error: 'text is required' }, { status: 400 });
        }

        if (!genAI) {
            return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
        }

        // 构建 Prompt
        const userPrompt = `请分析以下来自「${source || '未知平台'}」的外贸询盘：

---
${text.substring(0, 3000)}
---

请严格按要求的 JSON 格式返回分析结果。`;

        const fullPrompt = SYSTEM_PROMPT + '\n\n' + userPrompt;

        // 尝试可用模型（按优先级排序）
        const modelNames = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];
        let lastError: any = null;
        let result: any = null;

        for (const modelName of modelNames) {
            try {
                console.log(`Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                result = await model.generateContent(fullPrompt);
                console.log(`✓ Model ${modelName} succeeded`);
                break;
            } catch (e: any) {
                lastError = e;
                console.log(`✗ Model ${modelName} failed: ${e.message?.substring(0, 120)}`);
                continue;
            }
        }

        if (!result) {
            const isQuotaError = lastError?.message?.includes('429') || lastError?.message?.includes('quota');
            return NextResponse.json({
                error: isQuotaError
                    ? 'API 免费配额已用完。请到 Google AI Studio 检查配额，或稍后重试。'
                    : 'AI 分析失败：' + (lastError?.message || '未知错误'),
                quotaExceeded: isQuotaError,
            }, { status: isQuotaError ? 429 : 500 });
        }

        const responseText = result.response.text();

        // 清理可能的 markdown 代码块标记
        const cleaned = responseText
            .replace(/```json\s*/gi, '')
            .replace(/```\s*/g, '')
            .trim();

        const analysis = JSON.parse(cleaned);

        // 确保字段完整
        const safeAnalysis = {
            score: analysis.score ?? 50,
            level: analysis.level ?? 'medium',
            summary: analysis.summary ?? '分析完成',
            priority: analysis.priority ?? 'medium',
            requirements: {
                product: analysis.requirements?.product ?? '未识别',
                specs: analysis.requirements?.specs ?? '未提供',
                quantity: analysis.requirements?.quantity ?? '未提供',
                destination: analysis.requirements?.destination ?? '未提供',
                concerns: analysis.requirements?.concerns ?? '未提供',
                customerType: analysis.requirements?.customerType ?? '未识别',
            },
            replies: {
                formal: analysis.replies?.formal ?? '',
                friendly: analysis.replies?.friendly ?? '',
                concise: analysis.replies?.concise ?? '',
            },
        };

        return NextResponse.json({ success: true, data: safeAnalysis });
    } catch (error: any) {
        console.error('AI Analysis Error:', error?.message || error);

        return NextResponse.json({
            error: 'AI 分析失败：' + (error?.message || '未知错误'),
            details: error?.message,
        }, { status: 500 });
    }
}
