import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api-client';
import { useQueryClient } from '@tanstack/react-query';

interface BusinessGalleryTabProps {
  gallery?: string[];
  isOwnProfile?: boolean;
  userId?: string;
}

const BusinessGalleryTab: React.FC<BusinessGalleryTabProps> = ({ gallery = [], isOwnProfile = false, userId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !isOwnProfile) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });

    try {
      await apiClient.post('/dashboard/gallery/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      queryClient.invalidateQueries({ queryKey: ['user-gallery', userId] });
      toast({
        title: "Images uploaded successfully",
        description: "Your images have been added to the gallery.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload images.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    if (!isOwnProfile) return;

    try {
      await apiClient.delete('/dashboard/gallery/image', { data: { imageUrl } });
      queryClient.invalidateQueries({ queryKey: ['user-gallery', userId] });
      toast({
        title: "Image removed",
        description: "The image has been removed from your gallery.",
      });
    } catch (error) {
      toast({
        title: "Remove failed",
        description: "Failed to remove image.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {isOwnProfile && (
        <div className="flex justify-end">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="image-upload"
              disabled={uploading}
            />
            <Button asChild disabled={uploading}>
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Images'}
              </label>
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {gallery.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-muted-foreground">
            No images in gallery
          </div>
        ) : (
          gallery.map((imageUrl, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group">
              <CardContent className="p-0">
                <img
                  src={imageUrl}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
                {isOwnProfile && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8"
                    onClick={() => handleRemoveImage(imageUrl)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BusinessGalleryTab;
