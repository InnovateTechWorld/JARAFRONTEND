export interface Creator {
  id: string;
  name: string;
  bio: string;
  socialLinks: string[];
  jaraPageSlug: string;
  paymentPreferences: {
    currency: string;
    flutterwave_account?: string;
  };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentLink {
  id: string;
  creatorId: string;
  type: 'tip' | 'membership' | 'pay_per_view' | 'rental' | 'ticket' | 'product';
  title: string;
  description: string;
  price: number;
  currency: string;
  image_url?: string;
  successMessage: string;
  slug: string;
  isPublished: boolean;
  totalRevenue: number;
  totalTransactions: number;
  createdAt: string;
  updatedAt: string;
}

export interface LandingPage {
  id: string;
  creatorId: string;
  pageType: string;
  title: string;
  subtitle?: string;
  description: string;
  slug: string;
  isPublished: boolean;
  pageMetadata: Record<string, any>;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImageUrl?: string;
  heroBackgroundColor?: string;
  heroTextColor?: string;
  contentSections: ContentSection[];
  ctaButtons: CTAButton[];
  testimonials: Testimonial[];
  socialProof?: SocialProof;
  mediaGallery: MediaItem[];
  customCss?: string;
  themeSettings: ThemeSettings;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImageUrl?: string;
  analyticsSettings?: AnalyticsSettings;
  paymentLinks: string[];
  showSocialLinks: boolean;
  showTestimonials: boolean;
  showMediaGallery: boolean;
  contactFormEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContentSection {
  id: string;
  type: 'text' | 'image' | 'video' | 'cta' | 'testimonial' | 'gallery';
  content: any;
  styling: Record<string, any>;
  order: number;
}

export interface CTAButton {
  id: string;
  text: string;
  url: string;
  style: 'primary' | 'secondary' | 'outline';
  icon?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  review: string;
  rating: number;
  avatar?: string;
  title?: string;
}

export interface SocialProof {
  followers: number;
  reviews: number;
  customers?: number;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
  alt?: string;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
}

export interface AnalyticsSettings {
  googleAnalyticsId?: string;
  facebookPixelId?: string;
}

export interface Transaction {
  id: string;
  paymentLinkId: string;
  creatorId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  paymentMethod: 'flutterwave' | 'nowpayments';
  status: 'pending' | 'successful' | 'failed';
  transactionId: string;
  paymentReference: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalTransactions: number;
  publishedLinks: number;
  revenueByCurrency: Record<string, number>;
  recentRevenue: number;
  topPerformingLink?: any;
}

export interface AIPageSuggestion {
  title: string;
  subtitle: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  contentSections: ContentSection[];
  ctaButtons: CTAButton[];
  themeSettings: ThemeSettings;
}