/**
 * Μετατρέπει τις αλλαγές γραμμής σε HTML <br> tags
 */
export const formatMessage = (message: string): string => {
  return message.replace(/\n/g, "<br>");
};

/**
 * Δημιουργεί την υπογραφή εταιρείας
 */
export const createCompanySignature = (): string => {
  return `
    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 14px; color: #666;">
      <strong>AKROGONOS INTERNATIONAL GROUP</strong><br>
      📧 <span style="color: #666; pointer-events: none;" data-auto-link="false" data-apple-data-detectors="false">info[at]company.gr</span>
    </div>
  `;
};

/**
 * Δημιουργεί το σημείωμα για την απάντηση των πελατών
 * Εξαγωγή σαν ξεχωριστή συνάρτηση για καλύτερη συντήρηση και επαναχρησιμοποίηση
 */
export const createFooterNote = (): string => {
  return `<p style="color: #555; font-size: 0.9em; margin-top: 16px; border-top: 1px solid #eee; padding-top: 16px;">
    📬 Για οποιαδήποτε απορία ή επικοινωνία, παρακαλούμε απαντήστε στο email αποστολέα.
  </p>`;
};

/**
 * Δημιουργεί το μπλε πλαίσιο πληροφοριών
 * Εξαγωγή σαν ξεχωριστή συνάρτηση για καλύτερη συντήρηση και επαναχρησιμοποίηση
 */
export const createImportantInfo = (): string => {
  return `
    <div style="background-color: #f0f4ff; border: 1px solid #d0d8ff; border-radius: 4px; padding: 12px; margin: 16px 0;">
      <strong style="color: #3b5bdb;">Σημαντική σημείωση:</strong>
      <p style="color: #4263eb; margin: 6px 0 0 0; font-size: 14px;">
        Τα emails αποστέλλονται από το επίσημο εταιρικό email. Αυτό βοηθά στην αποφυγή των spam filters και στη διατήρηση του επαγγελματικού email καθαρό.
      </p>
    </div>
  `;
};
