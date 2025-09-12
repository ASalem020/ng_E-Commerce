# 🚀 FreshCart E-Commerce Deployment Guide

This guide will help you deploy the FreshCart e-commerce platform to various hosting platforms.

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Account on your chosen hosting platform

## 🛠️ Pre-Deployment Checklist

### 1. Environment Configuration
```bash
# Update production environment
cp src/environments/environments.prod.ts src/environments/environments.ts
```

### 2. API Configuration
Ensure your API endpoints are correctly configured in:
- `src/app/core/constants/appApis.ts`
- `src/environments/environments.prod.ts`

### 3. Build Optimization
```bash
# Run the deployment script
./deploy.sh

# Or manually build
ng build --configuration=production
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add your production API URLs

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   ng build --configuration=production
   netlify deploy --prod --dir=dist
   ```

3. **Configure Redirects**
   Create `_redirects` file in `public/`:
   ```
   /*    /index.html   200
   ```

### Option 3: Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm i -g firebase-tools
   ```

2. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```

3. **Configure firebase.json**
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Deploy**
   ```bash
   ng build --configuration=production
   firebase deploy
   ```

### Option 4: AWS S3 + CloudFront

1. **Install AWS CLI**
   ```bash
   # Follow AWS CLI installation guide
   ```

2. **Configure AWS**
   ```bash
   aws configure
   ```

3. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

4. **Upload Files**
   ```bash
   ng build --configuration=production
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

5. **Configure CloudFront**
   - Create CloudFront distribution
   - Set S3 as origin
   - Configure custom error pages for SPA routing

## 🔧 Production Configuration

### Angular Configuration
Update `angular.json` for production:

```json
{
  "configurations": {
    "production": {
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "1MB",
          "maximumError": "2MB"
        }
      ],
      "optimization": true,
      "outputHashing": "all",
      "sourceMap": false,
      "namedChunks": false,
      "extractLicenses": true,
      "vendorChunk": false,
      "buildOptimizer": true
    }
  }
}
```

### Environment Variables
Create production environment file:

```typescript
// src/environments/environments.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api',
  appName: 'FreshCart',
  version: '1.0.0'
};
```

## 🔒 Security Configuration

### HTTPS Setup
- Ensure SSL certificates are configured
- Redirect HTTP to HTTPS
- Set secure headers

### CORS Configuration
Configure your backend to allow:
- Your domain
- Required HTTP methods
- Necessary headers

### Content Security Policy
Add CSP headers:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
```

## 📊 Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
ng build --configuration=production --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

### Image Optimization
- Use WebP format for images
- Implement lazy loading
- Compress images before upload

### Caching Strategy
- Set appropriate cache headers
- Use CDN for static assets
- Implement service worker for offline support

## 🧪 Testing Before Deployment

### 1. Local Production Build
```bash
ng build --configuration=production
ng serve --configuration=production
```

### 2. Test All Features
- [ ] User authentication
- [ ] Product browsing
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Responsive design
- [ ] Performance metrics

### 3. Lighthouse Audit
```bash
# Install Lighthouse
npm i -g lighthouse

# Run audit
lighthouse http://localhost:4200 --output html --output-path ./lighthouse-report.html
```

## 🚀 Deployment Scripts

### Automated Deployment
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Starting deployment..."

# Build
ng build --configuration=production

# Test
ng test --watch=false --browsers=ChromeHeadless

# Deploy to Vercel
vercel --prod

echo "✅ Deployment complete!"
```

### CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test -- --watch=false --browsers=ChromeHeadless
      
    - name: Build
      run: ng build --configuration=production
      
    - name: Deploy to Vercel
      run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 📈 Monitoring & Analytics

### Performance Monitoring
- Google PageSpeed Insights
- Web Vitals monitoring
- Real User Monitoring (RUM)

### Error Tracking
- Sentry for error tracking
- LogRocket for session replay
- Custom error logging

### Analytics
- Google Analytics 4
- User behavior tracking
- Conversion funnel analysis

## 🔄 Post-Deployment

### 1. Verify Deployment
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] API calls are successful
- [ ] Mobile responsiveness
- [ ] Performance metrics

### 2. Monitor Performance
- Check Core Web Vitals
- Monitor error rates
- Track user engagement
- Analyze conversion rates

### 3. Backup Strategy
- Regular database backups
- Code repository backups
- Environment configuration backups

## 🆘 Troubleshooting

### Common Issues

**Build Failures**
- Check TypeScript errors
- Verify all imports
- Check environment configuration

**Runtime Errors**
- Check browser console
- Verify API endpoints
- Check CORS configuration

**Performance Issues**
- Analyze bundle size
- Check image optimization
- Review caching strategy

### Support
- Check Angular documentation
- Review hosting platform docs
- Community forums and Stack Overflow

---

**🎉 Congratulations! Your FreshCart e-commerce platform is now live!**

For any issues or questions, please refer to the main README.md or create an issue in the repository.
