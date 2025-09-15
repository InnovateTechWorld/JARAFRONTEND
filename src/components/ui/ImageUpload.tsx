import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { api } from '../../lib/api';
import { clsx } from 'clsx';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  className?: string;
  maxSize?: number;
  accept?: string;
  placeholder?: string;
  folder?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = 'image/*',
  placeholder = 'Drop an image here or click to browse',
  folder = 'general'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const response = await api.uploadImage(file, folder, file.name);
      onChange(response.imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [maxSize, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxFiles: 1,
    disabled: isUploading,
  });

  if (value) {
    return (
      <div className={clsx('relative group', className)}>
        <img
          src={value}
          alt="Uploaded"
          className="w-full h-48 object-cover rounded-lg border border-gray-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = accept;
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files && files.length > 0) {
                    onDrop([files[0]]);
                  }
                };
                input.click();
              }}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              Change
            </Button>
            {onRemove && (
              <Button
                variant="danger"
                size="sm"
                onClick={onRemove}
                leftIcon={<X className="w-4 h-4" />}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50',
          isUploading && 'cursor-not-allowed opacity-50'
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={clsx(
            'w-12 h-12 rounded-full flex items-center justify-center',
            isDragActive ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
          )}>
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <ImageIcon className="w-6 h-6" />
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900">
              {isUploading ? 'Uploading...' : placeholder}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to {maxSize / (1024 * 1024)}MB
            </p>
          </div>

          {!isDragActive && !isUploading && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Upload className="w-4 h-4" />}
            >
              Choose File
            </Button>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
}