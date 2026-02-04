-- Enums
create type public.user_role as enum ('client', 'admin');
create type public.inventory_status as enum ('available', 'sold', 'reserved', 'draft');
create type public.power_type as enum ('solar', 'battery', 'electric');
create type public.quote_status as enum ('draft', 'submitted', 'reviewing', 'quoted', 'accepted', 'rejected', 'expired');
create type public.order_status as enum ('confirmed', 'materials', 'building', 'finishing', 'ready', 'shipped', 'delivered', 'completed');

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'client',
  full_name text,
  email text not null,
  phone text,
  address_line1 text,
  address_line2 text,
  address_city text,
  address_state text,
  address_zip text,
  property_type text,
  property_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Inventory
create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  price integer not null default 0,
  power public.power_type not null default 'solar',
  status public.inventory_status not null default 'draft',
  images text[] not null default '{}',
  dimensions text not null default '',
  wood text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Quotes
create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  status public.quote_status not null default 'draft',
  wood_type text,
  power_source public.power_type,
  dimensions text,
  quantity integer not null default 1,
  custom_notes text,
  admin_notes text,
  quoted_total integer,
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Quote Line Items
create table public.quote_line_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  description text not null,
  quantity integer not null default 1,
  unit_price integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id),
  client_id uuid not null references public.profiles(id) on delete cascade,
  status public.order_status not null default 'confirmed',
  status_note text,
  estimated_completion timestamptz,
  tracking_number text,
  delivery_address text,
  total integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Messages (linked to either a quote OR an order, not both)
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references public.quotes(id) on delete cascade,
  order_id uuid references public.orders(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  constraint messages_quote_or_order check (
    (quote_id is not null and order_id is null) or
    (quote_id is null and order_id is not null)
  )
);

-- Indexes
create index idx_quotes_client_id on public.quotes(client_id);
create index idx_quotes_status on public.quotes(status);
create index idx_orders_client_id on public.orders(client_id);
create index idx_orders_status on public.orders(status);
create index idx_orders_quote_id on public.orders(quote_id);
create index idx_messages_quote_id on public.messages(quote_id);
create index idx_messages_order_id on public.messages(order_id);
create index idx_messages_sender_id on public.messages(sender_id);
create index idx_inventory_slug on public.inventory(slug);
create index idx_inventory_status on public.inventory(status);
create index idx_quote_line_items_quote_id on public.quote_line_items(quote_id);

-- Helper function: check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$ language sql security definer;

-- Trigger: auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger: auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.inventory
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.quotes
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.orders
  for each row execute function public.update_updated_at();
