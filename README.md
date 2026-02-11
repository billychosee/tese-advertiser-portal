# TESE Advertising Portal

The TESE Advertising Portal is the client-side application for businesses and individuals to run ads on TESE videos.

## Features

- **Registration & KYC**: Separate advertiser registration with Individual and Company types
- **Advertiser Dashboard**: Real-time metrics and performance charts
- **TESE Wallet**: Fund campaigns, view transactions, and track spending
- **Ad Campaigns**: Create category-based or creator-targeted campaigns
- **Campaign Management**: Monitor, pause, restart, and delete campaigns
- **Reports**: Performance metrics with CSV export
- **Team Management**: Add team members with roles and permissions

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query (TanStack Query)
- Recharts
- Mock APIs (replaceable)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── wallet/           # Wallet management
│   ├── campaigns/         # Campaign management
│   ├── reports/          # Reports and analytics
│   ├── users/            # Team management
│   └── settings/         # Account settings
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Layout components
│   ├── campaigns/       # Campaign-related components
│   ├── wallet/          # Wallet-related components
│   └── reports/         # Report-related components
├── services/            # API services and mock data
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── hooks/               # Custom React hooks
```

## Mock APIs

The application uses mock APIs that can be replaced with real backend endpoints:

- `/api/auth` - Authentication
- `/api/wallet` - Wallet operations
- `/api/campaigns` - Campaign management
- `/api/reports` - Reports and analytics
- `/api/users` - User management
- `/api/creators` - TESE creators
- `/api/categories` - TESE categories

## Integration

This portal integrates with the existing TESE ecosystem:
- Creators platform
- Categories system
- Users platform
- Wallet infrastructure

## License

 proprietary.
