'use client';

import { useState } from 'react';
import { Calendar, Building, Globe, Mail, Phone, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Inquiry, Customer, FollowUpTask } from '@/types';
import ReplyDraftEditor from './ReplyDraftEditor';

interface InquiryDetailClientProps {
    initialInquiry: Inquiry;
    customer: Customer | null;
    tasks: FollowUpTask[];
}

export default function InquiryDetailClient({ initialInquiry, customer, tasks }: InquiryDetailClientProps) {
    const [inquiry, setInquiry] = useState<Inquiry>(initialInquiry);
    const [actionFeedback, setActionFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // 【新增状态】：防重复点击与 loading 状态标记
    const [isUpdating, setIsUpdating] = useState(false);

    // 【替换原逻辑】：具备真实持久化、防重复点击、乐观UI展示与失败回滚能力的 handleUpdateStatus
    const handleUpdateStatus = async (newStatus: 'replied' | 'rejected') => {
        // 1. 防御：如果正在更新或者是相同状态，直接拦截
        if (isUpdating || inquiry.status === newStatus) return;

        // 2. 锁定按钮，防止重复提交
        setIsUpdating(true);
        const previousStatus = inquiry.status;

        // 3. 乐观 UI 更新：先让用户感觉瞬间成功
        setInquiry(prev => ({ ...prev, status: newStatus }));

        try {
            // 4. 发起真实的网络层持久化请求
            const response = await fetch(`/api/inquiries/${inquiry.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                // 如果 API 返回非 2xx，主动抛出异常走 catch 逻辑
                throw new Error('Failed to update status on server');
            }

            // 5. 成功后的体验：给出绿色 Toast 反馈
            setActionFeedback({
                message: `Inquiry successfully marked as ${newStatus}.`,
                type: 'success'
            });

        } catch (error) {
            console.error('Error during status update:', error);

            // 6. 失败回滚：如果网络请求失败，将状态悄悄回滚回之前的值
            setInquiry(prev => ({ ...prev, status: previousStatus }));

            // 给出红色错误提示
            setActionFeedback({
                message: `Failed to update status. Please try again.`,
                type: 'error'
            });
        } finally {
            // 7. 无论成功失败，解除按钮锁定
            setIsUpdating(false);

            // 3秒后自动清除 Toast
            setTimeout(() => {
                setActionFeedback(null);
            }, 3000);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto position-relative">
            {/* 顶部操作反馈栏 (Toast) */}
            {actionFeedback && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-md shadow-lg border text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-300 ${actionFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-red-50 text-red-900 border-red-200'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${actionFeedback.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {actionFeedback.message}
                </div>
            )}

            {/* Header 区 */}
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            {customer?.name || 'Unknown Customer'}
                        </h1>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize border shadow-sm ${inquiry.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200'
                            : inquiry.priority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                            {inquiry.priority} Priority
                        </span>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize border shadow-sm ${inquiry.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200'
                            : inquiry.status === 'replied' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : inquiry.status === 'new' ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                            {inquiry.status.replace('_', ' ')}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Globe size={14} className="text-slate-400" /> {customer?.country || 'Unknown Location'}</span>
                        <span className="flex items-center gap-1"><Building size={14} className="text-slate-400" /> {customer?.company || 'No Company'}</span>
                        <span className="flex items-center gap-1"><Calendar size={14} className="text-slate-400" /> {new Date(inquiry.createdAt).toLocaleString()}</span>
                    </div>

                    {/* Tags section */}
                    {inquiry.tags && inquiry.tags.length > 0 && (
                        <div className="flex gap-2 mt-3">
                            {inquiry.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 text-xs uppercase font-bold tracking-wider rounded bg-slate-100 text-slate-600 border border-slate-200">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                    <button
                        onClick={() => handleUpdateStatus('rejected')}
                        disabled={inquiry.status === 'rejected' || isUpdating}
                        className="flex items-center justify-center flex-1 md:flex-none px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                    >
                        {isUpdating && inquiry.status !== 'rejected' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {inquiry.status === 'rejected' ? 'Rejected' : 'Reject'}
                    </button>
                    <button
                        onClick={() => handleUpdateStatus('replied')}
                        disabled={inquiry.status === 'replied' || isUpdating}
                        className="flex items-center justify-center flex-1 md:flex-none px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                    >
                        {isUpdating && inquiry.status !== 'replied' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {inquiry.status === 'replied' ? 'Replied' : 'Mark as Replied'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Core Inquiry & AI */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2 border-b pb-3">
                            <Mail size={18} className="text-slate-400" />
                            Original Message
                        </h3>

                        <div className="mb-4">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Product Interested</span>
                            <p className="font-medium text-slate-900 bg-slate-50 inline-block px-3 py-1 rounded-md border border-slate-100">
                                {inquiry.productType}
                            </p>
                        </div>

                        <div>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Message Content</span>
                            <p className="text-slate-700 bg-slate-50 p-4 rounded-lg whitespace-pre-wrap leading-relaxed border border-slate-100 text-sm font-serif">
                                {inquiry.content}
                            </p>
                        </div>
                    </div>

                    {/* AI Reply generator component */}
                    <ReplyDraftEditor
                        inquiryId={inquiry.id}
                        productType={inquiry.productType}
                    />
                </div>

                {/* Right Column - Meta Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-semibold text-slate-900 mb-4 border-b pb-3 flex items-center gap-2">
                            <Building size={18} className="text-slate-400" />
                            Contact Info
                        </h3>
                        <div className="space-y-4 text-sm mt-2">
                            <div>
                                <span className="text-slate-500 block text-xs mb-1">Company</span>
                                <span className="font-medium text-slate-900">{customer?.company || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block text-xs mb-1">Email</span>
                                <a href={`mailto:${customer?.email}`} className="font-medium text-blue-600 hover:underline">{customer?.email}</a>
                            </div>
                            {customer?.phone && (
                                <div>
                                    <span className="text-slate-500 block text-xs mb-1">Phone</span>
                                    <span className="font-medium text-slate-900 flex items-center gap-1">
                                        <Phone size={14} className="text-slate-400" /> {customer.phone}
                                    </span>
                                </div>
                            )}
                            <div>
                                <span className="text-slate-500 block text-xs mb-1">Source</span>
                                <span className="font-medium text-slate-900">{inquiry.source}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-semibold text-slate-900 mb-4 border-b pb-3 flex items-center gap-2">
                            <Clock size={18} className="text-slate-400" />
                            Follow-up Tasks
                        </h3>

                        {tasks.length > 0 ? (
                            <div className="space-y-3 mt-2">
                                {tasks.map(task => {
                                    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
                                    return (
                                        <div key={task.id} className={`p-3 rounded-lg border text-sm ${isOverdue ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'
                                            }`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`font-medium ${isOverdue ? 'text-red-900' : 'text-slate-900'}`}>
                                                    {isOverdue && <AlertCircle size={14} className="inline mr-1 text-red-500 mb-0.5" />}
                                                    {isOverdue ? 'Overdue' : 'Due'}
                                                </span>
                                                <span className={isOverdue ? 'text-red-600 text-xs' : 'text-slate-500 text-xs'}>
                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className={isOverdue ? 'text-red-700' : 'text-slate-600'}>{task.notes}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 py-4 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">No active follow-up tasks.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
