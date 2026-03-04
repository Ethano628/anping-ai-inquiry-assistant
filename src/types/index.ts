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

export type Priority = 'high' | 'medium' | 'low';
export type InquiryStatus = 'new' | 'replied' | 'following_up' | 'closed' | 'rejected';

export interface Inquiry {
    id: string;
    customerId: string;
    productType: string;
    content: string;
    source: string; // e.g., Alibaba, Website, WhatsApp
    status: InquiryStatus;
    priority: Priority;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'sales';
}

export interface FollowUpTask {
    id: string;
    inquiryId: string;
    assignedToUser: string;
    dueDate: string;
    status: 'pending' | 'completed' | 'overdue';
    notes?: string;
    createdAt: string;
}

export interface ReplyDraft {
    id: string;
    inquiryId: string;
    content: string;
    status: 'draft' | 'approved' | 'sent';
    createdAt: string;
    updatedAt: string;
}
