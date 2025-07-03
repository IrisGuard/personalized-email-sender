import { Request, Response } from 'express';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { EmailQueue } from '../services/emailQueue';
import { EmailData } from '../types/email';

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

    let { recipients, subject, title, description, price, cta, imageUrl } = req.body;
    
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

    // Use imageUrl from request (image already uploaded via /upload endpoint)
    if (!imageUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image URL is required' 
      });
    }

    // Create email data
    const emailData: EmailData = {
      recipients: validEmails,
      subject,
      title,
      description,
      price,
      cta,
      imageUrl
    };

    // Add to queue for processing
    emailQueue.add(emailData);

    console.log('🚀 Emails successfully added to queue');
    
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