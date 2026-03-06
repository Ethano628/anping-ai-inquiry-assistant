// ===== 客户相关 =====
export type CustomerStatus = 'high_intent' | 'price_comparison' | 'sample_request' | 'invalid';

export interface Customer {
    id: string;
    name: string;
    country: string;
    company?: string;
    email: string;
    phone?: string;
    status?: CustomerStatus;
    createdAt: string;
}

// ===== 询盘相关 =====
export type Priority = 'high' | 'medium' | 'low' | 'ignore';
export type InquiryStatus = 'pending' | 'replied' | 'following_up' | 'closed' | 'abandoned';

export interface InquiryRequirements {
    product: string;
    specs: string;
    quantity: string;
    destination: string;
    concerns: string;
    customerType: string;
}

export interface Inquiry {
    id: string;
    // 基础信息
    content: string;
    source: string;
    status: InquiryStatus;
    priority: Priority;
    // AI 分析结果
    aiScore: number | null;
    aiSummary: string | null;
    aiRequirements: InquiryRequirements | null;
    aiReplyFormal: string | null;
    aiReplyFriendly: string | null;
    aiReplyConcise: string | null;
    // 客户信息（直接嵌入，简化 MVP）
    customerName: string;
    customerCompany: string | null;
    customerCountry: string | null;
    customerEmail: string | null;
    // 时间戳
    createdAt: string;
    updatedAt: string;
}

// ===== 用户 =====
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'sales';
}

// ===== 跟进任务 =====
export interface FollowUpTask {
    id: string;
    inquiryId: string;
    assignedToUser: string;
    dueDate: string;
    status: 'pending' | 'completed' | 'overdue';
    notes?: string;
    createdAt: string;
}

// ===== 回复草稿 (保留兼容) =====
export interface ReplyDraft {
    id: string;
    inquiryId: string;
    content: string;
    status: 'draft' | 'approved' | 'sent';
    createdAt: string;
    updatedAt: string;
}
