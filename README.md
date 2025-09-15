# Jara - AI-Powered Creator Monetization Platform

A comprehensive creator monetization platform built with React, TypeScript, and AI integration. Jara helps creators build stunning landing pages using AI, accept payments globally, and manage their monetization business.

## 🌟 Features

### AI-Powered Page Builder
- **Gemini AI Integration**: Generate customized landing pages based on creator preferences
- **Intelligent Content Generation**: AI creates compelling copy, layouts, and suggestions
- **Smart Image Handling**: Upload and optimize images with AI-powered recommendations

### Creator Tools
- **Landing Page Builder**: Drag-and-drop interface with real-time preview
- **Payment Link Management**: Create and manage multiple payment options
- **Custom Branding**: Full theme customization with brand colors and fonts
- **Analytics Dashboard**: Track revenue, transactions, and performance metrics

### Payment Processing
- **Multiple Payment Methods**: Support for Flutterwave (fiat) and NOWPayments (crypto)
- **Global Currency Support**: Accept payments in multiple currencies
- **Secure Transactions**: Industry-standard security and compliance

### Advanced Features
- **SEO Optimization**: Built-in SEO tools and meta tag management
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Real-time Preview**: See changes instantly as you build
- **Social Media Integration**: Connect social profiles and sharing

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Gemini API key for AI features
- Payment gateway credentials (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jara
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file with:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_API_URL=http://localhost:3001/api
   # Add other configuration as needed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Architecture

### Frontend Stack
- **React 18**: Modern React with hooks and context
- **TypeScript**: Full type safety and enhanced developer experience
- **Tailwind CSS**: Utility-first styling with custom design system
- **React Router**: Client-side routing and navigation
- **Zustand/Context API**: State management

### AI Integration
- **Google Gemini AI**: Content and page generation
- **Smart Suggestions**: Context-aware recommendations
- **Image Processing**: AI-powered image optimization

### Key Components
- **Page Builder**: Visual editor with drag-and-drop functionality
- **AI Assistant**: Intelligent content generation and suggestions
- **Payment Integration**: Multi-gateway payment processing
- **Analytics**: Revenue tracking and performance metrics

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Modal, etc.)
│   ├── layout/         # Layout components (Navbar, Footer)
│   └── page-builder/   # Page builder specific components
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   └── ...             # Other pages
├── hooks/              # Custom React hooks
├── context/            # React context providers
├── lib/                # Utility functions and API clients
├── types/              # TypeScript type definitions
└── styles/             # Global styles and Tailwind config
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#8B5CF6) - Main brand color
- **Secondary**: Blue (#3B82F6) - Supporting actions
- **Accent**: Green (#10B981) - Success states
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Font Family**: Inter (Google Fonts)
- **Heading Scale**: 4xl, 3xl, 2xl, xl, lg
- **Body Text**: Base (16px) with 1.6 line height

### Components
- **Consistent Spacing**: 8px grid system
- **Border Radius**: 8px standard, 12px for cards
- **Shadows**: Layered elevation system
- **Animations**: Smooth transitions and micro-interactions

## 🔧 API Integration

### Backend Requirements
The platform expects a REST API with the following endpoints:

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### Creators
- `POST /api/creators` - Create creator profile
- `GET /api/creators/:id` - Get creator profile
- `PUT /api/creators/:id` - Update creator profile

#### Landing Pages
- `POST /api/landing-pages` - Create landing page
- `GET /api/landing-pages/:id` - Get landing page
- `PUT /api/landing-pages/:id` - Update landing page
- `DELETE /api/landing-pages/:id` - Delete landing page

#### Payment Links
- `POST /api/payment-links` - Create payment link
- `GET /api/payment-links` - List payment links
- `PUT /api/payment-links/:id` - Update payment link

See the full API documentation in the provided markdown file.

## 🤖 AI Features

### Page Generation
The AI assistant can generate complete landing pages based on:
- Creator information and bio
- Business type and target audience
- Brand preferences and colors
- Uploaded images and assets

### Content Improvement
- Smart copy suggestions
- SEO optimization
- Conversion-focused recommendations
- A/B testing suggestions

## 💳 Payment Integration

### Supported Gateways
- **Flutterwave**: Credit cards, bank transfers, mobile money
- **NOWPayments**: 300+ cryptocurrencies
- **Extensible**: Easy to add more payment providers

### Features
- Multi-currency support
- Real-time conversion rates
- Secure webhook handling
- Transaction tracking and reporting

## 📊 Analytics & Insights

### Metrics Tracked
- Page views and conversion rates
- Revenue and transaction history
- Geographic distribution
- Payment method preferences
- Customer lifetime value

### Reporting
- Real-time dashboard updates
- Exportable reports
- Custom date ranges
- Performance comparisons

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Ensure all production environment variables are set:
- API endpoints
- Payment gateway credentials
- Analytics tracking IDs
- AI service keys

### Hosting Recommendations
- **Vercel**: Optimal for React applications
- **Netlify**: Great for static site generation
- **AWS S3 + CloudFront**: Scalable global distribution

## 🔒 Security

### Implementation
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- Secure authentication flows

### Best Practices
- Regular dependency updates
- Security header implementation
- SSL/TLS encryption
- Content Security Policy

## 🎯 Performance

### Optimizations
- Code splitting and lazy loading
- Image optimization and compression
- Bundle size monitoring
- Performance monitoring

### Metrics
- First Contentful Paint < 2s
- Largest Contentful Paint < 3s
- Cumulative Layout Shift < 0.1

## 🧪 Testing

### Setup
```bash
npm run test          # Run unit tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Testing Strategy
- Unit tests for components
- Integration tests for user flows
- End-to-end testing with Playwright
- Performance testing

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- TypeScript strict mode
- ESLint and Prettier configuration
- Conventional commit messages
- Component documentation

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Component Library](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### Community
- GitHub Issues for bug reports
- Discussions for feature requests
- Discord community for support

---

Built with ❤️ by the Jara team. Empowering creators worldwide with AI-powered monetization tools.