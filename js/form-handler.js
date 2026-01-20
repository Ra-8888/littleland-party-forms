/* ========================================
   FORM HANDLER - Common functionality
   ======================================== */

// Utility: Log if debug enabled
function log(...args) {
  if (CONFIG.debug) {
    console.log('[Form Handler]', ...args);
  }
}

// Get Greek day name from date
function getGreekDay(dateString) {
  const days = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];
  const date = new Date(dateString);
  return days[date.getDay()];
}

// Format phone number to international
function formatPhoneInternational(phone) {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Add +30 prefix if not present
  if (cleaned.startsWith('30')) {
    return '+' + cleaned;
  } else if (cleaned.startsWith('69')) {
    return '+30' + cleaned;
  }
  
  return '+30' + cleaned;
}

// Generate unique form ID
function generateFormId(formType) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `${formType}-${year}${month}${day}-${hours}${minutes}-${random}`;
}

// Validate email
function validateEmail(email) {
  return CONFIG.validation.email.pattern.test(email);
}

// Validate phone
function validatePhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return CONFIG.validation.phone.pattern.test(cleaned);
}

// Show error message on field
function showError(input, message) {
  input.classList.add('error');
  input.classList.remove('success');
  
  let errorDiv = input.nextElementSibling;
  if (!errorDiv || !errorDiv.classList.contains('error-message')) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
  }
  
  errorDiv.textContent = message;
}

// Clear error message
function clearError(input) {
  input.classList.remove('error');
  input.classList.add('success');
  
  const errorDiv = input.nextElementSibling;
  if (errorDiv && errorDiv.classList.contains('error-message')) {
    errorDiv.textContent = '';
  }
}

// Validate required field
function validateRequired(input, fieldName) {
  if (!input.value.trim()) {
    showError(input, `Το πεδίο "${fieldName}" είναι υποχρεωτικό`);
    return false;
  }
  clearError(input);
  return true;
}

// Show loading overlay
function showLoading() {
  const overlay = document.querySelector('.loading-overlay');
  if (overlay) {
    overlay.classList.add('active');
  }
}

// Hide loading overlay
function hideLoading() {
  const overlay = document.querySelector('.loading-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// Show success message
function showSuccess(data) {
  log('Success!', data);
  
  // Hide form
  const formCard = document.querySelector('.form-card');
  if (formCard) {
    formCard.style.display = 'none';
  }
  
  // Show success message
  const successHtml = `
    <div class="message-box success">
      <div class="message-icon">✅</div>
      <h2 class="message-title">Ευχαριστούμε!</h2>
      <div class="message-text">
        <p>Λάβαμε το αίτημά σας για:</p>
        <p><strong>📅 ${data.party.date} (${data.party.day})</strong></p>
        ${data.guests ? `<p><strong>👥 ${data.guests.children || 0} παιδιά, ${data.guests.adults || 0} ενήλικες</strong></p>` : ''}
        <p style="margin-top: 20px;">Θα επικοινωνήσουμε σύντομα μαζί σας<br>για να επιβεβαιώσουμε τη διαθεσιμότητα! 🎉</p>
      </div>
      <div class="contact-info" style="margin-top: 24px;">
        <p>Για επείγουσα επικοινωνία:</p>
        <a href="${data.contactPhone}" class="phone-number">${data.contactPhoneDisplay}</a>
      </div>
    </div>
  `;
  
  const container = document.querySelector('.container');
  if (container) {
    const successDiv = document.createElement('div');
    successDiv.innerHTML = successHtml;
    container.insertBefore(successDiv, formCard);
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Optional redirect
  if (CONFIG.successRedirect) {
    setTimeout(() => {
      window.location.href = CONFIG.successRedirect;
    }, 5000);
  }
}

// Show error message
function showErrorMessage(message) {
  log('Error:', message);
  
  const errorHtml = `
    <div class="message-box error">
      <div class="message-icon">❌</div>
      <h2 class="message-title">Κάτι πήγε στραβά</h2>
      <div class="message-text">
        <p>${message}</p>
        <p style="margin-top: 16px;">Παρακαλώ δοκιμάστε ξανά ή επικοινωνήστε μαζί μας τηλεφωνικά.</p>
      </div>
    </div>
  `;
  
  const container = document.querySelector('.container');
  const formCard = document.querySelector('.form-card');
  
  if (container && formCard) {
    // Remove existing error if any
    const existingError = container.querySelector('.message-box.error');
    if (existingError) {
      existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = errorHtml;
    container.insertBefore(errorDiv, formCard);
    
    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Send data to webhook
async function sendToWebhook(webhookUrl, data, retries = 0) {
  try {
    log('Sending to webhook:', webhookUrl);
    log('Data:', data);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    log('Webhook response:', result);
    
    return { success: true, data: result };
    
  } catch (error) {
    log('Webhook error:', error);
    
    // Retry logic
    if (retries < CONFIG.maxRetries) {
      log(`Retrying... (${retries + 1}/${CONFIG.maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1)));
      return sendToWebhook(webhookUrl, data, retries + 1);
    }
    
    return { 
      success: false, 
      error: error.message || 'Αποτυχία αποστολής δεδομένων' 
    };
  }
}

// Initialize date input with min date (today)
function initializeDateInput() {
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  
  dateInputs.forEach(input => {
    input.setAttribute('min', today);
  });
}

// Auto-fill day name when date is selected
function setupDateDaySync() {
  const dateInput = document.querySelector('input[name="party_date"]');
  const dayInput = document.querySelector('input[name="party_day"]');
  
  if (dateInput && dayInput) {
    dateInput.addEventListener('change', function() {
      if (this.value) {
        dayInput.value = getGreekDay(this.value);
      }
    });
  }
}

// Setup form validation on inputs
function setupLiveValidation() {
  // Email validation
  const emailInputs = document.querySelectorAll('input[type="email"]');
  emailInputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value && !validateEmail(this.value)) {
        showError(this, CONFIG.validation.email.message);
      } else if (this.value) {
        clearError(this);
      }
    });
  });
  
  // Phone validation
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value && !validatePhone(this.value)) {
        showError(this, CONFIG.validation.phone.message);
      } else if (this.value) {
        clearError(this);
      }
    });
    
    // Format as user types
    input.addEventListener('input', function() {
      this.value = this.value.replace(/\D/g, '').substring(0, 10);
    });
  });
}

// Initialize common features
document.addEventListener('DOMContentLoaded', function() {
  log('Initializing form handler...');
  
  initializeDateInput();
  setupDateDaySync();
  setupLiveValidation();
  
  log('Form handler initialized');
});

