import { NextResponse } from 'next/server';
import { inquiryService } from '@/services/inquiryService';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;

        // 1. UUID 合法性校验
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
        if (!isValidUUID) {
            return NextResponse.json({ error: 'Invalid UUID format' }, { status: 400 });
        }

        const body = await request.json();
        const { status } = body;

        // 2. Status 允许值校验
        if (status !== 'replied' && status !== 'rejected') {
            return NextResponse.json({ error: 'Invalid status. Must be "replied" or "rejected"' }, { status: 400 });
        }

        // 3. 调用 Service 层执行更新
        const success = await inquiryService.updateInquiryStatus(id, status);

        if (success) {
            // 返回最小必要数据
            return NextResponse.json({
                success: true,
                data: { id, status }
            }, { status: 200 });
        } else {
            // Service 层更新失败（通常是查无记录或数据库报错）
            return NextResponse.json({ error: 'Inquiry not found or update failed' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error parsing request:', error);
        return NextResponse.json({ error: 'Bad request payload' }, { status: 400 });
    }
}
