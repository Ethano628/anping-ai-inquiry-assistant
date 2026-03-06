'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import type { Inquiry, InquiryStatus } from '@/types';

const statusFilters: { key: InquiryStatus | 'all'; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待回复' },
    { key: 'replied', label: '已回复' },
    { key: 'following_up', label: '跟进中' },
    { key: 'closed', label: '已成单' },
    { key: 'abandoned', label: '已放弃' },
];

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
    pending: { label: '待回复', color: '#F59E0B', dot: '#F59E0B' },
    replied: { label: '已回复', color: '#10B981', dot: '#10B981' },
    following_up: { label: '跟进中', color: '#3B82F6', dot: '#3B82F6' },
    closed: { label: '已成单', color: '#10B981', dot: '#10B981' },
    abandoned: { label: '已放弃', color: '#EF4444', dot: '#EF4444' },
};

function getScoreColor(score: number | null) {
    if (!score) return '#9CA3AF';
    if (score >= 70) return '#10B981';
    if (score >= 40) return '#F59E0B';
    return '#EF4444';
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

export default function InquiryListClient() {
    const router = useRouter();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<InquiryStatus | 'all'>('all');
    const [search, setSearch] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // 拉取数据
    useEffect(() => {
        fetchInquiries();
    }, [activeFilter]);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const url = activeFilter === 'all'
                ? '/api/inquiries'
                : `/api/inquiries?status=${activeFilter}`;
            const res = await fetch(url);
            const json = await res.json();
            setInquiries(json.data || []);
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    // 更新状态
    const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
        setUpdatingId(id);
        try {
            const res = await fetch(`/api/inquiries/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setInquiries(prev =>
                    prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq)
                );
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    // 搜索过滤
    const filtered = inquiries.filter(inq => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (
            inq.customerName.toLowerCase().includes(s) ||
            (inq.customerCompany || '').toLowerCase().includes(s) ||
            (inq.customerCountry || '').toLowerCase().includes(s) ||
            inq.content.toLowerCase().includes(s)
        );
    });

    return (
        <div className="space-y-5">
            {/* 搜索 + 筛选 */}
            <div className="card p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="搜索公司名、产品、国家..."
                            className="w-full pl-9 pr-4 py-2 text-[13px] bg-[#F5F7FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981] placeholder:text-[#9CA3AF]"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {statusFilters.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setActiveFilter(f.key)}
                                className={`px-4 py-1.5 text-[13px] rounded-lg border transition-colors
                                    ${activeFilter === f.key
                                        ? 'bg-[#10B981] text-white border-[#10B981]'
                                        : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#10B981]'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 表格 */}
            <div className="card overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 size={24} className="animate-spin text-[#10B981]" />
                        <span className="ml-2 text-[14px] text-[#9CA3AF]">加载中...</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <span className="text-[32px] mb-2">📭</span>
                        <p className="text-[14px] text-[#9CA3AF]">
                            {search ? '没有找到匹配的询盘' : '暂无询盘记录'}
                        </p>
                        <p className="text-[12px] text-[#D1D5DB]">去「处理询盘」页面分析一条新询盘吧</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                                <th className="text-left text-[12px] font-semibold text-[#9CA3AF] px-5 py-3">客户</th>
                                <th className="text-left text-[12px] font-semibold text-[#9CA3AF] px-5 py-3">询盘摘要</th>
                                <th className="text-center text-[12px] font-semibold text-[#9CA3AF] px-5 py-3">意向评分</th>
                                <th className="text-left text-[12px] font-semibold text-[#9CA3AF] px-5 py-3">来源</th>
                                <th className="text-left text-[12px] font-semibold text-[#9CA3AF] px-5 py-3">状态</th>
                                <th className="text-left text-[12px] font-semibold text-[#9CA3AF] px-5 py-3">时间</th>
                                <th className="text-center text-[12px] font-semibold text-[#9CA3AF] px-5 py-3">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(inq => {
                                const st = statusConfig[inq.status] || statusConfig.pending;
                                return (
                                    <tr key={inq.id} className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB] transition-colors">
                                        <td className="px-5 py-4">
                                            <p className="text-[14px] font-semibold text-[#111827]">{inq.customerName}</p>
                                            {inq.customerCountry && (
                                                <p className="text-[12px] text-[#9CA3AF]">{inq.customerCountry}</p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-[13px] text-[#6B7280] truncate max-w-[200px]">
                                                {inq.content.substring(0, 60)}...
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="text-[14px] font-bold" style={{ color: getScoreColor(inq.aiScore) }}>
                                                {inq.aiScore ? `${inq.aiScore}分` : '-'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-[13px] text-[#6B7280]">{inq.source}</td>
                                        <td className="px-5 py-4">
                                            <select
                                                value={inq.status}
                                                onChange={e => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                                                disabled={updatingId === inq.id}
                                                className="text-[12px] font-medium px-2 py-1 rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                                                style={{ color: st.color }}
                                            >
                                                {statusFilters.filter(f => f.key !== 'all').map(f => (
                                                    <option key={f.key} value={f.key}>{f.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-5 py-4 text-[13px] text-[#9CA3AF]">
                                            {timeAgo(inq.createdAt)}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <button
                                                onClick={() => router.push(`/inquiries/${inq.id}`)}
                                                className={`px-4 py-1.5 text-[13px] font-medium rounded-lg transition-colors
                                                    ${inq.status === 'pending'
                                                        ? 'bg-[#10B981] text-white hover:bg-[#059669]'
                                                        : 'bg-[#F5F7FA] text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F0F4F8]'
                                                    }`}
                                            >
                                                {inq.status === 'pending' ? '处理' : '查看'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
