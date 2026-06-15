# Standard Operating Procedure (SOP)
# MSM Kids — St. Mark Primary Boys Service Web Platform

**Organization:** St. Mark's Coptic Orthodox Diocese of Qena
**Service:** St. Mark Primary Boys Service (Khidmet Mary Marcos Ebtidaey Baneen)
**Document Version:** 1.1
**Status:** Draft
**Last Updated:** June 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Project Identity & Branding](#2-project-identity--branding)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [User Roles & Permissions](#5-user-roles--permissions)
6. [Feature Specifications](#6-feature-specifications)
7. [Page Structure & Sitemap](#7-page-structure--sitemap)
8. [Database Schema](#8-database-schema)
9. [Development Phases](#9-development-phases)
10. [Hosting & Deployment](#10-hosting--deployment)
11. [Future Roadmap (Mobile App)](#11-future-roadmap-mobile-app)
12. [Governance & Maintenance](#12-governance--maintenance)

---

## 1. Project Overview

### 1.1 Purpose

MSM Kids is a web-based platform designed to serve as the digital home for St. Mark Primary Boys Service under the Coptic Orthodox Diocese of Qena. The platform aims to create a unified spiritual and educational community for children, parents, and servants (volunteers/teachers).

### 1.2 Mission Statement

> *"A spiritual and educational home where every child grows in faith, knowledge, and community."*

### 1.3 Primary Verse (Identity Anchor)

> *"If anyone serves Me, let him follow Me; and where I am, there My servant will be also. If anyone serves Me, him My Father will honor."*
> — John 12:26

### 1.4 Goals

- Digitize and centralize the management of the service's children, attendance, and activities.
- Provide children with an engaging, gamified learning environment.
- Give parents real-time visibility into their child's spiritual and academic progress.
- Empower servants with efficient digital tools for administration and content delivery.
- Lay the foundation for a future mobile application.

### 1.5 Scope

| In Scope | Out of Scope |
|----------|--------------|
| Web platform (desktop + mobile responsive) | Native mobile app (Phase 1) |
| Children, servant, and admin accounts | SMS integration |
| Attendance, points, and verse tracking | Payment gateway (Phase 1) |
| News, trips, and activity management | Multi-church/diocese support (Phase 1) |
| Educational materials and quizzes | |

---

## 2. Project Identity & Branding

### 2.1 Project Name

**MSM Kids**
*(Short for Maris Marcos Service — easy to brand as a logo, app, and website)*

### 2.2 Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| Sky Blue | `#87CEEB` | Primary backgrounds, headers |
| Medium Blue | `#4A90D9` | Buttons, accents, CTAs |
| White | `#FFFFFF` | Card backgrounds, text areas |
| Light Yellow | `#FFF9C4` | Highlights, badges, rewards |
| Light Gray | `#F5F5F5` | Section dividers, subtle backgrounds |

### 2.3 Design Style

- Friendly and cartoonish — appropriate for primary school children
- Mobile-first layout
- Clean, uncluttered UI with large readable text
- Consistent use of illustrated icons and child-friendly avatars

### 2.4 Typography

- **Headings:** Bold, rounded font (e.g., Nunito or Poppins)
- **Body:** Clean sans-serif (e.g., Inter or Open Sans)
- Arabic text support required throughout the platform

---

## 3. Technology Stack

### 3.1 Frontend

| Technology | Purpose |
|------------|---------|
| React.js / Next.js | UI framework, routing, SSR |
| Tailwind CSS | Styling and responsive design |
| Framer Motion | Animations and transitions |

### 3.2 Backend & Infrastructure

| Technology | Purpose |
|------------|---------|
| Firebase Authentication | User login (children, servants, admins, parents) |
| Firestore (Firebase) | Real-time NoSQL database |
| Firebase Storage | File uploads (photos, PDFs, videos) |
| Firebase Hosting | Free hosting with CDN |
| Firebase Cloud Messaging | Push notifications (future) |

### 3.3 Rationale for Firebase

- Free tier sufficient for initial scale
- Built-in authentication system
- Real-time data sync ideal for live attendance and leaderboards
- Seamless transition path to a mobile app (React Native + Firebase)
- No server management overhead

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│         Next.js App (Mobile-First, React Components)         │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                     FIREBASE LAYER                           │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │    Auth     │  │  Firestore   │  │  Storage (Files)   │  │
│  │  (4 roles)  │  │  (Database)  │  │  Photos/PDFs/Media │  │
│  └─────────────┘  └──────────────┘  └────────────────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           Firebase Hosting (CDN)                    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

> **Note:** Firestore Security Rules enforce all role-based access control at the database level, ensuring class-scoped data isolation without custom server logic.

---

## 5. User Roles & Permissions

### 5.1 Role Overview

| Role | Description |
|------|-------------|
| **Child** | Primary end-user; accesses personal profile, lessons, quizzes, and points. View-only access to own data. |
| **Parent** | Read-only view of their linked child's attendance, points, and notifications. Can submit absence excuses for upcoming sessions. |
| **Servant** | Manages ONLY their assigned class. Can view/manage children in their class, record attendance, manage points, and create accounts for children without one. Cannot access any other class. |
| **Admin** | Full access to all classes, all servants, all children, statistics, and system settings. Assigns servants to classes and controls all class configurations. |

### 5.2 Class-Based Access Model

The core access model is **class-scoped**. Each servant is assigned to exactly one class by the Admin. All servant actions are strictly bounded to that class:

- A servant **CANNOT** view, modify, or interact with children in another class.
- A servant **CANNOT** create or modify other servants' accounts.
- A servant **CAN** create child accounts within their own class for children who do not yet have accounts.
- Only the **Admin** has cross-class visibility and control.

> This is enforced at the **Firestore Security Rules** level, not just the UI level.

### 5.3 Permission Matrix

| Feature | Child | Parent | Servant | Admin |
|---------|-------|--------|---------|-------|
| View own profile | ✅ | ✅ | ✅ | ✅ |
| View own child's data | — | ✅ | — | — |
| Submit absence excuse | — | ✅ | — | — |
| View children in assigned class | — | — | ✅ (class only) | ✅ (all) |
| Record attendance | — | — | ✅ (class only) | ✅ |
| Add/modify points | — | — | ✅ (class only) | ✅ |
| Create child accounts | — | — | ✅ (class only) | ✅ |
| Publish news / trips | — | — | ✅ | ✅ |
| View class reports | — | — | ✅ (class only) | ✅ (all) |
| View absence excuses | — | — | ✅ (class only) | ✅ (all) |
| Manage servants | — | — | — | ✅ |
| Assign servant to class | — | — | — | ✅ |
| View statistics dashboard | — | — | Partial | ✅ |
| System configuration | — | — | — | ✅ |

### 5.4 Servant Account Creation Flow

When a child in a servant's class does not yet have a platform account, the servant (not the admin) can create one:

1. Servant navigates to their class children list.
2. Servant clicks **"Add Child"** and enters the child's name, grade (pre-filled to their class), and parent contact.
3. System creates a child account linked to the servant's `classId`.
4. An optional parent account can be linked at creation time or later by the Admin.
5. The servant **cannot** create accounts outside their assigned class.

---

## 6. Feature Specifications

### 6.1 Child Profile System

Each child account contains:

- Full name and grade/class
- Profile avatar (cartoon-style, selectable)
- Total points and current level (Beginner → Explorer → Champion → Star)
- Attendance record (weekly/monthly)
- Memorized verses log
- Completed assignments and earned badges

### 6.2 Gamification System

| Element | Description |
|---------|-------------|
| **Points** | Awarded for attendance, verse memorization, quizzes, assignments |
| **Levels** | Progressive tiers unlocked by point milestones |
| **Badges** | Special achievements (e.g., "Perfect Attendance," "Verse Champion") |
| **Weekly Challenges** | Short tasks or quizzes refreshed every week |
| **Leaderboard** | Class-level rankings visible to children and servants |

### 6.3 Attendance Module

- Servant marks attendance per session per child in their class only.
- System records date, class, and servant who recorded.
- Absence excuses submitted by parents are visible to the servant and admin.
- Admin views aggregate weekly/monthly attendance stats across all classes.

### 6.4 Absence Excuse System *(New)*

Parents can submit an advance absence excuse if their child will not attend an upcoming session:

1. Parent logs in and navigates to **"Excuse Absence"** on their dashboard.
2. Parent selects the upcoming session date and writes the reason.
3. Excuse is saved to Firestore under the child's record with `status: pending`.
4. The servant of that child's class sees the excuse flagged in their attendance panel.
5. Admin can view all excuses across all classes.
6. Excuse can only be submitted for a **future** session (not retroactively).

**Excuse statuses:** `pending` | `acknowledged` | `rejected`

### 6.5 Verse Memorization Module

- Servant assigns weekly verse to their class.
- Child marks verse as memorized.
- Servant verifies and awards points.
- History log maintained per child.

### 6.6 Quiz Module

- Multiple choice or short answer quizzes.
- Created by servant (for their class) or admin (any class).
- Auto-graded for MCQ format.
- Results contribute to points.

### 6.7 News & Announcements

- Published by servants or admin.
- Appears on public home page and child/parent dashboard.
- Supports images and text.

### 6.8 Trips Module

Each trip entry contains:

- Trip name, description, date, and location
- Price and registration deadline
- Registration form (name, parent phone, grade)
- Photo gallery (post-trip)

### 6.9 Educational Content

- PDF lesson uploads
- Short video links (YouTube embed)
- Organized by grade and subject
- Searchable content library

### 6.10 Admin Dashboard

- Total children count and active servants per class
- Weekly attendance rate by class
- Top-performing children across all classes
- Recent activity log
- Manage servant accounts and class assignments
- Export reports (CSV)

---

## 7. Page Structure & Sitemap

### 7.1 Public Pages (No Login Required)

```
/                   → Home Page
/about              → About the Service
/news               → News & Announcements
/activities         → Activities & Events
/trips              → Trips Page
/gallery            → Photos & Videos
/contact            → Contact Us
/login              → Login Page
```

### 7.2 Child Pages (Login Required — Child Role)

```
/child/dashboard    → Personal Dashboard (points, level, badges)
/child/attendance   → My Attendance Record
/child/lessons      → Lessons & Study Materials
/child/quizzes      → Quizzes & Challenges
/child/verses       → Verse Memorization Tracker
```

### 7.3 Parent Pages (Login Required — Parent Role)

```
/parent/dashboard   → Child Overview (attendance, points, notifications)
/parent/excuse      → Submit Absence Excuse for Upcoming Session
```

### 7.4 Servant Pages (Login Required — Servant Role)

```
/servant/dashboard  → My Class Overview (class-scoped only)
/servant/children   → My Class Children (view, manage, create accounts)
/servant/attendance → Record & View Attendance (class only)
/servant/content    → Upload Lessons & Materials
/servant/news       → Post News & Announcements
/servant/trips      → Manage Trip Registrations
/servant/quizzes    → Create & Manage Quizzes (class only)
/servant/reports    → Class Reports (class only)
/servant/excuses    → View Parent Absence Excuses (class only)
```

### 7.5 Admin Pages (Login Required — Admin Role)

```
/admin/dashboard    → Full Statistics Overview (all classes)
/admin/children     → All Children Management
/admin/servants     → Servant Accounts Management
/admin/classes      → Class Configuration & Servant Assignment
/admin/settings     → System Settings
/admin/reports      → Full Reports & Exports
/admin/excuses      → All Absence Excuses (all classes)
```

---

## 8. Database Schema

### 8.1 Collections (Firestore)

#### `users`
```json
{
  "uid": "string",
  "name": "string",
  "role": "child | parent | servant | admin",
  "email": "string",
  "phone": "string",
  "createdAt": "timestamp"
}
```

#### `classes` *(New)*
> Core collection — foundation of class-scoped access control.

```json
{
  "id": "string",
  "name": "string",
  "grade": "string",
  "servantUid": "string",
  "createdAt": "timestamp"
}
```

#### `children`
```json
{
  "uid": "string",
  "name": "string",
  "grade": "string",
  "classId": "string",
  "parentUid": "string | null",
  "servantUid": "string",
  "createdBy": "string",
  "avatarId": "string",
  "points": "number",
  "level": "string",
  "createdAt": "timestamp"
}
```

#### `attendance`
```json
{
  "id": "string",
  "childUid": "string",
  "classId": "string",
  "date": "timestamp",
  "present": "boolean",
  "excuseId": "string | null",
  "recordedBy": "string (servantUid)",
  "sessionId": "string"
}
```

#### `absence_excuses` *(New)*
```json
{
  "id": "string",
  "childUid": "string",
  "classId": "string",
  "parentUid": "string",
  "sessionDate": "timestamp",
  "reason": "string",
  "status": "pending | acknowledged | rejected",
  "submittedAt": "timestamp",
  "acknowledgedBy": "string | null",
  "acknowledgedAt": "timestamp | null"
}
```

#### `verses`
```json
{
  "childUid": "string",
  "classId": "string",
  "verseText": "string",
  "reference": "string",
  "assignedDate": "timestamp",
  "memorizedDate": "timestamp | null",
  "verifiedBy": "string (servantUid)",
  "pointsAwarded": "number"
}
```

#### `quizzes`
```json
{
  "id": "string",
  "title": "string",
  "classId": "string",
  "grade": "string",
  "createdBy": "string (servantUid | adminUid)",
  "questions": [
    {
      "text": "string",
      "options": "string[]",
      "correctIndex": "number"
    }
  ],
  "dueDate": "timestamp",
  "pointValue": "number"
}
```

#### `trips`
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "date": "timestamp",
  "location": "string",
  "price": "number",
  "registrationDeadline": "timestamp",
  "photos": "string[]",
  "createdBy": "string (servantUid | adminUid)"
}
```

#### `news`
```json
{
  "id": "string",
  "title": "string",
  "body": "string",
  "imageUrl": "string | null",
  "publishedAt": "timestamp",
  "publishedBy": "string (servantUid | adminUid)"
}
```

### 8.2 Firestore Security Rules (Key Principles)

- Servants can only read/write documents where `classId == their assigned class`.
- Parents can only read documents where `childUid == their linked child`.
- Parents can only write to `absence_excuses` where `parentUid == their own uid`.
- Children can only read their own documents (`uid == their own uid`).
- Admins have full read/write access to all collections.
- The `classes` collection is write-restricted to admin only.

---

## 9. Development Phases

### Phase 1 — Foundation (Weeks 1–3)

- [ ] Set up Next.js project and Firebase
- [ ] Configure authentication (all 4 roles)
- [ ] Build public pages (Home, About, Contact)
- [ ] Design system: colors, typography, components
- [ ] Configure Firestore Security Rules for class-scoped access
- [ ] Build `classes` collection and servant assignment flow (Admin)

### Phase 2 — Core Admin & Servant Features (Weeks 4–6)

- [ ] Admin dashboard with class management
- [ ] Servant dashboard (class-scoped only)
- [ ] Attendance recording system with class isolation
- [ ] Servant-initiated child account creation
- [ ] Points management (class-scoped)

### Phase 3 — Engagement Features (Weeks 7–9)

- [ ] Gamification: levels, badges, leaderboard (per class)
- [ ] Verse memorization module
- [ ] Quiz system (class-scoped creation)
- [ ] Weekly challenges

### Phase 4 — Content & Communication (Weeks 10–12)

- [ ] Absence Excuse system (parent submission + servant/admin view)
- [ ] News and announcements module
- [ ] Trips module with registration
- [ ] Educational content upload (PDF/video)
- [ ] Gallery page

### Phase 5 — Polish & Launch (Weeks 13–14)

- [ ] Parent portal with excuse submission
- [ ] Mobile responsiveness QA
- [ ] Performance optimization
- [ ] Final testing across all roles (especially class isolation)
- [ ] Launch on Firebase Hosting

---

## 10. Hosting & Deployment

### 10.1 Recommended Free Services

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Firebase Hosting | Static + dynamic hosting | 10 GB storage, 360 MB/day transfer |
| Firestore | Database | 1 GB storage, 50K reads/day |
| Firebase Auth | Authentication | Unlimited users |
| Firebase Storage | File storage | 5 GB |
| Vercel (alternative) | Next.js hosting | Generous free tier |

### 10.2 Custom Domain

- Register a free `.web.app` subdomain via Firebase
- Or purchase a `.com` domain (~$10/year) and link to Firebase Hosting

### 10.3 Deployment Workflow

```
Local Development → GitHub Repository → Firebase Hosting (auto-deploy on push)
```

---

## 11. Future Roadmap (Mobile App)

### 11.1 Technology Path

- **React Native** (reuses existing React components and Firebase backend)
- Available on Android (primary market) and iOS

### 11.2 Mobile-Exclusive Features

- Push notifications for announcements and attendance
- Offline mode for lessons and verses
- Camera integration for attendance (QR code scan)
- Biometric login for children

### 11.3 Timeline Estimate

- Mobile app development can begin after the web platform is stable (approximately 6 months post-launch)

---

## 12. Governance & Maintenance

### 12.1 Roles Responsible for This Document

| Role | Responsibility |
|------|---------------|
| Admin | Approve changes to platform features and user policies |
| Lead Servant (Tech) | Maintain codebase and Firebase configuration |
| Service Leader | Approve content guidelines and community rules |

### 12.2 Content Moderation Policy

- All published content (news, trips, lessons) must be reviewed by a servant before going live, or approved by admin.
- No external links without admin approval.
- All uploaded media must be appropriate for children ages 6–12.

### 12.3 Data Privacy

- Children's data is stored securely in Firebase and is never shared externally.
- Parents must provide consent during child registration.
- Only servants assigned to a class can view that class's children (enforced via Firestore rules).
- Absence excuses are visible only to the child's class servant and admins.
- Admin retains full audit log access.

### 12.4 Backup Policy

- Firestore automatic daily backups enabled.
- Firebase Storage files are replicated by default.
- A manual export of the database should be performed monthly by the admin.

### 12.5 Version Control

- All code maintained in a private GitHub repository.
- Branch naming: `main` (production), `dev` (development), `feature/[name]`.
- No direct commits to `main` — all changes via pull requests.

---

*Document prepared for: St. Mark Primary Boys Service, Diocese of Qena, Coptic Orthodox Church.*
*Version 1.1 — Updated June 2026*
