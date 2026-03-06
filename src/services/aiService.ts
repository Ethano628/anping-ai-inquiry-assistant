/**
 * AI 分析接口类型（客户端使用）
 * 保持与 Mock 版本完全一致的接口，确保 UI 无需任何修改
 */

export interface InquiryAnalysis {
    score: number;
    level: 'high' | 'medium' | 'low';
    summary: string;
    priority: 'high' | 'medium' | 'low' | 'ignore';
    requirements: {
        product: string;
        specs: string;
        quantity: string;
        destination: string;
        concerns: string;
        customerType: string;
    };
    replies: {
        formal: string;
        friendly: string;
        concise: string;
    };
}

/**
 * 调用后端 API 进行 AI 分析（真实 Gemini）
 */
export async function analyzeInquiry(text: string, source: string): Promise<InquiryAnalysis> {
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, source }),
    });

    if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || 'AI analysis request failed');
    }

    const json = await response.json();
    return json.data as InquiryAnalysis;
}
