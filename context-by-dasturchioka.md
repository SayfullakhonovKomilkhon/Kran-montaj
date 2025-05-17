
# 🛠️ Admin Panel Guide for "Kran Montaj Servis"

> 📌 Simple and clean instructions for Cursor — no folder structure changes.

---

## 📦 Project Context

This admin panel is for managing **categories**, **products**, and **services** for a company that installs and services lifting equipment.

From the about page:
> "Мы предлагаем полный спектр услуг по изготовлению и обслуживанию грузоподъемного оборудования"

---

## 🧱 Supabase Table Definitions

### ✅ `categories`

```sql
create table public.categories (
  id uuid primary key default extensions.uuid_generate_v4(),
  name text not null unique
);
```

### ✅ `products`

```sql
create table public.products (
  id uuid primary key default extensions.uuid_generate_v4(),
  title text not null,
  description text,
  price text,
  image_url text,
  characteristics jsonb,
  category_id uuid references categories(id) on delete set null
);
```

### ✅ `services`

```sql
create table public.services (
  id uuid primary key default extensions.uuid_generate_v4(),
  name text not null unique,
  description text,
  image_url text,
  category_id uuid references categories(id) on delete set null
);
```

### ✅ `users`

```sql
create table public.users (
  id uuid primary key default extensions.uuid_generate_v4(),
  email text not null unique,
  password text not null,
  full_name text not null,
  last_login timestamp
);
```

---

## 👁️ Supabase Views

### `products_with_category`

```sql
create view public.products_with_category as
select
  p.id,
  p.title,
  p.description,
  p.price,
  p.image_url,
  p.characteristics,
  p.category_id,
  c.name as category_name
from
  products p
  left join categories c on c.id = p.category_id;
```

### `services_with_category`

```sql
create view public.services_with_category as
select
  s.id,
  s.name,
  s.description,
  s.image_url,
  s.category_id,
  c.name as category_name
from
  services s
  left join categories c on c.id = s.category_id;
```

### `users_with_auth`

```sql
create view public.users_with_auth as
select
  u.id,
  u.email as login,
  u.password,
  u.full_name,
  a.last_sign_in_at as last_login
from
  users u
  left join auth.users a on u.id = a.id;
```

---

## 🎛️ Admin Panel Functionality (What Cursor Should Do)

### 📁 1. Categories Management

- Display all categories
- Add a new category (`name`)
- Edit and delete existing ones

**POST /categories example:**

```json
{
  "name": "Грузоподъемные краны"
}
```

---

### 📦 2. Products Management

Use `products_with_category` view to list.

#### Product Form Fields:

- `title` (required)
- `description` (optional)
- `price` (optional)
- `image_url` (optional, uploaded or external)
- `category_id` (dropdown from categories)
- `characteristics` (key-value pairs, stored as JSON)

---

### 🛠️ 3. Services Management

Use `services_with_category` view.

#### Service Form Fields:

- `name` (required)
- `description` (optional)
- `image_url` (optional)
- `category_id` (dropdown)

---

## 🖼️ Image Upload Handling

Use Supabase **storage bucket** named: `img`

### Option 1: Upload file

```ts
const { data, error } = await supabase.storage
  .from('img')
  .upload('services/or-products/filename.jpg', file);
```

Then get the public URL:

```ts
const url = supabase.storage
  .from('img')
  .getPublicUrl('services/or-products/filename.jpg').data.publicUrl;
```

Set this URL to `image_url` field in database.

### Option 2: Paste external image URL

User can just paste a valid image URL manually instead of uploading.

---

## 🧠 Notes for Cursor

✅ Do:

- Keep UI minimal and clear
- Use views for easier admin display
- Provide dropdowns for categories
- Allow upload OR external image input
- Keep current project structure — **don’t touch folders**

🚫 Don’t:

- Overcomplicate logic
- Add authentication or routing changes
- Refactor files or folder layout

---

## 💡 Example `characteristics` JSON

```json
{
  "load_capacity": "5 tons",
  "height": "12 meters",
  "brand": "KONE"
}
```

Cursor should provide a UI to enter these as key-value fields and convert to JSON before saving.

---

## 🎬 Quote of the Guide

> **"With great power... comes great responsibility."**  
> — *Uncle Ben, Spider-Man*

---
