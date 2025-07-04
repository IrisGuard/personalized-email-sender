import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Image, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '@/utils/api';

interface StoredImage {
  id: string;
  filename: string;
  url: string;
  title: string;
  category: string;
  uploadDate: string;
  size: number;
}

interface ImageSelectorProps {
  selectedImages: string[];
  onSelectionChange: (imageUrls: string[]) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  selectedImages,
  onSelectionChange,
}) => {
  const [storedImages, setStoredImages] = useState<StoredImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadStoredImages();
  }, []);

  const loadStoredImages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stored-images`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors',
      });

      if (response.ok) {
        const data = await response.json();
        setStoredImages(data.images || []);
      }
    } catch (error) {
      console.error('Error loading stored images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageToggle = (imageUrl: string) => {
    const isSelected = selectedImages.includes(imageUrl);
    if (isSelected) {
      onSelectionChange(selectedImages.filter(url => url !== imageUrl));
    } else {
      onSelectionChange([...selectedImages, imageUrl]);
    }
  };

  const filteredImages = filter === 'all' 
    ? storedImages 
    : storedImages.filter(img => img.category === filter);

  const categories = [...new Set(storedImages.map(img => img.category))];

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Select Images ({selectedImages.length} selected)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {storedImages.length === 0 ? (
          <Alert>
            <AlertDescription>
              No stored images available. Please upload some images first using the Image Manager.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={filter === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setFilter('all')}
              >
                All ({storedImages.length})
              </Badge>
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={filter === category ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFilter(category)}
                >
                  {category} ({storedImages.filter(img => img.category === category).length})
                </Badge>
              ))}
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredImages.map((image) => {
                const isSelected = selectedImages.includes(image.url);
                return (
                  <div
                    key={image.id}
                    className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all ${
                      isSelected 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:ring-1 hover:ring-muted-foreground/50'
                    }`}
                    onClick={() => handleImageToggle(image.url)}
                  >
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleImageToggle(image.url)}
                          className="flex-shrink-0"
                        />
                        <span className="text-xs font-medium truncate flex-1">
                          {image.title}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-primary rounded-full p-1">
                        <CheckCircle className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedImages.length > 0 && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>{selectedImages.length} images selected</strong> for your email campaign
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageSelector;