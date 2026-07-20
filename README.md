# Ágatha 2 aninhos

Convite digital responsivo para a comemoração dos 2 anos da Ágatha, com confirmação de presença, galeria acessível e área administrativa privada.

## Dados oficiais do evento

- Aniversário da Ágatha: **15/07/2026**.
- Comemoração: **domingo, 26/07/2026, às 12:00**.
- Fuso: `America/Sao_Paulo`.
- Endereço:
  - Rua Siriema
  - Qd. 22, Lt. 05
  - Bairro Major / Itamar Nóbrega 02
  - Recanto D. Paulo

A data real do aniversário e a data da festa são independentes. A contagem regressiva e o formulário se referem exclusivamente à comemoração de 26/07/2026 às 12:00.

## O que está incluído

- Convite completo em português e pensado primeiro para celular.
- Foto principal oficial preservada e usada também no compartilhamento social.
- Contagem regressiva até **26/07/2026 às 12:00**.
- Galeria com `next/image`, lightbox, setas, `Esc` e navegação por teclado.
- Seção de sugestões de presentes antes da confirmação.
- Formulário com validação no navegador e no servidor.
- Honeypot, tempo mínimo de preenchimento, limite de tentativas e prevenção de envio duplicado.
- Supabase com RLS: visitantes inserem, mas não leem, alteram ou excluem dados.
- `/admin` protegido por Supabase Auth e lista de e-mails autorizados.
- Pesquisa por nome, filtros, totais e exportação CSV.
- Open Graph, Twitter Card, favicon, canonical e theme color.

## Executar localmente

Requisitos: Node.js 20.9 ou superior e npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`. Sem as variáveis do Supabase, o convite pode ser visualizado, mas as confirmações não são gravadas e o painel informa que falta a conexão.

Verificações antes de publicar:

```bash
npm run lint
npm run build
```

## Configurar o Supabase

### Projeto novo

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Abra **SQL Editor**, cole todo o conteúdo de `supabase/schema.sql` e execute.
3. Em **Project Settings → API**, copie a URL, a chave `anon` e a chave `service_role`.
4. Copie `.env.example` para `.env.local` e preencha os valores.
5. Em **Authentication → Users**, crie o usuário administrador com e-mail e senha.
6. Coloque o mesmo e-mail em `ADMIN_EMAILS`. Separe múltiplos e-mails por vírgula.
7. Gere um valor longo e aleatório para `RSVP_HASH_SECRET`.

### Projeto existente

Antes de publicar esta versão, execute no SQL Editor o arquivo de compatibilidade que está em `supabase/migrations/`.

A migração não recria a tabela e mantém IDs, nomes, respostas, quantidades, mensagens e datas das confirmações já salvas.

`SUPABASE_SERVICE_ROLE_KEY` é segredo de servidor: nunca use o prefixo `NEXT_PUBLIC_`, nunca envie essa chave ao navegador e nunca a inclua no Git.

### Segurança dos dados

O navegador envia o RSVP à rota `/api/rsvp`. A rota valida, higieniza e só então grava. A tabela tem RLS habilitado e nenhuma política pública de leitura, alteração ou exclusão. O painel envia a sessão do administrador à API, que valida o usuário e o e-mail autorizado antes de usar a service role no servidor.

## Alterar o evento

Todos os dados ficam centralizados em `src/config/event.ts`: datas, horário, endereço, URL de busca no mapa e fuso. Se a festa mudar, ajuste também `celebrationStartsAt` e `celebrationEndsAt`, mantendo o deslocamento `-03:00`.

O link atual do mapa usa uma busca com o endereço exatamente como fornecido, sem acrescentar cidade, estado ou CEP.

## Fotos

As imagens ficam em `public/images/agatha` e `public/images/referencias`. A seleção, textos alternativos, dimensões e enquadramentos ficam em `src/config/photos.ts`.

- `heroPhoto`: foto principal oficial.
- `invitationReference`: convite oficial usado como referência visual.
- `timelinePhotos`: momentos da seção de história.
- `galleryPhotos`: ordem da galeria.
- `familyPhoto`: foto do encerramento.
- `objectPosition`: ajusta apenas o enquadramento visual, sem modificar o arquivo original.

Ao adicionar uma imagem, informe `width` e `height` reais para evitar mudança de layout.

## Área administrativa

1. Acesse `/admin` diretamente; a rota não aparece no convite.
2. Entre com o usuário criado no Supabase Auth.
3. O e-mail precisa estar em `ADMIN_EMAILS`.
4. Use **Atualizar** para buscar novas respostas ou **Exportar CSV** para baixar a lista filtrada.

O CSV neutraliza células que começam com caracteres de fórmula.

## Publicar na Vercel

1. Envie o projeto para o repositório Git correto.
2. Importe o projeto na Vercel e selecione `agatha-2-anos` como Root Directory se o repositório for um monorepo.
3. Cadastre as variáveis de `.env.example` nos ambientes necessários.
4. Defina `NEXT_PUBLIC_SITE_URL` com a URL final, sem barra no fim.
5. Faça o deploy, valide um RSVP real e confira o registro em `/admin`.

Nunca publique `.env.local`; ele é ignorado pelo Git.

## Estrutura principal

```text
src/
  app/admin/                       # área privada
  app/api/rsvp/                    # gravação validada no servidor
  app/api/admin/rsvps/             # leitura administrativa protegida
  components/                      # seções e componentes
  config/                          # evento e fotos
  lib/                             # validação e Supabase
  types/                           # tipos do RSVP
supabase/schema.sql                # estrutura nova, índices, RLS e permissões
supabase/migrations/               # alteração segura de estrutura existente
public/images/agatha/              # fotos originais da Ágatha
public/images/referencias/         # convite oficial
```

## Privacidade

O convite contém fotos pessoais e usa `noindex` para reduzir descoberta por mecanismos de busca. Isso não substitui controle de acesso: compartilhe a URL somente com os convidados. Os dados do RSVP ficam no projeto Supabase da família.
