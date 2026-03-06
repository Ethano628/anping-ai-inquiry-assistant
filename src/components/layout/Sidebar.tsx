'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    MessageSquarePlus,
    FolderOpen,
    Bell,
    Settings,
} from 'lucide-react';

const mainMenuItems = [
    { label: '仪表盘', icon: LayoutDashboard, href: '/dashboard' },
    { label: '处理询盘', icon: MessageSquarePlus, href: '/process', badge: 3 },
    { label: '询盘管理', icon: FolderOpen, href: '/inquiries' },
    { label: '跟进提醒', icon: Bell, href: '/follow-ups' },
];

const systemMenuItems = [
    { label: '设置', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-[200px] bg-white border-r border-[#E5E7EB] flex flex-col h-screen shrink-0">
            {/* Brand Logo */}
            <div className="px-5 py-6">
                <Link href="/dashboard" className="brand-logo text-[28px] leading-none tracking-tight block">
                    <span className="brand-trade">Trade</span>
                    <span className="brand-ai">AI</span>
                </Link>
            </div>

            {/* Main Menu */}
            <nav className="flex-1 px-3">
                <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider px-3 mb-2">主菜单</p>
                <ul className="space-y-1">
                    {mainMenuItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        const Icon = item.icon;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors group
                                        ${isActive
                                            ? 'bg-[#D1FAE5] text-[#10B981] font-semibold'
                                            : 'text-[#4B5563] hover:bg-[#F3F4F6]'
                                        }`}
                                >
                                    <Icon size={18} className={isActive ? 'text-[#10B981]' : 'text-[#9CA3AF] group-hover:text-[#6B7280]'} />
                                    <span className="flex-1">{item.label}</span>
                                    {item.badge && (
                                        <span className="bg-[#10B981] text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider px-3 mb-2 mt-8">系统</p>
                <ul className="space-y-1">
                    {systemMenuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors group
                                        ${isActive
                                            ? 'bg-[#D1FAE5] text-[#10B981] font-semibold'
                                            : 'text-[#4B5563] hover:bg-[#F3F4F6]'
                                        }`}
                                >
                                    <Icon size={18} className={isActive ? 'text-[#10B981]' : 'text-[#9CA3AF] group-hover:text-[#6B7280]'} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Profile */}
            <div className="px-4 py-4 border-t border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#10B981] flex items-center justify-center text-white font-bold text-[14px] shrink-0">
                        E
                    </div>
                    <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#111827] truncate">Ethan</p>
                        <p className="text-[11px] text-[#9CA3AF] truncate">安平丝网贸易</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
