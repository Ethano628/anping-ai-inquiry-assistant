export default function DashboardPage() {
    return (
        <div className="space-y-6 flex flex-col items-start gap-4 p-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <p className="text-slate-500 max-w-2xl">
                Overview of your inquiry statistics and follow-up tasks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Total Inquiries</h3>
                    <p className="text-3xl font-bold text-slate-900">124</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Pending Follow-ups</h3>
                    <p className="text-3xl font-bold text-amber-600">12</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">High Intent</h3>
                    <p className="text-3xl font-bold text-emerald-600">8</p>
                </div>
            </div>
        </div>
    );
}
