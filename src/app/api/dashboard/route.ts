import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/dashboard — 仪表盘聚合数据
 */
export async function GET() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // 并行查询
    const [
        todayCountRes,
        pendingCountRes,
        followUpCountRes,
        latestRes,
        allForRemindersRes,
    ] = await Promise.all([
        // 今日新询盘
        supabase
            .from('inquiries')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', todayISO),
        // 待处理
        supabase
            .from('inquiries')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending'),
        // 需跟进（following_up 状态）
        supabase
            .from('inquiries')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'following_up'),
        // 最新 5 条询盘
        supabase
            .from('inquiries')
            .select('id, customer_name, customer_country, content, ai_score, source, created_at')
            .order('created_at', { ascending: false })
            .limit(5),
        // 需要跟进的询盘（待回复超过 1 天 或 跟进中）
        supabase
            .from('inquiries')
            .select('id, customer_name, customer_company, ai_summary, status, ai_score, created_at, updated_at')
            .in('status', ['pending', 'following_up', 'replied'])
            .order('created_at', { ascending: true })
            .limit(5),
    ]);

    // 生成跟进提醒
    const reminders = (allForRemindersRes.data || []).map((row: any) => {
        const createdAt = new Date(row.created_at);
        const now = new Date();
        const daysSince = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

        let urgency: 'overdue' | 'today' | 'upcoming' = 'upcoming';
        let action = '首次回复';

        if (row.status === 'pending' && daysSince >= 1) {
            urgency = 'overdue';
            action = '待回复（已超时）';
        } else if (row.status === 'pending') {
            urgency = 'today';
            action = '待回复';
        } else if (row.status === 'following_up') {
            urgency = daysSince >= 3 ? 'overdue' : 'today';
            action = '跟进中';
        } else if (row.status === 'replied') {
            urgency = daysSince >= 5 ? 'today' : 'upcoming';
            action = '报价跟进';
        }

        return {
            id: row.id,
            customerName: row.customer_name,
            action,
            urgency,
            daysSince,
        };
    });

    // 映射最新询盘
    const latestInquiries = (latestRes.data || []).map((row: any) => ({
        id: row.id,
        customerName: row.customer_name,
        customerCountry: row.customer_country,
        content: row.content?.substring(0, 80) || '',
        aiScore: row.ai_score,
        source: row.source,
        createdAt: row.created_at,
    }));

    return NextResponse.json({
        stats: {
            todayNew: todayCountRes.count || 0,
            pending: pendingCountRes.count || 0,
            followUp: followUpCountRes.count || 0,
        },
        latestInquiries,
        reminders,
    });
}
