/* ========================================
   MONTESSORI WEEKDAY OFFER - Form Logic
   ======================================== */

// Validate that selected date is Tuesday, Wednesday, or Thursday
function validateWeekdayDate(dateString) {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  
  // 2 = Tuesday, 3 = Wednesday, 4 = Thursday
  return dayOfWeek >= 2 && dayOfWeek <= 4;
}

// Setup date validation for weekday only
document.addEventListener('DOMContentLoaded', function() {
  const dateInput = document.getElementById('party_date');
  const dateError = document.getElementById('date-error');
  
  dateInput.addEventListener('change', function() {
    if (this.value && !validateWeekdayDate(this.value)) {
      showError(this, 'Η προσφορά ισχύει μόνο για Τρίτη, Τετάρτη και Πέμπτη!');
      dateError.textContent = 'Η προσφορά ισχύει μόνο για Τρίτη, Τετάρτη και Πέμπτη!';
      dateError.style.display = 'block';
    } else if (this.value) {
      clearError(this);
      dateError.style.display = 'none';
    }
  });
});

document.getElementById('partyForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  log('Form submitted - Montessori Weekday Offer');
  
  // Validate form
  if (!validateForm()) {
    showErrorMessage('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία σωστά.');
    return;
  }
  
  // Show loading
  showLoading();
  
  // Collect form data
  const formData = collectFormData();
  
  // Send to webhook
  const result = await sendToWebhook(WEBHOOK_URLS.weekday, formData);
  
  // Hide loading
  hideLoading();
  
  // Handle result
  if (result.success) {
    showSuccess(formData);
  } else {
    showErrorMessage(result.error || 'Αποτυχία αποστολής. Παρακαλώ δοκιμάστε ξανά.');
  }
});

function validateForm() {
  let isValid = true;
  
  // Required fields
  const requiredFields = [
    { input: document.getElementById('party_date'), name: 'Ημερομηνία Party' },
    { input: document.getElementById('parent_name'), name: 'Ονοματεπώνυμο Γονέα' },
    { input: document.getElementById('email'), name: 'Email' },
    { input: document.getElementById('phone'), name: 'Τηλέφωνο' },
    { input: document.getElementById('child_name'), name: 'Όνομα Παιδιού' },
    { input: document.getElementById('child_age'), name: 'Ηλικία Παιδιού' },
    { input: document.getElementById('time_from'), name: 'Ώρα Έναρξης' },
    { input: document.getElementById('time_to'), name: 'Ώρα Λήξης' },
    { input: document.getElementById('num_children'), name: 'Αριθμός Παιδιών' },
    { input: document.getElementById('signature'), name: 'Υπογραφή' }
  ];
  
  requiredFields.forEach(field => {
    if (!validateRequired(field.input, field.name)) {
      isValid = false;
    }
  });
  
  // Weekday date validation
  const dateInput = document.getElementById('party_date');
  if (dateInput.value && !validateWeekdayDate(dateInput.value)) {
    showError(dateInput, 'Η προσφορά ισχύει μόνο για Τρίτη, Τετάρτη και Πέμπτη!');
    isValid = false;
  }
  
  // Email validation
  const emailInput = document.getElementById('email');
  if (emailInput.value && !validateEmail(emailInput.value)) {
    showError(emailInput, CONFIG.validation.email.message);
    isValid = false;
  }
  
  // Phone validation
  const phoneInput = document.getElementById('phone');
  if (phoneInput.value && !validatePhone(phoneInput.value)) {
    showError(phoneInput, CONFIG.validation.phone.message);
    isValid = false;
  }
  
  // Party location validation
  const locationRadios = document.querySelectorAll('input[name="party_location"]');
  const locationSelected = Array.from(locationRadios).some(radio => radio.checked);
  if (!locationSelected) {
    showErrorMessage('Παρακαλώ επιλέξτε θέση party (Εσωτερικό ή Εξωτερικό Χώρο).');
    isValid = false;
  }
  
  // Menu validation - at least one adult menu should have count > 0
  const menuCounts = [
    parseInt(document.querySelector('input[name="menu_adults_1_count"]')?.value || 0),
    parseInt(document.querySelector('input[name="menu_adults_2_count"]')?.value || 0),
    parseInt(document.querySelector('input[name="menu_adults_3_count"]')?.value || 0)
  ];
  
  const hasMenuSelection = menuCounts.some(count => count > 0);
  if (!hasMenuSelection) {
    showErrorMessage('Παρακαλώ επιλέξτε τουλάχιστον ένα μενού συνοδών με άτομα.');
    isValid = false;
  }
  
  return isValid;
}

function collectFormData() {
  // Party info
  const partyDate = document.getElementById('party_date').value;
  const partyDay = document.getElementById('party_day').value;
  const timeFrom = document.getElementById('time_from').value;
  const timeTo = document.getElementById('time_to').value;
  const location = document.querySelector('input[name="party_location"]:checked')?.value || '';
  
  // Parent info
  const parentName = document.getElementById('parent_name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const area = document.getElementById('area').value;
  
  // Child info
  const childName = document.getElementById('child_name').value;
  const childAge = parseInt(document.getElementById('child_age').value);
  
  // Guests
  const numChildren = parseInt(document.getElementById('num_children').value);
  const numAdults = parseInt(document.getElementById('num_adults').value) || 0;
  
  // Extras
  const extrasCheckboxes = document.querySelectorAll('input[name="extras"]:checked');
  const extras = {};
  ['clown', 'animatore', 'magic_show', 'prive1', 'prive2', 'decoration', 'face_painting', 'beauty_spa'].forEach(extra => {
    extras[extra] = Array.from(extrasCheckboxes).some(cb => cb.value === extra);
  });
  
  // Menus (Only adults for weekday offer)
  const menus = {
    adults: {
      menu_1: parseInt(document.querySelector('input[name="menu_adults_1_count"]')?.value || 0),
      menu_2: parseInt(document.querySelector('input[name="menu_adults_2_count"]')?.value || 0),
      menu_3: parseInt(document.querySelector('input[name="menu_adults_3_count"]')?.value || 0)
    }
  };
  
  // Other
  const deposit = parseFloat(document.getElementById('deposit').value) || 0;
  const signature = document.getElementById('signature').value;
  const notes = document.getElementById('notes').value;
  
  // Generate form ID
  const formId = generateFormId('MONTW');
  
  // Build payload
  return {
    form_type: 'montessori_weekday',
    form_id: formId,
    timestamp: new Date().toISOString(),
    offer_type: 'weekday_special',
    party: {
      date: partyDate,
      day: partyDay,
      time_from: timeFrom,
      time_to: timeTo,
      location: location
    },
    parent: {
      name: parentName,
      phone: formatPhoneInternational(phone),
      email: email,
      area: area
    },
    child: {
      name: childName,
      age: childAge
    },
    guests: {
      children: numChildren,
      adults: numAdults
    },
    menus: menus,
    extras: extras,
    financial: {
      deposit: deposit
    },
    notes: notes,
    signature: signature,
    contactPhone: CONTACT.littleland.phoneLink,
    contactPhoneDisplay: CONTACT.littleland.phone,
    user_agent: navigator.userAgent,
    submission_source: 'web_form'
  };
}

