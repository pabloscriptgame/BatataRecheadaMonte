# Fortune Tiger Casino – Site Template
## File Structure

```
fortune-tiger/
├── index.html              ← Main homepage
├── css/
│   └── style.css           ← All styles
├── js/
│   └── main.js             ← All JavaScript
├── admin/
│   └── index.html          ← Admin panel (password: pablologomarcas)
└── pages/
    ├── about.html
    ├── terms.html
    ├── privacy.html
    ├── support.html
    ├── responsible.html
    └── faq.html
```

## Admin Access
- URL: /admin/index.html
- Username: admin
- Password: **pablologomarcas**

## Features
- Full responsive homepage with hero, games, promotions, VIP, footer
- Login / Register modals with fake auth flow
- Win popup notifications (auto-rotating)
- Live chat widget
- Cookie consent banner
- Counter animations
- Marquee winner bar
- Admin panel:
  - Overview dashboard with live stats
  - User management
  - Deposit / Withdrawal management
  - Game management
  - Bonus manager
  - Revenue reports
  - Site settings

## Customization
- Colors: edit `:root` variables in `css/style.css`
- Site name: search/replace "Fortune Tiger"
- Admin password: change `ADMIN_PASS` in `admin/index.html`
- Add real payment gateway: integrate Stripe, PayPal, or crypto APIs in `js/main.js`
- Deploy: upload all files to any web host (Apache, Nginx, Vercel, Netlify, etc.)

## Notes
- This is a frontend template. A real casino requires a backend, database, payment processor, and gaming license.
- Always obtain the appropriate gaming license for your target jurisdiction before operating.
- Responsible gaming tools are required by most licensing authorities.
