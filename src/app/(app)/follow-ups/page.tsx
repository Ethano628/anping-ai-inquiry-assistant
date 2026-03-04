export default function FollowUpsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Follow-ups</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <p className="text-slate-500">Upcoming and overdue follow-up tasks will be displayed here.</p>
                <div className="mt-4 space-y-4">
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex justify-between items-center">
                        <div>
                            <h4 className="font-semibold text-red-800">Check pricing with Hans Müller</h4>
                            <p className="text-sm text-red-600">Overdue by 1 day - Stainless Steel Wire Mesh</p>
                        </div>
                        <button className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded hover:bg-red-200">Mark Done</button>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-lg flex justify-between items-center">
                        <div>
                            <h4 className="font-semibold text-slate-800">Draft quote based on current shipping rates</h4>
                            <p className="text-sm text-slate-500">Due Tomorrow - Welded Wire Mesh</p>
                        </div>
                        <button className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded hover:bg-slate-200">Mark Done</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
