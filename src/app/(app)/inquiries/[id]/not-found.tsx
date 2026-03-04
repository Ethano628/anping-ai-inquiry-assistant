import Link from 'next/link';
import { SearchX, ArrowLeft } from 'lucide-react';

export default function InquiryNotFound() {
    return (
        <div className="flex justify-center items-center min-h-[60vh] px-4">
            <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-slate-100 max-w-lg w-full">
                <div className="flex justify-center mb-6">
                    <div className="bg-slate-100 p-5 rounded-full">
                        <SearchX size={48} className="text-slate-400" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                    Inquiry Not Found
                </h2>

                <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
                    We couldn't find the inquiry you're looking for. It might have been deleted, or the URL may be incorrect.
                </p>

                <Link
                    href="/inquiries"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <ArrowLeft size={18} />
                    Back to Inquiries
                </Link>
            </div>
        </div>
    );
}
