[![CI](https://github.com/ricardo-camilo-programador-frontend-web/angular-chronicles-part-1/actions/workflows/ci.yml/badge.svg)](https://github.com/ricardo-camilo-programador-frontend-web/angular-chronicles-part-1/actions)
# 🍽 Food Hut - Angular Chronicles - Part 1

## 🎯 Project Overview
I developed this project to explore Angular's ecosystem and compare it with my Vue.js and React experience. The project showcases several key Angular features and modern web development practices.

## 🔗 Quick Links
- [Live Preview](https://food-hut-angular-chronicles-1.netlify.app/)
- [GitHub Repository](https://github.com/ricardo564/angular-chronicles-part-1)
- [Design Inspiration](https://www.figma.com/community/file/1103820487891554272)
- [Report a Bug](https://github.com/ricardo564/angular-chronicles-part-1/issues)

## 🛠 Key Technical Implementations
- ⚡ Progressive Web App (PWA) capabilities
- 🔄 Angular Router for seamless navigation
- 🎨 TailwindCSS for responsive design
- 📱 Mobile-first approach
- 🔍 Dynamic content rendering with structural directives
- 🎯 Conditional rendering and loop optimization

## ⚡ Performance Optimization (Issue #9)
- 🏆 **Lighthouse Score**: Target 100/100 on all metrics
  - **Performance**: 90-100
  - **Accessibility**: 95-100
  - **Best Practices**: 90-100
  - **SEO**: 95-100
- 📦 **Bundle Size**: 345.29 kB initial (budget: 400 kB)
  - Lazy loading implemented for all routes
  - Code splitting for better caching
- 🖼️ **Image Optimization**: WebP/AVIF support, lazy loading, LCP optimization
- ♿ **Accessibility**: WCAG AA contrast ratios, ARIA labels, skip-to-content link
- 🔍 **SEO**: Meta tags, Open Graph, Twitter Cards, JSON-LD structured data
- 📄 **PWA**: Offline support with service worker caching strategies
- ✅ **Security**: Pre-commit security scans, no `any` types, strict TypeScript

## 📚 Learning Outcomes
- 🏗 Gained hands-on experience with Angular's component architecture
- 📘 Implemented TypeScript best practices
- 🎨 Mastered Angular's template syntax
- 🔄 Enhanced understanding of rendering conditionals
- 📦 Improved code organization skills

## 🎨 Design Credits
UI/UX inspired by [Food Hut](https://www.figma.com/community/file/1103820487891554272) by [Kamran Ali](https://www.figma.com/@KamranAlime), adapted and implemented with modern web technologies.

#Angular #PWA #WebDev #FrontendDevelopment #TypeScript #TailwindCSS
## 🚀 Technologies
[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)](https://rxjs.dev)
[![NgRx](https://img.shields.io/badge/NgRx-BA2BD2?style=for-the-badge&logo=redux&logoColor=white)](https://ngrx.io)

## 🌟 Connect & Follow
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ricardo-camilo-web/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ricardo564)

## 🤝 How to Contribute

## 🔧 Environment Variables

All environment variables are documented in `.env.example`. Since this is an Angular project, values are centralized in `src/configs/env.ts` (not loaded from `.env` at runtime).

| Variable | Description |
|---|---|
| `VITE_PORTFOLIO_URL` | Portfolio website URL |
| `VITE_GITHUB_URL` | GitHub profile URL |
| `VITE_LINKEDIN_URL` | LinkedIn profile URL |
| `VITE_X_URL` | X (Twitter) profile URL |
| `VITE_INSTAGRAM_URL` | Instagram profile URL |
| `VITE_YOUTUBE_URL` | YouTube channel URL |
| `VITE_99FREELAS_URL` | 99Freelas profile URL |
| `VITE_WORKANA_URL` | Workana profile URL |
| `VITE_BUYMEACOFFEE_URL` | Buy Me a Coffee page URL |
| `VITE_FACEBOOK_URL` | Facebook profile URL |
| `VITE_FIGMA_URL` | Figma profile URL |
| `VITE_CONTACT_EMAIL` | Contact email address |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics measurement ID |
| `VITE_GTM_ID` | Google Tag Manager container ID |
| `VITE_COUNTER_DEV_ID` | Counter.dev site ID |

To update any value, edit `src/configs/env.ts`.

## 🤝 Contributing

1. 🍴 Fork the project
2. 🌱 Create your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. ✍ Make your changes
4. 📝 Commit using Gitmoji for categorization
   ```bash
   git commit -m "✨ feat: Add amazing feature"
   ```
5. 📤 Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
6. 🔄 Open a Pull Request

### 📋 Prerequisites

- Node.js 18.x or higher
- pnpm 8.x or higher
- Angular CLI 19.2.0

### 🏃♂ Running Locally

1. Clone the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/angular-chronicles-part-1.git
   ```
2. Install dependencies
   ```bash
   pnpm install
   ```
3. Start the development server
   ```bash
   pnpm start
   ```
4. Navigate to `http://localhost:4200`

### 🧪 Running Tests

```bash
# Run tests with coverage
pnpm run test:coverage

# Run SonarQube analysis (requires SONAR_TOKEN and SONAR_HOST_URL environment variables)
pnpm run sonar

# Or using Docker (recommended for CI/CD)
docker run --rm \
  -v "$PWD:/usr/src" \
  -w /usr/src \
  -e SONAR_TOKEN="$SONAR_TOKEN" \
  -e SONAR_HOST_URL="$SONAR_HOST_URL" \
  sonarsource/sonar-scanner-cli:latest \
  -Dsonar.token="$SONAR_TOKEN" \
  -Dsonar.host.url="$SONAR_HOST_URL"
```

### 🔍 SonarQube Code Quality Analysis

This project integrates with SonarQube Community Edition for continuous code quality analysis.

#### Setup Instructions

1. **Local Analysis**:
   ```bash
   # Set environment variables
   export SONAR_TOKEN="your_token_here"
   export SONAR_HOST_URL="http://localhost:9000"

   # Run analysis
   pnpm run sonar
   ```

2. **CI/CD Integration**:
   - Configure GitHub Secrets: `SONAR_TOKEN` and `SONAR_HOST_URL`
   - Analysis runs automatically on push/PR to main/master/develop branches
   - See `.github/workflows/sonarqube.yml` for details

#### Dashboard Access

- **SonarQube**: http://localhost:9000/dashboard?id=angular-chronicles-part-1
- **Project Key**: `angular-chronicles-part-1`

#### Configuration Files

- `sonar-project.properties` - SonarQube configuration
- `.github/workflows/sonarqube.yml` - CI/CD workflow

For more details, see [Issue #11](https://github.com/ricardo-camilo-programador-frontend-web/angular-chronicles-part-1/issues/11)

### 🧪 Running Tests
