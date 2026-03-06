'use client';

import { useState } from 'react';
import { Upload, RotateCcw, Sparkles, Loader2 } from 'lucide-react';

const platforms = ['阿里国际站', '中国制造网', '邮件', 'Facebook', '其他'];

interface InquiryInputProps {
    onAnalyze: (text: string, source: string) => void;
    isAnalyzing: boolean;
}

export default function InquiryInput({ onAnalyze, isAnalyzing }: InquiryInputProps) {
    const [text, setText] = useState('');
    const [source, setSource] = useState('阿里国际站');

    const handleClear = () => {
        setText('');
    };

    const handleAnalyze = () => {
        if (text.trim().length === 0) return;
        onAnalyze(text.trim(), source);
    };

    return (
        <div className="card p-6">
            <h2 className="text-[15px] font-semibold text-[#111827] mb-5 flex items-center gap-2">
                <Upload size={18} className="text-[#10B981]" />
                询盘输入
            </h2>

            {/* 来源平台 */}
            <div className="mb-4">
                <p className="text-[12px] font-medium text-[#6B7280] mb-2">询盘来源平台</p>
                <div className="flex flex-wrap gap-2">
                    {platforms.map((p) => (
                        <button
                            key={p}
                            onClick={() => setSource(p)}
                            className={`px-3 py-1.5 text-[13px] rounded-full border transition-all duration-200
                                ${source === p
                                    ? 'bg-[#10B981] text-white border-[#10B981] shadow-sm'
                                    : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#10B981] hover:text-[#10B981]'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* 询盘原文 */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[12px] font-medium text-[#6B7280]">粘贴询盘原文</p>
                    <span className={`text-[11px] ${text.length > 0 ? 'text-[#10B981]' : 'text-[#D1D5DB]'}`}>
                        {text.length} 字符
                    </span>
                </div>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={8}
                    placeholder={`Dear Sir/Madam,\n\nWe are interested in your stainless steel wire mesh products. We need 304 grade, aperture 1mm, wire diameter 0.5mm, roll size 1m × 30m. Quantity: 500 rolls for the first order. Please provide your best CIF Hamburg price and delivery time.\n\nBest regards,\nThomas Mueller · Mueller GmbH, Germany`}
                    className="w-full p-4 text-[14px] bg-[#F0F4F8] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981] resize-none transition-colors placeholder:text-[#C0C7D0] leading-relaxed"
                    disabled={isAnalyzing}
                />
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-3">
                <button
                    onClick={handleClear}
                    disabled={text.length === 0 || isAnalyzing}
                    className="px-4 py-2.5 text-[13px] font-medium text-[#6B7280] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <RotateCcw size={15} />
                    清空重置
                </button>
                <button
                    onClick={handleAnalyze}
                    disabled={text.trim().length === 0 || isAnalyzing}
                    className="flex-1 px-4 py-2.5 text-[14px] font-semibold text-white bg-[#10B981] rounded-lg hover:bg-[#059669] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            AI 正在分析中...
                        </>
                    ) : (
                        <>
                            <Sparkles size={16} />
                            开始分析
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
