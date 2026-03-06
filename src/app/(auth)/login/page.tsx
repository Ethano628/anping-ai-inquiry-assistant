'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message === 'Invalid login credentials'
                ? '邮箱或密码错误'
                : error.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-4">
            <div className="w-full max-w-[400px]">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="brand-logo text-[36px] leading-none tracking-tight">
                        <span className="brand-trade">Trade</span>
                        <span className="brand-ai">AI</span>
                    </h1>
                    <p className="text-[14px] text-[#9CA3AF] mt-2">外贸询盘 AI 智能助手</p>
                </div>

                {/* Login Card */}
                <div className="card p-8">
                    <h2 className="text-[18px] font-bold text-[#111827] mb-6">登录账号</h2>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-[12px] font-medium text-[#6B7280] block mb-1.5">邮箱地址</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full px-3 py-2.5 text-[14px] bg-[#F0F4F8] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981]"
                            />
                        </div>
                        <div>
                            <label className="text-[12px] font-medium text-[#6B7280] block mb-1.5">密码</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="至少 6 位"
                                required
                                className="w-full px-3 py-2.5 text-[14px] bg-[#F0F4F8] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981]"
                            />
                        </div>

                        {error && (
                            <p className="text-[13px] text-[#EF4444] bg-[#FEE2E2] px-3 py-2 rounded-lg">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 text-[14px] font-semibold text-white bg-[#10B981] rounded-lg hover:bg-[#059669] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {loading ? <><Loader2 size={16} className="animate-spin" /> 登录中...</> : '登 录'}
                        </button>
                    </form>

                    <p className="text-center text-[13px] text-[#9CA3AF] mt-6">
                        还没有账号？
                        <Link href="/register" className="text-[#10B981] font-medium hover:underline ml-1">
                            立即注册
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
