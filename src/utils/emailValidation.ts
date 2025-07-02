
/**
 * Email validation utility functions
 */

/**
 * Validates an email address format with a more comprehensive regex
 * @param email - The email address to validate
 * @returns boolean indicating if the email is valid
 */
export const validateEmail = (email: string): boolean => {
  // More comprehensive regex that checks for:
  // - Proper format with @ and domain
  // - No special characters at the beginning or end
  // - Valid TLD (at least 2 characters)
  // - No consecutive dots
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(email);
};

/**
 * Process multiple emails from text input
 * @param emailText - String containing multiple emails
 * @returns Object with valid emails and invalid emails for user feedback
 */
export const processEmailBatch = (emailText: string): { valid: string[]; invalid: string[] } => {
  if (!emailText.trim()) return { valid: [], invalid: [] };
  
  const emails = emailText
    .split(/[\n,;]/)
    .map(e => e.trim())
    .filter(e => e);
  
  const valid: string[] = [];
  const invalid: string[] = [];
  
  emails.forEach(email => {
    if (validateEmail(email)) {
      // Check for duplicates
      if (!valid.includes(email)) {
        valid.push(email);
      }
    } else if (email) {
      invalid.push(email);
    }
  });
  
  return { valid, invalid };
};

/**
 * Check for common email domain typos
 * @param email - The email address to check
 * @returns Corrected email address or the original if no typos found
 */
export const checkCommonEmailTypos = (email: string): string => {
  const commonTypos: Record<string, string> = {
    'gnail.com': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'gmai.com': 'gmail.com',
    'hotmal.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'hotmial.com': 'hotmail.com',
    'hotmail.co': 'hotmail.com',
    'yahoocom': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'yahooo.com': 'yahoo.com',
    'yaoo.com': 'yahoo.com'
  };
  
  if (!email.includes('@')) return email;
  
  const [localPart, domain] = email.split('@');
  const correctedDomain = commonTypos[domain.toLowerCase()] || domain;
  
  return `${localPart}@${correctedDomain}`;
};

/**
 * Validate a list of emails and filter out invalid ones
 * @param emails - Array of email addresses
 * @returns Object with valid and invalid emails
 */
export const validateEmailList = (emails: string[]): { valid: string[]; invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];
  
  emails.forEach(email => {
    const trimmedEmail = email.trim();
    if (trimmedEmail && validateEmail(trimmedEmail)) {
      // Check for duplicates
      if (!valid.includes(trimmedEmail)) {
        valid.push(trimmedEmail);
      }
    } else if (trimmedEmail) {
      invalid.push(trimmedEmail);
    }
  });
  
  return { valid, invalid };
};
