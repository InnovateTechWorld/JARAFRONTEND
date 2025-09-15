import { GoogleGenerativeAI } from '@google/generative-ai';

// Note: In production, this should be handled by your backend
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface AIPageGenerationRequest {
  creatorName: string;
  creatorBio: string;
  businessType: string;
  targetAudience: string;
  primaryGoal: string;
  brandColors?: string[];
  uploadedImages?: string[];
}

export async function generatePageWithAI(request: AIPageGenerationRequest) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Create a comprehensive landing page design for a creator named "${request.creatorName}".

Creator Details:
- Name: ${request.creatorName}
- Bio: ${request.creatorBio}
- Business Type: ${request.businessType}
- Target Audience: ${request.targetAudience}
- Primary Goal: ${request.primaryGoal}
${request.brandColors ? `- Brand Colors: ${request.brandColors.join(', ')}` : ''}

Please generate a JSON response with the following structure:
{
  "title": "Page title",
  "subtitle": "Page subtitle",
  "description": "Meta description",
  "heroTitle": "Compelling hero headline",
  "heroSubtitle": "Supporting hero text",
  "heroDescription": "Detailed hero description",
  "contentSections": [
    {
      "id": "unique-id",
      "type": "text|image|cta",
      "content": "Section content",
      "styling": {"textAlign": "center", "fontSize": "18px"},
      "order": 1
    }
  ],
  "ctaButtons": [
    {
      "id": "unique-id",
      "text": "Button text",
      "url": "#contact",
      "style": "primary|secondary|outline",
      "icon": "lucide-icon-name"
    }
  ],
  "themeSettings": {
    "primaryColor": "#8B5CF6",
    "secondaryColor": "#3B82F6",
    "accentColor": "#10B981",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "fontFamily": "Inter",
    "borderRadius": "8px"
  },
  "testimonials": [
    {
      "id": "unique-id",
      "name": "Customer name",
      "review": "Testimonial text",
      "rating": 5,
      "title": "Customer title"
    }
  ]
}

Make the content engaging, professional, and tailored to the creator's business type and target audience. Use modern web design principles and ensure the content is conversion-optimized.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }
    
    const aiSuggestion = JSON.parse(jsonMatch[0]);
    return aiSuggestion;
  } catch (error) {
    console.error('Error generating page with AI:', error);
    throw new Error('Failed to generate page with AI. Please try again.');
  }
}

export async function improveContentWithAI(content: string, context: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
Improve the following content for a creator's landing page:

Context: ${context}
Current Content: ${content}

Please provide an improved version that is:
- More engaging and conversion-focused
- Better written and professional
- Optimized for the target audience
- Concise but impactful

Return only the improved content, no additional formatting or explanations.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error improving content with AI:', error);
    return content; // Return original content if AI fails
  }
}