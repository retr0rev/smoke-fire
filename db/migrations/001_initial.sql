create extension if not exists "uuid-ossp";

create table restaurants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo_url text,
  favicon_url text,
  description_en text,
  description_ar text,
  phone text,
  whatsapp text,
  email text,
  address_en text,
  address_ar text,
  google_maps_url text,
  latitude float,
  longitude float,
  currency text not null default 'S.P',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table categories (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name_en text not null,
  name_ar text not null,
  description_en text,
  description_ar text,
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  slug text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(restaurant_id, slug)
);

create index idx_categories_restaurant on categories(restaurant_id);
create index idx_categories_sort on categories(sort_order);
create index idx_categories_slug on categories(restaurant_id, slug);
create index idx_categories_active on categories(restaurant_id, is_active);

create table menu_items (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references categories(id) on delete cascade,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name_en text not null,
  name_ar text not null,
  description_en text not null default '',
  description_ar text not null default '',
  price decimal(10,2) not null,
  image_url text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  is_popular boolean not null default false,
  is_spicy boolean not null default false,
  sort_order int not null default 0,
  ingredients_en text[],
  ingredients_ar text[],
  allergens_en text[],
  allergens_ar text[],
  calories int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_menu_items_category on menu_items(category_id);
create index idx_menu_items_restaurant on menu_items(restaurant_id);
create index idx_menu_items_sort on menu_items(sort_order);
create index idx_menu_items_available on menu_items(restaurant_id, is_available);

create table restaurant_socials (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  platform text not null,
  url text not null,
  is_enabled boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_socials_restaurant on restaurant_socials(restaurant_id);
create index idx_socials_platform on restaurant_socials(restaurant_id, platform);

create table opening_hours (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  open_time time,
  close_time time,
  is_closed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(restaurant_id, day_of_week)
);

create index idx_hours_restaurant on opening_hours(restaurant_id);
create index idx_hours_day on opening_hours(restaurant_id, day_of_week);

create table media (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  url text not null,
  alt_text text,
  file_name text,
  file_size int,
  mime_type text,
  uploaded_at timestamptz not null default now()
);

create index idx_media_restaurant on media(restaurant_id);

create table promotions (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  title_en text not null,
  title_ar text not null,
  image_url text,
  link_url text,
  is_active boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_promotions_restaurant on promotions(restaurant_id);
create index idx_promotions_active on promotions(restaurant_id, is_active);

alter table restaurants enable row level security;
alter table categories enable row level security;
alter table menu_items enable row level security;
alter table restaurant_socials enable row level security;
alter table opening_hours enable row level security;
alter table media enable row level security;
alter table promotions enable row level security;

create policy "Public read restaurants" on restaurants for select to anon using (true);
create policy "Public read categories" on categories for select to anon using (is_active = true);
create policy "Public read menu_items" on menu_items for select to anon using (is_available = true);
create policy "Public read socials" on restaurant_socials for select to anon using (is_enabled = true);
create policy "Public read opening_hours" on opening_hours for select to anon using (true);
create policy "Public read promotions" on promotions for select to anon using (is_active = true);
