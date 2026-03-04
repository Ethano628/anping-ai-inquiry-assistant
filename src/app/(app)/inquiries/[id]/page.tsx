import { notFound } from 'next/navigation';
import { inquiryService } from '@/services/inquiryService';
import InquiryDetailClient from '@/components/inquiries/InquiryDetailClient';

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Resolve dynamic params
    const resolvedParams = await params;

    // Fetch dynamic mock data
    const inquiry = await inquiryService.getInquiryDetails(resolvedParams.id);

    if (!inquiry) {
        notFound();
    }

    return (
        <InquiryDetailClient
            initialInquiry={inquiry}
            customer={inquiry.customer}
            tasks={inquiry.tasks}
        />
    );
}
