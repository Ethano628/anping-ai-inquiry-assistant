export const aiReplyService = {
    /**
     * Generates a draft reply for a given inquiry based on product and context.
     * This currently mocks a delay and returns predefined text.
     * In future stages, this will be replaced with an actual API call (e.g., OpenAI/Gemini).
     */
    generateDraft: async (inquiryId: string, productType: string): Promise<string> => {
        // Simulate a longer AI processing delay (2 seconds)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simple mock logic based on product type
        if (productType.toLowerCase().includes('welded')) {
            return `Dear Customer,\n\nThank you for reaching out regarding our ${productType}. We have carefully reviewed your requirement.\n\nWe are currently calculating the best CIF prices based on your specifications and will provide the detailed proforma invoice shortly.\n\nPlease let us know if there are any additional specifications we should consider.\n\nBest regards,\nAnping Wire Mesh AI Assistant`;
        } else if (productType.toLowerCase().includes('stainless')) {
            return `Hello,\n\nWe appreciate your inquiry about our ${productType}. Our stainless steel products feature excellent corrosion resistance and undergo strict quality control.\n\nWe can supply the requested mesh count and roll dimensions. A formal quotation is being prepared and will be sent to you by tomorrow.\n\nKind regards,\nSales Team`;
        }

        // Default reply
        return `Hi there,\n\nThank you for your interest in our ${productType}. We have received your inquiry and our engineering team is reviewing your requirements.\n\nWe will get back to you with a comprehensive quote and options within 24 hours.\n\nBest,\nCustomer Service`;
    }
};
