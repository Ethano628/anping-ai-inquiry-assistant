'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Loader2 } from 'lucide-react';
import type { Inquiry } from '@/types';

type UrgencyLevel = 'overdue' | 'today' | 'upcoming';

interface Reminder {
    inquiry: Inquiry;
    action: string;
    urgency: UrgencyLevel;
    daysSince: number;
}

const urgencyConfig: Record<UrgencyLevel, { dot: string; label: string; labelBg: string; labelColor: string }> = {
    overdue: { dot: '#EF4444', label: '已超时', labelBg: '#FEE2E2', labelColor: '#EF4444' },
    today: { dot: '#F59E0B', label: '今天', labelBg: '#FEF3C7', labelColor: '#F59E0B' },
    upcoming: { dot: '#3B82F6', label: '待处理', labelBg: '#DBEAFE', labelColor: '#3B82F6' },
};

function buildReminders(inquiries: Inquiry[]): Reminder[] {
    const now = Date.now();
    return inquiries
        .filter(inq => ['pending', 'replied', 'following_up'].includes(inq.status))
        .map(inq => {
            const daysSince = Math.floor((now - new Date(inq.createdAt).getTime()) / (1000 * 60 * 60 * 24));

            let urgency: UrgencyLevel = 'upcoming';
            let action = '';

            if (inq.status === 'pending') {
                urgency = daysSince >= 1 ? 'overdue' : 'today';
                action = daysSince >= 1 ? '待回复（已超时）' : '待首次回复';
            } else if (inq.status === 'following_up') {
                urgency = daysSince >= 3 ? 'overdue' : 'today';
                action = '跟进中';
            } else if (inq.status === 'replied') {
                urgency = daysSince >= 5 ? 'today' : 'upcoming';
                action = '报价跟进';
            }

            return { inquiry: inq, action, urgency, daysSince };
        })
        .sort((a, b) => {
            const order: Record<UrgencyLevel, number> = { overdue: 0, today: 1, upcoming: 2 };
            return order[a.urgency] - order[b.urgency];
        });
}

export default function FollowUpsPage() {
    const router = useRouter();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/inquiries')
            .then(res => res.json())
            .then(json => setInquiries(json.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const reminders = buildReminders(inquiries);
    const overdueCount = reminders.filter(r => r.urgency === 'overdue').length;
    const todayCount = reminders.filter(r => r.urgency === 'today').length;
    const upcomingCount = reminders.filter(r => r.urgency === 'upcoming').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 size={28} className="animate-spin text-[#10B981]" />
                <span className="ml-2 text-[14px] text-[#9CA3AF]">加载跟进数据...</span>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* 统计条 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] flex items-center justify-center">
                        <Bell size={18} className="text-[#EF4444]" />
                    </div>
                    <div>
                        <p className="text-[12px] text-[#9CA3AF]">已超时</p>
                        <p className="text-[20px] font-bold text-[#111827]">{overdueCount}</p>
                    </div>
                </div>
                <div className="card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                        <Bell size={18} className="text-[#F59E0B]" />
                    </div>
                    <div>
                        <p className="text-[12px] text-[#9CA3AF]">今日需处理</p>
                        <p className="text-[20px] font-bold text-[#111827]">{todayCount}</p>
                    </div>
                </div>
                <div className="card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                        <Bell size={18} className="text-[#3B82F6]" />
                    </div>
                    <div>
                        <p className="text-[12px] text-[#9CA3AF]">待处理</p>
                        <p className="text-[20px] font-bold text-[#111827]">{upcomingCount}</p>
                    </div>
                </div>
            </div>

            {/* 提醒列表 */}
            <div className="card">
                {reminders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <span className="text-[32px] mb-2">✅</span>
                        <p className="text-[14px] text-[#9CA3AF]">暂无待跟进事项</p>
                        <p className="text-[12px] text-[#D1D5DB]">所有询盘已处理完毕</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#F3F4F6]">
                        {reminders.map(rem => {
                            const urg = urgencyConfig[rem.urgency];
                            const scoreColor = (rem.inquiry.aiScore ?? 0) >= 70 ? '#10B981' : (rem.inquiry.aiScore ?? 0) >= 40 ? '#F59E0B' : '#EF4444';
                            return (
                                <div
                                    key={rem.inquiry.id}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                                    onClick={() => router.push(`/inquiries/${rem.inquiry.id}`)}
                                >
                                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: urg.dot }}></span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[14px] font-semibold text-[#111827]">
                                            {rem.inquiry.customerName} · {rem.action}
                                        </p>
                                        <p className="text-[12px] text-[#9CA3AF] truncate">
                                            {rem.inquiry.content.substring(0, 60)}...
                                        </p>
                                    </div>
                                    {rem.inquiry.aiScore && (
                                        <span className="text-[13px] font-bold" style={{ color: scoreColor }}>
                                            {rem.inquiry.aiScore}分
                                        </span>
                                    )}
                                    <span
                                        className="text-[12px] font-medium px-2.5 py-1 rounded-full shrink-0"
                                        style={{ color: urg.labelColor, backgroundColor: urg.labelBg }}
                                    >
                                        {rem.daysSince === 0 ? '今天' : `${rem.daysSince}天前`}
                                    </span>
                                    <button
                                        className="px-4 py-1.5 text-[13px] font-medium text-[#10B981] bg-[#D1FAE5] rounded-lg hover:bg-[#A7F3D0] transition-colors shrink-0"
                                        onClick={e => { e.stopPropagation(); router.push(`/inquiries/${rem.inquiry.id}`); }}
                                    >
                                        处理
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
