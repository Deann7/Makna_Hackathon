create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  phone_number text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

create policy "Users can update their own phone number" on profiles
  for update using ((select auth.uid()) = id);

-- Trigger function untuk membuat profile otomatis saat user baru registrasi
create or replace function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username, phone_number)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'phone_number'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger jika sudah ada, lalu buat ulang
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage untuk avatars
insert into storage.buckets (id, name)
  values ('avatars', 'avatars')
  on conflict (id) do nothing;

-- Storage policies
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');
  
create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

-- Fungsi untuk validasi registrasi user
create or replace function public.register_user(
  username text,
  phone_number text,
  password text,
  email text,
  full_name text default null
) returns json
language plpgsql
security definer
as $$
declare
  user_id uuid;
  result json;
begin
  -- Validasi input
  if char_length(username) < 3 then
    return json_build_object('error', 'Username must be at least 3 characters long');
  end if;
  
  if char_length(password) < 6 then
    return json_build_object('error', 'Password must be at least 6 characters long');
  end if;
  
  -- Cek apakah username sudah digunakan
  if exists(select 1 from profiles where profiles.username = register_user.username) then
    return json_build_object('error', 'Username already taken');
  end if;
  
  -- Validasi berhasil, registrasi akan dilakukan melalui client
  return json_build_object('success', true, 'message', 'User can be registered');
exception
  when others then
    return json_build_object('error', 'Registration failed: ' || SQLERRM);
end;
$$;

-- Fungsi untuk update profile
create or replace function public.update_user_profile(
  user_id uuid,
  new_username text default null,
  new_full_name text default null,
  new_phone_number text default null,
  new_avatar_url text default null,
  new_website text default null
) returns json
language plpgsql
security definer
as $$
begin
  -- Pastikan user hanya bisa update profile sendiri
  if user_id != auth.uid() then
    return json_build_object('error', 'Unauthorized');
  end if;
  
  -- Validasi username jika diubah
  if new_username is not null and char_length(new_username) < 3 then
    return json_build_object('error', 'Username must be at least 3 characters long');
  end if;
  
  -- Cek apakah username baru sudah digunakan (jika diubah)
  if new_username is not null and new_username != (select username from profiles where id = user_id) then
    if exists(select 1 from profiles where username = new_username) then
      return json_build_object('error', 'Username already taken');
    end if;
  end if;
  
  -- Update profile
  update profiles set
    username = coalesce(new_username, username),
    full_name = coalesce(new_full_name, full_name),
    phone_number = coalesce(new_phone_number, phone_number),
    avatar_url = coalesce(new_avatar_url, avatar_url),
    website = coalesce(new_website, website),
    updated_at = now()
  where id = user_id;
  
  return json_build_object('success', true, 'message', 'Profile updated successfully');
exception
  when others then
    return json_build_object('error', 'Update failed: ' || SQLERRM);
end;
$$;

-- ✅ SCRIPT SELESAI
-- Email confirmation setting harus diatur melalui Supabase Dashboard:
-- Authentication → Settings → uncheck "Enable email confirmations"
