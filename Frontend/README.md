# SmartBasket – Food Saver 🌱

A modern, responsive web application designed to help households reduce food waste through smart tracking, recipe suggestions, and community sharing.

## 🎯 Problem Statement

Households unknowingly waste food because items expire without their knowledge. SmartBasket solves this by:
- **Tracking** expiry dates with color-coded urgency system
- **Suggesting** recipes using items about to expire
- **Sharing** excess food with neighbors to prevent waste
- **Gamifying** the experience with streaks, badges, and impact tracking

## ✨ Features

### 1. **Landing Page**
- Engaging hero section with clear value proposition
- Visual timeline showing how the app works
- Community impact counter showing collective achievements
- Responsive design for all screen sizes

### 2. **Dashboard**
- Personalized greeting
- Summary cards showing critical stats (expiring items, total tracked, recipes available)
- Color-coded Expiry Radar:
  - 🔴 Red: Expires today/tomorrow
  - 🟠 Orange: Expires in ≤3 days
  - 🟢 Green: Fresh & safe (≥4 days)
- Smart suggestion chatbot panel
- Quick Wins carousel with recipe ideas

### 3. **Add Item Page**
- Smart form with autocomplete chips for common items
- Barcode scanner simulation (with modal explanation)
- Category selection
- Storage location (Fridge/Freezer/Pantry)
- Date pickers for expiry and purchase dates
- Helpful tips for users

### 4. **Recipes Page**
- Recipe cards showing meals using expiring ingredients
- Filters based on user preferences (vegetarian, difficulty)
- "Mark as Cooked" functionality
- Visual badges showing:
  - Number of expiring items used
  - Cook time
  - Difficulty level
  - Dietary info

### 5. **Community Sharing**
- Split layout: Share form + Available items feed
- Post excess food for neighbors
- Browse nearby shared items
- Mock chat functionality
- Building/Block selection for local coordination

### 6. **Impact & Gamification**
- Stats dashboard:
  - Food saved (kg)
  - CO₂ reduced (kg)
  - Current streak
  - Recipes cooked
- Monthly goal tracker with progress bar
- Streak visualization
- Achievement badges system:
  - Fridge Guardian
  - Leftover Legend
  - Recipe Explorer
  - Waste Warrior
  - Green Champion
  - Community Hero
- Environmental impact context

### 7. **Settings**
- Dark mode toggle (UI ready)
- Recipe preferences:
  - Vegetarian-only filter
  - Budget-friendly toggle
  - Show/hide difficulty
- Household info:
  - Family size (Single/Couple/Family)
  - Dietary preference (Veg/Non-veg/Vegan)

## 🎨 Design Highlights

- **Color Palette**: Fresh food-inspired (greens, oranges, light neutrals)
- **Animations**: Smooth micro-animations using Motion (Framer Motion)
- **Responsive**: Mobile-first design with sticky bottom nav on mobile, top nav on desktop
- **Accessibility**: Proper aria-labels, keyboard navigation, good contrast
- **Typography**: Clean hierarchy with consistent spacing
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Toast Notifications**: Success messages for key actions

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS v4** for styling
- **Motion** (Framer Motion) for animations
- **Lucide React** for icons
- **Sonner** for toast notifications
- **Context API** for state management

## 📱 Navigation

### Desktop
- Top navigation bar with all pages
- Logo in top left

### Mobile
- Sticky bottom navigation with 5 main pages:
  - Home (Dashboard)
  - Add
  - Recipes
  - Community
  - Impact

## 🎮 Demo Data

The app comes pre-loaded with:
- 10 food items with varying expiry dates
- 5 recipe suggestions
- 4 community posts
- 6 achievement badges (3 achieved, 3 locked)
- Mock impact statistics

## 🚀 Key Interactions

1. **Add Item**: Fill form → Toast confirmation → Auto-redirect to dashboard
2. **Barcode Scan**: Click → Modal with explanation → Simulate scan → Auto-fill form
3. **Mark Recipe as Cooked**: Click → Toast celebration → Update stats → Visual badge
4. **Community Interest**: Click "I'm Interested" → Chat preview modal
5. **Settings Toggle**: Any toggle → Toast confirmation → Instant UI update

## 🌟 Hackathon Differentiators

1. **Community Sharing**: Unique apartment/building-focused food sharing network
2. **Gamification**: Streaks, badges, and goals make saving food fun and engaging
3. **Smart Suggestions**: AI-like chatbot panel suggesting timely actions
4. **Environmental Impact**: Clear visualization of CO₂ and money saved
5. **Beautiful UI**: Professional design that looks production-ready
6. **Complete Flow**: Every feature is wired and functional (with mock data)

## 📊 Impact Metrics (Mock)

- Food Saved: 3.2 kg (user) / 2,400 kg (community)
- CO₂ Reduced: 8.5 kg (user) / 6,000 kg (community)
- Current Streak: 3 days
- Recipes Cooked: 2
- Active Users: 1,250

## 🎯 User Journey

1. Land on homepage → Learn about the problem
2. Click "Try Demo" → See Dashboard with real-looking data
3. Add a new item → Experience smooth form with barcode simulation
4. Check Recipes → See suggestions using expiring items
5. Mark recipe as cooked → Get celebration + see impact update
6. Browse Community → Share food with neighbors
7. Check Impact page → Feel motivated by progress and badges

## 💡 Future Enhancements (Post-Hackathon)

- Real barcode scanning with camera API
- Actual recipe database and matching algorithm
- Real-time chat between neighbors
- Push notifications for expiry alerts
- Integration with grocery APIs
- Nutrition tracking
- AI-powered recipe generation
- Calendar view of expiring items

---

**Built for hackathon demo** • **Focus on UI/UX excellence** • **Zero backend required**
