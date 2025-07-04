import { config } from '../config/environment';
import { EmailData } from '../types/email';

// Convert stored image data to URLs directly from passed data
const convertStoredImageDataToUrls = (storedImagesData?: Array<{
  id: string;
  filename: string;
  url: string;
  title: string;
  category: string;
  uploadDate: string;
  size: number;
}>): string[] => {
  if (!storedImagesData || storedImagesData.length === 0) return [];
  
  const urls: string[] = [];
  
  for (const imageData of storedImagesData) {
    urls.push(imageData.url);
    console.log(`✅ Using stored image: ${imageData.title} -> ${imageData.url}`);
  }
  
  console.log(`🔄 Converted ${storedImagesData.length} stored images to URLs`);
  return urls;
};

export class EmailTemplate {
  static generateHTML(emailData: EmailData, recipient: string): string {
    const unsubscribeToken = Buffer.from(recipient).toString('base64');
    const unsubscribeUrl = `https://offerakrogonosinternationalgroup.eu/unsubscribe?token=${unsubscribeToken}`;
    
    // Convert stored image data to URLs
    const storedImageUrls = convertStoredImageDataToUrls(emailData.storedImagesData);
    console.log(`🔄 Converted ${emailData.storedImagesData?.length || 0} stored images to ${storedImageUrls.length} URLs`);
    
    return `
<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailData.title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <!-- Preheader text for better preview -->
  <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; opacity: 0;">
    ${emailData.title} - Ενημέρωση προϊόντων από ${config.company.name}
  </div>
  
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9fa; padding: 20px 0;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <tr>
            <td style="padding: 30px;">
              
              <!-- Professional greeting -->
              <div style="color: #666; font-size: 14px; margin-bottom: 20px; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                Αγαπητέ/ή πελάτη, σας ενημερώνουμε για τα διαθέσιμα προϊόντα μας
              </div>
              
              <!-- Title -->
              <h1 style="color: #2c3e50; text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 15px; margin: 0 0 25px 0; font-size: 24px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                ${emailData.title}
              </h1>
              
               <!-- Image section with professional display -->
               ${this.generateImageSection(emailData.imageUrl, storedImageUrls)}
              
              <!-- Description -->
              <div style="font-size: 16px; line-height: 1.6; color: #333; margin: 20px 0; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                ${emailData.description.replace(/\n/g, '<br>')}
              </div>
              
              <!-- Price section -->
              ${emailData.price && emailData.price.trim() !== '' ? `
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 25px 0;">
                <tr>
                  <td align="center">
                    <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                      <div style="font-size: 14px; color: #495057; margin-bottom: 8px; font-weight: 500;">ΤΙΜΗ ΠΡΟΪΟΝΤΟΣ</div>
                      <div style="color: #495057; font-size: 24px; font-weight: bold; margin: 5px 0;">€${emailData.price}</div>
                      <div style="color: #495057; font-size: 16px; font-weight: 600;">(χωρίς Φ.Π.Α.)</div>
                    </div>
                  </td>
                </tr>
              </table>
              ` : `
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 25px 0;">
                <tr>
                  <td align="center">
                    <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                      <div style="color: #495057; font-size: 18px; font-weight: 600;">Επικοινωνήστε για πληροφορίες</div>
                    </div>
                  </td>
                </tr>
              </table>
              `}
              
              <!-- CTA Button -->
              ${emailData.cta ? `
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://www.energiakakoufomata-koufomatapvc.gr/epikoinonia/" 
                       target="_blank"
                       style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                      ${emailData.cta}
                    </a>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              <!-- Company info and footer -->
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                <p style="margin: 10px 0;"><strong>${config.company.name}</strong></p>
                <p style="margin: 10px 0;">Για περισσότερες πληροφορίες επικοινωνήστε μαζί μας</p>
                
                ${this.getCompanySignature()}
                ${this.getGDPRFooter(unsubscribeUrl)}
              </div>
              
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  private static generateImageSection(singleImageUrl?: string, multipleImages: string[] = []): string {
    const allImages = [];
    
    // Add single uploaded image if exists
    if (singleImageUrl) {
      allImages.push(singleImageUrl);
    }
    
    // Add multiple stored images
    if (multipleImages && multipleImages.length > 0) {
      allImages.push(...multipleImages);
    }
    
    if (allImages.length === 0) {
      return '';
    }
    
    // Single image layout
    if (allImages.length === 1) {
      return `
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 20px 0;">
          <tr>
            <td align="center">
              <img src="${allImages[0]}" 
                   alt="Επαγγελματική προσφορά προϊόντων από ${config.company.name} - Υψηλής ποιότητας εξοπλισμός" 
                   width="500" 
                   height="375"
                   style="max-width: 100%; width: 500px; height: 375px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); display: block; border: none; outline: none; object-fit: cover;"
                   loading="lazy"
                   decoding="async" />
            </td>
          </tr>
        </table>
      `;
    }
    
    // Multiple images layout (2 columns for 2 images, 3 columns for 3+ images)
    const columns = allImages.length === 2 ? 2 : 3;
    const imageWidth = columns === 2 ? 280 : 180;
    
    let imagesHtml = '';
    for (let i = 0; i < allImages.length; i += columns) {
      const rowImages = allImages.slice(i, i + columns);
      imagesHtml += `
        <tr>
          ${rowImages.map((imgUrl, index) => `
            <td align="center" style="padding: 10px;">
              <img src="${imgUrl}" 
                   alt="Επαγγελματική προσφορά προϊόντων ${index + 1} από ${config.company.name} - Υψηλής ποιότητας εξοπλισμός" 
                   width="${imageWidth}" 
                   height="${Math.round(imageWidth * 0.75)}"
                   style="max-width: 100%; width: ${imageWidth}px; height: ${Math.round(imageWidth * 0.75)}px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); display: block; border: none; outline: none; object-fit: cover;"
                   loading="lazy"
                   decoding="async" />
            </td>
          `).join('')}
        </tr>
      `;
    }
    
    return `
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 20px 0;">
        ${imagesHtml}
      </table>
    `;
  }

  private static getCompanySignature(): string {
    return `
      <!-- ΕΠΑΓΓΕΛΜΑΤΙΚΗ ΥΠΟΓΡΑΦΗ -->
      <div style="margin-top: 20px; font-size: 14px; line-height: 1.6; text-align: center; background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
        <strong>ΟΜΙΛΟΣ ΕΤΑΙΡΕΙΩΝ</strong><br />
        <strong>AKROGONOS INTERNATIONAL GROUP</strong><br />
        ΑΘΗΝΑ - ΠΕΙΡΑΙΑ - ΚΡΗΤΗ - ΒΟΥΛΓΑΡΙΑ – ΠΩΛΗΣΗ ΠΑΝΕΛΑΔΙΚΑ - ΑΝΤΙΠΡΟΣΩΠΕΙΕΣ / ΕΙΣΑΓΩΓΕΣ – ΕΞΑΓΩΓΕΣ<br /><br />
        
        <div style="margin: 15px 0; padding: 15px; background-color: #ffffff; border-left: 4px solid #6c757d; border-radius: 4px;">
          <strong style="color: #495057;">Επικοινωνήστε μαζί μας για περισσότερες πληροφορίες</strong><br />
          <span style="color: #6c757d;">Με ένα ολοκληρωμένο δίκτυο διανομής είμαστε σε θέση να προμηθεύουμε Πανελλαδικά τα προϊόντα μας με συνέπεια, ευθύνη και αξιοπιστία.</span>
        </div><br />
        
        <strong>Γραφείο Εξαγωγών – Πειραιά Νόταρα 117</strong><br />
        📧 imports@energiakakoufomata-koufomatapvc.gr<br />
        📧 export@energiakakoufomata-koufomatapvc.gr<br /><br />
        
        <strong>Γραφείο Ηράκλειο Κρήτης Σεφέρη 5</strong><br />
        Τηλ: 2811117934 – 6939366243<br />
        📧 paragelies@energiakakoufomata-koufomatapvc.gr<br /><br />
        
        <strong>Γραφεία Ηράκλειο Κρήτης Γερωνυμάκη 104 – ΠΑΤΕΛΕΣ</strong><br />
        Τηλ: 2811812735 – 6907793443<br />
        📧 sale@energiakakoufomata-koufomatapvc.gr<br />
        📧 koufomata.pvc@gmail.com<br /><br />
        
        <strong>Γραφεία Ηράκλειο Κρήτης Ολούντος 34</strong><br />
        Τηλ: 2811812736<br />
        📧 prosfores@energiakakoufomata-koufomatapvc.gr<br /><br />
        
        📧 pvc.laminate@gmail.com<br />
        🌐 Website: energiakakoufomata-koufomatapvc.gr<br />
        🔗 Επικοινωνία: energiakakoufomata-koufomatapvc.gr/epikoinonia
      </div>
    `;
  }

  private static getGDPRFooter(unsubscribeUrl: string): string {
    return `
      <!-- GDPR Compliance & Unsubscribe -->
      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #888; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <p style="margin: 10px 0;">Λαμβάνετε αυτό το email επειδή έχετε εκδηλώσει ενδιαφέρον για τις υπηρεσίες μας.</p>
        <p style="margin: 10px 0;">
          <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">Απεγγραφή από τη λίστα</a> | 
          <a href="mailto:${config.company.replyTo}?subject=Privacy%20Policy" style="color: #666; text-decoration: underline;">Πολιτική Απορρήτου</a>
        </p>
        <p style="margin-top: 10px;">
          ${config.company.name}<br>
          Email: <span style="color: #666;">${config.company.replyTo}</span>
        </p>
      </div>
    `;
  }
}