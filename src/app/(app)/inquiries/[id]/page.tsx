import { notFound } from 'next/navigation';
import { inquiryService } from '@/services/inquiryService';

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const inquiry = await inquiryService.getInquiryById(id);

    if (!inquiry) {
        notFound();
    }

    const scoreColor = (inquiry.aiScore ?? 0) >= 70 ? '#10B981' : (inquiry.aiScore ?? 0) >= 40 ? '#F59E0B' : '#EF4444';

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* 顶部信息 */}
            <div className="card p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-[18px] font-bold text-[#111827]">{inquiry.customerName}</h1>
                        <p className="text-[13px] text-[#9CA3AF]">
                            {inquiry.customerCountry} · {inquiry.source} · {new Date(inquiry.createdAt).toLocaleString('zh-CN')}
                        </p>
                    </div>
                    {inquiry.aiScore && (
                        <span className="text-[20px] font-bold px-3 py-1 rounded-lg" style={{ color: scoreColor, backgroundColor: scoreColor + '15' }}>
                            {inquiry.aiScore}分
                        </span>
                    )}
                </div>

                <div className="bg-[#F9FAFB] p-4 rounded-lg border border-[#F3F4F6]">
                    <p className="text-[12px] font-medium text-[#9CA3AF] mb-2">询盘原文</p>
                    <p className="text-[14px] text-[#374151] whitespace-pre-wrap leading-relaxed">{inquiry.content}</p>
                </div>
            </div>

            {/* AI 分析 */}
            {inquiry.aiSummary && (
                <div className="card p-6">
                    <h2 className="text-[15px] font-semibold text-[#111827] mb-3">✦ AI 分析</h2>
                    <p className="text-[13px] text-[#6B7280] mb-4">{inquiry.aiSummary}</p>

                    {inquiry.aiRequirements && (
                        <div className="space-y-2">
                            {Object.entries(inquiry.aiRequirements).map(([key, value]) => (
                                <div key={key} className="flex text-[13px]">
                                    <span className="text-[#9CA3AF] w-16 shrink-0">{
                                        { product: '产品', specs: '规格', quantity: '数量', destination: '目的港', concerns: '关注点', customerType: '客户类型' }[key] || key
                                    }</span>
                                    <span className="text-[#111827] font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* AI 回复 */}
            {inquiry.aiReplyFormal && (
                <div className="card p-6">
                    <h2 className="text-[15px] font-semibold text-[#111827] mb-3">AI 生成回复</h2>
                    <pre className="text-[13px] text-[#374151] whitespace-pre-wrap leading-relaxed bg-[#F9FAFB] p-4 rounded-lg border border-[#F3F4F6]">
                        {inquiry.aiReplyFormal}
                    </pre>
                </div>
            )}
        </div>
    );
}
