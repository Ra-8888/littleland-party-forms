# 🎈 Little Land Party Forms

3 responsive HTML forms για booking παιδικών party στα Little Land παιδότοπα.

## 📋 Forms

1. **Little Land Kids Play Area** - `forms/littleland-kids.html`
2. **Montessori Little Land - Regular** - `forms/montessori-regular.html`
3. **Montessori Weekday Offer (Τρ/Τε/Πε)** - `forms/montessori-weekday.html`

## 🚀 Deployment

### Option A: Netlify (Προτείνεται)

1. Push to GitHub
2. Πήγαινε στο [Netlify](https://netlify.com)
3. "New site from Git"
4. Επίλεξε το repo
5. Deploy!

**URLs θα είναι:**
```
https://your-site-name.netlify.app/forms/littleland-kids.html
https://your-site-name.netlify.app/forms/montessori-regular.html
https://your-site-name.netlify.app/forms/montessori-weekday.html
```

### Option B: GitHub Pages

1. Settings → Pages
2. Source: main branch
3. Save

## ⚙️ N8N Webhook Configuration

Άνοιξε το `js/config.js` και βάλε τα webhook URLs σου:

```javascript
const WEBHOOK_URLS = {
  littleland: 'https://your-n8n.app.n8n.cloud/webhook/littleland-kids',
  montessori: 'https://your-n8n.app.n8n.cloud/webhook/montessori-regular',
  weekday: 'https://your-n8n.app.n8n.cloud/webhook/montessori-weekday'
};
```

## 📊 Webhook Payload Structure

```json
{
  "form_type": "littleland_kids",
  "form_id": "LL-2026-0120-1430",
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
    "children_menu": 2,
    "adults": 10,
    "adults_menu": 1
  },
  "extras": {
    "clown": false,
    "animatore": true,
    "magos": false,
    "prive1": false,
    "prive2": false
  },
  "financial": {
    "deposit": 150
  },
  "notes": "Θέλουμε τούρτα σοκολάτα",
  "signature": "Γιάννης Παπαδόπουλος"
}
```

## 📱 Features

- ✅ Mobile-first responsive design
- ✅ Form validation
- ✅ Native date/time pickers
- ✅ Email keyboard optimization
- ✅ Phone number formatting
- ✅ Success/Error handling
- ✅ Greek language support

## 🎨 Customization

### Χρώματα (`css/base.css`)
```css
--color-primary: #FF9AA2;
--color-secondary: #B5EAD7;
--color-accent: #FFB7B2;
```

### Τηλέφωνα Επικοινωνίας
- Little Land: 211 444 7000
- Montessori: 210 98 58 300

## 📞 Support

Για ερωτήσεις ή προβλήματα, επικοινωνήστε με την ομάδα ανάπτυξης.

