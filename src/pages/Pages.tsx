import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCreator } from '../hooks/useCreator';
import { api, LandingPage } from '../lib/api';
import { Link } from 'react-router-dom';
import {
  Plus,
  Eye,
  Edit,
  ExternalLink,
  Trash2,
  Globe,
  Lock,
  Calendar,
} from 'lucide-react';
import { formatDistance } from 'date-fns';
import toast from 'react-hot-toast';

export function Pages() {
  const { creator } = useCreator();
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    if (creator) {
      loadPages();
    }
  }, [creator, filter]);

  const loadPages = async () => {
    if (!creator) return;

    try {
      setIsLoading(true);
      const published = filter === 'published' ? true : filter === 'draft' ? false : undefined;
      
      // Mock data for demonstration
      const mockPages: LandingPage[] = [
        {
          id: '1',
          creatorId: creator.id,
          pageType: 'landing',
          title: 'Welcome to My Creative Journey',
          subtitle: 'Discover amazing content and support my work',
          description: 'A landing page showcasing my creative work and offering ways to support',
          slug: 'welcome-creative-journey',
          isPublished: true,
          pageMetadata: {},
          heroTitle: 'Welcome to My Creative Journey',
          heroSubtitle: 'Discover amazing content and support my work',
          heroDescription: 'Join thousands of supporters who believe in my creative vision',
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      setPages(mockPages.filter(page => {
        if (filter === 'published') return page.isPublished;
        if (filter === 'draft') return !page.isPublished;
        return true;
      }));
    } catch (error) {
      console.error('Error loading pages:', error);
      toast.error('Failed to load pages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return;
    }

    try {
      await api.deleteLandingPage(pageId);
      setPages(prev => prev.filter(page => page.id !== pageId));
      toast.success('Page deleted successfully');
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Failed to delete page');
    }
  };

  const handleTogglePublish = async (pageId: string, isPublished: boolean) => {
    try {
      await api.publishLandingPage(pageId, !isPublished);
      setPages(prev => prev.map(page =>
        page.id === pageId ? { ...page, isPublished: !isPublished } : page
      ));
      toast.success(`Page ${!isPublished ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast.error('Failed to update page status');
    }
  };

  const filteredPages = pages.filter(page => {
    if (filter === 'published') return page.isPublished;
    if (filter === 'draft') return !page.isPublished;
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Landing Pages</h1>
            <p className="text-gray-600">
              Create and manage your monetization landing pages
            </p>
          </div>
          <Link to="/pages/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Create Page
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { id: 'all', label: 'All Pages' },
              { id: 'published', label: 'Published' },
              { id: 'draft', label: 'Drafts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.id
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pages Grid */}
        {filteredPages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((page) => (
              <Card key={page.id} hover className="group">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-4 overflow-hidden relative">
                  {page.heroImageUrl ? (
                    <img
                      src={page.heroImageUrl}
                      alt={page.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Globe className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <p className="text-sm text-purple-600 font-medium">{page.title}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        page.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {page.isPublished ? (
                        <>
                          <Globe className="w-3 h-3 mr-1" />
                          Published
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 mr-1" />
                          Draft
                        </>
                      )}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                    <Link to={`/pages/${page.id}/edit`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white text-gray-900 hover:bg-gray-100"
                        leftIcon={<Edit className="w-4 h-4" />}
                      >
                        Edit
                      </Button>
                    </Link>
                    {page.isPublished && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white text-gray-900 hover:bg-gray-100"
                        leftIcon={<ExternalLink className="w-4 h-4" />}
                      >
                        View
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                      {page.title}
                    </h3>
                    {page.subtitle && (
                      <p className="text-sm text-gray-600 mt-1">{page.subtitle}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Updated {formatDistance(new Date(page.updatedAt), new Date(), { addSuffix: true })}
                      </span>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {page.pageType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublish(page.id, page.isPublished)}
                        leftIcon={page.isPublished ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                      >
                        {page.isPublished ? 'Unpublish' : 'Publish'}
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePage(page.id)}
                      leftIcon={<Trash2 className="w-4 h-4" />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'published' ? 'No published pages' : filter === 'draft' ? 'No draft pages' : 'No pages created yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'published'
                ? 'Publish your first page to make it visible to the world.'
                : filter === 'draft'
                ? 'Create a new page or check your published pages.'
                : 'Create your first landing page to start monetizing your content.'}
            </p>
            <Link to="/pages/new">
              <Button leftIcon={<Plus className="w-4 h-4" />}>
                Create Your First Page
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}