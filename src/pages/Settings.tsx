import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { useCreator } from '../hooks/useCreator';
import { api, Creator } from '../lib/api';
import { ImageUpload } from '../components/ui/ImageUpload';
import { User, Camera, Palette, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface RawCreatorResponse {
  id: string;
  name: string;
  bio: string;
  social_links: string[];
  profile_image?: string;
  background_image?: string;
  payment_preferences: {
    currency: string;
    flutterwave_account?: string;
  };
  jara_page_slug: string;
  created_at: string;
  updated_at: string;
}

export function Settings() {
  const { creator, updateCreator, refetch } = useCreator();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    socialLinks: [''],
    profileImage: '',
    backgroundImage: '',
  });
  const [originalData, setOriginalData] = useState<typeof formData | null>(null);

  useEffect(() => {
    if (creator?.id) {
      loadCreatorData();
    } else {
      setIsInitialLoading(false);
    }
  }, [creator?.id]);

  const loadCreatorData = async () => {
    if (!creator?.id) return;

    try {
      setIsInitialLoading(true);
      // Fetch creator data directly to get the latest images
      const creatorResponse = await api.getCreator(creator.id) as unknown as { success: boolean; creator: RawCreatorResponse };

      if (creatorResponse.success && creatorResponse.creator) {
        const rawCreator = creatorResponse.creator;
        const initialData = {
          name: rawCreator.name || '',
          bio: rawCreator.bio || '',
          socialLinks: rawCreator.social_links && rawCreator.social_links.length > 0 ? rawCreator.social_links : [''],
          profileImage: rawCreator.profile_image || '',
          backgroundImage: rawCreator.background_image || '',
        };
        setFormData(initialData);
        setOriginalData(initialData);
      }
    } catch (error) {
      console.error('Error loading creator data:', error);
      // Fallback to useCreator hook data
      if (creator) {
        const initialData = {
          name: creator.name || '',
          bio: creator.bio || '',
          socialLinks: creator.socialLinks && creator.socialLinks.length > 0 ? creator.socialLinks : [''],
          profileImage: creator.profileImage || '',
          backgroundImage: creator.backgroundImage || '',
        };
        setFormData(initialData);
        setOriginalData(initialData);
      }
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (index: number, value: string) => {
    const newSocialLinks = [...formData.socialLinks];
    newSocialLinks[index] = value;
    setFormData(prev => ({
      ...prev,
      socialLinks: newSocialLinks
    }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, '']
    }));
  };

  const removeSocialLink = (index: number) => {
    if (formData.socialLinks.length > 1) {
      const newSocialLinks = formData.socialLinks.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        socialLinks: newSocialLinks
      }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!creator || !originalData) return;

    try {
      setIsLoading(true);

      // Filter out empty social links
      const filteredSocialLinks = formData.socialLinks.filter(link => link.trim() !== '');
      const filteredOriginalSocialLinks = originalData.socialLinks.filter(link => link.trim() !== '');

      // Check if any changes were made
      const hasChanges =
        formData.name !== originalData.name ||
        formData.bio !== originalData.bio ||
        formData.profileImage !== originalData.profileImage ||
        formData.backgroundImage !== originalData.backgroundImage ||
        JSON.stringify(filteredSocialLinks) !== JSON.stringify(filteredOriginalSocialLinks);

      if (!hasChanges) {
        toast('No changes detected');
        navigate('/dashboard');
        return;
      }

      const updates = {
        name: formData.name,
        bio: formData.bio,
        socialLinks: filteredSocialLinks,
        profileImage: formData.profileImage,
        backgroundImage: formData.backgroundImage,
      };

      await updateCreator(updates);
      // Refetch to ensure we have the latest data
      await refetch();
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading || !creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600">Update your creator profile and customize your Jara page</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-purple-600" />
                <span>Profile Images</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Picture */}
                <div className="space-y-4">
                  <Label htmlFor="profileImage">Profile Picture</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {formData.profileImage ? (
                        <img
                          src={formData.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <ImageUpload
                        onChange={(url) => setFormData(prev => ({ ...prev, profileImage: url }))}
                        accept="image/*"
                        maxSize={5 * 1024 * 1024} // 5MB
                        folder="profiles"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended: Square image, max 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Background Image */}
                <div className="space-y-4">
                  <Label htmlFor="backgroundImage">Background Image</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {formData.backgroundImage ? (
                        <img
                          src={formData.backgroundImage}
                          alt="Background"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Palette className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <ImageUpload
                        onChange={(url) => setFormData(prev => ({ ...prev, backgroundImage: url }))}
                        accept="image/*"
                        maxSize={10 * 1024 * 1024} // 10MB
                        folder="profiles"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended: Landscape image, max 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-purple-600" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your creator name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell your fans about yourself..."
                  rows={4}
                />
                <p className="text-xs text-gray-500">
                  This will be displayed on your Jara page and payment links
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.socialLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={link}
                    onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                    placeholder="https://..."
                    className="flex-1"
                  />
                  {formData.socialLinks.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSocialLink(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSocialLink}
                className="w-full"
              >
                Add Social Link
              </Button>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}