# 🚀 InvestPro - Quick Reference Card

## Installation & Run
```bash
npm install
npm run dev
```
Open: http://localhost:5173

## 🧪 Testing Guide

### 1️⃣ Test USER Role
**Register as User:**
- Name: John Doe
- Email: john@test.com
- Password: 123456
- Confirm: 123456
- Role: ✅ User

**Expected:**
- Redirects to `/dashboard`
- See 4 stat cards (Invested, Value, Profit, Return%)
- See 3 charts (Line, Pie, Bar)
- Sidebar: Overview, Explore Funds, My Investments, SIP Calculator, Profile, Logout
- 💬 Chat button (bottom-right) - VISIBLE
- Can explore funds and invest
- Cannot access `/admin/*` routes

**Chat Keywords to Test:**
- Type "returns" → Portfolio growth message
- Type "risk" → Diversification message
- Type "invest" → Explore funds suggestion
- Type "sip" → SIP calculator suggestion
- Type "portfolio" → Portfolio health message

### 2️⃣ Test ADMIN Role
**Register as Admin:**
- Name: Admin User
- Email: admin@test.com
- Password: admin123
- Confirm: admin123
- Role: ✅ Admin

**Expected:**
- Redirects to `/admin/dashboard`
- See 4 stat cards (Users, Investments, Funds, Growth)
- See 3 charts (User Growth, Investment Dist, Revenue)
- Sidebar: Dashboard, Manage Users, Manage Funds, Reports, Logout
- ❌ NO Chat button
- Can manage users and funds
- Cannot access `/dashboard` route

**Admin Features to Test:**
1. **Manage Users** (`/admin/users`)
   - View user table
   - Click "Delete" on any user
   - Confirm deletion

2. **Manage Funds** (`/admin/funds`)
   - Click "+ Add Fund"
   - Fill form (Name, Category, Risk, Returns)
   - Submit to add new fund
   - Click "Delete Fund" on any card

3. **Reports** (`/admin/reports`)
   - View performance metrics
   - See detailed charts

## 🎨 UI Features to Verify

### Landing Page
- ✅ Split layout (left text, right illustration)
- ✅ Animated SVG chart with growth line
- ✅ Floating stat badges (₹2.5Cr+, 10K+, 18.5%)
- ✅ Smooth fade-in animations
- ✅ Responsive design

### User Dashboard
- ✅ Blue/Teal gradient theme
- ✅ Interactive charts with tooltips
- ✅ Hover effects on cards
- ✅ Chat support floating button
- ✅ Smooth animations

### Admin Dashboard
- ✅ Blue gradient theme
- ✅ Different color scheme from user
- ✅ Analytics charts
- ✅ Management tables
- ✅ No chat support

## 🔐 Role-Based Access

| Feature | User | Admin |
|---------|------|-------|
| Dashboard with charts | ✅ | ✅ |
| Explore & Invest | ✅ | ❌ |
| Portfolio | ✅ | ❌ |
| Chat Support | ✅ | ❌ |
| Manage Users | ❌ | ✅ |
| Manage Funds | ❌ | ✅ |
| Reports | ❌ | ✅ |

## 📱 Responsive Testing
- Desktop: Full layout
- Tablet: Adjusted grid
- Mobile: Single column, stacked

## 🎯 Key Routes

**Public:**
- `/` → Splash (2s) → `/home`
- `/home` → Landing Page
- `/login` → Login
- `/register` → Register with role

**User (Protected):**
- `/dashboard` → User Dashboard
- `/explore` → Explore Funds
- `/invest/:fundName` → Investment Page
- `/portfolio` → My Investments
- `/sip-calculator` → SIP Calculator
- `/profile` → User Profile

**Admin (Protected):**
- `/admin/dashboard` → Admin Dashboard
- `/admin/users` → Manage Users
- `/admin/funds` → Manage Funds
- `/admin/reports` → Reports

## ✅ Checklist

- [ ] Splash screen shows and redirects
- [ ] Landing page has split layout with animation
- [ ] Register validates password match
- [ ] Role selection works (User/Admin)
- [ ] User redirects to `/dashboard`
- [ ] Admin redirects to `/admin/dashboard`
- [ ] User sees chat button
- [ ] Admin doesn't see chat button
- [ ] Charts render correctly
- [ ] User can't access admin routes
- [ ] Admin can't access user routes
- [ ] Logout clears localStorage
- [ ] All navigation works
- [ ] Responsive on mobile

## 🎉 Success Criteria

Your app should look like a **mini Zerodha/Groww** with:
✅ Professional fintech design
✅ Role-based authentication
✅ Interactive charts
✅ User chatbot
✅ Admin management panel
✅ Smooth animations
✅ Fully responsive

**All features implemented and ready to use!**
