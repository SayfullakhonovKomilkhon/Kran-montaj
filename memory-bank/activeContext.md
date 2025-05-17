# Active Context

## Current Work Focus

The project is in active development with key pages and components implemented. We have created the main structure of the site and implemented core pages including Home, Services, Catalog, Contacts, and About. The About page has been recently added to present company information, values, and advantages. We have now integrated Supabase to dynamically load service and product data on the home page, as well as services on the services page. Product cards now display pricing information from the database.

Currently, we're focusing on refining the comprehensive admin panel that's now based on Supabase authentication for managing categories, products, and services with the appropriate relationships and image uploads. The main data structure with categories is now implemented, allowing proper organization and filtering of products and services. We've also enhanced the image management with advanced features like dual input methods and proper storage management.

We recently expanded the admin panel with a dedicated products management interface and a page content management system. This allows for easy editing of product/service cards with image uploads and editing of page section headers and content across the site. The page content feature is backed by a new database table that stores content by page and section, making it easy to dynamically update text content throughout the site.

## Recent Changes

1. Project initialization with Next.js
2. Core pages implemented:
   - Home page with video hero, service sections, and catalog preview
   - Services page with detailed service cards
   - Catalog page with product listings
   - Contact page with form and contact details
   - About page showcasing company information, values, and advantages
3. Components created:
   - Responsive navigation with mobile support
   - Footer with contact information and links
   - Hero sections with video and text
   - Service cards that dynamically load data from Supabase
   - Product cards that dynamically load data from Supabase with pricing information
   - Experience counter section
4. Supabase integration:
   - Connected services components to Supabase database
   - Connected product components to Supabase database
   - Implemented data fetching with error handling and loading states
   - Limited the home page to show only 3 services and 3 products
   - Added product price display from Supabase data
5. Admin panel implementation:
   - Set up Supabase authentication provider with proper signInWithPassword
   - Created login page with authentication flow
   - Implemented session guards on all admin routes
   - Dashboard page with overview of content
   - Created categories management with CRUD operations
   - Updated products management to link with categories and store specifications as JSON
   - Updated services management to link with categories
   - Implemented proper image upload to 'img' bucket with organized paths
   - Added filtering by categories in products and services admin
   - Enhanced image handling with dual input methods (upload/direct URL)
   - Added image deletion from storage when updating or deleting items
   - Improved image preview for better UX
   - Created a dedicated products admin page for product card management
   - Implemented a new page content management section for editing content by page/section
   - Added a new SQL table page_content to store dynamic page content

## Next Steps

1. Refine admin sections:
   - Complete testing of data relationships and CRUD operations
   - Add additional error handling and validation
   - Improve UX for filtering and category selection
   - Ensure proper mobile display of admin forms
   - Integrate page content with frontend pages
2. Complete remaining Supabase integration for dynamic content
3. Implement form handling logic for the contact form
4. Add SEO metadata to all pages
5. Performance optimizations (image loading, code splitting)
6. Accessibility improvements
7. Testing across different browsers and devices

## Active Decisions and Considerations

1. **Admin Panel Structure**: Successfully implemented categories, products, and services management according to the context document
2. **Data Relationships**: Using category_id as a foreign key in products and services tables with proper views for displaying data
3. **Image Handling**: Using Supabase storage with the 'img' bucket and organized paths (products/, services/) with dual input methods
4. **Content Management**: Created a dedicated page_content table to store and manage content by page and section
5. **Design System**: Using TailwindCSS for consistent styling across the site
6. **Image Handling**: Using Next.js Image component for optimization
7. **Form Handling**: Need to implement server-side handling for contact forms
8. **SEO Strategy**: Meta tags and structured data to be implemented
9. **Analytics**: Planning to add analytics for tracking user behavior

## Important Patterns and Preferences

1. Admin Panel Patterns:

   - Session guard on all admin routes
   - Consistent UI components (tables, forms, modals)
   - Image upload with preview
   - JSON handling for complex data structures (characteristics)
   - Category filtering and relationships
   - Multiple image input methods with appropriate validation
   - Proper image storage management including deletion
   - Page content management organized by page and section

2. Component Organization:

   - Reusable components in `app/components`
   - Page-specific components within their respective page folders
   - Shared utilities in `app/lib`

3. Styling Approach:

   - TailwindCSS for all styling
   - Consistent color palette throughout the site (amber primary, slate secondary)
   - Responsive design with mobile-first approach
   - Animation and transitions for interactive elements

4. Data Fetching:

   - Using Supabase client for frontend data fetching
   - Implementing loading and error states for all data requests
   - Console logging for debugging during development
   - Limiting results on home page to show previews

5. Code Structure:
   - TypeScript interfaces for all data structures
   - Client components marked with 'use client' directive
   - Error handling with descriptive error messages

## Learnings and Project Insights

1. Next.js App Router provides good structure but requires attention to client/server component boundaries
2. TailwindCSS speeds up development but needs organization to prevent class bloat
3. Responsive design requires testing at multiple breakpoints
4. Supabase provides an effective solution for dynamic data without requiring complex backend setup
5. Admin panel authentication requires careful session management and security considerations
6. Managing relationships between tables requires well-structured views and proper foreign key handling
7. JSON data storage in Supabase is powerful but requires careful parsing and validation in the UI
8. Proper image management requires consideration of storage paths, deletion, and multiple input methods
9. Separating page content into a dedicated table makes content management more flexible and user-friendly

## Note

This active context document will be regularly updated as work on the project evolves, decisions are made, and new insights are gained.
