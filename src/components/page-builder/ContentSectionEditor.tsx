import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ImageUpload } from '../ui/ImageUpload';
import { Type, Image, Video, MousePointer, Trash2, GripVertical } from 'lucide-react';
import { ContentSection } from '../../lib/api';

interface ContentSectionEditorProps {
  section: ContentSection;
  onChange: (updates: Partial<ContentSection>) => void;
  onRemove: () => void;
}

export function ContentSectionEditor({ section, onChange, onRemove }: ContentSectionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const sectionTypes = [
    { value: 'text', label: 'Text', icon: Type },
    { value: 'image', label: 'Image', icon: Image },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'cta', label: 'Call to Action', icon: MousePointer },
  ];

  const currentType = sectionTypes.find(type => type.value === section.type);
  const CurrentIcon = currentType?.icon || Type;

  const renderContentEditor = () => {
    switch (section.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={typeof section.content === 'string' ? section.content : ''}
                onChange={(e) => onChange({ content: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                placeholder="Enter your text content..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Size
                </label>
                <select
                  value={section.styling?.fontSize || '16px'}
                  onChange={(e) => onChange({
                    styling: { ...section.styling, fontSize: e.target.value }
                  })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                >
                  <option value="14px">Small</option>
                  <option value="16px">Medium</option>
                  <option value="18px">Large</option>
                  <option value="24px">Extra Large</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Alignment
                </label>
                <select
                  value={section.styling?.textAlign || 'left'}
                  onChange={(e) => onChange({
                    styling: { ...section.styling, textAlign: e.target.value }
                  })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <ImageUpload
              value={section.content?.url}
              onChange={(url) => onChange({ content: { ...section.content, url } })}
              onRemove={() => onChange({ content: { ...section.content, url: undefined } })}
              folder="landing-pages"
            />
            <Input
              label="Alt Text"
              value={section.content?.alt || ''}
              onChange={(e) => onChange({
                content: { ...section.content, alt: e.target.value }
              })}
              placeholder="Image description for accessibility"
            />
            <Input
              label="Caption (Optional)"
              value={section.content?.caption || ''}
              onChange={(e) => onChange({
                content: { ...section.content, caption: e.target.value }
              })}
              placeholder="Image caption"
            />
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-4">
            <Input
              label="Button Text"
              value={section.content?.text || ''}
              onChange={(e) => onChange({
                content: { ...section.content, text: e.target.value }
              })}
              placeholder="Click here"
            />
            <Input
              label="Button URL"
              value={section.content?.url || ''}
              onChange={(e) => onChange({
                content: { ...section.content, url: e.target.value }
              })}
              placeholder="https://example.com"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Style
              </label>
              <select
                value={section.content?.style || 'primary'}
                onChange={(e) => onChange({
                  content: { ...section.content, style: e.target.value }
                })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <Input
              label="Video URL"
              value={section.content?.url || ''}
              onChange={(e) => onChange({
                content: { ...section.content, url: e.target.value }
              })}
              placeholder="https://youtube.com/watch?v=..."
            />
            <Input
              label="Video Title (Optional)"
              value={section.content?.title || ''}
              onChange={(e) => onChange({
                content: { ...section.content, title: e.target.value }
              })}
              placeholder="Video title"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="border-l-4 border-l-purple-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
          <div className="flex items-center space-x-2">
            <CurrentIcon className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-gray-900">{currentType?.label}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Remove
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Type
            </label>
            <select
              value={section.type}
              onChange={(e) => onChange({ type: e.target.value as any, content: '' })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
            >
              {sectionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {renderContentEditor()}
        </div>
      )}
    </Card>
  );
}