import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { useToast } from './ui/use-toast';
import { api } from '../lib/api';
import { Video } from '../types';
import { Video as VideoIcon, Trash2, Play, Calendar, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface VideoListProps {
  userId?: string;
  isPublic?: boolean;
  limit?: number;
  showDelete?: boolean;
  onVideoDeleted?: (videoId: string) => void;
}

const VideoList: React.FC<VideoListProps> = ({
  userId,
  isPublic = false,
  limit = 20,
  showDelete = false,
  onVideoDeleted
}) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
  }, [userId, isPublic, limit]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      let response;

      if (userId) {
        response = await api.getUserVideos(userId, { isPublic, limit });
      } else {
        response = await api.getPublicVideos({ limit });
      }

      if (response.success) {
        setVideos(response.videos);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        title: 'Error loading videos',
        description: 'Failed to load videos. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    setDeletingId(videoId);
    try {
      const response = await api.deleteVideo(videoId);
      if (response.success) {
        setVideos(videos.filter(video => video.id !== videoId));
        toast({
          title: 'Video deleted',
          description: 'The video has been successfully deleted.',
        });
        if (onVideoDeleted) {
          onVideoDeleted(videoId);
        }
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: 'Delete failed',
        description: 'Failed to delete the video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <VideoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
        <p className="text-gray-500">
          {userId ? 'You haven\'t uploaded any videos yet.' : 'No public videos available.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Video Thumbnail/Preview */}
              <div className="md:w-48 h-32 bg-gray-100 flex items-center justify-center relative">
                {video.coverImageUrl ? (
                  <img
                    src={video.coverImageUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <VideoIcon className="h-8 w-8 text-gray-400" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Video Details */}
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(video.uploadedAt), { addSuffix: true })}
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        {formatFileSize(video.fileSize)}
                      </div>
                      {video.isPublic && (
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                          Public
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(video.url, '_blank')}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Watch
                    </Button>

                    {showDelete && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(video.id)}
                        disabled={deletingId === video.id}
                      >
                        {deletingId === video.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VideoList;