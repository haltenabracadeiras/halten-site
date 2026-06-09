alter table representatives
  add column if not exists email text,
  add column if not exists regiao text;
