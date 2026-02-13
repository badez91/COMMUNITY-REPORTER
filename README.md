# 🌐 Community Reporter - Local Problem Reporting Platform

A Progressive Web App (PWA) that empowers communities to report, track, and resolve local issues collaboratively.

## 🚀 Live Demo

**Deployed URL:** [https://community-reporter.vercel.app](https://community-reporter.vercel.app)

## 📋 Features Implemented

### ✅ Must-Have Requirements

#### 1. **Google Sign-In (OAuth)**
- Secure authentication via NextAuth.js
- User profile page with:
  - Name and avatar display
  - Points tracking system
  - Badge collection showcase
  - Activity history

#### 2. **Create Report**
- Simple form with:
  - Title
  - Description
  - Category selection
- Anti-spam: 30-second cooldown between reports
- Rate limiting: Max 3 reports per minute

#### 3. **Public Feed + Report Detail Page**
- Clean, card-based report listing
- Search functionality
- Status flow: **Open → Acknowledged → In Progress → Closed**
- Detailed report view with:
  - Full description
  - Status updates
  - Activity timeline
  - Community comments

#### 4. **Follow System**
- Follow/unfollow any report
- Auto-follow on report creation
- View followed reports on profile
- Real-time follow status updates

#### 5. **Gamification System**
- **Points System:**
  - Create report: +10 points
  - Acknowledge report: +10 points
  - Confirm closure: +10 points
  - Follow report: +5 points

- **Badges (3 types):**
  - 🎯 **First Report** - Create your first report
  - 🤝 **Helper** - Post 5 updates/comments
  - ✅ **Resolver** - Confirm 2 report closures

#### 6. **Public-First Updates**
- Community members can post updates/comments
- Activity timeline on each report
- Close confirmation system (community-driven)
- Real-time activity feed

### ✅ Nice-to-Have Features Implemented

#### 7. **Search + Filters**
- Search by title/description
- Filter by status (Open, Acknowledged, In Progress, Closed)
- Pagination support

#### 8. **Anti-Spam Measures**
- Rate limiting on report creation
- Rate limiting on comments (5 per minute)
- Flag button for inappropriate content
- Auto-hide reports after 5 flags

#### 9. **Duplicate Report Handling**
- Admin can mark reports as duplicates
- Automatic redirect to original report
- Prevents duplicate tracking

### ✅ Admin Dashboard

#### 10. **Lightweight Admin Panel**
- View all reports with flagged count
- Hide/unhide reports
- Ban/unban users
- Monitor flagged content
- Lock/unlock comments (via isLocked field)
- Admin-only access control

### ✅ PWA Support
- Installable as Progressive Web App
- Offline-ready architecture
- Responsive design for all devices

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Authentication:** NextAuth.js with Google OAuth
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Deployment:** Vercel
- **Architecture:** Domain-Driven Design (DDD)

## 📁 Project Structure

```
COMMUNITY-REPORTER/
├── app/
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes
│   │   ├── auth/           # NextAuth configuration
│   │   ├── reports/        # Report CRUD operations
│   │   ├── users/          # User management
│   │   └── admin/          # Admin operations
│   ├── components/         # Reusable React components
│   ├── profile/            # User profile page
│   └── reports/            # Report pages
├── application/            # Application services
├── domain/                 # Domain logic
├── infrastructure/         # Data repositories
├── lib/                    # Utilities (auth, prisma, etc.)
├── prisma/                 # Database schema & migrations
└── types/                  # TypeScript type definitions
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or Supabase account)
- Google OAuth credentials

### 1. Clone the Repository
```bash
git clone https://github.com/badez91/COMMUNITY-REPORTER.git
cd COMMUNITY-REPORTER
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL=postgresql://user:password@host:6543/database?pgbouncer=true
DIRECT_URL=postgresql://user:password@host:5432/database
```

### 4. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed badges (optional)
node prisma/seedBadges.js
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production
```bash
npm run build
npm start
```

### 7. Make a User Admin (Optional)
To grant admin access to a user:

```bash
# After user has signed in at least once
npx ts-node scripts/makeAdmin.ts user@example.com
```

Or manually in database:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'user@example.com';
```

## 🎮 How to Use

### For Judges Testing:
**See [JUDGE_TESTING_GUIDE.md](./JUDGE_TESTING_GUIDE.md) for detailed testing instructions.**

Quick steps:
1. Visit [https://community-reporter.vercel.app](https://community-reporter.vercel.app)
2. Sign in with Google
3. Test all features (create reports, follow, comment, etc.)
4. To test admin features, contact developer to set your account as admin

### For Users:
1. **Sign In** with Google account
2. **Create Report** - Click "Create" in navbar
3. **Browse Reports** - View all community reports on home page
4. **Follow Reports** - Click "Follow" to track updates
5. **Add Updates** - Comment on reports you're following
6. **Confirm Closures** - Help verify when issues are resolved
7. **Earn Badges** - Complete activities to unlock achievements

### For Admins:
1. Sign in with admin account
2. Click "Admin" button in navbar
3. View flagged reports
4. Hide inappropriate content
5. Ban problematic users
6. Mark duplicate reports

## 🏗️ Architecture Highlights

### Domain-Driven Design
- **Domain Layer:** Business logic and rules
- **Application Layer:** Use cases and orchestration
- **Infrastructure Layer:** Data access and external services
- **Presentation Layer:** UI components and pages

### Key Design Decisions
1. **Separation of Concerns:** Clean architecture with distinct layers
2. **Type Safety:** Full TypeScript coverage
3. **Error Handling:** Comprehensive try-catch blocks in all API routes
4. **Security:** Input validation, rate limiting, authentication checks
5. **Performance:** Connection pooling, optimized queries, pagination

## 🔒 Security Features

- OAuth 2.0 authentication
- CSRF protection via NextAuth
- SQL injection prevention (Prisma ORM)
- Rate limiting on sensitive operations
- Input validation on all forms
- Admin-only route protection
- Environment variable security

## 📊 Database Schema

### Core Models:
- **User** - Authentication, points, badges, role
- **Report** - Issues with status tracking
- **Follow** - User-report relationships
- **Badge** - Achievement definitions
- **UserBadge** - User achievements
- **Activity** - Timeline of actions
- **CloseConfirmation** - Community verification
- **RateLimit** - Anti-spam tracking
- **Flag** - Content moderation

## 🎯 Assumptions & Design Choices

1. **Status Flow:** Linear progression (Open → Acknowledged → In Progress → Closed)
2. **Close Confirmation:** Any user can confirm, lightweight approach
3. **Gamification:** Simple point system, 3 core badges
4. **Admin Access:** Role-based, set via database
5. **Photo Upload:** Not implemented (optional requirement)
6. **Location:** Not implemented (optional requirement)
7. **PWA:** Configured but can be enhanced with service workers

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 API Endpoints

### Public Routes
- `GET /api/reports` - List all reports
- `GET /api/reports/[id]` - Get report details

### Authenticated Routes
- `POST /api/reports` - Create report
- `POST /api/reports/[id]/follow` - Follow report
- `DELETE /api/reports/[id]/follow` - Unfollow report
- `POST /api/reports/[id]/acknowledge` - Acknowledge report
- `POST /api/reports/[id]/start-progress` - Start progress
- `POST /api/reports/[id]/confirm-close` - Confirm closure
- `POST /api/reports/[id]/updates` - Add comment
- `POST /api/reports/[id]/flag` - Flag report

### Admin Routes
- `GET /api/admin/flagged-reports` - View flagged content
- `PATCH /api/admin/reports/[id]/hide` - Hide/unhide report
- `PATCH /api/admin/users/[id]/ban` - Ban/unban user
- `PATCH /api/admin/reports/[id]/duplicate` - Mark duplicate

## 🌟 Future Enhancements

- Photo upload with cloud storage
- Geolocation and map integration
- Push notifications
- Email notifications
- Advanced analytics dashboard
- Mobile app (React Native)
- Multi-language support

## 👥 Contributing

This is a bounty submission project. For questions or feedback, please contact the repository owner.

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Built for the Local Community Problem Reporter bounty
- Powered by Next.js, Vercel, and Supabase
- Icons from React Icons

---

**Deployed URL:** [https://community-reporter.vercel.app](https://community-reporter.vercel.app)

**GitHub Repository:** [https://github.com/badez91/COMMUNITY-REPORTER](https://github.com/badez91/COMMUNITY-REPORTER)
