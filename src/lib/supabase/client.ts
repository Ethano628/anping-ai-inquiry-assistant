import { createBrowserClient } from '@supabase/ssr';

/**
 * 客户端 Supabase — 用于 React 组件中
 */
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}
