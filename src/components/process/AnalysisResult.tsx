'use client';

import ScoreRing from './ScoreRing';
import type { InquiryAnalysis } from '@/services/aiService';

interface AnalysisResultProps {
    analysis: InquiryAnalysis;
}

const priorityConfig = {
    high: { label: '高优先级', color: '#10B981', bg: '#D1FAE5' },
    medium: { label: '中优先级', color: '#F59E0B', bg: '#FEF3C7' },
    low: { label: '低优先级', color: '#9CA3AF', bg: '#F3F4F6' },
    ignore: { label: '建议忽略', color: '#EF4444', bg: '#FEE2E2' },
};

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
    const pConfig = priorityConfig[analysis.priority];

    return (
        <div className="space-y-5">
            {/* 评分 + 优先级 */}
            <div className="flex items-start justify-between">
                <ScoreRing score={analysis.score} />
                <span
                    className="text-[12px] font-semibold px-3 py-1 rounded-full"
                    style={{ color: pConfig.color, backgroundColor: pConfig.bg }}
                >
                    {pConfig.label}
                </span>
            </div>

            {/* 分析说明 */}
            <p className="text-[13px] text-[#6B7280] leading-relaxed bg-[#F9FAFB] p-3 rounded-lg border border-[#F3F4F6]">
                {analysis.summary}
            </p>

            {/* 客户需求分析 */}
            <div>
                <h3 className="text-[13px] font-semibold text-[#111827] mb-3">客户需求分析</h3>
                <div className="space-y-2.5">
                    {[
                        { label: '产品', value: analysis.requirements.product },
                        { label: '规格', value: analysis.requirements.specs },
                        { label: '数量', value: analysis.requirements.quantity },
                        { label: '目的港', value: analysis.requirements.destination },
                        { label: '关注点', value: analysis.requirements.concerns },
                        { label: '客户类型', value: analysis.requirements.customerType },
                    ].map((item) => (
                        <div key={item.label} className="flex text-[13px]">
                            <span className="text-[#9CA3AF] w-16 shrink-0">{item.label}</span>
                            <span className="text-[#111827] font-medium">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
