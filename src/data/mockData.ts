import { Customer, Inquiry, FollowUpTask, ReplyDraft, User } from '@/types';

export const mockUser: User = {
    id: 'u1',
    name: 'Admin',
    email: 'admin@anping-ai.com',
    role: 'admin',
};

export const mockCustomers: Customer[] = [
    {
        id: 'c1',
        name: 'John Smith',
        country: 'United States',
        company: 'BuildRight USA',
        email: 'john@buildright.com',
        status: 'high_intent',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'c2',
        name: 'Hans Müller',
        country: 'Germany',
        company: 'BauTech GmbH',
        email: 'hans@bautech.de',
        status: 'price_comparison',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'c3',
        name: 'Luis Garcia',
        country: 'Mexico',
        company: 'Cercas y Mallas SA',
        email: 'luis@cercasmallas.mx',
        status: 'sample_request',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

export const mockInquiries: Inquiry[] = [
    {
        id: 'i1',
        customerId: 'c1',
        productType: 'Welded Wire Mesh',
        content: 'Hi, we need 5 containers of 2x2 inch galvanized welded wire mesh (BWG 12). Please quote CIF Los Angeles. Urgent requirement.',
        source: 'Website',
        status: 'new',
        priority: 'high',
        tags: ['Urgent', 'High Intent'],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'i2',
        customerId: 'c2',
        productType: 'Stainless Steel Wire Mesh',
        content: 'Looking for 304 SS wire mesh, 100 mesh count, 1m x 30m rolls. Looking for your best price per roll.',
        source: 'Alibaba',
        status: 'following_up',
        priority: 'medium',
        tags: ['Price Comparison'],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'i3',
        customerId: 'c3',
        productType: 'Chain Link Fence',
        content: 'Do you provide samples for PVC coated chain link fence? We want to check the coating quality before placing a bulk order.',
        source: 'WhatsApp',
        status: 'new',
        priority: 'medium',
        tags: ['Sample Request'],
        createdAt: new Date().toISOString(), // Now
        updatedAt: new Date().toISOString(),
    }
];

export const mockFollowUpTasks: FollowUpTask[] = [
    {
        id: 't1',
        inquiryId: 'i1',
        assignedToUser: 'u1',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        status: 'pending',
        notes: 'Draft quote based on current shipping rates to LA.',
        createdAt: new Date().toISOString(),
    },
    {
        id: 't2',
        inquiryId: 'i2',
        assignedToUser: 'u1',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday (Overdue)
        status: 'overdue',
        notes: 'Check if they reviewed the pricing sent on Tuesday.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    }
];

export const mockReplyDrafts: ReplyDraft[] = [
    {
        id: 'd1',
        inquiryId: 'i1',
        content: `Dear John,
    
Thank you for your inquiry regarding our galvanized welded wire mesh. We have reviewed your requirement for 5 containers of 2x2 inch (BWG 12).

We are pleased to offer our quote for CIF Los Angeles as requested. Attached is the detailed proforma invoice. We can arrange shipment within 15 days upon receipt of the deposit.

Looking forward to your feedback.

Best regards,
Anping AI Inquiry Assistant`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];
