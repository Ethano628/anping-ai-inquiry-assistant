import { Bell, Search, UserCircle } from 'lucide-react';
import { mockUser } from '@/data/mockData';

export default function Header() {
    return (
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center flex-1">
                <div className="relative w-64 md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search inquiries, products..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-md focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 outline-none text-sm transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-900">{mockUser.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{mockUser.role}</p>
                    </div>
                    <button className="text-slate-500 hover:text-slate-700 transition-colors">
                        <UserCircle size={32} />
                    </button>
                </div>
            </div>
        </header>
    );
}
