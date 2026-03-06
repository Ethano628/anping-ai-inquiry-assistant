'use client';

import { useState, useEffect } from 'react';
import { Building, Globe, Package, User, Save, CheckCircle } from 'lucide-react';

interface Settings {
    companyName: string;
    contactEmail: string;
    companyIntro: string;
    products: string[];
    uiLanguage: string;
    aiReplyLanguage: string;
    userName: string;
}

const defaultSettings: Settings = {
    companyName: '安平县丝网贸易有限公司',
    contactEmail: 'ethan@anpingmesh.com',
    companyIntro: '专业生产各类丝网产品，包括不锈钢丝网、镀锌丝网、焊接网片等，年产能 5000 吨，出口 60+ 国家',
    products: ['不锈钢丝网', '镀锌丝网', '焊接网片', '冲孔网', '护栏网', '钢格栅板'],
    uiLanguage: '简体中文',
    aiReplyLanguage: 'English',
    userName: 'Ethan',
};

const STORAGE_KEY = 'tradeai_settings';

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [saved, setSaved] = useState(false);
    const [newProduct, setNewProduct] = useState('');

    // 初始化：从 localStorage 读取
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setSettings(JSON.parse(stored));
        } catch { /* ignore */ }
    }, []);

    const update = (key: keyof Settings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const addProduct = () => {
        if (newProduct.trim() && !settings.products.includes(newProduct.trim())) {
            update('products', [...settings.products, newProduct.trim()]);
            setNewProduct('');
        }
    };

    const removeProduct = (p: string) => {
        update('products', settings.products.filter(x => x !== p));
    };

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const inputClass = "w-full px-3 py-2 text-[14px] bg-[#F0F4F8] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981]";

    return (
        <div className="space-y-6 max-w-3xl">
            {/* 公司信息 */}
            <div className="card p-6">
                <h2 className="text-[15px] font-semibold text-[#111827] mb-5 flex items-center gap-2">
                    <Building size={18} className="text-[#10B981]" />
                    公司信息
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[12px] font-medium text-[#6B7280] block mb-1.5">公司名称</label>
                        <input
                            type="text"
                            value={settings.companyName}
                            onChange={e => update('companyName', e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className="text-[12px] font-medium text-[#6B7280] block mb-1.5">联系邮箱</label>
                        <input
                            type="email"
                            value={settings.contactEmail}
                            onChange={e => update('contactEmail', e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-[12px] font-medium text-[#6B7280] block mb-1.5">公司简介（AI 生成回复时使用）</label>
                        <textarea
                            rows={3}
                            value={settings.companyIntro}
                            onChange={e => update('companyIntro', e.target.value)}
                            className={`${inputClass} resize-none`}
                        />
                    </div>
                </div>
            </div>

            {/* 产品信息 */}
            <div className="card p-6">
                <h2 className="text-[15px] font-semibold text-[#111827] mb-5 flex items-center gap-2">
                    <Package size={18} className="text-[#10B981]" />
                    主营产品
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                    {settings.products.map(p => (
                        <span
                            key={p}
                            className="group px-3 py-1.5 text-[13px] bg-[#D1FAE5] text-[#059669] rounded-full font-medium flex items-center gap-1.5 cursor-pointer hover:bg-[#A7F3D0] transition-colors"
                            onClick={() => removeProduct(p)}
                        >
                            {p}
                            <span className="text-[#10B981] group-hover:text-[#EF4444]">×</span>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newProduct}
                        onChange={e => setNewProduct(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addProduct()}
                        placeholder="输入产品名，回车添加"
                        className={`flex-1 ${inputClass}`}
                    />
                    <button
                        onClick={addProduct}
                        className="px-4 py-2 text-[13px] font-medium text-[#10B981] bg-[#D1FAE5] rounded-lg hover:bg-[#A7F3D0] transition-colors"
                    >
                        添加
                    </button>
                </div>
            </div>

            {/* 语言偏好 */}
            <div className="card p-6">
                <h2 className="text-[15px] font-semibold text-[#111827] mb-5 flex items-center gap-2">
                    <Globe size={18} className="text-[#10B981]" />
                    语言偏好
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[12px] font-medium text-[#6B7280] block mb-1.5">界面语言</label>
                        <select
                            value={settings.uiLanguage}
                            onChange={e => update('uiLanguage', e.target.value)}
                            className={inputClass}
                        >
                            <option>简体中文</option>
                            <option>English</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[12px] font-medium text-[#6B7280] block mb-1.5">AI 回复语言</label>
                        <select
                            value={settings.aiReplyLanguage}
                            onChange={e => update('aiReplyLanguage', e.target.value)}
                            className={inputClass}
                        >
                            <option>English</option>
                            <option>简体中文</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 账号管理 */}
            <div className="card p-6">
                <h2 className="text-[15px] font-semibold text-[#111827] mb-5 flex items-center gap-2">
                    <User size={18} className="text-[#10B981]" />
                    账号管理
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[12px] font-medium text-[#6B7280] block mb-1.5">用户名</label>
                        <input
                            type="text"
                            value={settings.userName}
                            onChange={e => update('userName', e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className="text-[12px] font-medium text-[#6B7280] block mb-1.5">邮箱</label>
                        <input
                            type="email"
                            value={settings.contactEmail}
                            disabled
                            className={`${inputClass} opacity-60 cursor-not-allowed`}
                        />
                    </div>
                </div>
            </div>

            {/* 保存按钮 */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium rounded-lg shadow-sm transition-all
                        ${saved
                            ? 'bg-[#D1FAE5] text-[#10B981]'
                            : 'bg-[#10B981] text-white hover:bg-[#059669]'
                        }`}
                >
                    {saved ? <><CheckCircle size={16} /> 已保存</> : <><Save size={16} /> 保存设置</>}
                </button>
            </div>
        </div>
    );
}
