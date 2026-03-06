-- TradeAI MVP · 询盘表重建
-- 运行于 Supabase SQL Editor

-- 1. 删除旧表（如果存在残留的旧结构）
DROP TABLE IF EXISTS follow_up_tasks CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- 2. 创建新的询盘表（MVP 简化版：客户信息直接嵌入）
CREATE TABLE inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- 基础信息
    content TEXT NOT NULL,                            -- 询盘原文
    source VARCHAR(50) NOT NULL DEFAULT '其他',        -- 来源平台
    status VARCHAR(20) NOT NULL DEFAULT 'pending',     -- pending | replied | following_up | closed | abandoned
    priority VARCHAR(10) NOT NULL DEFAULT 'medium',    -- high | medium | low | ignore
    
    -- AI 分析结果
    ai_score INTEGER,                                  -- 真实性评分 0-100
    ai_summary TEXT,                                   -- AI 分析说明
    ai_requirements JSONB,                             -- 结构化需求 { product, specs, quantity, ... }
    ai_reply_formal TEXT,                              -- 正式风格回复
    ai_reply_friendly TEXT,                            -- 友好风格回复
    ai_reply_concise TEXT,                             -- 简洁风格回复
    
    -- 客户信息（直接嵌入，简化 MVP）
    customer_name VARCHAR(200) NOT NULL DEFAULT '未知买家',
    customer_company VARCHAR(200),
    customer_country VARCHAR(100),
    customer_email VARCHAR(200),
    
    -- 时间戳
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inquiries_updated_at
    BEFORE UPDATE ON inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. 索引
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_priority ON inquiries(priority);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);

-- 5. 启用 RLS（行级安全，暂时允许匿名访问）
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON inquiries FOR ALL USING (true) WITH CHECK (true);
