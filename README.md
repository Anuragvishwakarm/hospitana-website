# Hospitana — Public Website (Phase 3)

Public-facing patient portal for **Sahara Hospital, Bhadohi UP**.
Runs on **port 3000**, connects to the existing Hospitana HMS backend on port 8000.

This is the companion frontend to `hospitana-backend` (FastAPI) and `hospitana-hms` (staff portal, port 3001). The website is for patients, families, and walk-ins — not staff.

---

## 1. What's in here

```
hospitana-website/
├── src/
│   ├── app/
│   │   ├── page.tsx                ← Home (hero, live beds, featured doctors)
│   │   ├── layout.tsx              ← Fraunces + Manrope, navbar, footer
│   │   ├── globals.css             ← Design tokens, grain texture
│   │   ├── doctors/
│   │   │   ├── page.tsx            ← Doctor list + search + dept filter
│   │   │   └── [id]/page.tsx       ← Individual doctor profile
│   │   ├── rooms/page.tsx          ← LIVE bed availability per ward
│   │   ├── book/page.tsx           ← Appointment request form
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   └── login/page.tsx          ← Patient login → backend /auth/login
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── lib/
│       ├── api.ts                  ← Axios client w/ graceful fallback
│       └── mockData.ts             ← 8 doctors, 7 wards — demo-ready
├── tailwind.config.ts              ← Custom palette + keyframes
├── next.config.mjs
├── package.json
└── .env.local.example
```

---

## 2. Setup

```bash
cd hospitana-website
npm install
cp .env.local.example .env.local          # set NEXT_PUBLIC_API_URL
npm run dev                                # http://localhost:3000
```

That's it. The site is **demo-ready without the backend** — every API call falls back to the mock data in `src/lib/mockData.ts`, so you can show this to the hospital owner immediately.

---

## 3. Design System

| Token          | Value       | Where used                          |
| -------------- | ----------- | ----------------------------------- |
| `cream-100`    | `#FAF6EF`   | Page background                     |
| `forest-700`  | `#0F4C4A`   | Primary — CTAs, eyebrow, logo       |
| `forest-900`  | `#0B3432`   | Deepest accent, footer              |
| `clay-500`    | `#C76D52`   | Accent — CTAs, italic headlines     |
| `ink-900`     | `#0F1F1D`   | Body text — warm near-black         |
| Display font  | Fraunces    | Variable serif, optical-size aware  |
| Body font     | Manrope     | Clean, friendly sans                |

**Rules:**
- Never use pure black (`#000`). Always `ink-900`.
- Italic serif = emphasis. Reserve for 1–2 words per headline.
- Terracotta (clay) appears in <10% of any view — it's a spice, not a sauce.
- Grain overlay (`body::before`) is fixed at `0.035` opacity. Don't touch.

Global utilities available in `globals.css`:
- `.btn-primary` · `.btn-outline` · `.btn-clay`
- `.card-soft`
- `.eyebrow` (small caps tag line)
- `.serif-italic`
- `.container-x`
- `.link-underline` (animated underline on hover)
- `.dot-pattern` (hero decorative background)

---

## 4. API Integration — **Action Required on Backend**

The website expects these **public** (no-auth) endpoints that don't exist yet in `hospitana-backend`. Add a new router `app/routers/public.py`:

```python
# app/routers/public.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.doctor import DoctorProfile
from ..models.bed import Ward, Bed
# ... schemas

router = APIRouter(prefix="/public", tags=["public"])

@router.get("/doctors")
def list_doctors(
    department: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    q = db.query(DoctorProfile).filter(DoctorProfile.is_active == True)
    if department:
        q = q.filter(DoctorProfile.department == department)
    if search:
        q = q.filter(DoctorProfile.name.ilike(f"%{search}%"))
    return q.all()

@router.get("/doctors/{doctor_id}")
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    return db.query(DoctorProfile).filter(DoctorProfile.id == doctor_id).first()

@router.get("/wards")
def list_wards(db: Session = Depends(get_db)):
    wards = db.query(Ward).all()
    return [
        {
            **ward.__dict__,
            "available_beds": sum(1 for b in ward.beds if not b.is_occupied),
            "total_beds": len(ward.beds),
        }
        for ward in wards
    ]

@router.get("/stats")
def stats(db: Session = Depends(get_db)):
    return {
        "doctors": db.query(DoctorProfile).filter(DoctorProfile.is_active == True).count(),
        "beds": db.query(Bed).count(),
        "departments": 14,
        "years_serving": 17,
        "patients_served_yearly": 48000,
        "surgeries_yearly": 3200,
    }

@router.post("/appointments")
def request_appointment(payload: AppointmentRequest, db: Session = Depends(get_db)):
    # Create an appointment with status=pending, no-auth
    # Reception confirms later
    ...
```

Then in `app/main.py`:
```python
from app.routers import public
app.include_router(public.router, prefix="/api/v1")
```

