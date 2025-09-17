import React, { useState, useRef } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { useToast } from './ui/use-toast';
import { api } from '../lib/api';
import { Video } from '../types';
import { Upload, Video as VideoIcon, X } from 'lucide-react';

interface VideoUploadProps {
  onVideoUploaded?: (video: Video) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onVideoUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a video file.',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Video file must be less than 100MB.',
          variant: 'destructive',
        });
        return;
      }

      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file.',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Cover image must be less than 5MB.',
          variant: 'destructive',
        });
        return;
      }

      setCoverImageFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      toast({
        title: 'No video selected',
        description: 'Please select a video file to upload.',
        variant: 'destructive',
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for your video.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('isPublic', 'true'); // Always public as per requirements

      if (coverImageFile) {
        formData.append('coverImage', coverImageFile);
      }

      const response = await api.uploadVideo(formData);

      if (response.success) {
        toast({
          title: 'Video uploaded successfully!',
          description: 'Your video is now live and public.',
        });

        // Reset form
        setTitle('');
        setDescription('');
        setVideoFile(null);
        setCoverImageFile(null);
        setVideoPreview(null);
        setCoverPreview(null);

        // Notify parent component
        if (onVideoUploaded) {
          onVideoUploaded(response as any);
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An error occurred during upload.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverPreview(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <VideoIcon className="h-5 w-5" />
          Upload Video
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-6">
          {/* Video File Selection */}
          <div className="space-y-2">
            <Label htmlFor="video">Video File *</Label>
            {!videoFile ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => videoInputRef.current?.click()}
              >
                <VideoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to select a video file
                </p>
                <p className="text-xs text-gray-500">
                  MP4, MOV, AVI up to 100MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <video
                  src={videoPreview!}
                  controls
                  className="w-full max-h-64 rounded-lg"
                />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeVideo}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <input
              ref={videoInputRef}
              type="file"
              id="video"
              accept="video/*"
              onChange={handleVideoSelect}
              className="hidden"
            />
          </div>

          {/* Cover Image Selection */}
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image (Optional)</Label>
            {!coverImageFile ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => coverInputRef.current?.click()}
              >
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Click to select a cover image
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG up to 5MB
                </p>
              </div>
            ) : (
              <div className="relative inline-block">
                <img
                  src={coverPreview!}
                  alt="Cover preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  className="absolute -top-2 -right-2"
                  onClick={removeCoverImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <input
              ref={coverInputRef}
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={handleCoverImageSelect}
              className="hidden"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Upload Button */}
          <Button
            type="submit"
            disabled={isUploading || !videoFile}
            className="w-full"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Video
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            All videos are uploaded as public content
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default VideoUpload;