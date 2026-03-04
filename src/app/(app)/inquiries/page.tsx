import { inquiryService } from '@/services/inquiryService';
import InquiriesListClient from '@/components/inquiries/InquiriesListClient';

export default async function InquiriesPage() {
    const inquiries = await inquiryService.getAllInquiries();

    return <InquiriesListClient initialInquiries={inquiries} />;
}