Also enable CORS for `http://localhost:3000`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Until those endpoints exist, the website works in demo mode using `src/lib/mockData.ts`.** No errors, no broken UI — `api.ts` catches and falls back silently.

---

## 5. Pages

### `/` Home
Hero with live bed counter · marquee of departments · 4 big stats · 8-dept service grid · 4 featured doctors · ward occupancy list · Hinglish testimonial · split CTA (Book / Emergency).

### `/doctors`
Searchable list of all doctors. Filter pills for each department. Deep-linkable: `/doctors?dept=Cardiology`.

### `/doctors/[id]`
Portrait, qualifications, languages, OPD schedule, conditions treated, related doctors in same dept. CTAs: Book (with doctor pre-filled) and Call.

### `/rooms`
The headline page. Every ward with:
- Live bed availability counter
- Individual bed grid (green = free, grey = occupied)
- Occupancy progress bar
- Daily charge · amenities · description
- Reserve button (disabled when full)
- Auto-refreshes every 60 seconds
- Hospital-wide occupancy gauge at the top

### `/book`
3-step appointment request: name, phone, department (or "any"), optional doctor picker, date, reason. Submits to `POST /public/appointments`. Returns a reference number like `APT-X7K3LM` with copy-to-clipboard.

### `/about` & `/contact`
Editorial pages. `/contact` embeds OpenStreetMap with a marker at the hospital coords (adjust in the iframe URL).

### `/login`
Split-screen: forest-green editorial panel + minimal form. Hits `POST /api/v1/auth/login` (existing backend endpoint), stores `access_token` in `localStorage`. **TODO:** build `/dashboard` for logged-in patients — currently redirects to `/`.

---

## 6. What's left (Phase 3.1+)

### High priority
- [ ] Backend `/public/*` router (section 4 above)
- [ ] Backend CORS for port 3000
- [ ] `/dashboard` for logged-in patients — appointments, bills, reports, prescriptions
- [ ] `/reports/[id]` — lab report viewer with download button
- [ ] `/bills/[id]` — bill viewer + Razorpay online pay

### Medium
- [ ] Multilingual toggle (Hindi / English) — add `next-intl`
- [ ] Dark mode (the palette already has forest-900 as a natural dark anchor)
- [ ] Real testimonials carousel (currently one hardcoded)
- [ ] Blog / health-tips section (SEO for Bhadohi queries)

### Low
- [ ] WhatsApp floating button (Twilio)
- [ ] Live chat via existing hospital staff
- [ ] Appointment reminders (SMS via MSG91)
- [ ] PWA install prompt for patients on slow networks

---

## 7. Deployment Notes

**Recommended: Hostinger VPS / CyberPanel (matches your existing setup).**

```bash
# On server
cd /home/rtc/apps
git clone <repo> hospitana-website
cd hospitana-website
npm install
npm run build

# PM2
pm2 start npm --name "hospitana-web" -- start
pm2 save
```

**Nginx / OpenLiteSpeed reverse-proxy** — subdomain `saharahospital.in` or `www.saharahospital.in`:
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

Set `.env.local` on the server:
```
NEXT_PUBLIC_API_URL=https://api.saharahospital.in/api/v1
```

---

## 8. Quick reference

```bash
# Start everything (three terminals)
cd hospitana-backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000
cd hospitana-hms     && npm run dev                              # → localhost:3001 (staff)
cd hospitana-website && npm run dev                              # → localhost:3000 (public)
```

| Port | App                 | Who it's for     |
| ---- | ------------------- | ---------------- |
| 8000 | hospitana-backend   | FastAPI + Swagger |
| 3001 | hospitana-hms       | Doctors, nurses, receptionists, admin |
| 3000 | hospitana-website   | **Patients, families, walk-ins**  |

---

## 9. Known gotchas

1. **`useSearchParams` needs `<Suspense>`** — already handled in `/doctors` and `/book` via the Suspense wrapper pattern. Don't remove.

2. **Unsplash images** in mock data — they're placeholder only. Replace with real doctor photos before going live. Add your CDN domain to `next.config.mjs > images.remotePatterns`.

3. **`.env.local` not committed** — copy from `.env.local.example` on every fresh clone/deploy.

4. **Grainy texture** uses a base64-inline SVG filter in `globals.css`. If it ever feels "too much" on a given page, override with `body::before { opacity: 0 }` on that route.

5. **Mock bed counts** don't match between renders (they're static in mockData). Once the backend is live, the `/rooms` page auto-refreshes every 60 seconds to feel truly live.

---

## 10. Credits

- **Design:** Editorial medical aesthetic — Fraunces serif + Manrope body, warm cream base with forest-teal + terracotta accents.
- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · lucide-react · axios
- **Hospital:** Sahara Hospital, Bhadohi UP · Est. 2009 · 084299 33131
- **Part of:** Hospitana HMS · Phase 3

---

**Next chat:** Build `/dashboard` (patient portal post-login) + add the `/public/*` backend router.
