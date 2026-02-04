-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.inventory enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_line_items enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;

-- ============ PROFILES ============
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins can update all profiles"
  on public.profiles for update
  using (public.is_admin());

-- ============ INVENTORY ============
create policy "Anyone can view available/sold inventory"
  on public.inventory for select
  using (status in ('available', 'sold'));

create policy "Admins can view all inventory"
  on public.inventory for select
  using (public.is_admin());

create policy "Admins can insert inventory"
  on public.inventory for insert
  with check (public.is_admin());

create policy "Admins can update inventory"
  on public.inventory for update
  using (public.is_admin());

create policy "Admins can delete inventory"
  on public.inventory for delete
  using (public.is_admin());

-- ============ QUOTES ============
create policy "Clients can view own quotes"
  on public.quotes for select
  using (auth.uid() = client_id);

create policy "Clients can insert own quotes"
  on public.quotes for insert
  with check (auth.uid() = client_id);

create policy "Clients can update own draft quotes"
  on public.quotes for update
  using (auth.uid() = client_id and status = 'draft');

create policy "Admins can view all quotes"
  on public.quotes for select
  using (public.is_admin());

create policy "Admins can update all quotes"
  on public.quotes for update
  using (public.is_admin());

-- ============ QUOTE LINE ITEMS ============
create policy "Clients can view own quote line items"
  on public.quote_line_items for select
  using (
    exists (
      select 1 from public.quotes
      where quotes.id = quote_line_items.quote_id
      and quotes.client_id = auth.uid()
    )
  );

create policy "Admins can view all quote line items"
  on public.quote_line_items for select
  using (public.is_admin());

create policy "Admins can insert quote line items"
  on public.quote_line_items for insert
  with check (public.is_admin());

create policy "Admins can update quote line items"
  on public.quote_line_items for update
  using (public.is_admin());

create policy "Admins can delete quote line items"
  on public.quote_line_items for delete
  using (public.is_admin());

-- ============ ORDERS ============
create policy "Clients can view own orders"
  on public.orders for select
  using (auth.uid() = client_id);

create policy "Admins can view all orders"
  on public.orders for select
  using (public.is_admin());

create policy "Admins can insert orders"
  on public.orders for insert
  with check (public.is_admin());

create policy "Admins can update orders"
  on public.orders for update
  using (public.is_admin());

-- ============ MESSAGES ============
create policy "Users can view messages on own quotes"
  on public.messages for select
  using (
    exists (
      select 1 from public.quotes
      where quotes.id = messages.quote_id
      and quotes.client_id = auth.uid()
    )
  );

create policy "Users can view messages on own orders"
  on public.messages for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = messages.order_id
      and orders.client_id = auth.uid()
    )
  );

create policy "Users can send messages on own quotes"
  on public.messages for insert
  with check (
    auth.uid() = sender_id and (
      exists (
        select 1 from public.quotes
        where quotes.id = messages.quote_id
        and quotes.client_id = auth.uid()
      )
    )
  );

create policy "Users can send messages on own orders"
  on public.messages for insert
  with check (
    auth.uid() = sender_id and (
      exists (
        select 1 from public.orders
        where orders.id = messages.order_id
        and orders.client_id = auth.uid()
      )
    )
  );

create policy "Users can mark own messages as read"
  on public.messages for update
  using (
    sender_id != auth.uid() and (
      exists (
        select 1 from public.quotes
        where quotes.id = messages.quote_id
        and quotes.client_id = auth.uid()
      ) or exists (
        select 1 from public.orders
        where orders.id = messages.order_id
        and orders.client_id = auth.uid()
      )
    )
  );

create policy "Admins can view all messages"
  on public.messages for select
  using (public.is_admin());

create policy "Admins can send messages"
  on public.messages for insert
  with check (public.is_admin() and auth.uid() = sender_id);

create policy "Admins can update messages"
  on public.messages for update
  using (public.is_admin());
