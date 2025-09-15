import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { LandingPage, Creator } from '../../lib/api';

interface PagePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  page: LandingPage;
  creator: Creator | null;
}

export function PagePreview({ isOpen, onClose, page, creator }: PagePreviewProps) {
  const renderContentSection = (section: any) => {
    const style = {
      fontSize: section.styling?.fontSize || '16px',
      textAlign: section.styling?.textAlign || 'left',
      ...section.styling,
    };

    switch (section.type) {
      case 'text':
        return (
          <div style={style} className="prose max-w-none">
            <p>{section.content}</p>
          </div>
        );

      case 'image':
        return (
          <div className="text-center">
            {section.content?.url && (
              <img
                src={section.content.url}
                alt={section.content?.alt || ''}
                className="max-w-full h-auto rounded-lg mx-auto"
              />
            )}
            {section.content?.caption && (
              <p className="text-sm text-gray-600 mt-2">{section.content.caption}</p>
            )}
          </div>
        );

      case 'cta':
        const buttonStyles = {
          primary: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-medium',
          secondary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium',
          outline: 'border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-medium',
        };

        return (
          <div className="text-center">
            <a
              href={section.content?.url || '#'}
              className={buttonStyles[section.content?.style as keyof typeof buttonStyles] || buttonStyles.primary}
            >
              {section.content?.text || 'Click Here'}
            </a>
          </div>
        );

      case 'video':
        return (
          <div className="text-center">
            {section.content?.title && (
              <h3 className="text-lg font-semibold mb-4">{section.content.title}</h3>
            )}
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Video: {section.content?.url || 'No URL provided'}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const themeStyles = {
    '--primary-color': page.themeSettings?.primaryColor || '#8B5CF6',
    '--secondary-color': page.themeSettings?.secondaryColor || '#3B82F6',
    '--accent-color': page.themeSettings?.accentColor || '#10B981',
    '--background-color': page.themeSettings?.backgroundColor || '#ffffff',
    '--text-color': page.themeSettings?.textColor || '#1f2937',
  } as React.CSSProperties;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Page Preview"
      size="full"
    >
      <div className="h-[80vh] overflow-y-auto">
        <div
          className="min-h-full"
          style={{
            backgroundColor: page.themeSettings?.backgroundColor || '#ffffff',
            color: page.themeSettings?.textColor || '#1f2937',
            fontFamily: page.themeSettings?.fontFamily || 'Inter, sans-serif',
            ...themeStyles,
          }}
        >
          {/* Hero Section */}
          {(page.heroTitle || page.heroSubtitle || page.heroDescription || page.heroImageUrl) && (
            <section className="relative py-20 px-4">
              {page.heroImageUrl && (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${page.heroImageUrl})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40" />
                </div>
              )}
              
              <div className="relative max-w-4xl mx-auto text-center">
                {page.heroTitle && (
                  <h1
                    className="text-4xl md:text-6xl font-bold mb-6"
                    style={{
                      color: page.heroTextColor || (page.heroImageUrl ? '#ffffff' : 'var(--text-color)'),
                    }}
                  >
                    {page.heroTitle}
                  </h1>
                )}
                
                {page.heroSubtitle && (
                  <p
                    className="text-xl md:text-2xl mb-6"
                    style={{
                      color: page.heroTextColor || (page.heroImageUrl ? '#f3f4f6' : 'var(--text-color)'),
                    }}
                  >
                    {page.heroSubtitle}
                  </p>
                )}
                
                {page.heroDescription && (
                  <p
                    className="text-lg mb-8 max-w-2xl mx-auto"
                    style={{
                      color: page.heroTextColor || (page.heroImageUrl ? '#d1d5db' : 'var(--text-color)'),
                    }}
                  >
                    {page.heroDescription}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Content Sections */}
          {page.contentSections && page.contentSections.length > 0 && (
            <section className="py-12 px-4">
              <div className="max-w-4xl mx-auto space-y-12">
                {page.contentSections
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <div key={section.id} className="space-y-4">
                      {renderContentSection(section)}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* CTA Buttons */}
          {page.ctaButtons && page.ctaButtons.length > 0 && (
            <section className="py-12 px-4 text-center">
              <div className="max-w-2xl mx-auto space-y-4">
                {page.ctaButtons.map((button) => (
                  <div key={button.id}>
                    <a
                      href={button.url}
                      className={`inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                        button.style === 'primary'
                          ? 'text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                          : button.style === 'secondary'
                          ? 'text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                          : 'border-2 hover:shadow-lg transform hover:-translate-y-1'
                      }`}
                      style={{
                        backgroundColor:
                          button.style === 'primary'
                            ? 'var(--primary-color)'
                            : button.style === 'secondary'
                            ? 'var(--secondary-color)'
                            : 'transparent',
                        borderColor:
                          button.style === 'outline' ? 'var(--primary-color)' : 'transparent',
                        color:
                          button.style === 'outline'
                            ? 'var(--primary-color)'
                            : button.style === 'primary' || button.style === 'secondary'
                            ? '#ffffff'
                            : 'var(--text-color)',
                      }}
                    >
                      {button.text}
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Testimonials */}
          {page.testimonials && page.testimonials.length > 0 && page.showTestimonials && (
            <section className="py-12 px-4 bg-gray-50">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">What People Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {page.testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="bg-white p-6 rounded-lg shadow-md"
                    >
                      <div className="flex items-center mb-4">
                        {testimonial.avatar && (
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full mr-4"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          {testimonial.title && (
                            <p className="text-sm text-gray-600">{testimonial.title}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{testimonial.review}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Footer */}
          <footer className="py-8 px-4 border-t border-gray-200">
            <div className="max-w-4xl mx-auto text-center">
              {creator && (
                <>
                  <h3 className="text-lg font-semibold mb-2">{creator.name}</h3>
                  {creator.bio && <p className="text-gray-600 mb-4">{creator.bio}</p>}
                  {creator.socialLinks && creator.socialLinks.length > 0 && page.showSocialLinks && (
                    <div className="flex justify-center space-x-4">
                      {creator.socialLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {new URL(link).hostname}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              )}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Powered by{' '}
                  <span className="font-semibold text-purple-600">Jara</span>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </Modal>
  );
}