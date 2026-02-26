# Zahnarzt Mirzaie - Projektstatus

**Stand:** 26.02.2026
**Live:** https://zahnarzt-mirzaie.de
**Backend:** Railway (Auto-Deploy via GitHub Push)
**Repo:** https://github.com/zahnarztpraxism/zahnarzt-mirzaie

---

## Projektstruktur

```
zahnarzt-mirzaie/
├── index.html, praxis.html, leistungen.html, ...   ← Statische Website
├── kontakt.html, termin.html, karriere.html         ← Formulare (POST → Railway API)
├── impressum.html, datenschutz.html                 ← Legal
├── css/, js/, images/                               ← Assets
├── sitemap.xml, robots.txt                          ← SEO
└── booking-system/                                  ← Railway Backend
    ├── server.js                                    ← Express + Cron
    ├── database.js                                  ← PostgreSQL (4 Tabellen)
    ├── emailService.js                              ← Resend + ICS
    ├── calendarService.js                           ← Google Calendar (noch nicht aktiv)
    ├── routes/admin.js                              ← Admin-Dashboard Routes
    ├── routes/api.js                                ← Public API Routes
    ├── views/admin/*.ejs                            ← 6 Admin-Views
    └── public/css/admin.css                         ← Admin-Styling
```

---

## Backend (Praxisverwaltung)

### Datenbank (PostgreSQL auf Railway)
| Tabelle | Felder | Status-Werte |
|---------|--------|--------------|
| `termine` | name, email, telefon, wunschdatum, wunschzeit, behandlung, nachricht, bestaetigte_zeit, termin_datum, termin_uhrzeit, google_event_id, erinnerung_7_tage, erinnerung_1_tag | pending, confirmed, cancelled, completed |
| `kontakt_nachrichten` | name, email, telefon, nachricht | neu, gelesen, beantwortet |
| `anamneseboegen` | vorname, nachname, geburtsdatum, geschlecht, telefon, email, in_behandlung, medikamente, erkrankungen, allergien, ... | neu, gelesen |
| `bewerbungen` | vorname, nachname, email, telefon, wohnort, eintritt, erfahrung, motivation, typ | neu, gelesen, eingeladen, abgelehnt |

### API-Endpunkte (POST)
- `/api/termin` - Terminanfrage
- `/api/kontakt` - Kontaktnachricht
- `/api/anamnese` - Anamnesebogen
- `/api/bewerbung` - Bewerbung (ZFA / Ausbildung)

### Admin-Dashboard (`/admin`)
- **Login:** praxis@zahnarzt-mirzaie.de / Zhttg520#
- **Dashboard:** Stats + Neueste Eingaenge (alle 4 Typen, klickbare Kacheln)
- **Termine:** Bestaetigen/Ablehnen/Verschieben/Erledigt (mit oder ohne E-Mail)
- **Nachrichten:** Status: neu → gelesen → beantwortet
- **Anamneseboegen:** Status: neu → gelesen
- **Bewerbungen:** Status: neu → gelesen → eingeladen/abgelehnt

### E-Mail-System (Resend)
- Bestaetigungs-Mail mit ICS-Kalender-Attachment
- Absage-Mail mit optionalem Grund
- Verschiebungs-Mail mit neuem ICS
- Erinnerungsmails: 7 Tage + 1 Tag vor Termin (Cron, taeglich 09:00 Uhr)
- Kontakt-/Anamnese-/Bewerbungs-Bestaetigungen

### Cron-Job
- Taeglich 09:00 Uhr (Europe/Berlin)
- Prueft confirmed Termine mit termin_datum in 7 oder 1 Tag
- Sendet Erinnerungsmail, markiert als gesendet

---

## Google Calendar Integration

**Status: VORBEREITET, NOCH NICHT AKTIV**

Code ist fertig in `calendarService.js`. Aktivierung durch 2 Railway Env-Vars:
- `GOOGLE_CALENDAR_ID` - Kalender-ID der Praxis
- `GOOGLE_SERVICE_ACCOUNT_KEY` - JSON Key des Service Accounts

**Problem:** Google Workspace Org-Policy `iam.disableServiceAccountKeyCreation` blockiert Key-Erstellung. Loesungen:
1. Persoenliches Gmail nutzen fuer Google Cloud Projekt (empfohlen)
2. Workspace Admin bitten, Policy zu lockern
3. OAuth2 Refresh Token statt Service Account

**Service Account erstellt:** praxisverwaltung-555@zahnarztpraxis-mirzaie.iam.gserviceaccount.com
**Projekt:** zahnarztpraxis-mirzaie (Google Cloud)

**Wenn Key vorhanden:**
1. Railway Env-Vars setzen
2. Praxis-Kalender mit Service-Account-E-Mail teilen ("Termine aendern")
3. Fertig - funktioniert automatisch

---

## Railway Env-Vars (Produktiv)
| Variable | Wert | Status |
|----------|------|--------|
| `DATABASE_URL` | (automatisch von Railway) | Aktiv |
| `RESEND_API_KEY` | re_Eg9pbQmP_... | Aktiv |
| `SESSION_SECRET` | (gesetzt) | Aktiv |
| `RAILWAY_ENVIRONMENT` | production | Aktiv |
| `GOOGLE_CALENDAR_ID` | - | NICHT GESETZT |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | - | NICHT GESETZT |

---

## Website (Statisch)
- Alle Seiten live auf zahnarzt-mirzaie.de
- SEO: sitemap.xml, robots.txt, Meta-Tags
- Legal: Impressum + Datenschutz (DSGVO)
- Formulare: 4 Formulare → Railway API
- Responsive Design

---

## Was fehlt / Naechste Schritte
1. **Google Calendar aktivieren** - Key erstellen (persoenliches Gmail nutzen)
2. **Cookie-Banner** - noch nicht implementiert
3. **GA4 Tracking** - noch nicht eingerichtet
4. **Backup-Strategie** - Railway PostgreSQL Backups konfigurieren
