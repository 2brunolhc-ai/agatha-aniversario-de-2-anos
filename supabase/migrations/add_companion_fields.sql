-- Adiciona os campos usados pelo novo formulário simplificado de confirmação
-- (acompanhantes e crianças). Não recria a tabela, não remove colunas
-- existentes e não apaga nenhuma confirmação já registrada.
-- Execute este arquivo uma única vez em bancos que já usam a versão anterior.

begin;

alter table if exists public.rsvps
  add column if not exists leva_acompanhante boolean,
  add column if not exists quantidade_acompanhantes integer,
  add column if not exists possui_criancas boolean;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'rsvp_quantidade_acompanhantes_range'
  ) then
    alter table public.rsvps
      add constraint rsvp_quantidade_acompanhantes_range
      check (quantidade_acompanhantes is null or quantidade_acompanhantes between 0 and 20);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'rsvp_children_within_companions'
  ) then
    alter table public.rsvps
      add constraint rsvp_children_within_companions
      check (
        children is null
        or quantidade_acompanhantes is null
        or children <= quantidade_acompanhantes
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'rsvp_total_matches_companions'
  ) then
    alter table public.rsvps
      add constraint rsvp_total_matches_companions
      check (
        attendance_status = 'no'
        or leva_acompanhante is null
        or (leva_acompanhante is not true and total_guests = 1)
        or (leva_acompanhante is true and total_guests = 1 + coalesce(quantidade_acompanhantes, 0))
      );
  end if;
end $$;

-- A política antiga não valida o novo campo e precisa ser recriada.
drop policy if exists "public can insert valid rsvps" on public.rsvps;
create policy "public can insert valid rsvps"
on public.rsvps
for insert
to anon, authenticated
with check (
  char_length(full_name) between 3 and 100
  and attendance_status in ('yes', 'no')
  and coalesce(total_guests, 0) between 0 and 20
  and coalesce(adults, 0) between 0 and 20
  and coalesce(children, 0) between 0 and 20
  and coalesce(quantidade_acompanhantes, 0) between 0 and 20
);

commit;

-- Confirmações registradas antes desta migração continuam intactas: os três
-- novos campos ficam nulos para elas (não é possível saber retroativamente
-- se houve acompanhantes) e a coluna "adults" continua no formato antigo.
-- IDs, nomes, respostas, quantidades já salvas, mensagens e datas não são
-- alterados nem apagados. A nova constraint "rsvp_total_matches_companions"
-- exclui explicitamente as linhas com leva_acompanhante nulo (dados antigos),
-- então nenhuma confirmação existente é rejeitada por essa migração.
