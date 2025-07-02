import { Request, Response } from 'express';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Δεν βρέθηκε αρχείο εικόνας'
      });
    }
    
    const optimizedImagePath = path.join(path.dirname(req.file.path), 'optimized-' + req.file.filename);
    
    // Optimize image with Sharp
    await sharp(req.file.path)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(optimizedImagePath);
    
    const imageUrl = `https://offerakrogonosinternationalgroup.eu/uploads/optimized-${req.file.filename}`;
    
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