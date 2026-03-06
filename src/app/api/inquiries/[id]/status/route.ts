import { NextResponse } from 'next/server';
import { inquiryService } from '@/services/inquiryService';

/**
 * PATCH /api/inquiries/[id]/status — 更新询盘状态
 */
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
        if (!isValidUUID) {
            return NextResponse.json({ error: 'Invalid UUID format' }, { status: 400 });
        }

        const body = await request.json();
        const { status } = body;

        const validStatuses = ['pending', 'replied', 'following_up', 'closed', 'abandoned'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
        }

        const success = await inquiryService.updateStatus(id, status);

        if (success) {
            return NextResponse.json({ success: true, data: { id, status } });
        } else {
            return NextResponse.json({ error: 'Inquiry not found or update failed' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error in PATCH /api/inquiries/[id]/status:', error);
        return NextResponse.json({ error: 'Bad request payload' }, { status: 400 });
    }
}
