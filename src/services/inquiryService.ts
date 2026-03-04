import 'server-only';
import { supabase } from '@/lib/supabase';
import { Inquiry, Customer, FollowUpTask } from '@/types';

export interface InquiryDetail extends Inquiry {
    customer: Customer | null;
    tasks: FollowUpTask[];
}

export const inquiryService = {
    getAllInquiries: async (): Promise<(Inquiry & { customer: Customer | null })[]> => {
        const { data, error } = await supabase
            .from('inquiries')
            .select(`
                id,
                customerId:customer_id,
                productType:product_type,
                content,
                source,
                status,
                priority,
                tags,
                createdAt:created_at,
                updatedAt:updated_at,
                customer:customers (
                    id, 
                    name, 
                    country, 
                    company, 
                    email, 
                    phone, 
                    status, 
                    createdAt:created_at
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching inquiries from Supabase:', error);
            return [];
        }

        return data.map((item: any) => ({
            ...item,
            customer: Array.isArray(item.customer) ? item.customer[0] : item.customer
        })) as (Inquiry & { customer: Customer | null })[];
    },

    getInquiryDetails: async (id: string): Promise<InquiryDetail | null> => {
        // 进行初步 UUID 简单校验，防止向 Supabase 发起注定 400 的格式错误请求
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
        if (!isValidUUID) {
            return null; // 非法 UUID 直接返回 null，触发 404
        }

        const { data: inquiry, error } = await supabase
            .from('inquiries')
            .select(`
                id,
                customerId:customer_id,
                productType:product_type,
                content,
                source,
                status,
                priority,
                tags,
                createdAt:created_at,
                updatedAt:updated_at,
                customer:customers (
                    id, name, country, company, email, phone, status, createdAt:created_at
                ),
                tasks:follow_up_tasks (
                    id, 
                    inquiryId:inquiry_id, 
                    assignedToUser:assigned_to_user, 
                    dueDate:due_date, 
                    status, 
                    notes, 
                    createdAt:created_at
                )
            `)
            .eq('id', id)
            .maybeSingle(); // 使用 maybeSingle 确保当找不到记录时不抛出异常而是返回 null/空

        if (error || !inquiry) {
            if (error) console.error('Error fetching inquiry details from Supabase:', error.message);
            return null;
        }

        return {
            ...inquiry,
            customer: Array.isArray(inquiry.customer) ? inquiry.customer[0] : inquiry.customer,
            tasks: inquiry.tasks || []
        } as InquiryDetail;
    },

    updateInquiryStatus: async (id: string, status: Inquiry['status']): Promise<boolean> => {
        const { error } = await supabase
            .from('inquiries')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error('Error updating inquiry status in Supabase:', error.message);
            return false;
        }

        return true;
    }
};
