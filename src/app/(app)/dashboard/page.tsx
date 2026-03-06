'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

interface DashboardData {
    stats: { todayNew: number; pending: number; followUp: number };
    latestInquiries: {
        id: string;
        customerName: string;
        customerCountry: string | null;
        content: string;
        aiScore: number | null;
        source: string;
        createdAt: string;
    }[];
    reminders: {
        id: string;
        customerName: string;
        action: string;
        urgency: 'overdue' | 'today' | 'upcoming';
        daysSince: number;
    }[];
}

function getScoreLabel(score: number | null): { text: string; color: string; bg: string } {
    if (!score) return { text: '-', color: '#9CA3AF', bg: '#F3F4F6' };
    if (score >= 70) return { text: '高意向', color: '#10B981', bg: '#D1FAE5' };
    if (score >= 40) return { text: '中意向', color: '#F59E0B', bg: '#FEF3C7' };
    return { text: '疑似垃圾', color: '#EF4444', bg: '#FEE2E2' };
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return `${days}天前`;
}

const urgencyConfig = {
    overdue: { dot: '#EF4444', label: '已过期', labelBg: '#FEE2E2', labelColor: '#EF4444' },
    today: { dot: '#F59E0B', label: '今天', labelBg: '#FEF3C7', labelColor: '#F59E0B' },
    upcoming: { dot: '#3B82F6', label: '待处理', labelBg: '#DBEAFE', labelColor: '#3B82F6' },
};

export default function DashboardPage() {
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard')
            .then(res => res.json())
            .then(json => setData(json))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 size={28} className="animate-spin text-[#10B981]" />
                <span className="ml-2 text-[14px] text-[#9CA3AF]">加载仪表盘...</span>
            </div>
        );
    }

    if (!data) return null;

    const today = new Date();
    const dateStr = today.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

    return (
        <div className="space-y-6">
            {/* 日期标题 */}
            <p className="text-[13px] text-[#9CA3AF]">{dateStr}</p>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#D1FAE5] flex items-center justify-center">
                        <FileText size={20} className="text-[#10B981]" />
                    </div>
                    <div>
                        <p className="text-[12px] text-[#9CA3AF]">今日新询盘</p>
                        <p className="text-[24px] font-bold text-[#111827]" style={{ fontFamily: "'Sora', sans-serif" }}>
                            {data.stats.todayNew}
                        </p>
                    </div>
                </div>
                <div className="card p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
                        <TrendingUp size={20} className="text-[#F59E0B]" />
                    </div>
                    <div>
                        <p className="text-[12px] text-[#9CA3AF]">待处理</p>
                        <p className="text-[24px] font-bold text-[#111827]" style={{ fontFamily: "'Sora', sans-serif" }}>
                            {data.stats.pending}
                        </p>
                    </div>
                </div>
                <div className="card p-5 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#FEE2E2] flex items-center justify-center">
                        <AlertCircle size={20} className="text-[#EF4444]" />
                    </div>
                    <div>
                        <p className="text-[12px] text-[#9CA3AF]">需跟进</p>
                        <p className="text-[24px] font-bold text-[#111827]" style={{ fontFamily: "'Sora', sans-serif" }}>
                            {data.stats.followUp}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 最新询盘 */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[15px] font-semibold text-[#111827]">最新询盘</h2>
                        <button
                            onClick={() => router.push('/inquiries')}
                            className="text-[12px] text-[#10B981] font-medium hover:underline"
                        >
                            查看全部 →
                        </button>
                    </div>

                    {data.latestInquiries.length === 0 ? (
                        <div className="text-center py-10">
                            <span className="text-[28px]">📭</span>
                            <p className="text-[13px] text-[#9CA3AF] mt-2">暂无询盘，去「处理询盘」分析一条吧</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#F3F4F6]">
                            {data.latestInquiries.map(inq => {
                                const scoreInfo = getScoreLabel(inq.aiScore);
                                return (
                                    <div
                                        key={inq.id}
                                        className="flex items-start gap-3 py-3 cursor-pointer hover:bg-[#F9FAFB] -mx-2 px-2 rounded-lg transition-colors"
                                        onClick={() => router.push(`/inquiries/${inq.id}`)}
                                    >
                                        <span className="text-[12px] font-bold text-white bg-[#9CA3AF] rounded w-7 h-7 flex items-center justify-center shrink-0 mt-0.5">
                                            {(inq.customerCountry || '??').substring(0, 2).toUpperCase()}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[14px] font-semibold text-[#111827]">{inq.customerName}</p>
                                            <p className="text-[12px] text-[#9CA3AF] truncate">{inq.content}...</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-[11px] text-[#D1D5DB]">{timeAgo(inq.createdAt)}</p>
                                            <span
                                                className="text-[11px] font-medium px-2 py-0.5 rounded-full inline-block mt-1"
                                                style={{ color: scoreInfo.color, backgroundColor: scoreInfo.bg }}
                                            >
                                                {scoreInfo.text}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 跟进提醒 */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[15px] font-semibold text-[#111827]">跟进提醒</h2>
                        <button
                            onClick={() => router.push('/follow-ups')}
                            className="text-[12px] text-[#10B981] font-medium hover:underline"
                        >
                            查看全部 →
                        </button>
                    </div>

                    {data.reminders.length === 0 ? (
                        <div className="text-center py-10">
                            <span className="text-[28px]">✅</span>
                            <p className="text-[13px] text-[#9CA3AF] mt-2">暂无待跟进事项</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#F3F4F6]">
                            {data.reminders.map(rem => {
                                const urg = urgencyConfig[rem.urgency];
                                return (
                                    <div
                                        key={rem.id}
                                        className="flex items-center gap-3 py-3 cursor-pointer hover:bg-[#F9FAFB] -mx-2 px-2 rounded-lg transition-colors"
                                        onClick={() => router.push(`/inquiries/${rem.id}`)}
                                    >
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: urg.dot }}></span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[14px] font-semibold text-[#111827]">
                                                {rem.customerName} · {rem.action}
                                            </p>
                                            <p className="text-[12px] text-[#9CA3AF]">
                                                {rem.daysSince === 0 ? '今天收到' : `${rem.daysSince} 天前`}
                                            </p>
                                        </div>
                                        <span
                                            className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                                            style={{ color: urg.labelColor, backgroundColor: urg.labelBg }}
                                        >
                                            {urg.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
