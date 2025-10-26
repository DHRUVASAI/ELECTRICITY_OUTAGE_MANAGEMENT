# Electricity Outage Management System

A modern, full-stack web application for managing and tracking electricity outages across India. Built with Next.js 16, React 19, TypeScript, and real-time WebSocket communication.

## Features

### User Features
- **User Authentication**: Secure login and registration system
- **Report Outages**: Submit power outage reports with location and description
- **View All Outages**: Browse all reported outages with filtering options (All, Active, My Reports)
- **Real-time Updates**: WebSocket integration for live outage status updates
- **Service Areas**: Browse electricity service areas across all Indian states and districts
- **Notifications**: Receive and manage outage-related notifications
- **User Profile**: Update personal information and preferences
- **Emergency Contacts**: Access emergency contact information
- **Maintenance Schedule**: View scheduled maintenance activities
- **State Information**: Browse detailed information about Indian states and their electricity infrastructure

### Admin Features
- **Admin Dashboard**: Comprehensive overview of system statistics
- **Outage Management**: Update outage status, assign priorities, and manage resolutions
- **Area Management**: Create, update, and delete service areas
- **User Management**: View and manage user accounts
- **Analytics**: View system-wide statistics and trends
- **Bulk Operations**: Perform mass updates and notifications

## Technology Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **React 19.2**: Latest React with server components
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling
- **shadcn/ui**: High-quality UI components
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Recharts**: Data visualization
- **React Hook Form + Zod**: Form handling and validation

### Real-time Communication
- **WebSocket (STOMP)**: Real-time outage updates
- **SockJS**: WebSocket fallback support

### State Management
- **React Context**: User authentication state
- **Local Storage**: Persistent user sessions

### Backend Integration
- **REST API**: Communication with Java Spring Boot backend
- **Mock Data**: Development mode with comprehensive mock data for all Indian states

## Project Structure

\`\`\`
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin dashboard
│   ├── areas/                    # Service areas listing
│   ├── dashboard/                # User dashboard
│   ├── emergency/                # Emergency contacts
│   ├── maintenance/              # Maintenance schedule
│   ├── notifications/            # User notifications
│   ├── outages/                  # Outage management
│   │   ├── [id]/                 # Individual outage details
│   │   └── page.tsx              # All outages list
│   ├── profile/                  # User profile
│   ├── state-info/               # Indian states information
│   └── page.tsx                  # Landing/login page
├── components/                   # React components
│   ├── admin/                    # Admin-specific components
│   ├── auth/                     # Authentication components
│   ├── dashboard/                # Dashboard components
│   ├── layout/                   # Layout components (header, sidebar)
│   ├── outage/                   # Outage-related components
│   ├── ui/                       # shadcn/ui components
│   └── theme-provider.tsx        # Dark mode support
├── lib/                          # Utility libraries
│   ├── api-client.ts             # API client with mock data
│   ├── auth-context.tsx          # Authentication context
│   ├── indian-states-data.ts     # Comprehensive Indian states data
│   ├── utils.ts                  # Utility functions
│   └── websocket-service.ts      # WebSocket connection management
└── public/                       # Static assets
\`\`\`

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd electricity-outage-system
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Set up environment variables:
Create a `.env.local` file in the root directory:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=http://localhost:8080/ws
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `password`

**User Account:**
- Username: `user1`
- Password: `password`

## Development Mode

The application includes comprehensive mock data for development:
- Mock users (admin and regular users)
- Mock outages across Indian states
- Mock service areas covering all Indian states and districts
- Mock notifications
- Simulated API delays for realistic testing

## Backend Integration

The frontend is designed to work with a Java Spring Boot backend. The API client (`lib/api-client.ts`) provides:

### API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/outages` - Get all outages
- `GET /api/outages/{id}` - Get outage by ID
- `POST /api/outages` - Report new outage
- `PUT /api/outages/{id}/status` - Update outage status
- `DELETE /api/outages/{id}` - Delete outage
- `GET /api/areas` - Get all service areas
- `GET /api/areas?state={code}` - Get areas by state
- `GET /api/notifications/{userId}` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark notification as read

### WebSocket Integration
- Connect to: `ws://localhost:8080/ws`
- Subscribe to: `/topic/outages` for real-time updates
- Message format: JSON with outage data

## Key Features Explained

### Real-time Updates
The application uses WebSocket (STOMP protocol) to receive real-time outage updates. When an outage status changes, all connected clients are notified instantly.

### Indian States Coverage
The system includes comprehensive data for all Indian states and union territories:
- 28 States + 8 Union Territories
- 700+ Districts
- 4000+ Cities
- State-wise service area management

### Responsive Design
Fully responsive UI that works seamlessly on:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

### Dark Mode
Built-in dark mode support using `next-themes` with system preference detection.

### Accessibility
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- High contrast mode compatible

## Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

The application will be optimized and ready for deployment.

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway
- Render

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8080/api` |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL | `http://localhost:8080/ws` |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@electricityoutage.com

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)
