-- Remove o campo de telefone sem recriar a tabela e sem apagar confirmações.
-- Execute este arquivo uma única vez em bancos que já usam a versão anterior.

begin;

-- A política antiga dependia da coluna removida e precisa ser recriada.
drop policy if exists "public can insert valid rsvps" on public.rsvps;

alter table if exists public.rsvps
  drop column if exists phone;

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
);

commit;

-- A operação acima altera somente a estrutura da coluna removida.
-- IDs, nomes, respostas, quantidades, mensagens e datas existentes permanecem intactos.
