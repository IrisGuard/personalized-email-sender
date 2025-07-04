import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Trash2, Eye, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

const ImageManager = () => {
  const [storedImages, setStoredImages] = useState<StoredImage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageTitle, setImageTitle] = useState('');
  const [imageCategory, setImageCategory] = useState('products');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!imageTitle) {
        setImageTitle(file.name.split('.')[0]);
      }
    }
  };

  const uploadImage = async () => {
    if (!selectedFile || !imageTitle.trim()) {
      toast({
        title: 'Incomplete Information',
        description: 'Please select a file and enter a title',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('title', imageTitle);
    formData.append('category', imageCategory);

    try {
      const response = await fetch(`${API_BASE_URL}/upload-stored-image`, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
        mode: 'cors',
      });

      if (response.ok) {
        const data = await response.json();
        setStoredImages(prev => [...prev, data.image]);
        setSelectedFile(null);
        setImageTitle('');
        toast({
          title: '✅ Success!',
          description: 'Image uploaded successfully',
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast({
        title: 'Upload Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/stored-images/${imageId}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
        mode: 'cors',
      });

      if (response.ok) {
        setStoredImages(prev => prev.filter(img => img.id !== imageId));
        toast({
          title: 'Deleted',
          description: 'Image deleted successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Delete Error',
        description: 'Failed to delete image',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading stored images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <Label>Image Title</Label>
              <Input
                value={imageTitle}
                onChange={(e) => setImageTitle(e.target.value)}
                placeholder="Enter descriptive title"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Category</Label>
            <select 
              value={imageCategory} 
              onChange={(e) => setImageCategory(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="products">Products</option>
              <option value="offers">Special Offers</option>
              <option value="branding">Company Branding</option>
              <option value="seasonal">Seasonal</option>
            </select>
          </div>

          <Button
            onClick={uploadImage}
            disabled={!selectedFile || !imageTitle.trim() || uploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stored Images ({storedImages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {storedImages.length === 0 ? (
            <Alert>
              <AlertDescription>
                No stored images yet. Upload your first image above.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {storedImages.map((image) => (
                <div key={image.id} className="border rounded-lg overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate">{image.title}</h3>
                    <p className="text-xs text-muted-foreground">{image.category}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteImage(image.id)}
                        className="flex-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageManager;