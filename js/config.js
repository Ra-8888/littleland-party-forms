/* ========================================
   CONFIGURATION
   ======================================== */

// N8N Webhook URLs
const WEBHOOK_URLS = {
  littleland: 'https://n8n.srv1172726.hstgr.cloud/webhook/littleland-kids',
  montessori: 'https://n8n.srv1172726.hstgr.cloud/webhook/montessori-regular',
  weekday: 'https://n8n.srv1172726.hstgr.cloud/webhook/montessori-weekday'
};

// Contact Information
const CONTACT = {
  littleland: {
    phone: '211 444 7000',
    phoneLink: 'tel:+302114447000'
  },
  montessori: {
    phone: '210 98 58 300',
    phoneLink: 'tel:+302109858300'
  }
};

// Form Configuration
const CONFIG = {
  // Enable/Disable console logging
  debug: true,
  
  // Validation rules
  validation: {
    phone: {
      pattern: /^69\d{8}$/,
      message: 'Το τηλέφωνο πρέπει να είναι 10ψήφιο και να ξεκινά με 69'
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Παρακαλώ εισάγετε έγκυρο email'
    }
  },
  
  // Success redirect (optional)
  successRedirect: null, // Set to URL if you want to redirect after success
  
  // Error retry attempts
  maxRetries: 3
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WEBHOOK_URLS, CONTACT, CONFIG };
}

