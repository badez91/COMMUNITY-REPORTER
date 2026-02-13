# 🧪 Judge Testing Guide

## Quick Start for Judges

### 1. Access the Application
**Live URL:** [https://community-reporter.vercel.app](https://community-reporter.vercel.app)

### 2. Sign In with Google
Click the "Sign in" button and use your Google account. The app will automatically create your profile.

### 3. Test User Features

#### Create a Report
1. Click "Create" in the navbar
2. Fill in:
   - Title: "Broken streetlight on Main St"
   - Description: "The streetlight has been out for 3 days"
   - Category: Any category
3. Submit and earn +10 points

#### Follow Reports
1. Browse reports on the home page
2. Click "Follow" on any report
3. Earn +5 points

#### Add Updates/Comments
1. Open any report detail page
2. Scroll to "Add Update" section
3. Post a comment
4. Earn points toward "Helper" badge (5 comments needed)

#### Confirm Closures
1. Find a report with "In Progress" status
2. Click "Confirm Close" button
3. Earn +10 points and progress toward "Resolver" badge

### 4. Test Admin Features

#### Become an Admin
To test admin features, you need admin access. There are two ways:

**Option A: Request Admin Access**
- Email your Google account email to the developer
- They will manually set your role to ADMIN in the database

**Option B: Use SQL (if you have database access)**
```sql
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'your-google-email@gmail.com';
```

#### Access Admin Dashboard
Once you have admin role:
1. Sign in with your Google account
2. You'll see an "Admin" button in the navbar (purple button)
3. Click it to access the admin dashboard

#### Admin Features to Test
1. **View All Reports** - See complete list with flagged counts
2. **Hide/Unhide Reports** - Click "Hide" to remove from public view
3. **Ban Users** - Click "Ban User" to prevent user from posting
4. **Monitor Flags** - See which reports have been flagged by users

### 5. Test Gamification

#### Points System
- Create report: +10 points
- Follow report: +5 points
- Acknowledge report: +10 points
- Confirm closure: +10 points

#### Badges to Unlock
1. **🎯 First Report** - Create your first report (automatic)
2. **🤝 Helper** - Post 5 updates/comments
3. **✅ Resolver** - Confirm 2 report closures

View your points and badges on your profile page.

### 6. Test Search & Filters

#### Search
- Use the search bar on home page
- Search by title or description keywords

#### Filter by Status
- Click status buttons: All, Open, Acknowledged, In Progress, Closed
- Results update automatically

### 7. Test Anti-Spam Features

#### Rate Limiting
- Try creating 4 reports quickly (you'll be blocked after 3)
- Try posting 6 comments quickly (you'll be blocked after 5)

#### Flag Reports
- Click "⚠ Flag" button on any report
- After 5 flags, report is auto-hidden

### 8. Test PWA Features

#### Install as App
**On Desktop (Chrome/Edge):**
1. Click the install icon in the address bar
2. Click "Install"

**On Mobile:**
1. Open in Chrome/Safari
2. Tap "Add to Home Screen"

## 🎯 Testing Checklist

- [ ] Sign in with Google OAuth
- [ ] Create a report
- [ ] Follow a report
- [ ] Add a comment/update
- [ ] Search for reports
- [ ] Filter by status
- [ ] View profile with points and badges
- [ ] Confirm a closure
- [ ] Flag a report
- [ ] Access admin dashboard (if admin)
- [ ] Hide/unhide a report (admin)
- [ ] Ban a user (admin)
- [ ] Install as PWA

## 📝 Notes for Judges

### Design Decisions
1. **Status Flow:** Linear progression ensures clear tracking
2. **Community-Driven:** Any user can confirm closures (lightweight approach)
3. **Simple Gamification:** 3 badges only, as per requirements
4. **Admin Access:** Role-based, requires database update for security

### Optional Features Not Implemented
- Photo upload (marked as optional)
- Location/map integration (marked as optional)
- Advanced PWA features (basic PWA configured)

### Known Limitations
- Admin role must be set manually in database (security by design)
- No email notifications (not in requirements)
- No real-time updates (uses page refresh)

## 🆘 Troubleshooting

### Can't Sign In
- Make sure you're using a Google account
- Check if cookies are enabled
- Try incognito/private mode

### Don't See Admin Button
- Confirm your role is set to ADMIN in database
- Try signing out and back in
- Clear browser cache

### Rate Limited
- Wait 60 seconds before trying again
- This is intentional anti-spam protection

## 📧 Contact

For any issues or questions during testing, please contact the developer through the GitHub repository.

---

**Live URL:** [https://community-reporter.vercel.app](https://community-reporter.vercel.app)
**GitHub:** [https://github.com/badez91/COMMUNITY-REPORTER](https://github.com/badez91/COMMUNITY-REPORTER)
