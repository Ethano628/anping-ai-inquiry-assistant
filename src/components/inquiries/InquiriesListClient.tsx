'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, Inbox } from 'lucide-react';
import { Inquiry, Customer, InquiryStatus } from '@/types';

type InquiryWithCustomer = Inquiry & { customer: Customer | null };

export default function InquiriesListClient({ initialInquiries }: { initialInquiries: InquiryWithCustomer[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'all'>('all');

    // 本地过滤逻辑
    const filteredInquiries = useMemo(() => {
        return initialInquiries.filter(inquiry => {
            const matchesSearch =
                inquiry.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inquiry.customer?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inquiry.productType.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [initialInquiries, searchTerm, statusFilter]);

    return (
        <div className="space-y-6">
            {/* 顶部工具栏 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inquiries</h1>

                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by customer, company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as InquiryStatus | 'all')}
                            className="pl-9 pr-8 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm appearance-none bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="new">New</option>
                            <option value="following_up">Following Up</option>
                            <option value="replied">Replied</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 数据表格区域 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {filteredInquiries.length > 0 ? (
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tags</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredInquiries.map((inquiry) => {
                                const customer = inquiry.customer;
                                return (
                                    <tr key={inquiry.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link href={`/inquiries/${inquiry.id}`} className="block group">
                                                <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{customer?.name}</div>
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    {customer?.company && <span>{customer.company}</span>}
                                                    {customer?.company && customer?.country && <span>•</span>}
                                                    {customer?.country && <span>{customer.country}</span>}
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{inquiry.productType}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize border shadow-sm ${inquiry.status === 'new' ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                    : inquiry.status === 'following_up' ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                        : inquiry.status === 'replied' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : 'bg-slate-100 text-slate-700 border-slate-200'
                                                }`}>
                                                {inquiry.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize border shadow-sm ${inquiry.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200'
                                                    : inquiry.priority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                }`}>
                                                {inquiry.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                {inquiry.tags?.map(tag => (
                                                    <span key={tag} className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-slate-100 text-slate-600 border border-slate-200">
                                                        {tag}
                                                    </span>
                                                )) || <span className="text-slate-400 text-sm">-</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={`/inquiries/${inquiry.id}`} className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    /* 空状态展示 */
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="bg-slate-100 p-4 rounded-full mb-4">
                            <Inbox size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No inquiries found</h3>
                        <p className="text-slate-500 max-w-sm">
                            {searchTerm || statusFilter !== 'all'
                                ? "We couldn't find any inquiries matching your current filters. Try adjusting your search."
                                : "You don't have any incoming inquiries yet."}
                        </p>
                        {(searchTerm || statusFilter !== 'all') && (
                            <button
                                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                                className="mt-4 text-blue-600 font-medium hover:underline text-sm"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
