// Domain warm-up strategy for new email senders
// Helps establish sender reputation gradually

export class DomainWarmupService {
  private static warmupLimits = {
    day1: 5,
    day2: 10,
    day3: 15,
    day4: 20,
    day5: 25,
    day6: 30,
    day7: 35,
    week2: 50,
    week3: 75,
    week4: 100,
    mature: 200 // After 4 weeks
  };

  static getDailyLimit(): number {
    // This is a simple implementation
    // In production, you'd store the start date and calculate based on that
    const isNewSender = process.env.SENDER_START_DATE ? 
      (Date.now() - new Date(process.env.SENDER_START_DATE).getTime()) < (7 * 24 * 60 * 60 * 1000) :
      true; // Default to new sender if no start date

    if (isNewSender) {
      console.log('🔥 NEW SENDER DETECTED: Using warm-up limits (max 35 emails/day)');
      return this.warmupLimits.day7; // Conservative limit for first week
    }

    return this.warmupLimits.mature;
  }

  static isWithinWarmupLimits(emailCount: number): boolean {
    return emailCount <= this.getDailyLimit();
  }

  static getWarmupMessage(emailCount: number): string {
    const limit = this.getDailyLimit();
    
    if (emailCount > limit) {
      return `⚠️ WARM-UP PROTECTION: Μπορείτε να στείλετε μέχρι ${limit} emails σήμερα για να προστατέψετε τη φήμη του domain σας.`;
    }
    
    return `✅ Εντός ορίων warm-up: ${emailCount}/${limit} emails σήμερα.`;
  }
}