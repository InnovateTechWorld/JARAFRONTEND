import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { useCreator } from '../hooks/useCreator';
import { api } from '../lib/api';
import { Sparkles, Upload, X, Eye, ExternalLink, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface GeneratedResult {
  landingPage: any;
  generatedPaymentLinks: any[];
}

export function AIGenerator() {
  const { creator } = useCreator();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [pageType, setPageType] = useState('landing');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const maxImages = 5;
    const currentCount = images.length;
    const availableSlots = maxImages - currentCount;

    if (files.length > availableSlots) {
      toast.error(`You can only upload up to ${maxImages} images. You have ${availableSlots} slots remaining.`);
      return;
    }

    const newImages: string[] = [];

    for (let i = 0; i < files.length && i < availableSlots; i++) {
      const file = files[i];

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file.`);
        continue;
      }

      try {
        const base64 = await fileToBase64(file);
        newImages.push(base64);
      } catch (error) {
        toast.error(`Failed to process ${file.name}`);
      }
    }

    setImages(prev => [...prev, ...newImages]);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const generateLandingPage = async () => {
    if (!creator) {
      toast.error('You must be logged in to generate landing pages');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a description for your landing page');
      return;
    }

    try {
      setIsGenerating(true);
      setResult(null);

      const response = await api.generateLandingPage({
        prompt: prompt.trim(),
        images: images.length > 0 ? images : undefined,
        pageType,
        targetAudience: targetAudience.trim() || undefined,
        tone,
      });

      if (response.success) {
        setResult({
          landingPage: response.landingPage,
          generatedPaymentLinks: response.generatedPaymentLinks || [],
        });
        toast.success('Landing page generated successfully!');
      } else {
        throw new Error(response.message || 'Generation failed');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate landing page');
    } finally {
      setIsGenerating(false);
    }
  };

  const viewGeneratedPage = () => {
    if (result?.landingPage?.slug) {
      window.open(`/ai/${result.landingPage.slug}`, '_blank');
    }
  };

  const editGeneratedPage = () => {
    if (result?.landingPage?.id) {
      // Navigate to edit page or open edit modal
      navigate(`/create-jara-page`);
    }
  };

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Required</h1>
          <p className="text-gray-600">Please log in to use AI landing page generation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Wand2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Landing Page Generator</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Describe your vision and let AI create a professional landing page with integrated payment links
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Generator Form - Takes 2 columns */}
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>AI Landing Page Generator</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-base font-medium">Describe Your Landing Page *</Label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Create a comprehensive landing page for my premium fitness coaching service. Include sections about my methodology, client testimonials, pricing packages, and a clear call-to-action for booking a consultation..."
                    rows={5}
                    className="text-base"
                    required
                  />
                  <p className="text-sm text-gray-600">
                    Be detailed about your services, target audience, key benefits, and desired outcomes. The AI will create a complete landing page with content sections, testimonials, and payment links.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pageType" className="font-medium">Page Type</Label>
                    <select
                      id="pageType"
                      value={pageType}
                      onChange={(e) => setPageType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      <option value="landing">General Landing</option>
                      <option value="product">Product Launch</option>
                      <option value="service">Service Offering</option>
                      <option value="portfolio">Portfolio</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone" className="font-medium">Content Tone</Label>
                    <select
                      id="tone"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="friendly">Friendly</option>
                      <option value="formal">Formal</option>
                      <option value="creative">Creative</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience" className="font-medium">Target Audience</Label>
                    <Input
                      id="targetAudience"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="Fitness enthusiasts, busy professionals..."
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Upload className="w-5 h-5 text-purple-600" />
                    <span>Reference Images (Optional)</span>
                  </div>
                  <span className="text-sm text-gray-500 bg-purple-100 px-2 py-1 rounded-full">
                    {images.length}/5 uploaded
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<Upload className="w-4 h-4" />}
                    className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                    disabled={images.length >= 5}
                  >
                    {images.length === 0 ? 'Upload Reference Images' : `Upload ${5 - images.length} More Images`}
                  </Button>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Upload up to 5 images to inspire the AI design</p>
                    <p>• Supported formats: JPEG, PNG, WebP (Max 5MB each)</p>
                    <p>• Images help create more visually appealing and relevant content</p>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Uploaded Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                            <img
                              src={image}
                              alt={`Reference ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
                    <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Generate Your Landing Page?</h3>
                    <p className="text-gray-600 mb-4">
                      The AI will create a complete landing page with content sections, testimonials, call-to-action buttons, and payment links based on your description.
                    </p>
                  </div>
                  <Button
                    onClick={generateLandingPage}
                    disabled={isGenerating || !prompt.trim()}
                    size="lg"
                    className="px-12 py-4 text-lg font-semibold"
                    leftIcon={<Sparkles className="w-6 h-6" />}
                  >
                    {isGenerating ? (
                      <span className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating Your Landing Page...</span>
                      </span>
                    ) : (
                      'Generate Landing Page'
                    )}
                  </Button>
                  {isGenerating && (
                    <p className="text-sm text-gray-600">
                      This may take a few moments. The AI is crafting your complete landing page...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview/Results */}
          <div className="space-y-6">
            {result ? (
              <div className="space-y-6">
                {/* Action Buttons */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{result.landingPage.title}</h3>
                        <p className="text-sm text-gray-600">Generated landing page ready for review</p>
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          onClick={viewGeneratedPage}
                          leftIcon={<Eye className="w-4 h-4" />}
                        >
                          Live Preview
                        </Button>
                        <Button
                          onClick={editGeneratedPage}
                          leftIcon={<ExternalLink className="w-4 h-4" />}
                        >
                          Edit Page
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Full Page Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Page Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden bg-white">
                      {/* Hero Section */}
                      <div
                        className="relative px-6 py-12 text-center"
                        style={{
                          backgroundColor: result.landingPage.hero_background_color || '#f3f4f6',
                          color: result.landingPage.hero_text_color || '#1f2937'
                        }}
                      >
                        {result.landingPage.hero_image_url && (
                          <div className="mb-6">
                            <img
                              src={result.landingPage.hero_image_url}
                              alt="Hero"
                              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
                            />
                          </div>
                        )}
                        <h1 className="text-3xl font-bold mb-2">{result.landingPage.hero_title}</h1>
                        {result.landingPage.hero_subtitle && (
                          <p className="text-xl mb-4">{result.landingPage.hero_subtitle}</p>
                        )}
                        {result.landingPage.hero_description && (
                          <p className="text-lg max-w-2xl mx-auto">{result.landingPage.hero_description}</p>
                        )}
                      </div>

                      {/* Content Sections */}
                      <div className="px-6 py-8 space-y-8">
                        {result.landingPage.content_sections && result.landingPage.content_sections.map((section: any, index: number) => (
                          <div key={index} className="text-center">
                            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                            {section.description && (
                              <p className="text-gray-600 mb-6">{section.description}</p>
                            )}
                            {section.items && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                {section.items.map((item: any, itemIndex: number) => (
                                  <div key={itemIndex} className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="font-semibold mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-sm">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}

                        {/* CTA Buttons */}
                        {result.landingPage.cta_buttons && result.landingPage.cta_buttons.length > 0 && (
                          <div className="text-center">
                            <div className="flex flex-wrap justify-center gap-4">
                              {result.landingPage.cta_buttons.map((cta: any, index: number) => (
                                <button
                                  key={index}
                                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                    cta.style === 'secondary'
                                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                      : 'bg-purple-600 text-white hover:bg-purple-700'
                                  }`}
                                >
                                  {cta.text}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Testimonials */}
                        {result.landingPage.testimonials && result.landingPage.testimonials.length > 0 && (
                          <div className="bg-gray-50 p-8 rounded-lg">
                            <h2 className="text-2xl font-bold text-center mb-8">What People Say</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {result.landingPage.testimonials.map((testimonial: any, index: number) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                                  <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                                  <p className="font-semibold">- {testimonial.author}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Generated Payment Links */}
                {result.generatedPaymentLinks && result.generatedPaymentLinks.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-700">Generated Payment Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.generatedPaymentLinks.map((link: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                            <div>
                              <h4 className="font-semibold text-green-900">{link.title}</h4>
                              <p className="text-sm text-green-700">
                                {link.type} • ₦{link.price} • {link.currency}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`/pay/${link.slug}`, '_blank')}
                              className="border-green-300 text-green-700 hover:bg-green-100"
                            >
                              View Link
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Page Metadata */}
                <Card>
                  <CardHeader>
                    <CardTitle>Page Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-700">Slug:</span>
                          <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">{result.landingPage.slug}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Type:</span>
                          <p className="text-sm mt-1 capitalize">{result.landingPage.page_type}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Status:</span>
                          <p className="text-sm mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              result.landingPage.is_published
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {result.landingPage.is_published ? 'Published' : 'Draft'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {result.landingPage.meta_title && (
                          <div>
                            <span className="font-medium text-gray-700">Meta Title:</span>
                            <p className="text-sm mt-1">{result.landingPage.meta_title}</p>
                          </div>
                        )}
                        {result.landingPage.meta_description && (
                          <div>
                            <span className="font-medium text-gray-700">Meta Description:</span>
                            <p className="text-sm mt-1">{result.landingPage.meta_description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">AI Generated Preview</h3>
                    <p className="text-gray-600 max-w-md">
                      Your AI-generated landing page will appear here with a full preview of all sections, content, and styling
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}