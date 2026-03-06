'use client';

import { usePathname } from 'next/navigation';
import { Search, BellDot, FileDown, Plus } from 'lucide-react';

const pageTitles: Record<string, string> = {
    '/dashboard': '今日概览',
    '/process': 'AI 询盘处理',
    '/inquiries': '询盘管理',
    '/follow-ups': '跟进提醒',
    '/settings': '设置',
};

export default function Header() {
    const pathname = usePathname();

    // 匹配当前页面标题
    const title = Object.entries(pageTitles).find(([path]) =>
        pathname === path || pathname.startsWith(path + '/')
    )?.[1] || '今日概览';

    // 根据页面显示不同的动作按钮
    const showExport = pathname === '/dashboard' || pathname === '/inquiries';
    const showNewInquiry = pathname === '/dashboard' || pathname === '/inquiries';

    // 获取当前日期
    const today = new Date();
    const dateStr = today.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });

    return (
        <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 shrink-0">
            {/* Left — Page Title */}
            <div>
                <h1 className="text-[16px] font-semibold text-[#111827]" style={{ fontFamily: "'Sora', sans-serif" }}>
                    {title}
                </h1>
                {pathname === '/dashboard' && (
                    <p className="text-[12px] text-[#10B981]">{dateStr}</p>
                )}
            </div>

            {/* Right — Actions */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                        type="text"
                        placeholder="搜索公司名、产品、国家..."
                        className="pl-9 pr-4 py-2 text-[13px] bg-[#F5F7FA] border border-[#E5E7EB] rounded-lg w-[240px] focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981] transition-colors placeholder:text-[#9CA3AF]"
                    />
                </div>

                {/* Notification Bell */}
                <button className="relative p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors">
                    <BellDot size={20} className="text-[#6B7280]" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444]"></span>
                </button>

                {/* Action Buttons */}
                {showExport && (
                    <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-[#4B5563] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors shadow-sm">
                        <FileDown size={16} />
                        导出报告
                    </button>
                )}
                {showNewInquiry && (
                    <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-[#10B981] rounded-lg hover:bg-[#059669] transition-colors shadow-sm">
                        <Plus size={16} />
                        新建询盘
                    </button>
                )}

                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white font-bold text-[13px] cursor-pointer">
                    E
                </div>
            </div>
        </header>
    );
}
