# Kran Montaj Admin Panel

This admin panel allows you to manage all content on the Kran Montaj website, including:

- Services
- Catalog items
- General content (text and images)
- Contact information

## Setup Instructions

### 1. Supabase Setup

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Use the provided JWT token to connect to your project:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jd3hheXlzdW9zbGhzcHNubmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNDI1NTYsImV4cCI6MjA2MjYxODU1Nn0.a55WRVX8xbrR0m6sNBLRETMnd35cA-jjWNqXmc5W-wA
   ```
3. Create database tables by running the SQL commands in `supabase-setup.sql` in the Supabase SQL Editor
4. Create an 'images' storage bucket in the Supabase Storage section
5. Set appropriate public access policies for the storage bucket

### 2. Environment Variables

Make sure your environment variables are set up in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```

### 3. Admin Account

A default admin account is created by the setup script with these credentials:

- Email: admin@example.com
- Password: admin123

**IMPORTANT**: Change these credentials after your first login for security!

## Usage

### Accessing the Admin Panel

1. Navigate to `/admin` on your website
2. Log in using your admin credentials
3. Use the sidebar navigation to access different sections

### Managing Content

#### Services
- Add, edit, and delete services
- Upload images for each service
- Control the order of services

#### Catalog
- Manage catalog items by category
- Add detailed specifications for each item
- Upload product images
- Set price information

#### General Content
- Edit text throughout the website
- Replace images on different pages
- Organize content by section

#### Contacts
- Manage contact information (phone, email, address)
- Set business hours
- Add social media links

### Best Practices

1. **Images**:
   - Use optimized images (JPG/PNG)
   - Recommended dimensions:
     - Services: 800×600px
     - Catalog: 800×800px
     - General: Depends on placement

2. **Text Content**:
   - Keep titles concise (60 characters or less)
   - Use formatting in description fields when available

3. **Organization**:
   - Use the "order" field to control display sequence
   - Use consistent categories for catalog items

## Troubleshooting

If you encounter issues:

1. Check your browser console for errors
2. Verify Supabase connection settings
3. Ensure your tables are set up correctly
4. Confirm storage bucket permissions

For additional help, contact support.

## Security Notes

- Your admin panel is protected by authentication
- Only authenticated users can modify content
- Public users can only read content
- Always use strong passwords
- Change the default admin password immediately 