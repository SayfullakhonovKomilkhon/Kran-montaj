# System Patterns

## Architecture Overview
The Kran Montaj application follows the Next.js App Router architecture pattern, which is a file-system based router built on React Server Components.

## Key Technical Decisions
1. **Next.js App Router**: Using the latest Next.js App Router for improved performance and developer experience
2. **TypeScript**: Employing TypeScript for type safety and improved developer experience
3. **Server Components**: Leveraging React Server Components for optimized rendering and reduced client-side JavaScript
4. **Static Site Generation**: Utilizing static generation where possible for optimal performance
5. **Dynamic Routes**: Implementing dynamic routes for content that requires server-side rendering

## Design Patterns
1. **Component Composition**: Building UI from reusable, composable components
2. **Page Layout Pattern**: Using nested layouts for consistent page structure
3. **Container/Presentational Pattern**: Separating data fetching from presentation where appropriate
4. **Responsive Design Pattern**: Implementing adaptive layouts for different device sizes
5. **Progressive Enhancement**: Building core functionality that works without JavaScript, then enhancing with client-side features

## Component Relationships
1. **Layouts**: Shared layouts for consistent page structure
   - Root Layout: Applied to all pages
   - Section Layouts: Applied to specific sections (e.g., services, projects)
2. **Pages**: Content for specific routes
3. **Components**: Reusable UI elements
   - UI Components: Buttons, forms, cards, etc.
   - Feature Components: More complex, domain-specific components
4. **Hooks**: Shared stateful logic

## Critical Implementation Paths
1. **Routing**: Next.js App Router handles navigation and page rendering
2. **Data Fetching**: Server Components fetch data during rendering
3. **Styling**: Using CSS modules or a CSS-in-JS solution for component styling
4. **Form Handling**: Managing user input and form submissions
5. **SEO Optimization**: Implementing metadata for search engine visibility

## State Management
1. **Server State**: Data fetched on the server side
2. **Client State**: Interactive elements managed with React hooks
3. **Form State**: User input managed with form libraries if needed

## Note
This document represents the initial system architecture and patterns based on Next.js best practices. It should be updated as the implementation progresses and specific architectural decisions are made. 