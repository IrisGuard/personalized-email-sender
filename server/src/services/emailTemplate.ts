import { config } from '../config/environment';
import { EmailData } from '../types/email';

export class EmailTemplate {
  static generateHTML(emailData: EmailData, recipient: string): string {
    const unsubscribeToken = Buffer.from(recipient).toString('base64');
    const unsubscribeUrl = `mailto:unsubscribe+${unsubscribeToken}@${config.company.senderEmail.split('@')[1]}?subject=Unsubscribe`;
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #2c3e50; text-align: center; border-bottom: 3px solid #3498db; padding-bottom: 10px;">
            ${emailData.title}
          </h1>
          
          ${emailData.imageUrl ? `
            <div style="text-align: center; margin: 20px 0;">
              <img src="${emailData.imageUrl}" alt="Product Image" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
            </div>
          ` : ''}
          
          <div style="font-size: 16px; line-height: 1.6; color: #333; margin: 20px 0;">
            ${emailData.description.replace(/\n/g, '<br>')}
          </div>
          
          ${emailData.price && emailData.price.trim() !== '' ? `
            <div style="background-color: #e8f5e8; border: 2px solid #4a7c59; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <div style="font-size: 14px; color: #2c5530; margin-bottom: 8px; font-weight: 500;">💰 ΤΙΜΗ ΠΡΟΣΦΟΡΑΣ</div>
              <div style="color: #2c5530; font-size: 24px; font-weight: bold; margin: 5px 0;">€${emailData.price}</div>
              <div style="color: #2c5530; font-size: 16px; font-weight: 600;">(χωρίς Φ.Π.Α.)</div>
            </div>
          ` : `
            <div style="background-color: #f0f4ff; border: 2px solid #3498db; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
              <div style="color: #2c3e50; font-size: 18px; font-weight: 600;">📞 Επικοινωνήστε για προσφορά</div>
            </div>
          `}
          
          ${emailData.cta ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://www.energiakakoufomata-koufomatapvc.gr/epikoinonia/" 
                 target="_blank"
                 style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                ${emailData.cta}
              </a>
            </div>
          ` : ''}
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; text-align: center;">
            <p><strong>${config.company.name}</strong></p>
            <p>Για περισσότερες πληροφορίες επικοινωνήστε μαζί μας</p>
            
            ${this.getCompanySignature()}
            ${this.getGDPRFooter(unsubscribeUrl)}
          </div>
        </div>
      </div>
    `;
  }

  private static getCompanySignature(): string {
    return `
      <!-- ΕΠΑΓΓΕΛΜΑΤΙΚΗ ΥΠΟΓΡΑΦΗ -->
      <div style="margin-top: 20px; font-size: 14px; line-height: 1.6; text-align: left; background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
        <strong>ΟΜΙΛΟΣ ΕΤΑΙΡΕΙΩΝ</strong><br />
        <strong>AKROGONOS INTERNATIONAL GROUP</strong><br />
        ΑΘΗΝΑ - ΠΕΙΡΑΙΑ - ΚΡΗΤΗ - ΒΟΥΛΓΑΡΙΑ – ΠΩΛΗΣΗ ΠΑΝΕΛΑΔΙΚΑ - ΑΝΤΙΠΡΟΣΩΠΕΙΕΣ / ΕΙΣΑΓΩΓΕΣ – ΕΞΑΓΩΓΕΣ<br /><br />
        
        <div style="margin: 15px 0; padding: 15px; background-color: #e8f4f8; border-left: 4px solid #3498db; border-radius: 4px;">
          <strong style="color: #2c3e50;">Ζητήστε μας μια οικονομική προσφορά</strong><br />
          <span style="color: #34495e;">Με ένα ολοκληρωμένο δίκτυο διανομής είμαστε σε θέση να προμηθεύουμε Πανελλαδικά τα προϊόντα μας στις καλύτερες τιμές της αγοράς με συνέπεια, ευθύνη και αξιοπιστία.</span>
        </div><br />
        
        <strong>Γραφείο Εξαγωγών – Πειραιά Νόταρα 117</strong><br />
        📧 <span style="color: #3498db;">imports@energiakakoufomata-koufomatapvc.gr</span><br />
        📧 <span style="color: #3498db;">export@energiakakoufomata-koufomatapvc.gr</span><br /><br />
        
        <strong>Γραφείο Ηράκλειο Κρήτης Σεφέρη 5</strong><br />
        Τηλ: 2811117934 – 6939366243<br />
        📧 <span style="color: #3498db;">paragelies@energiakakoufomata-koufomatapvc.gr</span><br /><br />
        
        <strong>Γραφεία Ηράκλειο Κρήτης Γερωνυμάκη 104 – ΠΑΤΕΛΕΣ</strong><br />
        Τηλ: 2811812735 – 6907793443<br />
        📧 <span style="color: #3498db;">sale@energiakakoufomata-koufomatapvc.gr</span><br />
        📧 <span style="color: #3498db;">koufomata.pvc@gmail.com</span><br /><br />
        
        <strong>Γραφεία Ηράκλειο Κρήτης Ολούντος 34</strong><br />
        Τηλ: 2811812736<br />
        📧 <span style="color: #3498db;">prosfores@energiakakoufomata-koufomatapvc.gr</span><br /><br />
        
        📧 <span style="color: #3498db;">pvc.laminate@gmail.com</span><br />
        🌐 Website: <a href="https://www.energiakakoufomata-koufomatapvc.gr/" target="_blank" style="color: #3498db; text-decoration: none;">www.energiakakoufomata-koufomatapvc.gr</a><br />
        🔗 Επικοινωνία: <a href="https://www.energiakakoufomata-koufomatapvc.gr/epikoinonia/" target="_blank" style="color: #3498db; text-decoration: none;">www.energiakakoufomata-koufomatapvc.gr/epikoinonia</a>
      </div>
    `;
  }

  private static getGDPRFooter(unsubscribeUrl: string): string {
    return `
      <!-- GDPR Compliance & Unsubscribe -->
      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #888;">
        <p>Λαμβάνετε αυτό το email επειδή έχετε εκδηλώσει ενδιαφέρον για τις υπηρεσίες μας.</p>
        <p>
          <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">Απεγγραφή από τη λίστα</a> | 
          <a href="mailto:${config.company.replyTo}?subject=Privacy%20Policy" style="color: #666; text-decoration: underline;">Πολιτική Απορρήτου</a>
        </p>
        <p style="margin-top: 10px;">
          ${config.company.name}<br>
          Email: <span style="color: #666;">${config.company.replyTo}</span><br>
          Email: <span style="color: #666;">sale@energiakakoufomata-koufomatapvc.gr</span>
        </p>
      </div>
    `;
  }
}