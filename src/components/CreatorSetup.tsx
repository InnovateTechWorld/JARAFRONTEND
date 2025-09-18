import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { useCreator } from '../hooks/useCreator';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { User, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export function CreatorSetup() {
  const { user } = useAuth();
  const { createCreator, isLoading } = useCreator();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    bio: '',
    socialLinks: [''],
  });

  const handleSocialLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.socialLinks];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, socialLinks: newLinks }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, '']
    }));
  };

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Filter out empty social links
      const filteredSocialLinks = formData.socialLinks.filter(link => link.trim() !== '');

      const creatorData = {
        name: formData.name,
        bio: formData.bio,
        socialLinks: filteredSocialLinks,
        paymentPreferences: {
          currency: 'USD',
        },
      };

      await createCreator(creatorData);
      toast.success('Filmmaker profile created successfully!');
      navigate('/movies');
    } catch (error: any) {
      console.error('Error creating creator profile:', error);
      toast.error(error.message || 'Failed to create creator profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Jara!</h1>
          <p className="text-gray-600 text-lg">Let's set up your filmmaker profile to start sharing your movies</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Create Your Filmmaker Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Display Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your creator name"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">This will be your public display name</p>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  placeholder="Tell your fans about yourself..."
                />
                <p className="text-sm text-gray-500 mt-1">Optional: Share a bit about yourself</p>
              </div>

              <div>
                <Label>Social Links</Label>
                <p className="text-sm text-gray-500 mb-3">Add your social media profiles (optional)</p>

                {formData.socialLinks.map((link, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <Input
                      type="url"
                      value={link}
                      onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                      placeholder="https://twitter.com/yourusername"
                    />
                    {formData.socialLinks.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSocialLink(index)}
                        className="px-3"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSocialLink}
                  className="mt-2"
                >
                  + Add Social Link
                </Button>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• You'll be able to upload and share your movies</li>
                  <li>• Fans can rent your movies and get access codes</li>
                  <li>• You'll get access to analytics and earnings reports</li>
                  <li>• You can customize your filmmaker page and movie listings</li>
                </ul>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Skip for Now
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading || !formData.name.trim()}
                >
                  {isLoading ? 'Creating Profile...' : 'Create Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>By creating a profile, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}