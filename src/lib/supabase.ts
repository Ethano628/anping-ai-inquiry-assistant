import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fail-Fast：禁止静默失败，强制要求正确配置环境变量
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local');
}

// 供服务端或客户端基础使用的匿名客户端
export const supabase = createClient(supabaseUrl, supabaseKey);
