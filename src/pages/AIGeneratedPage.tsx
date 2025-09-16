import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useCreator } from '../hooks/useCreator';
import { api } from '../lib/api';
import { LandingPage } from '../types';
import { ArrowLeft, ExternalLink, Edit, Share2, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export function AIGeneratedPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { creator } = useCreator();
  const [landingPage, setLandingPage] = React.useState<LandingPage | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Helper functions for theme and styling
  const applyTheme = (themeSettings: any) => {
    const root = document.documentElement;

    if (themeSettings.primaryColor) {
      root.style.setProperty('--primary-color', themeSettings.primaryColor);
    }
    if (themeSettings.secondaryColor) {
      root.style.setProperty('--secondary-color', themeSettings.secondaryColor);
    }
    if (themeSettings.accentColor) {
      root.style.setProperty('--accent-color', themeSettings.accentColor);
    }
    if (themeSettings.backgroundColor) {
      root.style.setProperty('--background-color', themeSettings.backgroundColor);
    }
    if (themeSettings.textColor) {
      root.style.setProperty('--text-color', themeSettings.textColor);
    }
    if (themeSettings.fontFamily) {
      root.style.setProperty('--font-family', themeSettings.fontFamily);
    }
    if (themeSettings.borderRadius) {
      root.style.setProperty('--border-radius', themeSettings.borderRadius);
    }
    if (themeSettings.spacing) {
      root.style.setProperty('--spacing', themeSettings.spacing);
    }
  };

  const applyCustomCss = (customCss: string) => {
    // Remove existing custom styles
    const existingStyle = document.getElementById('landing-page-custom-css');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Add new custom styles
    if (customCss) {
      const styleElement = document.createElement('style');
      styleElement.id = 'landing-page-custom-css';
      styleElement.textContent = customCss;
      document.head.appendChild(styleElement);
    }
  };

  const updateMetaTag = (name: string, content: string) => {
    if (!content) return;

    let metaTag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = name;
      document.head.appendChild(metaTag);
    }
    metaTag.content = content;
  };

  React.useEffect(() => {
    if (slug) {
      loadLandingPage();
    }
  }, [slug]);

  React.useEffect(() => {
    if (landingPage) {
      // Apply theme settings
      if (landingPage.themeSettings) {
        applyTheme(landingPage.themeSettings);
      }

      // Apply custom CSS
      if (landingPage.customCss) {
        applyCustomCss(landingPage.customCss);
      }

      // Set page title and meta tags
      if (landingPage.metaTitle) {
        document.title = landingPage.metaTitle;
      } else if (landingPage.title) {
        document.title = landingPage.title;
      }

      // Update meta description
      updateMetaTag('description', landingPage.metaDescription || landingPage.description);

      // Update Open Graph tags
      updateMetaTag('og:title', landingPage.metaTitle || landingPage.title);
      updateMetaTag('og:description', landingPage.metaDescription || landingPage.description);
      if (landingPage.ogImageUrl) {
        updateMetaTag('og:image', landingPage.ogImageUrl);
      }

      // Update keywords
      if (landingPage.metaKeywords && landingPage.metaKeywords.length > 0) {
        updateMetaTag('keywords', landingPage.metaKeywords.join(', '));
      }
    }
  }, [landingPage]);

  const loadLandingPage = async () => {
    try {
      setLoading(true);
      const response = await api.getLandingPageBySlug(slug!) as { success: boolean; landingPage: any };
      if (response.success) {
        setLandingPage(response.landingPage);
      } else {
        throw new Error('Landing page not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load landing page');
      toast.error('Failed to load landing page');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading</p>
        </div>
      </div>
    );
  }

  if (error || !landingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The landing page you\'re looking for doesn\'t exist.'}</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section
          className="relative rounded-2xl overflow-hidden mb-12 shadow-lg"
          style={{
            backgroundColor: landingPage.heroBackgroundColor || '#f8fafc',
            color: landingPage.heroTextColor || '#1e293b'
          }}
        >
          <div className="relative px-8 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              {landingPage.heroImageUrl && (
                <div className="mb-8">
                  <img
                    src={landingPage.heroImageUrl}
                    alt="Hero"
                    className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full object-cover border-4 border-white shadow-xl"
                  />
                </div>
              )}

              {landingPage.heroTitle && (
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                  {landingPage.heroTitle}
                </h1>
              )}

              {landingPage.heroSubtitle && (
                <h2 className="text-xl md:text-2xl font-semibold mb-6 text-opacity-90">
                  {landingPage.heroSubtitle}
                </h2>
              )}

              {landingPage.heroDescription && (
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                  {landingPage.heroDescription}
                </p>
              )}

              {/* CTA Buttons */}
              {landingPage.ctaButtons && landingPage.ctaButtons.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {landingPage.ctaButtons.map((cta: any, index: number) => {
                    // Handle payment link integration
                    let buttonUrl = cta.url;
                    if (cta.paymentLinkSlug && landingPage.paymentLinks) {
                      // Find the payment link URL from the payment links array
                      const paymentLink = landingPage.paymentLinks.find((link: any) =>
                        link.slug === cta.paymentLinkSlug
                      );
                      if (paymentLink) {
                        buttonUrl = `/pay/${paymentLink.slug}`;
                      }
                    }

                    return (
                      <button
                        key={index}
                        className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                          cta.style === 'secondary'
                            ? 'bg-white bg-opacity-20 text-current border-2 border-current hover:bg-opacity-30'
                            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
                        }`}
                        onClick={() => {
                          if (buttonUrl) {
                            if (buttonUrl.startsWith('http') || buttonUrl.startsWith('/pay/')) {
                              window.open(buttonUrl, '_blank');
                            } else if (buttonUrl.startsWith('#')) {
                              // Handle anchor links
                              const element = document.querySelector(buttonUrl);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                              }
                            } else {
                              navigate(buttonUrl);
                            }
                          }
                        }}
                      >
                        {cta.text}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        {landingPage.contentSections && landingPage.contentSections.length > 0 && (
          <div className="space-y-16 mb-16">
            {landingPage.contentSections.map((section: any, sectionIndex: number) => {
              // Handle different section types
              const renderSectionContent = () => {
                switch (section.type) {
                  case 'text':
                    return (
                      <div className="prose prose-lg max-w-none">
                        {section.content && (
                          <div dangerouslySetInnerHTML={{ __html: section.content }} />
                        )}
                      </div>
                    );

                  case 'features':
                    return section.items && section.items.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {section.items.map((item: any, itemIndex: number) => (
                          <div key={itemIndex} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                            {item.icon && (
                              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">{item.icon}</span>
                              </div>
                            )}
                            {item.title && (
                              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                                {item.title}
                              </h3>
                            )}
                            {item.description && (
                              <p className="text-gray-600 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null;

                  case 'gallery':
                    return section.items && section.items.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {section.items.map((item: any, itemIndex: number) => (
                          <div key={itemIndex} className="aspect-square rounded-xl overflow-hidden shadow-lg">
                            <img
                              src={item.image || item.url}
                              alt={item.caption || item.title || `Gallery item ${itemIndex + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    ) : null;

                  case 'cta':
                    return section.cta && (
                      <div className="text-center">
                        <button
                          className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                            section.cta.style === 'secondary'
                              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
                          }`}
                          onClick={() => {
                            if (section.cta.url) {
                              if (section.cta.url.startsWith('http')) {
                                window.open(section.cta.url, '_blank');
                              } else {
                                navigate(section.cta.url);
                              }
                            }
                          }}
                        >
                          {section.cta.text}
                        </button>
                      </div>
                    );

                  default:
                    // Default grid layout for items
                    return section.items && section.items.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {section.items.map((item: any, itemIndex: number) => (
                          <div key={itemIndex} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                            {item.title && (
                              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                                {item.title}
                              </h3>
                            )}
                            {item.description && (
                              <p className="text-gray-600 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null;
                }
              };

              return (
                <section key={sectionIndex} className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
                  <div className="max-w-6xl mx-auto">
                    {section.title && (
                      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
                        {section.title}
                      </h2>
                    )}

                    {section.description && (
                      <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                        {section.description}
                      </p>
                    )}

                    {renderSectionContent()}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Testimonials */}
        {landingPage.showTestimonials && landingPage.testimonials && landingPage.testimonials.length > 0 && (
          <section className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 md:p-12 mb-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
                What People Say
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {landingPage.testimonials.map((testimonial: any, index: number) => (
                  <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                    <div className="flex items-center mb-4">
                      {testimonial.avatar || testimonial.imageUrl ? (
                        <img
                          src={testimonial.avatar || testimonial.imageUrl}
                          alt={testimonial.author || testimonial.name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-purple-600 font-semibold text-lg">
                            {(testimonial.author || testimonial.name)?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {testimonial.author || testimonial.name}
                        </p>
                        {testimonial.title && (
                          <p className="text-sm text-gray-600">{testimonial.title}</p>
                        )}
                        <div className="flex text-yellow-400">
                          {'★'.repeat(testimonial.rating || 5)}
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                      "{testimonial.quote || testimonial.content || testimonial.review}"
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Media Gallery */}
        {landingPage.showMediaGallery && landingPage.mediaGallery && landingPage.mediaGallery.length > 0 && (
          <section className="bg-white rounded-2xl p-8 md:p-12 mb-16 shadow-lg">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
                Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {landingPage.mediaGallery.map((media: any, index: number) => (
                  <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={media.url || media.src}
                      alt={media.alt || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Social Proof */}
        {landingPage.socialProof && (
          <section className="bg-gray-900 text-white rounded-2xl p-8 md:p-12 mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Join Thousands of Satisfied Customers
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {landingPage.socialProof.followers && (
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                      {landingPage.socialProof.followers.toLocaleString()}
                    </div>
                    <div className="text-gray-300">Followers</div>
                  </div>
                )}
                {landingPage.socialProof.reviews && (
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                      {landingPage.socialProof.reviews.toLocaleString()}
                    </div>
                    <div className="text-gray-300">Reviews</div>
                  </div>
                )}
                {landingPage.socialProof.customers && (
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                      {landingPage.socialProof.customers.toLocaleString()}
                    </div>
                    <div className="text-gray-300">Customers</div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Contact Form */}
        {landingPage.contactFormEnabled && (
          <section className="bg-white rounded-2xl p-8 md:p-12 mb-16 shadow-lg">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
                Get In Touch
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <div className="text-center">
                  <Button size="lg" className="px-12 py-4 text-lg">
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="bg-gray-900 text-white rounded-2xl p-8 md:p-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">{landingPage.title}</h3>
                {landingPage.description && (
                  <p className="text-gray-300 mb-4">{landingPage.description}</p>
                )}
              </div>

              {landingPage.showSocialLinks && (
                <div>
                  <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                      <span className="text-sm">f</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                      <span className="text-sm">t</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors">
                      <span className="text-sm">i</span>
                    </a>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 {landingPage.title}. All rights reserved.</p>
              <p className="text-sm mt-2">Powered by AI Landing Page Generator</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}