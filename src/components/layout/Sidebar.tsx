import Link from 'next/link';
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    CheckSquare,
    Settings
} from 'lucide-react';

export default function Sidebar() {
    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Inquiries', href: '/inquiries', icon: MessageSquare },
        { name: 'Follow-ups', href: '/follow-ups', icon: CheckSquare },
        { name: 'Customers', href: '/customers', icon: Users },
    ];

    return (
        <aside className="w-64 bg-slate-900 min-h-screen text-slate-300 flex flex-col hidden md:flex">
            <div className="p-6">
                <h1 className="text-xl font-bold text-white tracking-tight">Anping AI Assistant</h1>
                <p className="text-sm text-slate-500 mt-1">B2B Wire Mesh Platform</p>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </Link>
            </div>
        </aside>
    );
}
