import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import VideoUpload from '../components/VideoUpload';
import VideoList from '../components/VideoList';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Video } from '../types';
import { Video as VideoIcon, Upload, List } from 'lucide-react';

const Videos: React.FC = () => {
  const { user } = useAuth();
  const [userVideos, setUserVideos] = useState<Video[]>([]);
  const [publicVideos, setPublicVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserVideos();
    }
    fetchPublicVideos();
  }, [user]);

  const fetchUserVideos = async () => {
    if (!user) return;

    try {
      const response = await api.getUserVideos(user.id);
      if (response.success) {
        setUserVideos(response.videos);
      }
    } catch (error) {
      console.error('Error fetching user videos:', error);
    }
  };

  const fetchPublicVideos = async () => {
    try {
      const response = await api.getPublicVideos();
      if (response.success) {
        setPublicVideos(response.videos);
      }
    } catch (error) {
      console.error('Error fetching public videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUploaded = (video: Video) => {
    setUserVideos(prev => [video, ...prev]);
    setPublicVideos(prev => [video, ...prev]);
  };

  const handleVideoDeleted = (videoId: string) => {
    setUserVideos(prev => prev.filter(video => video.id !== videoId));
    setPublicVideos(prev => prev.filter(video => video.id !== videoId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Management</h1>
        <p className="text-gray-600">
          Upload and manage your videos. All videos are automatically set to public.
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Video
          </TabsTrigger>
          <TabsTrigger value="my-videos" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            My Videos ({userVideos.length})
          </TabsTrigger>
          <TabsTrigger value="public-videos" className="flex items-center gap-2">
            <VideoIcon className="h-4 w-4" />
            Public Videos ({publicVideos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <VideoUpload onVideoUploaded={handleVideoUploaded} />
        </TabsContent>

        <TabsContent value="my-videos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                My Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <VideoList
                  userId={user.id}
                  showDelete={true}
                  onVideoDeleted={handleVideoDeleted}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Please log in to view your videos.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="public-videos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <VideoIcon className="h-5 w-5" />
                Public Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VideoList isPublic={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Videos;