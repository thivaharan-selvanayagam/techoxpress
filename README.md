# Techo Xpress — Courier & Logistics Website

A Node.js + Express + EJS website for Techo Xpress (Pvt) Ltd — the logistics arm of the Techo Traders ecosystem.

**Primary Color:** `#D44F0A` (Burning Orange)
**Design Aesthetic:** Kinetic Industrial — dark base, speed lines, diagonal cuts, custom cursor

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open in browser
http://localhost:3000
```

For development with auto-reload:
```bash
npm run dev
```

---

## Project Structure

```
techo-xpress/
├── server.js
├── package.json
├── README.md
├── routes/
│   ├── home.js
│   ├── services.js
│   ├── tracking.js
│   ├── about.js
│   └── contact.js
├── views/
│   ├── home.ejs
│   ├── services.ejs
│   ├── tracking.ejs
│   ├── about.ejs
│   ├── contact.ejs
│   ├── 404.ejs
│   └── partials/
│       ├── head.ejs
│       ├── nav.ejs
│       └── footer.ejs
└── public/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── favicon.svg
```

---

## Pages

| Page      | Route       | Description                                      |
|-----------|-------------|--------------------------------------------------|
| Home      | `/`         | Hero, quick-track bar, services, why-us, map     |
| Services  | `/services` | Full breakdown of all 4 service types            |
| Tracking  | `/tracking` | Live tracking form with timeline result          |
| About     | `/about`    | Story, numbers, values, Techo ecosystem          |
| Contact   | `/contact`  | Quote form + immediate contact info              |
| 404       | `*`         | Branded error page                               |

---

## Tracking Demo

Two demo shipments are pre-loaded in `routes/tracking.js`:

| Tracking ID   | Status           |
|---------------|------------------|
| TXT-2025-001  | ✅ Delivered      |
| TXT-2025-002  | 🚚 Out for Delivery |

---

## Customisation Checklist

- [ ] Update phone number in `views/partials/footer.ejs` and `views/contact.ejs`
- [ ] Update email address (`hello@techoxpress.lk`) throughout
- [ ] Set real Techo Traders parent URL in footer
- [ ] Connect contact form to email (add nodemailer to `routes/contact.js`)
- [ ] Replace mock tracking data with real DB in `routes/tracking.js`
- [ ] Add Techo Connect website link in `views/about.ejs`

### Adding Email to Contact Form

```bash
npm install nodemailer
```

```js
// In routes/contact.js — after validation:
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({ /* your SMTP config */ });
await transporter.sendMail({
  from: '"Techo Xpress" <hello@techoxpress.lk>',
  to: 'hello@techoxpress.lk',
  subject: `New inquiry — ${department}`,
  text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
});
```

---

## Design System

| Token           | Value              |
|-----------------|--------------------|
| Primary Orange  | `#D44F0A`          |
| Dark Orange     | `#A33C07`          |
| Light Orange    | `#F06A1F`          |
| Background      | `#0A0A0A`          |
| Dark Surface    | `#111111`          |
| Border          | `rgba(255,255,255,0.07)` |
| Display Font    | Barlow Condensed   |
| Body Font       | DM Sans            |
| Mono Font       | Share Tech Mono    |

---

## Part of the Techo Ecosystem

- **Techo Traders** — Parent company: `techotraders.com.lk`
- **Techo Labs** — Digital & marketing arm
- **Techo Xpress** — This site (logistics)
- **Techo Connect** — Antenna & hardware
