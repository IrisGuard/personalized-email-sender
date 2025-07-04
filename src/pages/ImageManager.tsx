import React from 'react';
import ImageManagerComponent from '@/components/admin/ImageManager';

const ImageManagerPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">📚 Image Manager</h1>
          <p className="text-muted-foreground">
            Manage your stored images for email campaigns
          </p>
        </div>
        <ImageManagerComponent />
      </div>
    </div>
  );
};

export default ImageManagerPage;