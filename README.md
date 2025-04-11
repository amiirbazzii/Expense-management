# Expense Manager

A modern expense management application built with Next.js, Convex, and Clerk.

## Features

- Track daily expenses with simple entry form
- Query and analyze spending patterns
- Monthly and comparative spending reports
- Google authentication via Clerk
- Real-time data sync with Convex
- Dark mode UI with responsive design

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Convex for database and backend functions
- **Authentication**: Clerk with Google OAuth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- Clerk account
- Convex account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/expense-manager.git
cd expense-manager
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Clerk and Convex credentials:
```
# Convex
CONVEX_DEPLOYMENT=your-deployment-id
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-id.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-key
CLERK_SECRET_KEY=sk_test_your-key
```

4. Set up Clerk
   - Create a new application in Clerk
   - Set up Google OAuth
   - Create a JWT template for Convex

5. Set up Convex
   - Run `npx convex dev` to set up your development environment

6. Start the development server
```bash
npm run dev
```

## Usage

1. Sign in with your Google account
2. Use the "Add Expense" form to log your daily expenses
3. View your spending patterns in the Reports tab
4. Check spending comparison between months

## Deployment

Deploy this project to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fexpense-manager)

Make sure to add your environment variables to your Vercel project.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
