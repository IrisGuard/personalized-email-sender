import { Request, Response } from 'express';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

interface StoredImage {
  id: string;
  filename: string;
  url: string;
  title: string;
  category: string;
  uploadDate: string;
  size: number;
}

// In-memory storage for demo - replace with database in production
let storedImages: StoredImage[] = [];

export const getStoredImages = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      images: storedImages
    });
  } catch (error) {
    console.error('Error getting stored images:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve stored images'
    });
  }
};

export const uploadStoredImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    const { title, category } = req.body;
    
    if (!title || !category) {
      return res.status(400).json({
        success: false,
        error: 'Title and category are required'
      });
    }

    console.log('📸 Uploading stored image:', { title, category, filename: req.file.filename });

    // Create professional filename
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const safeTitle = title.toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');
    
    const professionalFilename = `akrogonos-stored-${timestamp}-${safeTitle}.jpg`;
    const optimizedImagePath = path.join(path.dirname(req.file.path), professionalFilename);

    // Optimize image for email delivery
    await sharp(req.file.path)
      .resize(800, 600, { 
        fit: 'inside', 
        withoutEnlargement: true,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .jpeg({ 
        quality: 85,
        progressive: true,
        mozjpeg: true
      })
      .toFile(optimizedImagePath);

    // Generate URL
    const host = req.get('host') || 'personalized-email-sender.onrender.com';
    const protocol = req.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const imageUrl = `${protocol}://${host}/uploads/${professionalFilename}`;

    // Create stored image record
    const storedImage: StoredImage = {
      id: uuidv4(),
      filename: professionalFilename,
      url: imageUrl,
      title,
      category,
      uploadDate: new Date().toISOString(),
      size: req.file.size
    };

    // Add to storage
    storedImages.push(storedImage);

    // Clean up original file
    fs.unlinkSync(req.file.path);

    console.log('✅ Stored image uploaded successfully:', storedImage.id);

    res.json({
      success: true,
      image: storedImage,
      message: 'Image stored successfully'
    });

  } catch (error) {
    console.error('❌ Error uploading stored image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload stored image'
    });
  }
};

export const deleteStoredImage = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;
    
    const imageIndex = storedImages.findIndex(img => img.id === imageId);
    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

    const image = storedImages[imageIndex];
    
    // Delete file from filesystem
    try {
      const uploadsDir = path.join(__dirname, '../../uploads');
      const filePath = path.join(uploadsDir, image.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fileError) {
      console.warn('Warning: Could not delete image file:', fileError);
    }

    // Remove from storage
    storedImages.splice(imageIndex, 1);

    console.log('🗑️ Stored image deleted:', imageId);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting stored image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete stored image'
    });
  }
};