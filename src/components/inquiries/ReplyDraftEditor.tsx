'use client';

import { useState } from 'react';
import { Sparkles, Save, Check } from 'lucide-react';
import { aiReplyService } from '@/services/aiReplyService';

interface ReplyDraftEditorProps {
    inquiryId: string;
    productType: string;
}

export default function ReplyDraftEditor({ inquiryId, productType }: ReplyDraftEditorProps) {
    const [draftContent, setDraftContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleGenerateAI = async () => {
        setIsGenerating(true);
        try {
            const generated = await aiReplyService.generateDraft(inquiryId, productType);
            setDraftContent(generated);
        } catch (error) {
            console.error('Failed to generate draft', error);
            // Fallback
            setDraftContent('Error generating draft. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Mock save delay
        await new Promise(resolve => setTimeout(resolve, 600));
        console.log('Saved draft content to local state:', draftContent);
        setIsSaving(false);
        setSaveSuccess(true);

        // Reset success message after 3 seconds
        setTimeout(() => {
            setSaveSuccess(false);
        }, 3000);
    };

    return (
        <div className="bg-blue-50/50 p-6 rounded-xl shadow-sm border border-blue-100/60 transition-all">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                    <Sparkles size={18} className="text-blue-600" />
                    AI Reply Draft
                </h3>

                {!draftContent ? (
                    <button
                        onClick={handleGenerateAI}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors shadow-sm"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} />
                                Generate AI Reply
                            </>
                        )}
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleGenerateAI}
                            disabled={isGenerating}
                            className="px-3 py-1.5 bg-white text-blue-600 border border-blue-200 rounded-md text-sm font-medium hover:bg-blue-50 disabled:opacity-50 transition-colors"
                        >
                            {isGenerating ? 'Regenerating...' : 'Regenerate'}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !draftContent}
                            className={`flex items-center gap-2 px-4 py-1.5 text-white rounded-md text-sm font-medium transition-all shadow-sm ${saveSuccess
                                    ? 'bg-emerald-500 hover:bg-emerald-600'
                                    : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300'
                                }`}
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : saveSuccess ? (
                                <>
                                    <Check size={16} />
                                    Saved
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Draft
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {draftContent ? (
                <textarea
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    placeholder="AI generated draft will appear here. You can manually edit it before sending."
                    className="w-full text-sm text-slate-700 bg-white p-4 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[280px] leading-relaxed shadow-sm transition-shadow resize-y"
                />
            ) : (
                <div className="w-full min-h-[280px] border-2 border-dashed border-blue-200 rounded-lg flex flex-col items-center justify-center text-slate-400 bg-white/50">
                    <Sparkles size={32} className="mb-3 text-blue-200" />
                    <p className="text-sm">Click "Generate AI Reply" to create a draft based on the inquiry details.</p>
                </div>
            )}
        </div>
    );
}
