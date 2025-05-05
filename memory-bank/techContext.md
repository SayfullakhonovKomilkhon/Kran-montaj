# Technical Context

## Core Technologies
1. **Next.js**: React framework for building web applications
   - Version: Latest (based on the project setup)
   - Features: App Router, Server Components, Static Site Generation
2. **React**: JavaScript library for building user interfaces
   - Used within the Next.js framework
3. **TypeScript**: Typed superset of JavaScript
   - Used for type safety and improved developer experience
4. **ESLint**: Code quality tool
   - Configured through eslint.config.mjs

## Development Setup
1. **Node.js**: JavaScript runtime environment
   - Required for running the Next.js application
2. **npm/yarn/pnpm**: Package managers
   - Used for managing dependencies and running scripts
3. **Git**: Version control system
   - Used for tracking changes to the codebase

## Frontend Stack
1. **CSS**: Styling approach
   - Likely using CSS Modules, Tailwind CSS, or a CSS-in-JS solution
2. **PostCSS**: CSS post-processor
   - Configured through postcss.config.mjs
3. **Fonts**: Using next/font
   - Geist font family is configured (from Vercel)

## Development Tools
1. **VS Code/Cursor**: Recommended IDE for development
2. **Chrome DevTools**: For debugging and performance monitoring
3. **Lighthouse**: For performance and accessibility auditing

## Technical Constraints
1. **Browser Compatibility**: Must support modern browsers
2. **Accessibility**: Must meet WCAG guidelines
3. **Performance**: Must achieve good Lighthouse scores
4. **SEO**: Must be optimized for search engines
5. **Responsive Design**: Must work well on all device sizes

## Deployment
1. **Vercel**: Recommended platform for deploying Next.js applications
   - Provides seamless integration with Next.js features
   - Offers global CDN for fast content delivery

## Configuration Files
1. **package.json**: Project dependencies and scripts
2. **tsconfig.json**: TypeScript configuration
3. **next.config.ts**: Next.js configuration
4. **eslint.config.mjs**: ESLint configuration
5. **postcss.config.mjs**: PostCSS configuration

## Note
This technical context is based on the initial project setup. It should be updated as the project evolves and specific technologies are integrated. 