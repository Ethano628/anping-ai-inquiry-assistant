'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InquiryInput from '@/components/process/InquiryInput';
import AnalysisResult from '@/components/process/AnalysisResult';
import ReplyGenerator from '@/components/process/ReplyGenerator';
import { analyzeInquiry, type InquiryAnalysis } from '@/services/aiService';
import { CheckCircle } from 'lucide-react';

export default function ProcessPage() {
    const router = useRouter();
    const [analysis, setAnalysis] = useState<InquiryAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async (text: string, source: string) => {
        setIsAnalyzing(true);
        setAnalysis(null);
        setSaved(false);
        setError(null);

        try {
            const result = await analyzeInquiry(text, source);
            setAnalysis(result);

            // 自动保存到数据库
            setIsSaving(true);
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: text,
                    source,
                    aiScore: result.score,
                    aiSummary: result.summary,
                    aiRequirements: result.requirements,
                    aiReplyFormal: result.replies.formal,
                    aiReplyFriendly: result.replies.friendly,
                    aiReplyConcise: result.replies.concise,
                    priority: result.priority,
                }),
            });

            if (response.ok) {
                setSaved(true);
            }
        } catch (err: any) {
            setError(err?.message || 'AI 分析失败，请稍后重试');
        } finally {
            setIsAnalyzing(false);
            setIsSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：询盘输入 */}
            <InquiryInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

            {/* 右侧：AI 分析结果 */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[15px] font-semibold text-[#111827]">
                        ✦ AI 分析结果
                    </h2>
                    {saved && (
                        <span className="flex items-center gap-1 text-[12px] text-[#10B981] font-medium">
                            <CheckCircle size={14} />
                            已保存
                        </span>
                    )}
                </div>

                {isAnalyzing && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="relative w-16 h-16 mb-4">
                            <div className="absolute inset-0 rounded-full border-4 border-[#E5E7EB]"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-[#10B981] animate-spin"></div>
                        </div>
                        <p className="text-[14px] text-[#10B981] font-medium animate-pulse">
                            AI 正在深度分析询盘...
                        </p>
                        <p className="text-[12px] text-[#9CA3AF] mt-1">
                            正在评估真实性、提取需求、生成回复
                        </p>
                    </div>
                )}

                {!isAnalyzing && error && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-14 h-14 rounded-full bg-[#FEE2E2] flex items-center justify-center mb-4">
                            <span className="text-[24px]">⚠️</span>
                        </div>
                        <p className="text-[14px] text-[#EF4444] font-medium mb-1">分析失败</p>
                        <p className="text-[12px] text-[#9CA3AF] max-w-sm">{error}</p>
                        <p className="text-[12px] text-[#D1D5DB] mt-2">请检查网络连接或 API 配额后重试</p>
                    </div>
                )}

                {!isAnalyzing && !analysis && !error && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-[#F0F4F8] flex items-center justify-center mb-4">
                            <span className="text-[24px]">🤖</span>
                        </div>
                        <p className="text-[14px] text-[#9CA3AF] mb-1">
                            粘贴询盘后点击「开始分析」
                        </p>
                        <p className="text-[12px] text-[#D1D5DB]">
                            AI 将自动分析真假、提取需求、生成回复
                        </p>
                    </div>
                )}

                {!isAnalyzing && analysis && (
                    <div className="space-y-6">
                        <AnalysisResult analysis={analysis} />
                        <div className="border-t border-[#F3F4F6] pt-5">
                            <ReplyGenerator replies={analysis.replies} />
                        </div>

                        {/* 跳转到询盘管理 */}
                        <button
                            onClick={() => router.push('/inquiries')}
                            className="w-full py-2.5 text-[13px] font-medium text-[#10B981] bg-[#D1FAE5] rounded-lg hover:bg-[#A7F3D0] transition-colors"
                        >
                            查看询盘管理列表 →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
