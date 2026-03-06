import { NextResponse } from 'next/server';
import { inquiryService } from '@/services/inquiryService';

/**
 * POST /api/inquiries — 保存一条新询盘（含 AI 分析结果）
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 校验必填字段
        if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
            return NextResponse.json({ error: 'content is required' }, { status: 400 });
        }

        const result = await inquiryService.createInquiry({
            content: body.content,
            source: body.source || '其他',
            aiScore: body.aiScore ?? 0,
            aiSummary: body.aiSummary || '',
            aiRequirements: body.aiRequirements || {},
            aiReplyFormal: body.aiReplyFormal || '',
            aiReplyFriendly: body.aiReplyFriendly || '',
            aiReplyConcise: body.aiReplyConcise || '',
            priority: body.priority || 'medium',
            customerName: body.customerName,
            customerCompany: body.customerCompany,
            customerCountry: body.customerCountry,
            customerEmail: body.customerEmail,
        });

        if (!result) {
            return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: result }, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/inquiries:', error);
        return NextResponse.json({ error: 'Bad request payload' }, { status: 400 });
    }
}

/**
 * GET /api/inquiries — 获取所有询盘
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const inquiries = status
        ? await inquiryService.getInquiriesByStatus(status)
        : await inquiryService.getAllInquiries();

    return NextResponse.json({ data: inquiries });
}
