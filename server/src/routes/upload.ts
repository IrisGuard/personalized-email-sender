import { Request, Response } from 'express';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    console.log('📸 Upload request received:', req.file ? 'File present' : 'No file');
    
    if (!req.file) {
      console.log('❌ No file in upload request');
      return res.status(400).json({
        success: false,
        error: 'Δεν βρέθηκε αρχείο εικόνας'
      });
    }
    
    console.log('📁 File details:', {
      originalname: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      path: req.file.path
    });
    
    const optimizedImagePath = path.join(path.dirname(req.file.path), 'optimized-' + req.file.filename);
    
    // Optimize image with Sharp
    await sharp(req.file.path)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(optimizedImagePath);
    
    console.log('✨ Image optimized successfully');
    
    // Use the correct domain for production
    const host = req.get('host') || 'personalized-email-sender.onrender.com';
    const protocol = req.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const imageUrl = `${protocol}://${host}/uploads/optimized-${req.file.filename}`;
    
    console.log('🌐 Generated image URL:', imageUrl);
    
    // Clean up original file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      imageUrl: imageUrl,
      originalName: req.file.originalname,
      size: req.file.size
    });

  } catch (error) {
    console.error('❌ Error in upload:', error);
    res.status(500).json({
      success: false,
      error: 'Σφάλμα στο ανέβασμα εικόνας'
    });
  }
};