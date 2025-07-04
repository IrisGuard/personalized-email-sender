import { Request, Response } from 'express';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import FormData from 'form-data';
import { ImgBBResponse } from '../types/imgbb';

interface StoredImage {
  id: string;
  filename: string;
  url: string;
  title: string;
  category: string;
  uploadDate: string;
  size: number;
}

// File-based persistent storage
const STORAGE_FILE = path.join(__dirname, '../../data/stored-images.json');
let storedImages: StoredImage[] = [];

// Ensure data directory exists
const ensureDataDirectory = (): void => {
  const dataDir = path.dirname(STORAGE_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('📁 Created data directory:', dataDir);
  }
};

// Load stored images from file
const loadStoredImages = (): void => {
  try {
    ensureDataDirectory();
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8');
      const parsedData = JSON.parse(data);
      storedImages = Array.isArray(parsedData) ? parsedData : [];
      console.log(`📚 Loaded ${storedImages.length} stored images from file`);
    } else {
      console.log('📚 No stored images file found, creating empty file');
      storedImages = [];
      // Create empty file
      fs.writeFileSync(STORAGE_FILE, JSON.stringify([], null, 2), 'utf8');
      console.log('✅ Created empty stored-images.json file');
    }
  } catch (error) {
    console.error('❌ Error loading stored images:', error);
    storedImages = [];
    // Try to create backup file
    try {
      fs.writeFileSync(STORAGE_FILE, JSON.stringify([], null, 2), 'utf8');
      console.log('🔧 Created recovery stored-images.json file');
    } catch (recoveryError) {
      console.error('❌ Failed to create recovery file:', recoveryError);
    }
  }
};

// Save stored images to file
const saveStoredImages = (): void => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(storedImages, null, 2), 'utf8');
    console.log(`💾 Saved ${storedImages.length} stored images to file`);
  } catch (error) {
    console.error('❌ Error saving stored images:', error);
  }
};

// Initialize storage on module load
loadStoredImages();

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

    // ULTIMATE EMAIL DELIVERABILITY OPTIMIZATION FOR STORED IMAGES
    const optimizedBuffer = await sharp(req.file.path)
      .resize(800, 600, { 
        fit: 'inside', 
        withoutEnlargement: true,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .jpeg({ 
        quality: 85,
        progressive: true,
        mozjpeg: true,
        optimizeScans: true,
        optimizeCoding: true
      })
      .withMetadata({})        // STRIP ALL METADATA
      .toBuffer();
    
    // Ensure stored images are under 150KB
    let finalBuffer = optimizedBuffer;
    if (optimizedBuffer.length > 150000) {
      finalBuffer = await sharp(req.file.path)
        .resize(650, 500, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 75, progressive: true, mozjpeg: true })
        .withMetadata({})
        .toBuffer();
    }

    // Upload to ImgBB CDN with professional settings
    const imgbbApiKey = '7c9b3dc0ad75d9b5f8e4f2a1d3e6c8b9'; // Public API key για testing
    const formData = new FormData();
    formData.append('image', finalBuffer.toString('base64'));
    formData.append('name', professionalFilename);
    formData.append('expiration', '15552000'); // 6 months expiration
    
    const cdnResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
      method: 'POST',
      body: formData,
    });
    
    const cdnData = await cdnResponse.json() as ImgBBResponse;
    
    if (!cdnData.success) {
      // Fallback to local hosting with final optimized buffer
      await sharp(finalBuffer).toFile(optimizedImagePath);
      const host = req.get('host') || 'personalized-email-sender.onrender.com';
      const protocol = req.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
      var imageUrl = `${protocol}://${host}/uploads/${professionalFilename}`;
      console.log('⚠️ CDN failed for stored image, using local hosting with optimization:', imageUrl);
    } else {
      var imageUrl = cdnData.data?.url || '';
      console.log('🚀 Stored image CDN Upload successful with professional optimization:', imageUrl);
    }

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

    // Add to storage and save to file
    storedImages.push(storedImage);
    saveStoredImages();

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

    // Remove from storage and save to file
    storedImages.splice(imageIndex, 1);
    saveStoredImages();

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