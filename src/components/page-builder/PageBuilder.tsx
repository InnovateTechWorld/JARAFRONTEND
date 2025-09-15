import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ImageUpload } from '../ui/ImageUpload';
import { Modal } from '../ui/Modal';
import { ContentSectionEditor } from './ContentSectionEditor';
import { AIAssistant } from './AIAssistant';
import { PagePreview } from './PagePreview';
import { Save, Eye, Wand2, Settings, Palette, Type, Layout } from 'lucide-react';
import { LandingPage, ContentSection, ThemeSettings } from '../../lib/api';
import { generatePageWithAI, AIPageGenerationRequest } from '../../lib/gemini';
import { useCreator } from '../../hooks/useCreator';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';

export function PageBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { creator } = useCreator();
  const [page, setPage] = useState<Partial<LandingPage>>({
    title: '',
    subtitle: '',
    description: '',
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    contentSections: [],
    ctaButtons: [],
    testimonials: [],
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
    showSocialLinks: true,
    showTestimonials: false,
    showMediaGallery: false,
    contactFormEnabled: false,
    paymentLinks: [],
    isPublished: false,
  });

  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'settings'>('content');
  const [showAIModal, setShowAIModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      loadPage(id);
    }
  }, [id]);

  const loadPage = async (pageId: string) => {
    try {
      setIsLoading(true);
      const response = await api.getLandingPage(pageId);
      setPage(response.landingPage);
    } catch (error) {
      console.error('Error loading page:', error);
      toast.error('Failed to load page');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!creator) return;

    try {
      setIsSaving(true);
      
      const pageData = {
        ...page,
        creatorId: creator.id,
        isPublished: true, // Auto-publish landing pages
      };

      if (id === 'new') {
        const response = await api.createLandingPage(pageData);
        toast.success('Page created successfully!');
        navigate(`/pages/${response.landingPage.id}/edit`);
      } else {
        await api.updateLandingPage(id!, pageData);
        toast.success('Page updated successfully!');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIGeneration = async (request: AIPageGenerationRequest) => {
    try {
      setIsLoading(true);
      const aiSuggestion = await generatePageWithAI(request);
      
      setPage(prev => ({
        ...prev,
        ...aiSuggestion,
        contentSections: aiSuggestion.contentSections.map((section: any, index: number) => ({
          ...section,
          id: `section-${index}`,
          order: index,
        })),
        ctaButtons: aiSuggestion.ctaButtons.map((button: any, index: number) => ({
          ...button,
          id: `button-${index}`,
        })),
        testimonials: aiSuggestion.testimonials?.map((testimonial: any, index: number) => ({
          ...testimonial,
          id: `testimonial-${index}`,
        })) || [],
      }));
      
      setShowAIModal(false);
      toast.success('AI has generated your page content!');
    } catch (error) {
      console.error('Error generating with AI:', error);
      toast.error('Failed to generate content with AI');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePage = (updates: Partial<LandingPage>) => {
    setPage(prev => ({ ...prev, ...updates }));
  };

  const addContentSection = () => {
    const newSection: ContentSection = {
      id: `section-${Date.now()}`,
      type: 'text',
      content: 'Your content here...',
      styling: {},
      order: page.contentSections?.length || 0,
    };

    updatePage({
      contentSections: [...(page.contentSections || []), newSection],
    });
  };

  const updateContentSection = (sectionId: string, updates: Partial<ContentSection>) => {
    updatePage({
      contentSections: page.contentSections?.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    });
  };

  const removeContentSection = (sectionId: string) => {
    updatePage({
      contentSections: page.contentSections?.filter(section => section.id !== sectionId),
    });
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: Type },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {id === 'new' ? 'Create New Page' : 'Edit Page'}
              </h1>
              <div className="flex space-x-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAIModal(true)}
                leftIcon={<Wand2 className="w-4 h-4" />}
              >
                AI Assistant
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(true)}
                leftIcon={<Eye className="w-4 h-4" />}
              >
                Preview
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Page
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <Input
                    label="Page Title"
                    value={page.title}
                    onChange={(e) => updatePage({ title: e.target.value })}
                    placeholder="Enter page title"
                  />
                  <Input
                    label="Subtitle"
                    value={page.subtitle || ''}
                    onChange={(e) => updatePage({ subtitle: e.target.value })}
                    placeholder="Enter page subtitle"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={page.description}
                      onChange={(e) => updatePage({ description: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                      placeholder="Enter page description"
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Hero Section</CardTitle>
                  </div>
                </CardHeader>
                <div className="space-y-4">
                  <Input
                    label="Hero Title"
                    value={page.heroTitle || ''}
                    onChange={(e) => updatePage({ heroTitle: e.target.value })}
                    placeholder="Enter compelling hero title"
                  />
                  <Input
                    label="Hero Subtitle"
                    value={page.heroSubtitle || ''}
                    onChange={(e) => updatePage({ heroSubtitle: e.target.value })}
                    placeholder="Enter hero subtitle"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Description
                    </label>
                    <textarea
                      value={page.heroDescription || ''}
                      onChange={(e) => updatePage({ heroDescription: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                      placeholder="Enter hero description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Image
                    </label>
                    <ImageUpload
                      value={page.heroImageUrl}
                      onChange={(url) => updatePage({ heroImageUrl: url })}
                      onRemove={() => updatePage({ heroImageUrl: undefined })}
                      folder="landing-pages"
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Content Sections</CardTitle>
                    <Button
                      size="sm"
                      onClick={addContentSection}
                      leftIcon={<Layout className="w-4 h-4" />}
                    >
                      Add Section
                    </Button>
                  </div>
                </CardHeader>
                <div className="space-y-4">
                  {page.contentSections?.map((section) => (
                    <ContentSectionEditor
                      key={section.id}
                      section={section}
                      onChange={(updates) => updateContentSection(section.id, updates)}
                      onRemove={() => removeContentSection(section.id)}
                    />
                  ))}
                  {(!page.contentSections || page.contentSections.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <Layout className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No content sections yet. Add your first section!</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Page Actions</CardTitle>
                </CardHeader>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowPreview(true)}
                    leftIcon={<Eye className="w-4 h-4" />}
                  >
                    Preview Page
                  </Button>
                  <Button
                    className="w-full"
                    onClick={handleSave}
                    isLoading={isSaving}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    Save Changes
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={page.themeSettings?.primaryColor || '#8B5CF6'}
                    onChange={(e) => updatePage({
                      themeSettings: {
                        ...page.themeSettings!,
                        primaryColor: e.target.value,
                      },
                    })}
                    className="w-full h-10 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    value={page.themeSettings?.secondaryColor || '#3B82F6'}
                    onChange={(e) => updatePage({
                      themeSettings: {
                        ...page.themeSettings!,
                        secondaryColor: e.target.value,
                      },
                    })}
                    className="w-full h-10 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accent Color
                  </label>
                  <input
                    type="color"
                    value={page.themeSettings?.accentColor || '#10B981'}
                    onChange={(e) => updatePage({
                      themeSettings: {
                        ...page.themeSettings!,
                        accentColor: e.target.value,
                      },
                    })}
                    className="w-full h-10 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={page.themeSettings?.backgroundColor || '#ffffff'}
                    onChange={(e) => updatePage({
                      themeSettings: {
                        ...page.themeSettings!,
                        backgroundColor: e.target.value,
                      },
                    })}
                    className="w-full h-10 rounded-lg border border-gray-300"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <Input
                  label="Meta Title"
                  value={page.metaTitle || ''}
                  onChange={(e) => updatePage({ metaTitle: e.target.value })}
                  placeholder="SEO title for search engines"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={page.metaDescription || ''}
                    onChange={(e) => updatePage({ metaDescription: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                    placeholder="SEO description for search engines"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Page Visibility</CardTitle>
              </CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Publish Page</h4>
                  <p className="text-sm text-gray-600">Make this page publicly accessible</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={page.isPublished}
                    onChange={(e) => updatePage({ isPublished: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </Card>
          </div>
        )}
      </div>

      <AIAssistant
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleAIGeneration}
        creator={creator}
      />

      <PagePreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        page={page as LandingPage}
        creator={creator}
      />
    </div>
  );
}