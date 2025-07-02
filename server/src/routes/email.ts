import { Request, Response } from 'express';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { EmailQueue, EmailData } from '../services/emailQueue';

const emailQueue = new EmailQueue();

export const sendOfferEmails = async (req: Request, res: Response) => {
  try {
    let { recipients, subject, title, description, cta } = req.body;
    
    // Parse recipients if it's a string
    if (typeof recipients === 'string') {
      recipients = recipients.split(',').map(email => email.trim());
    }

    // Validate recipients
    const validEmails = recipients.filter((email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    });

    if (validEmails.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Δεν βρέθηκαν έγκυρα email addresses' 
      });
    }

    let imageUrl = '';
    
    // Process uploaded image
    if (req.file) {
      const optimizedImagePath = path.join(path.dirname(req.file.path), 'optimized-' + req.file.filename);
      
      // Optimize image with Sharp
      await sharp(req.file.path)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(optimizedImagePath);
      
      // For production, you would upload to a CDN or cloud storage
      // For now, we'll use the local path (not ideal for production)
      imageUrl = `/uploads/optimized-${req.file.filename}`;
      
      // Clean up original file
      fs.unlinkSync(req.file.path);
    }

    // Create email data
    const emailData: EmailData = {
      recipients: validEmails,
      subject,
      title,
      description,
      cta,
      imageUrl
    };

    // Add to queue for processing
    emailQueue.add(emailData);

    res.json({
      success: true,
      message: 'Emails added to queue successfully',
      validEmails: validEmails.length,
      totalEmails: recipients.length,
      imageUploaded: !!req.file
    });

  } catch (error) {
    console.error('❌ Error in send-offer-emails:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Σφάλμα στην αποστολή emails' 
    });
  }
};