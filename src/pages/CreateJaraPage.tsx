import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useCreator } from '../hooks/useCreator';
import { api } from '../lib/api';
import { Sparkles, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export function CreateJaraPage() {
  const { creator, updateCreator } = useCreator();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  const handleCreateJaraPage = async () => {
    if (!creator) return;

    try {
      setIsCreating(true);

      const landingPageData = {
        pageType: 'landing',
        title: `${creator.name}'s Creator Page`,
        subtitle: 'Support my creative work',
        description: creator.bio || 'Welcome to my creator page! Support my work and get exclusive content.',
        slug: creator.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        isPublished: true,
        heroTitle: creator.name,
        heroSubtitle: 'Creator & Artist',
        heroDescription: creator.bio || 'Welcome to my creator page!',
        contentSections: [],
        ctaButtons: [],
        testimonials: [],
        socialProof: {
          followers: 0,
          reviews: 0,
        },
        mediaGallery: [],
        themeSettings: {
          primaryColor: '#8B5CF6',
          secondaryColor: '#3B82F6',
          accentColor: '#10B981',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          fontFamily: 'Inter',
          borderRadius: '8px',
        },
        paymentLinks: [],
        showSocialLinks: true,
        showTestimonials: false,
        showMediaGallery: false,
        contactFormEnabled: false,
        pageMetadata: {
          creatorName: creator.name,
          creatorBio: creator.bio,
          socialLinks: creator.socialLinks,
        },
      };

      const response = await api.createLandingPage(landingPageData);
      const slug = response.landingPage.slug;
      setCreatedSlug(slug);

      // Update creator with the jara page slug
      await updateCreator({ jaraPageSlug: slug });

      toast.success('Your Jara page has been created successfully!');

    } catch (error: any) {
      console.error('Error creating Jara page:', error);
      toast.error(error.message || 'Failed to create Jara page');
    } finally {
      setIsCreating(false);
    }
  };

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Jara Page</h1>
          <p className="text-gray-600 text-lg">Create a beautiful landing page to showcase your work and connect with fans</p>
        </div>

        {!createdSlug ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Your Jara Page Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">What will be included:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your profile information and bio</li>
                  <li>• Social media links</li>
                  <li>• Payment links for your content</li>
                  <li>• Customizable design and layout</li>
                  <li>• Mobile-friendly responsive design</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Profile Enhancement</h4>
                <p className="text-sm text-yellow-800 mb-3">
                  For the best experience, make sure your profile has a profile picture and background image.
                </p>
                {!creator.profileImage && (
                  <p className="text-sm text-yellow-700 mb-2">⚠️ You haven't uploaded a profile picture yet.</p>
                )}
                {!creator.backgroundImage && (
                  <p className="text-sm text-yellow-700 mb-2">⚠️ You haven't uploaded a background image yet.</p>
                )}
                {(!creator.profileImage || !creator.backgroundImage) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/settings')}
                    className="mt-2"
                  >
                    Update Profile
                  </Button>
                )}
              </div>

              <div className="text-center">
                <Button
                  onClick={handleCreateJaraPage}
                  disabled={isCreating}
                  className="px-8 py-3"
                >
                  {isCreating ? 'Creating Your Page...' : 'Create My Jara Page'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-green-600">🎉 Your Jara Page is Ready!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-medium text-green-900 mb-2">Your Jara Page URL</h4>
                <p className="text-lg font-mono bg-white px-3 py-2 rounded border text-green-800">
                  {window.location.origin}/u/{createdSlug}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/u/${createdSlug}`)}
                  className="mt-2"
                >
                  Copy Link
                </Button>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => window.open(`/u/${createdSlug}`, '_blank')}
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                >
                  View My Jara Page
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Dashboard
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
                <ul className="text-sm text-blue-800 space-y-1 text-left">
                  <li>• Share your Jara page link with your audience</li>
                  <li>• Create payment links to monetize your content</li>
                  <li>• Customize your page design and content</li>
                  <li>• Track your earnings and engagement</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}