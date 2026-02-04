-- ============================================
-- 003: Blog Posts & Gallery Items
-- ============================================

-- Blog Posts
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null,
  date date not null default current_date,
  author text not null default 'Woodly Team',
  category text,
  image text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_posts_slug on public.blog_posts (slug);
create index if not exists idx_blog_posts_published on public.blog_posts (published, date desc);

-- Gallery Items
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_gallery_items_published on public.gallery_items (published, sort_order);

-- Triggers for updated_at
create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function update_updated_at();

create trigger gallery_items_updated_at
  before update on public.gallery_items
  for each row execute function update_updated_at();

-- ============================================
-- RLS Policies
-- ============================================

alter table public.blog_posts enable row level security;
alter table public.gallery_items enable row level security;

-- Blog Posts: public read for published
create policy "Published blog posts are viewable by everyone"
  on public.blog_posts for select
  using (published = true);

-- Blog Posts: admin full access
create policy "Admins can manage all blog posts"
  on public.blog_posts for all
  using (is_admin())
  with check (is_admin());

-- Gallery Items: public read for published
create policy "Published gallery items are viewable by everyone"
  on public.gallery_items for select
  using (published = true);

-- Gallery Items: admin full access
create policy "Admins can manage all gallery items"
  on public.gallery_items for all
  using (is_admin())
  with check (is_admin());
