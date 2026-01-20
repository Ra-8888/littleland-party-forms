# 🚀 Deployment Guide - Little Land Party Forms

## Οδηγίες Ανάπτυξης

---

## Option 1: Netlify (Προτείνεται - Πιο Εύκολο)

### Βήμα 1: Ανέβασμα στο GitHub

```bash
cd /Users/thodoriskitsis/Desktop/paidotopos/littleland-party-forms

# Initialize git (αν δεν έχει γίνει)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Little Land Party Forms"

# Add remote (ΑΛΛΑΞΕ ΤΟ USERNAME)
git remote add origin https://github.com/Ra-8888/littleland-party-forms.git

# Push
git push -u origin main
```

### Βήμα 2: Deploy στο Netlify

1. Πήγαινε στο [https://app.netlify.com](https://app.netlify.com)
2. Sign in με το GitHub account σου
3. Κλικ **"Add new site"** → **"Import an existing project"**
4. Επίλεξε **GitHub** και βρες το `littleland-party-forms` repo
5. Settings:
   - **Build command:** (άδειο - δεν χρειάζεται)
   - **Publish directory:** `.` (root)
6. Κλικ **"Deploy site"**

### Βήμα 3: URLs

Μετά το deployment, θα έχεις:

```
https://your-site-name.netlify.app/forms/littleland-kids.html
https://your-site-name.netlify.app/forms/montessori-regular.html
https://your-site-name.netlify.app/forms/montessori-weekday.html
```

### Βήμα 4: Custom Domain (Προαιρετικό)

Αν έχεις domain (π.χ. `forms.littleland.gr`):

1. Netlify Dashboard → **Domain Settings**
2. **Add custom domain**
3. Ακολούθησε τις οδηγίες για DNS configuration

---

## Option 2: GitHub Pages

### Βήμα 1: Push to GitHub (όπως πιο πάνω)

### Βήμα 2: Enable GitHub Pages

1. GitHub Repo → **Settings**
2. Sidebar → **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main** / **root**
5. Save

### Βήμα 3: URLs

```
https://ra-8888.github.io/littleland-party-forms/forms/littleland-kids.html
https://ra-8888.github.io/littleland-party-forms/forms/montessori-regular.html
https://ra-8888.github.io/littleland-party-forms/forms/montessori-weekday.html
```

---

## Configuration: N8N Webhooks

### Βήμα 1: Φτιάξε Webhooks στο N8N

Για κάθε φόρμα, φτιάξε ένα Webhook node στο N8N:

**Little Land Kids:**
```
Webhook URL: https://your-n8n-instance.app.n8n.cloud/webhook/littleland-kids
Method: POST
Response: { "success": true, "message": "Received" }
```

**Montessori Regular:**
```
Webhook URL: https://your-n8n-instance.app.n8n.cloud/webhook/montessori-regular
Method: POST
Response: { "success": true, "message": "Received" }
```

**Montessori Weekday:**
```
Webhook URL: https://your-n8n-instance.app.n8n.cloud/webhook/montessori-weekday
Method: POST
Response: { "success": true, "message": "Received" }
```

### Βήμα 2: Ενημέρωση Config

Άνοιξε το `js/config.js` και άλλαξε:

```javascript
const WEBHOOK_URLS = {
  littleland: 'https://your-n8n-instance.app.n8n.cloud/webhook/littleland-kids',
  montessori: 'https://your-n8n-instance.app.n8n.cloud/webhook/montessori-regular',
  weekday: 'https://your-n8n-instance.app.n8n.cloud/webhook/montessori-weekday'
};
```

### Βήμα 3: Push Changes

```bash
git add js/config.js
git commit -m "Update webhook URLs"
git push
```

Το Netlify θα κάνει auto-deploy!

---

## N8N Workflow Example

### Workflow Structure:

```
┌─────────────┐
│   Webhook   │ ← Receives form data
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Set Variables│ ← Extract data
└──────┬──────┘
       │
       ↓
┌─────────────┐
│Google Sheets│ ← Save to spreadsheet
│   Append    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Filter    │ ← Check availability logic
└──────┬──────┘
       │
       ↓
┌─────────────┐
│Human in Loop│ ← Manual approval
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ IF Approved │
└──────┬──────┘
   Yes │   No
       ↓     ↓
  [Confirm] [Reject]
```

### Sample N8N Nodes:

**1. Webhook Node:**
- HTTP Method: POST
- Path: `/webhook/littleland-kids`
- Response: JSON `{"success": true}`

**2. Google Sheets Append:**
- Spreadsheet: "Little Land Bookings"
- Sheet: "Form Submissions"
- Data Mapping:
  - Form ID → `{{ $json.form_id }}`
  - Date → `{{ $json.party.date }}`
  - Parent Name → `{{ $json.parent.name }}`
  - Phone → `{{ $json.parent.phone }}`
  - Email → `{{ $json.parent.email }}`
  - Children → `{{ $json.guests.children }}`
  - Adults → `{{ $json.guests.adults }}`
  - Notes → `{{ $json.notes }}`

**3. Human in the Loop:**
- Approval Message: "New party request for {{ $json.party.date }}"
- Options: Approve / Reject

---

## Testing

### Local Testing:

Άνοιξε τα HTML files locally:

```bash
cd /Users/thodoriskitsis/Desktop/paidotopos/littleland-party-forms
open forms/littleland-kids.html
```

### Test Webhook (με RequestBin):

Πριν το N8N, δοκίμασε με temporary webhook:

1. Πήγαινε στο [https://requestbin.com](https://requestbin.com)
2. Create a RequestBin
3. Copy URL
4. Βάλ' το στο `js/config.js`
5. Submit φόρμα
6. Check RequestBin για το payload

---

## Troubleshooting

### ❌ Η φόρμα δεν στέλνει:

1. Άνοιξε Browser Console (F12)
2. Δες για errors
3. Check αν το webhook URL είναι σωστό στο `config.js`

### ❌ CORS Error:

Στο N8N Webhook node, enable:
- **Options** → **Response** → **Headers**
- Add: `Access-Control-Allow-Origin: *`

### ❌ Mobile display issues:

- Clear browser cache
- Check `viewport` meta tag στο HTML

---

## Security Notes

### 🔒 Best Practices:

1. **Webhook URLs:** Μην τα μοιράζεσαι δημόσια
2. **Rate Limiting:** Στο N8N, βάλε rate limits
3. **Validation:** Το N8N πρέπει να validate τα data
4. **HTTPS:** Πάντα HTTPS για production

---

## Updates & Maintenance

### Πώς να κάνεις αλλαγές:

1. Edit locally
2. Test
3. Commit & Push:
```bash
git add .
git commit -m "Description of changes"
git push
```
4. Netlify θα κάνει auto-deploy σε ~1 λεπτό

---

## Support

Για ερωτήσεις:
- Check README.md
- GitHub Issues
- N8N Community Forum

---

**Happy Deploying! 🎉**

