'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type ReplyStyle = 'formal' | 'friendly' | 'concise';

interface ReplyGeneratorProps {
    replies: {
        formal: string;
        friendly: string;
        concise: string;
    };
}

const styleLabels: { key: ReplyStyle; label: string }[] = [
    { key: 'formal', label: '正式' },
    { key: 'friendly', label: '友好' },
    { key: 'concise', label: '简洁' },
];

export default function ReplyGenerator({ replies }: ReplyGeneratorProps) {
    const [style, setStyle] = useState<ReplyStyle>('formal');
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(replies[style]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
            const textarea = document.createElement('textarea');
            textarea.value = replies[style];
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-4">
            {/* 标题 + 风格选择 */}
            <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-[#111827]">AI 生成英文回复</h3>
                <div className="flex rounded-lg border border-[#E5E7EB] overflow-hidden">
                    {styleLabels.map((s) => (
                        <button
                            key={s.key}
                            onClick={() => setStyle(s.key)}
                            className={`px-3 py-1.5 text-[12px] font-medium transition-colors
                                ${style === s.key
                                    ? 'bg-[#10B981] text-white'
                                    : 'bg-white text-[#6B7280] hover:bg-[#F9FAFB]'
                                }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 回复内容 */}
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 max-h-[320px] overflow-y-auto">
                <pre className="text-[13px] text-[#374151] whitespace-pre-wrap leading-relaxed font-sans">
                    {replies[style]}
                </pre>
            </div>

            {/* 复制按钮 */}
            <button
                onClick={handleCopy}
                className={`w-full py-2.5 text-[13px] font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-300
                    ${copied
                        ? 'bg-[#D1FAE5] text-[#059669] border border-[#10B981]/30'
                        : 'bg-white text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#10B981]'
                    }`}
            >
                {copied ? (
                    <>
                        <Check size={15} />
                        已复制到剪贴板
                    </>
                ) : (
                    <>
                        <Copy size={15} />
                        一键复制回复内容
                    </>
                )}
            </button>
        </div>
    );
}
