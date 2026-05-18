-- Helpers: updated_at trigger function + sort_order reorder RPC.
-- Applied first; downstream migrations reuse these.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.reorder_by_sort_order(p_table text, p_items text)
returns void
language plpgsql
as $$
declare
  item json;
begin
  for item in select * from json_array_elements(p_items::json) loop
    execute format(
      'update %I set sort_order = %L where id = %L',
      p_table,
      (item->>'sort_order')::int,
      (item->>'id')::uuid
    );
  end loop;
end;
$$;
