import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/utils/api';

interface ImageUploadCardProps {
  selectedImage: File | null;
  setSelectedImage: (file: File | null) => void;
  imagePreview: string;
  setImagePreview: (preview: string) => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
  uploadedImageUrl: string;
  setUploadedImageUrl: (url: string) => void;
}

const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  selectedImage,
  setSelectedImage,
  imagePreview,
  setImagePreview,
  uploading,
  setUploading,
  uploadedImageUrl,
  setUploadedImageUrl,
}) => {
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      toast({
        title: 'Λείπει αρχείο',
        description: 'Παρακαλώ επιλέξτε πρώτα ένα αρχείο',
        variant: 'destructive',
      });
      return;
    }

    console.log('🚀 Starting image upload:', selectedImage.name);
    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', selectedImage);

    try {
      console.log('📡 Making upload request to:', `${API_BASE_URL}/upload`);
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: uploadFormData,
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      });

      console.log('📥 Upload response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Upload response data:', data);

      if (data.success) {
        setUploadedImageUrl(data.imageUrl);
        console.log('✅ Upload successful, image URL set:', data.imageUrl);
        
        // SUCCESS NOTIFICATION - VISIBLE AND CLEAR
        toast({
          title: '🎉 ΕΠΙΤΥΧΙΑ! Εικόνα Ανέβηκε!',
          description: `✅ "${data.originalName}" είναι έτοιμη για αποστολή στα emails!`,
          variant: 'default',
          duration: 8000,
        });
        
        // Additional visual confirmation
        console.log('🎉 UPLOAD SUCCESS - IMAGE READY FOR EMAIL SENDING:', data.imageUrl);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      toast({
        title: 'Σφάλμα ανεβάσματος',
        description: error instanceof Error ? error.message : 'Αποτυχία ανεβάσματος εικόνας',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Εικόνα/PDF Προσφοράς
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Label>Επιλέξτε εικόνα ή PDF</Label>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*,application/pdf,.doc,.docx"
              onChange={handleImageSelect}
              className="flex-1"
            />
            <Button
              onClick={uploadImage}
              disabled={!selectedImage || uploading}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Ανέβασμα...' : 'Ανέβασμα'}
            </Button>
          </div>
          
          {imagePreview && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">Προεπισκόπηση:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full h-auto max-h-64 mx-auto border rounded shadow-sm"
              />
            </div>
          )}
          
          {uploadedImageUrl && (
            <Alert className="bg-gradient-to-r from-green-100 to-emerald-100 border-4 border-green-500 dark:from-green-900/50 dark:to-emerald-900/50 dark:border-green-400 shadow-xl animate-fade-in">
              <CheckCircle className="h-8 w-8 text-green-700 dark:text-green-300" />
              <AlertDescription className="text-green-900 dark:text-green-100 font-extrabold text-xl">
                🎉 ΕΠΙΤΥΧΙΑ! Εικόνα Ανέβηκε Σωστά! ✅
                <br />
                <span className="text-lg font-bold text-green-800 dark:text-green-200 bg-green-200 dark:bg-green-800 px-2 py-1 rounded-md inline-block mt-2">
                  ✅ ΕΤΟΙΜΗ ΓΙΑ ΑΠΟΣΤΟΛΗ! Συνεχίστε με την αποστολή!
                </span>
                <br />
                <span className="text-base font-semibold text-green-700 dark:text-green-300 mt-2 block">
                  📷 Αρχείο: {uploadedImageUrl.split('/').pop()}
                </span>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploadCard;