# Alterações realizadas — convite da Ágatha

## Localização
- Coordenadas oficiais: `15°44'29.5"S 48°23'53.0"W`
- Decimal: `-15.7415278, -48.3980556`
- Google Maps, Waze e mapa incorporado usam exatamente o mesmo ponto.

## Confirmação de presença
- Removidos os campos editáveis "Total de pessoas" e "Adultos".
- O convidado principal conta automaticamente como 1 pessoa.
- O formulário pergunta se haverá acompanhantes.
- A quantidade de crianças só aparece quando necessário.
- Crianças já fazem parte dos acompanhantes e não são somadas novamente.
- O total é mostrado apenas como informação.
- Quem recusar presença fica com total 0 e pode deixar um recado.

## Compatibilidade dos dados
- O banco atual continua funcionando sem apagar confirmações antigas.
- `adults` continua sendo preenchido internamente para compatibilidade.
- O painel calcula acompanhantes como `total_guests - 1`.
- A migração `supabase/migrations/20260720_rsvp_companion_logic.sql` adiciona validações mais rígidas, sem alterar os registros existentes.

## Verificações executadas
- `npm run build`: aprovado.
- `npm run lint`: sem erros; existe somente um aviso antigo em `opengraph-image.tsx`.

## Publicação
- Configure as variáveis usando `.env.example`.
- O arquivo `.env.local` não foi incluído neste pacote para não expor credenciais.

## Atalho de localização no início
- Adicionado um card logo após a abertura do convite.
- Ao tocar no card, a página rola suavemente até a seção de localização.
- O atalho foi adaptado para celular e não abre o mapa imediatamente; ele leva primeiro ao endereço, Google Maps e Waze.

## Correção do campo de quantidade de crianças

- O campo agora inicia vazio, exibindo `1` apenas como exemplo em cinza.
- Digitar `2` grava `2`, sem concatenar com um valor pré-preenchido.
- O Backspace agora consegue apagar completamente o campo.
- A mesma melhoria foi aplicada ao campo de quantidade de acompanhantes.
- As validações e os limites de quantidade foram mantidos.
