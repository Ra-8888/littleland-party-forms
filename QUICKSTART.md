# ⚡ Quick Start Guide

## 🚀 Γρήγορη Ανάπτυξη σε 5 λεπτά

### Βήμα 1: Upload στο GitHub (2 λεπτά)

```bash
cd /Users/thodoriskitsis/Desktop/paidotopos/littleland-party-forms

# Initialize git
git init
git add .
git commit -m "🎉 Initial commit - Little Land Party Forms"

# Δημιούργησε νέο repository στο GitHub:
# https://github.com/Ra-8888/littleland-party-forms

# Add remote & push
git remote add origin https://github.com/Ra-8888/littleland-party-forms.git
git branch -M main
git push -u origin main
```

### Βήμα 2: Deploy στο Netlify (2 λεπτά)

1. Πήγαινε στο [netlify.com](https://netlify.com)
2. Κλικ **"Add new site"** → **"Import from Git"**
3. Επίλεξε το GitHub repo
4. Deploy! ✅

**Τα URLs σου θα είναι:**
```
https://your-site.netlify.app/forms/littleland-kids.html
https://your-site.netlify.app/forms/montessori-regular.html
https://your-site.netlify.app/forms/montessori-weekday.html
```

### Βήμα 3: Configure N8N Webhooks (1 λεπτό)

Άνοιξε `js/config.js` και βάλε τα webhook URLs:

```javascript
const WEBHOOK_URLS = {
  littleland: 'https://YOUR-N8N.app.n8n.cloud/webhook/littleland-kids',
  montessori: 'https://YOUR-N8N.app.n8n.cloud/webhook/montessori-regular',
  weekday: 'https://YOUR-N8N.app.n8n.cloud/webhook/montessori-weekday'
};
```

Commit & Push:
```bash
git add js/config.js
git commit -m "✅ Add webhook URLs"
git push
```

**ΤΕΛΕΙΩΣΕΣ! 🎉**

---

## 📱 Πώς θα το χρησιμοποιήσεις

### Instagram Agent Flow:

```
Agent: "Ποιο παιδότοπο σας ενδιαφέρει;"
User: "Montessori"
Agent: "Τέλεια! Παρακαλώ συμπληρώστε τη φόρμα: 
       https://your-site.netlify.app/forms/montessori-regular.html"

↓ User fills form & submits

↓ Webhook → N8N

↓ Google Sheets (save data)

↓ Check availability

↓ Human approval

↓ Agent confirms με τον πελάτη
```

---

## 🧪 Testing

### Local Test:
```bash
open forms/littleland-kids.html
```

### Production Test:
Στείλε τα links σε φίλους/συνεργάτες για testing!

---

## 📊 N8N Webhook Payload

Θα λαμβάνεις JSON όπως αυτό:

```json
{
  "form_type": "littleland_kids",
  "form_id": "LL-20260120-1430-AB3F",
  "timestamp": "2026-01-20T14:30:00Z",
  "party": {
    "date": "2026-02-15",
    "day": "Σάββατο",
    "time_from": "15:00",
    "time_to": "18:00",
    "location": "εσωτερικό_χώρο"
  },
  "parent": {
    "name": "Γιάννης Παπαδόπουλος",
    "phone": "+306912345678",
    "email": "test@example.com",
    "area": "Χαλάνδρι"
  },
  "child": {
    "name": "Μαρία",
    "age": 5
  },
  "guests": {
    "children": 20,
    "adults": 10
  },
  "extras": {
    "clown": false,
    "animatore": true,
    "magos": false
  },
  "notes": "Θέλουμε τούρτα σοκολάτα",
  "signature": "Γιάννης Παπαδόπουλος"
}
```

---

## 🔧 Customization

### Αλλαγή χρωμάτων:
Άνοιξε `css/base.css`:
```css
:root {
  --color-coral: #FF9AA2;  /* Αλλάξε αυτό */
  --color-mint: #B5EAD7;   /* Και αυτό */
}
```

### Αλλαγή τηλεφώνων:
Άνοιξε `js/config.js`:
```javascript
const CONTACT = {
  littleland: {
    phone: '211 444 7000',  /* Αλλάξε */
    phoneLink: 'tel:+302114447000'
  }
};
```

---

## 📞 Support

**Docs:**
- [README.md](README.md) - Πλήρης documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Λεπτομερείς οδηγίες deployment

**Contacts:**
- Little Land: 211 444 7000
- Montessori: 210 98 58 300

---

## ✅ Checklist

- [ ] Upload to GitHub
- [ ] Deploy to Netlify
- [ ] Configure webhook URLs
- [ ] Test all 3 forms
- [ ] Setup N8N workflows
- [ ] Test full flow (form → webhook → sheets)
- [ ] Share links with Instagram agent
- [ ] Monitor submissions

---

**Καλή επιτυχία! 🎉**

