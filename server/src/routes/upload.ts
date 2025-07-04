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
    
    // Create a professional filename based on current date and original name
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const originalName = req.file.originalname.toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-')  // Replace special chars with dash
      .replace(/--+/g, '-')          // Replace multiple dashes with single
      .replace(/^-|-$/g, '');        // Remove leading/trailing dashes
    
    const professionalFilename = `akrogonos-prosfora-${timestamp}-${originalName}`;
    const optimizedImagePath = path.join(path.dirname(req.file.path), professionalFilename);
    
    // Optimize image with Sharp - proper settings for email
    await sharp(req.file.path)
      .resize(600, 450, { 
        fit: 'inside', 
        withoutEnlargement: true,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .jpeg({ 
        quality: 90,
        progressive: true,
        mozjpeg: true
      })
      .toFile(optimizedImagePath);
    
    console.log('✨ Image optimized successfully with professional filename');
    
    // Use the correct domain for production
    const host = req.get('host') || 'personalized-email-sender.onrender.com';
    const protocol = req.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const imageUrl = `${protocol}://${host}/uploads/${professionalFilename}`;
    
    console.log('🌐 Generated professional image URL:', imageUrl);
    
    // Clean up original file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      imageUrl: imageUrl,
      originalName: req.file.originalname,
      professionalFilename,
      size: req.file.size,
      optimizedForEmail: true
    });

  } catch (error) {
    console.error('❌ Error in upload:', error);
    res.status(500).json({
      success: false,
      error: 'Σφάλμα στο ανέβασμα εικόνας'
    });
  }
};