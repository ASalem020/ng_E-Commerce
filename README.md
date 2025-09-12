# 🛒 FreshCart E-Commerce Platform

A modern, full-stack e-commerce application built with Angular 18, featuring a complete shopping experience with authentication, product management, cart functionality, and payment integration.

## 🌟 Features

### 🔐 Authentication & Security
- **User Registration & Login** with form validation
- **Remember Me** functionality with persistent sessions
- **Password Reset** with email verification
- **JWT Token-based** authentication
- **Route Guards** for protected pages
- **Session Management** (localStorage/sessionStorage)

### 🛍️ E-Commerce Core Features
- **Product Catalog** with categories and brands
- **Product Search & Filtering** with advanced options
- **Product Details** with image galleries
- **Shopping Cart** with real-time updates
- **Wishlist** functionality
- **Order Management** and history
- **Checkout Process** with payment integration

### 🎨 User Interface
- **Responsive Design** for all devices
- **Dark/Light Theme** support
- **Modern UI/UX** with Tailwind CSS
- **Loading States** and animations
- **Toast Notifications** for user feedback
- **Interactive Components** with smooth transitions

### 🚀 Technical Features
- **Server-Side Rendering (SSR)** for better SEO
- **Lazy Loading** for optimal performance
- **Code Splitting** for smaller bundles
- **TypeScript** for type safety
- **Reactive Forms** with validation
- **HTTP Interceptors** for API management
- **State Management** with services

## 🛠️ Tech Stack

### Frontend
- **Angular 18** - Main framework
- **TypeScript** - Programming language
- **Tailwind CSS** - Styling framework
- **RxJS** - Reactive programming
- **Angular Material** - UI components
- **ngx-toastr** - Notifications
- **ngx-spinner** - Loading indicators

### Backend Integration
- **RESTful APIs** - Backend communication
- **JWT Authentication** - Token-based auth
- **HTTP Client** - API requests
- **Interceptors** - Request/response handling

### Development Tools
- **Angular CLI** - Development tooling
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Karma & Jasmine** - Testing framework

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                    # Core functionality
│   │   ├── components/          # Shared components
│   │   ├── guards/             # Route guards
│   │   ├── layouts/            # Layout components
│   │   ├── services/           # Core services
│   │   └── constants/          # App constants
│   ├── features/               # Feature modules
│   │   ├── auth/              # Authentication
│   │   ├── products/          # Product management
│   │   ├── cart/              # Shopping cart
│   │   ├── wishlist/          # Wishlist functionality
│   │   ├── payment/           # Payment processing
│   │   └── home/              # Home page
│   └── shared/                # Shared utilities
├── environments/              # Environment configs
└── styles/                   # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (v18)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ng_E-Commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy environment files
   cp src/environments/environments.dev.ts src/environments/environments.ts
   ```

4. **Start development server**
   ```bash
   ng serve
   ```

5. **Open your browser**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
# Build the project
ng build --configuration=production

# Or use the deployment script
./deploy.sh
```

## 🔧 Configuration

### Environment Variables
Update `src/environments/environments.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'your-api-url',
  // Add other environment-specific variables
};
```

### API Configuration
Configure your API endpoints in `src/app/core/constants/appApis.ts`:

```typescript
export const appApis = {
  signin: '/auth/signin',
  signup: '/auth/signup',
  // Add other API endpoints
};
```

## 📱 Available Scripts

- `ng serve` - Start development server
- `ng build` - Build the project
- `ng test` - Run unit tests
- `ng lint` - Run linting
- `ng e2e` - Run end-to-end tests
- `ng generate` - Generate components, services, etc.

## 🎯 Key Features Implementation

### Authentication Flow
1. User registration with email validation
2. Secure login with JWT tokens
3. Remember me functionality
4. Password reset via email
5. Route protection with guards

### Shopping Experience
1. Browse products by categories/brands
2. Search and filter products
3. Add to cart with real-time updates
4. Manage wishlist
5. Secure checkout process

### State Management
- Centralized state with Angular services
- Reactive programming with RxJS
- HTTP interceptors for API management
- Local storage for persistence

## 🚀 Deployment

### Production Build
```bash
ng build --configuration=production
```

### Deployment Options
- **Vercel** - Static site deployment
- **Netlify** - JAMstack deployment
- **AWS S3** - Cloud storage deployment
- **Firebase Hosting** - Google's hosting platform

### Environment Setup
1. Configure production environment variables
2. Set up API endpoints
3. Configure CORS settings
4. Set up SSL certificates

## 🧪 Testing

### Unit Tests
```bash
ng test
```

### E2E Tests
```bash
ng e2e
```

### Linting
```bash
ng lint
```

## 📊 Performance Optimizations

- **Lazy Loading** - Modules loaded on demand
- **Tree Shaking** - Unused code elimination
- **Code Splitting** - Smaller bundle sizes
- **OnPush Change Detection** - Optimized rendering
- **Image Optimization** - Compressed assets
- **Caching Strategies** - HTTP caching

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Form validation
- **XSS Protection** - Angular's built-in protection
- **CSRF Protection** - Cross-site request forgery prevention
- **Secure Headers** - HTTP security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Salem** - Full Stack Developer
- LinkedIn: [Your LinkedIn Profile]
- GitHub: [Your GitHub Profile]
- Email: [Your Email]

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Tailwind CSS for the utility-first CSS
- All open-source contributors

---

**Built with ❤️ using Angular 18**