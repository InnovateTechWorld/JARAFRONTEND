import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api, LandingPage, PaymentLink } from '../lib/api';
import { Creator } from '../types';
import {
  CreditCard,
  User,
  Globe,
  Heart,
  Users,
  Eye,
  Calendar,
  Ticket,
  Package,
  DollarSign,
  ExternalLink,
  ArrowLeft,
  Instagram,
  Twitter,
  Youtube,
  Music,
  Link as LinkIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface JaraPageData {
  success: boolean;
  landingPage: LandingPage;
}

interface RawCreatorResponse {
  id: string;
  name: string;
  bio: string;
  social_links: string[];
  profile_image?: string;
  background_image?: string;
  payment_preferences: {
    currency: string;
    flutterwave_account?: string;
  };
  jara_page_slug: string;
  created_at: string;
  updated_at: string;
}

export function JaraPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<JaraPageData | null>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [creatorPaymentLinks, setCreatorPaymentLinks] = useState<PaymentLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadJaraPage();
    }
  }, [slug]);

  const loadJaraPage = async () => {
    if (!slug) return;

    try {
      setIsLoading(true);
      console.log('Loading Jara page for slug:', slug);
      const response = await api.getLandingPageBySlug(slug) as { success: boolean; landingPage: LandingPage };
      console.log('Landing page response:', response);

      if (response.success && response.landingPage) {
        setPageData(response);
        console.log('Landing page data set:', response.landingPage);

        // Fetch creator information using creator_id from landing page
        if (response.landingPage.creator_id) {
          console.log('Fetching creator data for ID:', response.landingPage.creator_id);
          try {
            const creatorResponse = await api.getCreator(response.landingPage.creator_id) as unknown as { success: boolean; creator: RawCreatorResponse };
            console.log('Creator response:', creatorResponse);

            if (creatorResponse.success && creatorResponse.creator) {
              // Transform snake_case to camelCase for the Creator type
              const transformedCreator: Creator = {
                id: creatorResponse.creator.id,
                name: creatorResponse.creator.name,
                bio: creatorResponse.creator.bio,
                socialLinks: creatorResponse.creator.social_links || [],
                profileImage: creatorResponse.creator.profile_image,
                backgroundImage: creatorResponse.creator.background_image,
                paymentPreferences: creatorResponse.creator.payment_preferences,
                jaraPageSlug: creatorResponse.creator.jara_page_slug,
                isPublished: true, // Assume published if we have a page
                createdAt: creatorResponse.creator.created_at,
                updatedAt: creatorResponse.creator.updated_at,
              };

              console.log('Transformed creator:', transformedCreator);
              setCreator(transformedCreator);

              // Fetch creator's payment links
              try {
                const paymentLinksResponse = await api.getPaymentLinks(transformedCreator.id, { published: true });
                if (paymentLinksResponse.success) {
                  console.log('Creator payment links:', paymentLinksResponse.paymentLinks);
                  setCreatorPaymentLinks(paymentLinksResponse.paymentLinks);
                }
              } catch (paymentLinksError) {
                console.error('Error fetching creator payment links:', paymentLinksError);
                // Continue without payment links
              }
            }
          } catch (creatorError) {
            console.error('Error fetching creator:', creatorError);
            // Continue without creator data - use metadata fallback
          }
        } else {
          console.log('No creator_id found in landing page');
        }
      } else {
        throw new Error('Landing page not found');
      }
    } catch (error) {
      console.error('Error loading Jara page:', error);
      toast.error('Page not found');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentTypeIcon = (type: string) => {
    const icons = {
      tip: Heart,
      membership: Users,
      pay_per_view: Eye,
      rental: Calendar,
      ticket: Ticket,
      product: Package,
    };
    return icons[type as keyof typeof icons] || CreditCard;
  };

  const getSocialIcon = (url: string) => {
    if (url.includes('instagram')) return Instagram;
    if (url.includes('twitter') || url.includes('x.com')) return Twitter;
    if (url.includes('youtube') || url.includes('youtu.be')) return Youtube;
    if (url.includes('linkedin')) return LinkIcon; // Use LinkIcon for now
    if (url.includes('facebook')) return LinkIcon; // Use LinkIcon for now
    if (url.includes('tiktok')) return LinkIcon; // Use LinkIcon for now
    if (url.includes('music') || url.includes('spotify') || url.includes('soundcloud')) return Music;
    return LinkIcon;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (!pageData?.success || !pageData.landingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const { landingPage } = pageData;

  // Use fetched creator data, fallback to metadata
  const creatorInfo = creator || {
    name: landingPage.pageMetadata?.creatorName || landingPage.heroTitle,
    bio: landingPage.pageMetadata?.creatorBio || landingPage.heroDescription,
    socialLinks: (landingPage.pageMetadata?.socialLinks as string[]) || [],
    profileImage: undefined,
    backgroundImage: undefined,
  };

  console.log('Creator info:', creatorInfo);
  console.log('Creator profile image:', creatorInfo?.profileImage);
  console.log('Creator background image:', creatorInfo?.backgroundImage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background */}
      <div
        className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white"
        style={{
          backgroundImage: creatorInfo?.backgroundImage ? `url(${creatorInfo.backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            {/* Profile Image */}
            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {creatorInfo?.profileImage ? (
                <img
                  src={creatorInfo.profileImage}
                  alt={creatorInfo.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-600" />
                </div>
              )}
            </div>

            {/* Creator Info */}
            <h1 className="text-4xl font-bold mb-2">{creatorInfo?.name || landingPage.heroTitle}</h1>
            <p className="text-xl text-red-100 mb-4">{landingPage.heroSubtitle}</p>
            <p className="text-lg text-red-200 max-w-2xl mx-auto">{creatorInfo?.bio || landingPage.heroDescription}</p>

            {/* Social Links */}
            {creatorInfo?.socialLinks && creatorInfo.socialLinks.length > 0 && (
              <div className="flex justify-center space-x-4 mt-8">
                {creatorInfo.socialLinks.map((link, index) => {
                  const Icon = getSocialIcon(link);
                  return (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* About Section */}
        {landingPage.description && (
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {landingPage.description}
            </p>
          </div>
        )}

        {/* Payment Links Section */}
        {((landingPage.paymentLinks && landingPage.paymentLinks.length > 0) || creatorPaymentLinks.length > 0) && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">My Movies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Combine and deduplicate payment links, filter by type product */}
              {[
                ...(landingPage.paymentLinks || []),
                ...creatorPaymentLinks.filter(cp => !(landingPage.paymentLinks || []).some(lp => lp.id === cp.id))
              ].filter(paymentLink => paymentLink.type === 'product').map((paymentLink) => {
                const Icon = getPaymentTypeIcon(paymentLink.type);

                return (
                  <Card key={paymentLink.id} hover className="group">
                    <div className="aspect-video bg-gradient-to-br from-red-100 to-red-200 rounded-lg mb-4 overflow-hidden relative">
                      {paymentLink.image_url ? (
                        <img
                          src={paymentLink.image_url}
                          alt={paymentLink.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Icon className="w-8 h-8 text-red-400" />
                        </div>
                      )}

                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          paymentLink.type === 'tip' ? 'bg-pink-100 text-pink-800' :
                          paymentLink.type === 'product' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          <Icon className="w-3 h-3 mr-1" />
                          {paymentLink.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
                          {paymentLink.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {paymentLink.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-gray-900">
                            ${paymentLink.price} {paymentLink.currency}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/pay/${paymentLink.slug}`)}
                          leftIcon={<ExternalLink className="w-4 h-4" />}
                        >
                          Rent Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA Section */}
        {landingPage.ctaButtons && landingPage.ctaButtons.length > 0 && (
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-4">
              {landingPage.ctaButtons.map((cta, index) => (
                <Button
                  key={index}
                  onClick={() => window.open(cta.url, '_blank')}
                  className={cta.style === 'secondary' ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' : ''}
                >
                  {cta.text}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}