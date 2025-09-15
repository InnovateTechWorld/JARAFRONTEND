import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { useCreator } from '../hooks/useCreator';
import { api, LandingPage, CTAButton } from '../lib/api';
import { Sparkles, ExternalLink, Edit, Eye, Copy, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export function CreateJaraPage() {
  const { creator, updateCreator } = useCreator();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingPage, setExistingPage] = useState<LandingPage | null>(null);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    subtitle: string;
    description: string;
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    ctaButtons: CTAButton[];
  }>({
    title: '',
    subtitle: '',
    description: '',
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    ctaButtons: [{ id: '1', text: '', url: '', style: 'primary' }],
  });

  useEffect(() => {
    if (creator?.id) {
      loadExistingPage();
    }
  }, [creator?.id]);

  const loadExistingPage = async () => {
    if (!creator?.id) return;

    try {
      setIsLoading(true);
      // Get all landing pages for this creator
      const response = await api.getLandingPages(creator.id, { type: 'landing' }) as { success: boolean; landingPages: LandingPage[] };

      if (response.success && response.landingPages.length > 0) {
        // Find the Jara page (the one with the creator's slug)
        const jaraPage = response.landingPages.find((page: LandingPage) => page.slug === creator.jaraPageSlug) || response.landingPages[0];
        setExistingPage(jaraPage);

        // Populate form with existing data
        setFormData({
          title: jaraPage.title || '',
          subtitle: jaraPage.subtitle || '',
          description: jaraPage.description || '',
          heroTitle: jaraPage.heroTitle || '',
          heroSubtitle: jaraPage.heroSubtitle || '',
          heroDescription: jaraPage.heroDescription || '',
          ctaButtons: jaraPage.ctaButtons && jaraPage.ctaButtons.length > 0 ? jaraPage.ctaButtons : [{ id: '1', text: '', url: '', style: 'primary' }],
        });
      }
    } catch (error) {
      console.error('Error loading existing page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCtaButtonChange = (index: number, field: 'text' | 'url' | 'style', value: string) => {
    const newCtaButtons = [...formData.ctaButtons];
    newCtaButtons[index] = { ...newCtaButtons[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      ctaButtons: newCtaButtons
    }));
  };

  const addCtaButton = () => {
    setFormData(prev => ({
      ...prev,
      ctaButtons: [...prev.ctaButtons, { id: Date.now().toString(), text: '', url: '', style: 'primary' }]
    }));
  };

  const removeCtaButton = (index: number) => {
    if (formData.ctaButtons.length > 1) {
      const newCtaButtons = formData.ctaButtons.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ctaButtons: newCtaButtons
      }));
    }
  };

  const handleCreateJaraPage = async () => {
    if (!creator) return;

    try {
      setIsCreating(true);

      const landingPageData = {
        pageType: 'landing',
        title: formData.title || `${creator.name}'s Creator Page`,
        subtitle: formData.subtitle || 'Support my creative work',
        description: formData.description || creator.bio || 'Welcome to my creator page! Support my work and get exclusive content.',
        slug: creator.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        isPublished: true,
        heroTitle: formData.heroTitle || creator.name,
        heroSubtitle: formData.heroSubtitle || 'Creator & Artist',
        heroDescription: formData.heroDescription || creator.bio || 'Welcome to my creator page!',
        contentSections: [],
        ctaButtons: formData.ctaButtons.filter(btn => btn.text.trim() && btn.url.trim()),
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

  const handleUpdateJaraPage = async () => {
    if (!creator || !existingPage) return;

    try {
      setIsCreating(true);

      const updateData = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        heroTitle: formData.heroTitle,
        heroSubtitle: formData.heroSubtitle,
        heroDescription: formData.heroDescription,
        ctaButtons: formData.ctaButtons.filter(btn => btn.text.trim() && btn.url.trim()),
      };

      await api.updateLandingPage(existingPage.id, updateData);
      toast.success('Your Jara page has been updated successfully!');

    } catch (error: any) {
      console.error('Error updating Jara page:', error);
      toast.error(error.message || 'Failed to update Jara page');
    } finally {
      setIsCreating(false);
    }
  };

  const copyPageLink = () => {
    const slug = existingPage?.slug || createdSlug;
    if (slug) {
      navigator.clipboard.writeText(`${window.location.origin}/u/${slug}`);
      toast.success('Link copied to clipboard!');
    }
  };

  const previewPage = () => {
    const slug = existingPage?.slug || createdSlug;
    if (slug) {
      window.open(`/u/${slug}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Required</h1>
          <p className="text-gray-600">Please log in to create or edit your Jara page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            {existingPage ? <Edit className="w-10 h-10 text-white" /> : <Sparkles className="w-10 h-10 text-white" />}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {existingPage ? 'Edit Your Jara Page' : 'Create Your Jara Page'}
          </h1>
          <p className="text-gray-600 text-lg">
            {existingPage ? 'Customize your landing page and connect with fans' : 'Create a beautiful landing page to showcase your work and connect with fans'}
          </p>
        </div>

        {existingPage && (
          <div className="flex justify-center space-x-4 mb-8">
            <Button
              variant="outline"
              onClick={copyPageLink}
              leftIcon={<Copy className="w-4 h-4" />}
            >
              Copy Link
            </Button>
            <Button
              variant="outline"
              onClick={previewPage}
              leftIcon={<Eye className="w-4 h-4" />}
            >
              Preview Page
            </Button>
          </div>
        )}

        {!createdSlug ? (
          <form onSubmit={(e) => { e.preventDefault(); existingPage ? handleUpdateJaraPage() : handleCreateJaraPage(); }}>
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Page Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Page Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Page Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="My Creator Page"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Page Subtitle</Label>
                      <Input
                        id="subtitle"
                        value={formData.subtitle}
                        onChange={(e) => handleInputChange('subtitle', e.target.value)}
                        placeholder="Support my creative work"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Page Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Tell visitors about yourself and your work..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Hero Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="heroTitle">Hero Title *</Label>
                      <Input
                        id="heroTitle"
                        value={formData.heroTitle}
                        onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                        placeholder="Welcome to my page"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                      <Input
                        id="heroSubtitle"
                        value={formData.heroSubtitle}
                        onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                        placeholder="Creator & Artist"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heroDescription">Hero Description</Label>
                    <Textarea
                      id="heroDescription"
                      value={formData.heroDescription}
                      onChange={(e) => handleInputChange('heroDescription', e.target.value)}
                      placeholder="A brief description that appears in the hero section..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Call-to-Action Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Call-to-Action Buttons</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCtaButton}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Add Button
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.ctaButtons.map((button, index) => (
                    <div key={button.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Button Text</Label>
                          <Input
                            value={button.text}
                            onChange={(e) => handleCtaButtonChange(index, 'text', e.target.value)}
                            placeholder="Click here"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Button URL</Label>
                          <Input
                            value={button.url}
                            onChange={(e) => handleCtaButtonChange(index, 'url', e.target.value)}
                            placeholder="https://..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Style</Label>
                          <select
                            value={button.style}
                            onChange={(e) => handleCtaButtonChange(index, 'style', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="primary">Primary</option>
                            <option value="secondary">Secondary</option>
                            <option value="outline">Outline</option>
                          </select>
                        </div>
                      </div>
                      {formData.ctaButtons.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCtaButton(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex justify-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="px-8 py-3"
                >
                  {isCreating ? (existingPage ? 'Updating...' : 'Creating...') : (existingPage ? 'Update Page' : 'Create Page')}
                </Button>
              </div>
            </div>
          </form>
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