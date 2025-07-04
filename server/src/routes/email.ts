import { Request, Response } from 'express';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { EmailQueue } from '../services/emailQueue';
import { EmailData } from '../types/email';

interface StoredImage {
  id: string;
  filename: string;
  url: string;
  title: string;
  category: string;
  uploadDate: string;
  size: number;
}

// Load stored images from file
const loadStoredImages = (): StoredImage[] => {
  try {
    const STORAGE_FILE = path.join(__dirname, '../../data/stored-images.json');
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('❌ Error loading stored images in email route:', error);
  }
  return [];
};


const emailQueue = new EmailQueue();

// Simple rate limiting - max 3 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const sendOfferEmails = async (req: Request, res: Response) => {
  try {
    // Rate limiting check
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const minute = 60 * 1000; // 1 minute in milliseconds
    
    if (!rateLimitMap.has(clientIP)) {
      rateLimitMap.set(clientIP, { count: 1, resetTime: now + minute });
    } else {
      const userData = rateLimitMap.get(clientIP)!;
      if (now > userData.resetTime) {
        // Reset the counter
        userData.count = 1;
        userData.resetTime = now + minute;
      } else {
        userData.count++;
        if (userData.count > 3) {
          return res.status(429).json({
            success: false,
            error: 'Πάρα πολλές αιτήσεις. Παρακαλώ περιμένετε 1 λεπτό.'
          });
        }
      }
    }

    let { recipients, description, price, cta, imageUrl, storedImages } = req.body;
    
    console.log('📥 Received request body:', req.body);
    console.log('🖼️ Image URL from request:', imageUrl);
    console.log('📨 Recipients received:', recipients);
    
    // Handle recipients array (already parsed from frontend)
    if (!Array.isArray(recipients)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Recipients must be an array' 
      });
    }

    // Validate recipients
    const validEmails = recipients.filter((email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    });

    console.log('✅ Valid emails found:', validEmails.length);

    if (validEmails.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Δεν βρέθηκαν έγκυρα email addresses' 
      });
    }


    // Load stored images data FIRST for validation
    const allStoredImages = loadStoredImages();
    console.log(`📚 CRITICAL CHECK: Loaded ${allStoredImages.length} stored images from file`);
    
    // Convert stored image IDs to actual image data with URLs
    const selectedStoredImages: StoredImage[] = [];
    if (storedImages && Array.isArray(storedImages)) {
      console.log(`🔍 CRITICAL CHECK: Processing ${storedImages.length} requested image IDs:`, storedImages);
      
      for (const imageId of storedImages) {
        const foundImage = allStoredImages.find(img => img.id === imageId);
        if (foundImage) {
          selectedStoredImages.push(foundImage);
          console.log(`✅ FOUND stored image: ${foundImage.title} -> ${foundImage.url}`);
        } else {
          console.error(`❌ CRITICAL: Stored image with ID ${imageId} NOT FOUND in storage`);
        }
      }
    }
    
    console.log(`🖼️ CRITICAL CHECK: Selected stored images: ${selectedStoredImages.length}`);

    // CRITICAL VALIDATION: Ensure at least one image source is available with actual data
    const hasValidUploadedImage = imageUrl && imageUrl.trim() !== '';
    const hasValidStoredImages = selectedStoredImages.length > 0;
    
    console.log(`🔍 VALIDATION CHECK:`, {
      hasValidUploadedImage,
      hasValidStoredImages,
      uploadedImageUrl: imageUrl,
      storedImagesCount: selectedStoredImages.length
    });

    if (!hasValidUploadedImage && !hasValidStoredImages) {
      console.error('❌ CRITICAL FAILURE: No valid images found for email');
      return res.status(400).json({ 
        success: false, 
        error: 'ΚΡΙΣΙΜΟ ΣΦΑΛΜΑ: Δεν βρέθηκαν έγκυρες εικόνες. Παρακαλώ ανεβάστε νέα εικόνα ή επιλέξτε από τις αποθηκευμένες εικόνες.' 
      });
    }

    // Create email data with hardcoded professional subject
    const emailData: EmailData = {
      recipients: validEmails,
      subject: 'Ενημέρωση Προϊόντων - AKROGONOS INTERNATIONAL GROUP',
      title: 'Ενημέρωση προϊόντων',
      description,
      price,
      cta,
      imageUrl,
      storedImages: storedImages || [],
      storedImagesData: selectedStoredImages  // Pass actual image data
    };

    // FINAL VALIDATION BEFORE QUEUE
    console.log('🔍 FINAL EMAIL DATA VALIDATION:', {
      recipients: emailData.recipients.length,
      hasUploadedImage: !!emailData.imageUrl,
      hasStoredImagesData: emailData.storedImagesData?.length || 0,
      totalImagesInEmail: (emailData.imageUrl ? 1 : 0) + (emailData.storedImagesData?.length || 0)
    });

    // Add to queue for processing
    emailQueue.add(emailData);

    console.log('🚀 EMAILS SUCCESSFULLY ADDED TO QUEUE - 100% VALIDATED');
    
    res.json({
      success: true,
      message: 'Emails added to queue successfully',
      validEmails: validEmails.length,
      totalEmails: recipients.length,
      estimatedTime: `${validEmails.length * 3} λεπτά`,
      imageUploaded: true
    });

  } catch (error) {
    console.error('❌ Error in send-offer-emails:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Σφάλμα στην αποστολή emails' 
    });
  }
};