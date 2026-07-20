-- Compatibilidade com a nova lógica do formulário.
-- A pessoa que recebeu o convite conta como 1. A quantidade de acompanhantes
-- é derivada de total_guests - 1, portanto nenhuma confirmação antiga é perdida.

alter table public.rsvps
  drop constraint if exists rsvp_guest_totals_match;

alter table public.rsvps
  add constraint rsvp_guest_totals_match check (
    (attendance_status = 'no' and coalesce(total_guests, 0) = 0)
    or (
      attendance_status = 'yes'
      and total_guests between 1 and 20
      and total_guests = coalesce(adults, 0) + coalesce(children, 0)
      and coalesce(children, 0) <= greatest(total_guests - 1, 0)
    )
  );

comment on column public.rsvps.adults is
  'Quantidade de adultos presentes, incluindo o convidado principal quando ele for adulto.';
comment on column public.rsvps.children is
  'Quantidade de crianças entre os acompanhantes; já incluídas em total_guests.';
comment on column public.rsvps.total_guests is
  'Total confirmado: convidado principal (1) + acompanhantes.';
