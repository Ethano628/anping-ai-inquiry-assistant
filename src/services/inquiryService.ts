import 'server-only';
import { supabase } from '@/lib/supabase';
import type { Inquiry, InquiryRequirements } from '@/types';

/**
 * 将 Supabase 返回的 snake_case 行映射为前端的 camelCase Inquiry 对象
 */
function mapRow(row: any): Inquiry {
    return {
        id: row.id,
        content: row.content,
        source: row.source,
        status: row.status,
        priority: row.priority,
        aiScore: row.ai_score,
        aiSummary: row.ai_summary,
        aiRequirements: row.ai_requirements as InquiryRequirements | null,
        aiReplyFormal: row.ai_reply_formal,
        aiReplyFriendly: row.ai_reply_friendly,
        aiReplyConcise: row.ai_reply_concise,
        customerName: row.customer_name,
        customerCompany: row.customer_company,
        customerCountry: row.customer_country,
        customerEmail: row.customer_email,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export const inquiryService = {
    /**
     * 获取所有询盘（按创建时间倒序）
     */
    getAllInquiries: async (): Promise<Inquiry[]> => {
        const { data, error } = await supabase
            .from('inquiries')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching inquiries:', error.message);
            return [];
        }

        return (data || []).map(mapRow);
    },

    /**
     * 按状态筛选询盘
     */
    getInquiriesByStatus: async (status: string): Promise<Inquiry[]> => {
        const { data, error } = await supabase
            .from('inquiries')
            .select('*')
            .eq('status', status)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching inquiries by status:', error.message);
            return [];
        }

        return (data || []).map(mapRow);
    },

    /**
     * 获取单条询盘详情
     */
    getInquiryById: async (id: string): Promise<Inquiry | null> => {
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
        if (!isValidUUID) return null;

        const { data, error } = await supabase
            .from('inquiries')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error || !data) {
            if (error) console.error('Error fetching inquiry:', error.message);
            return null;
        }

        return mapRow(data);
    },

    /**
     * 保存一条新询盘（含 AI 分析结果）
     */
    createInquiry: async (inquiry: {
        content: string;
        source: string;
        aiScore: number;
        aiSummary: string;
        aiRequirements: InquiryRequirements;
        aiReplyFormal: string;
        aiReplyFriendly: string;
        aiReplyConcise: string;
        priority: string;
        customerName?: string;
        customerCompany?: string;
        customerCountry?: string;
        customerEmail?: string;
    }): Promise<Inquiry | null> => {
        const { data, error } = await supabase
            .from('inquiries')
            .insert({
                content: inquiry.content,
                source: inquiry.source,
                status: 'pending',
                priority: inquiry.priority,
                ai_score: inquiry.aiScore,
                ai_summary: inquiry.aiSummary,
                ai_requirements: inquiry.aiRequirements,
                ai_reply_formal: inquiry.aiReplyFormal,
                ai_reply_friendly: inquiry.aiReplyFriendly,
                ai_reply_concise: inquiry.aiReplyConcise,
                customer_name: inquiry.customerName || '未知买家',
                customer_company: inquiry.customerCompany || null,
                customer_country: inquiry.customerCountry || null,
                customer_email: inquiry.customerEmail || null,
            })
            .select()
            .single();

        if (error || !data) {
            console.error('Error creating inquiry:', error?.message);
            return null;
        }

        return mapRow(data);
    },

    /**
     * 更新询盘状态
     */
    updateStatus: async (id: string, status: string): Promise<boolean> => {
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
        if (!isValidUUID) return false;

        const { error } = await supabase
            .from('inquiries')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error('Error updating status:', error.message);
            return false;
        }

        return true;
    },
};
