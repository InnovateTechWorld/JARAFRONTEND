import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Wand2, Sparkles } from 'lucide-react';
import { AIPageGenerationRequest } from '../../lib/gemini';
import { Creator } from '../../lib/api';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (request: AIPageGenerationRequest) => Promise<void>;
  creator: Creator | null;
}

export function AIAssistant({ isOpen, onClose, onGenerate, creator }: AIAssistantProps) {
  const [formData, setFormData] = useState({
    businessType: '',
    targetAudience: '',
    primaryGoal: '',
    brandColors: [''],
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!creator) return;

    const request: AIPageGenerationRequest = {
      creatorName: creator.name,
      creatorBio: creator.bio,
      businessType: formData.businessType,
      targetAudience: formData.targetAudience,
      primaryGoal: formData.primaryGoal,
      brandColors: formData.brandColors.filter(color => color.trim()),
    };

    try {
      setIsGenerating(true);
      await onGenerate(request);
    } catch (error) {
      console.error('AI generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addColorField = () => {
    setFormData(prev => ({
      ...prev,
      brandColors: [...prev.brandColors, ''],
    }));
  };

  const updateColor = (index: number, color: string) => {
    setFormData(prev => ({
      ...prev,
      brandColors: prev.brandColors.map((c, i) => i === index ? color : c),
    }));
  };

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      brandColors: prev.brandColors.filter((_, i) => i !== index),
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Page Assistant"
      size="lg"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Let AI Create Your Perfect Page
          </h3>
          <p className="text-gray-600">
            Tell us about your business and goals, and we'll generate a customized landing page for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="What type of business or service do you offer?"
            value={formData.businessType}
            onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
            placeholder="e.g., Digital Marketing Agency, Freelance Designer, Online Coach"
            required
          />

          <Input
            label="Who is your target audience?"
            value={formData.targetAudience}
            onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
            placeholder="e.g., Small business owners, Young professionals, Students"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's your primary goal for this page?
            </label>
            <select
              value={formData.primaryGoal}
              onChange={(e) => setFormData(prev => ({ ...prev, primaryGoal: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              required
            >
              <option value="">Select your primary goal</option>
              <option value="generate_leads">Generate Leads</option>
              <option value="sell_products">Sell Products/Services</option>
              <option value="build_community">Build Community</option>
              <option value="showcase_portfolio">Showcase Portfolio</option>
              <option value="collect_donations">Collect Donations/Tips</option>
              <option value="promote_events">Promote Events</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Brand Colors (Optional)
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addColorField}
              >
                Add Color
              </Button>
            </div>
            <div className="space-y-2">
              {formData.brandColors.map((color, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="w-12 h-10 rounded-lg border border-gray-300"
                  />
                  <Input
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    placeholder="#FFFFFF"
                    className="flex-1"
                  />
                  {formData.brandColors.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeColor(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isGenerating}
              leftIcon={<Wand2 className="w-4 h-4" />}
              className="flex-1"
            >
              Generate Page
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}