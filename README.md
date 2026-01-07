# AISource - AI Traffic Analytics

Track traffic from AI sources like ChatGPT, Claude, Perplexity, and more with a lightweight analytics tool.

## 🚀 Quick Start

Add one script tag to your website:

```html
<script src="https://your-domain.com/track.js" data-site="your-site-id"></script>
```

That's it! Start seeing your AI traffic in the dashboard.

## ✨ Features

- **🤖 AI Source Detection**: Automatically identifies traffic from ChatGPT, Claude, Perplexity, Gemini, Copilot, and more
- **📊 Rich Analytics**: Page views, engagement tracking, time on page, bounce rate
- **⚡ Lightweight**: <2KB tracking script with zero performance impact
- **🔒 Privacy-First**: No personal data collection, GDPR compliant
- **📱 Real-time Dashboard**: Beautiful analytics interface
- **🎯 Event Tracking**: Custom event tracking with properties

## 🎯 Why AISource?

Traditional analytics tools like Google Analytics don't properly categorize AI traffic:
- AI referrals often show as "direct" traffic
- No distinction between different AI sources
- Missing engagement context for AI-driven visits

AISource solves this with specialized AI referrer detection and dedicated analytics.

## 📊 Tracking API

### Basic Usage
The script automatically tracks page views. For custom tracking:

```javascript
// Track custom events
aisource.track('Button Clicked', {
  button_name: 'signup',
  page_section: 'hero'
});

// Identify users
aisource.identify('user-123', {
  plan: 'premium',
  signup_date: '2024-01-01'
});

// Set super properties (sent with every event)
aisource.register({
  version: '2.1',
  feature_flags: ['new_ui', 'ai_chat']
});
```

### Auto-tracked Events
- `Page Viewed` - Every page load
- `Page Engaged` - User interaction (scroll, click, key)
- `Page Left` - User leaves page
- `Page Heartbeat` - Every 30s on engaged pages

## 🏗️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/aisource
cd aisource
npm install
```

### 2. Environment Setup
Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 3. Database Setup (Supabase)
1. Create a new Supabase project
2. Run the SQL from `lib/database.sql` in the SQL editor
3. Update your environment variables

### 4. Authentication Setup (Clerk)
1. Create a Clerk application
2. Add your keys to environment variables
3. Configure allowed domains

### 5. Deploy
```bash
npm run build
npm start
```

Or deploy to Vercel:
```bash
npx vercel
```

## 🎨 Dashboard Features

### Overview Metrics
- Total page views vs AI traffic
- AI traffic percentage
- Top AI sources
- Trending metrics

### Time Series Charts
- Traffic over time (total vs AI)
- AI source breakdown
- Engagement trends

### Top Content
- Pages receiving most AI traffic
- AI traffic percentage per page
- Engagement metrics by AI source

### AI Source Analysis
- ChatGPT, Claude, Perplexity breakdowns
- Source-specific engagement patterns
- Growth trends by AI platform

## 🔧 Customization

### Tracking Script Options
```html
<!-- Basic setup -->
<script src="/track.js" data-site="site-123"></script>

<!-- Custom endpoint -->
<script src="/track.js" data-site="site-123" data-endpoint="https://api.yoursite.com/track"></script>
```

### Adding New AI Sources
Edit `AI_SOURCES` in `public/track.js`:

```javascript
const AI_SOURCES = {
  'your-ai-domain.com': 'Your AI Name',
  // ... existing sources
};
```

### Custom Properties
Send additional data with every event:

```javascript
aisource.register({
  user_segment: 'enterprise',
  ab_test_variant: 'new_design'
});
```

## 📱 API Endpoints

### POST `/api/track`
Receives tracking events:

```json
{
  "event": "Page Viewed",
  "properties": {
    "token": "site-123",
    "$ai_source": "ChatGPT",
    "$current_url": "https://example.com/blog",
    "time": 1704067200000
  },
  "distinct_id": "user-abc123",
  "session_id": "session-xyz789"
}
```

## 🚀 Deployment Options

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically

### Self-hosted
1. Build the application: `npm run build`
2. Start the server: `npm start`
3. Ensure database and auth are configured

## 📊 Database Schema

### Events Table
Stores all tracking events with both structured and JSON properties for flexible querying.

### Sites Table
Manages tracked websites and associates them with user accounts.

See `lib/database.sql` for complete schema.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [Demo Dashboard](https://aisource.vercel.app/dashboard)
- [Live Demo Site](https://aisource.vercel.app/demo)
- [Documentation](https://docs.aisource.app)

---

Built with ❤️ for the AI-native web.