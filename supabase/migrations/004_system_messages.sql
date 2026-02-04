-- Allow system messages with no sender
alter table public.messages alter column sender_id drop not null;
