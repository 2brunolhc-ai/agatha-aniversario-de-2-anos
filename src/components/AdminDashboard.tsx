"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Baby,
  Bird,
  ClipboardList,
  Download,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { RSVPRecord } from "@/types/rsvp";

type Filter = "all" | "yes" | "no";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

function csvCell(value: unknown) {
  const text = String(value ?? "").replace(/\r?\n/g, " ");
  const protectedText = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${protectedText.replace(/"/g, '""')}"`;
}

export function AdminDashboard() {
  const [supabase] = useState(() => createBrowserSupabase());
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [records, setRecords] = useState<RSVPRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const loadRsvps = useCallback(async (accessToken: string) => {
    setLoading(true);
    setMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch("/api/admin/rsvps", {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });
      const result = (await response.json()) as { rsvps?: RSVPRecord[]; message?: string };
      if (!response.ok) throw new Error(result.message || "Não foi possível carregar os dados.");
      setRecords(result.rsvps || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      if (!supabase) {
        if (mounted) {
          setMessage("Configure as variáveis do Supabase para acessar a área administrativa.");
          setAuthLoading(false);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      const accessToken = data.session?.access_token || "";
      setToken(accessToken);
      setAuthLoading(false);
      if (accessToken) await loadRsvps(accessToken);
    }

    restoreSession();
    return () => { mounted = false; };
  }, [loadRsvps, supabase]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setAuthLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      setMessage("E-mail ou senha inválidos.");
      setAuthLoading(false);
      return;
    }

    setPassword("");
    setToken(data.session.access_token);
    setAuthLoading(false);
    await loadRsvps(data.session.access_token);
  }

  async function signOut() {
    await supabase?.auth.signOut();
    setToken("");
    setRecords([]);
    setMessage("");
    setSuccessMessage("");
  }

  async function deleteRsvp(record: RSVPRecord) {
    const confirmed = window.confirm(
      `Excluir a confirmação de ${record.full_name}? Esta ação não pode ser desfeita.`,
    );

    if (!confirmed) return;

    setDeletingId(record.id);
    setMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/admin/rsvps", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: record.id }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Não foi possível excluir esta confirmação.");

      setRecords((current) => current.filter((item) => item.id !== record.id));
      setSuccessMessage(`A confirmação de ${record.full_name} foi excluída.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível excluir esta confirmação.");
    } finally {
      setDeletingId("");
    }
  }

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    return records.filter((record) => {
      const matchesFilter = filter === "all" || record.attendance_status === filter;
      const matchesQuery = !normalizedQuery ||
        record.full_name.toLocaleLowerCase("pt-BR").includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, records]);

  const stats = useMemo(() => records.reduce(
    (total, record) => {
      total.responses += 1;
      if (record.attendance_status === "yes") {
        total.confirmations += 1;
        total.guests += record.total_guests || 0;
        total.companions += record.companion_count || 0;
        total.children += record.children || 0;
      } else {
        total.declined += 1;
      }
      return total;
    },
    { responses: 0, confirmations: 0, guests: 0, companions: 0, children: 0, declined: 0 },
  ), [records]);

  function exportCsv() {
    const header = ["Nome", "Status", "Total", "Quantidade de acompanhantes", "Crianças", "Nomes dos acompanhantes", "Mensagem", "Data"];
    const rows = filteredRecords.map((record) => [
      record.full_name,
      record.attendance_status === "yes" ? "Confirmado" : "Não poderá ir",
      record.total_guests,
      record.companion_count,
      record.children,
      record.companion_names,
      record.message,
      formatDate(record.created_at),
    ]);
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `confirmacoes-agatha-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (authLoading && !token) {
    return <div className="grid min-h-svh place-items-center bg-[#fff9fc] text-plum"><LoaderCircle className="animate-spin" aria-label="Carregando" /></div>;
  }

  if (!token) {
    return (
      <main className="admin-login grid min-h-svh place-items-center px-5 py-12">
        <div className="w-full max-w-md rounded-[2rem] border border-white bg-white/90 p-7 shadow-card backdrop-blur sm:p-9">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-lilac-soft text-lilac-deep"><LockKeyhole aria-hidden="true" /></span>
          <h1 className="font-display mt-5 text-center text-4xl text-plum">Área da família</h1>
          <p className="mt-2 text-center leading-7 text-plum/65">Entre para acompanhar as confirmações da festa.</p>
          <form className="mt-7 space-y-4" onSubmit={signIn}>
            <label className="field"><span>E-mail</span><input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label className="field"><span>Senha</span><input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <button className="button-primary focus-ring w-full" type="submit" disabled={!supabase || authLoading}>
              {authLoading ? <><LoaderCircle className="animate-spin" size={18} aria-hidden="true" /> Entrando...</> : "Entrar"}
            </button>
          </form>
          <p className="mt-4 min-h-6 text-center text-sm font-semibold text-error" role="alert">{message}</p>
          <Link href="/" className="text-link focus-ring mx-auto mt-2 block w-fit">Voltar para o convite</Link>
        </div>
      </main>
    );
  }

  const cards = [
    { label: "Total de respostas", value: stats.responses, icon: ClipboardList, color: "bg-white text-lilac-deep" },
    { label: "Presenças confirmadas", value: stats.confirmations, icon: UserCheck, color: "bg-leaf/20 text-leaf-deep" },
    { label: "Pessoas confirmadas", value: stats.guests, icon: Users, color: "bg-lilac-soft text-lilac-deep" },
    { label: "Acompanhantes", value: stats.companions, icon: Users, color: "bg-sky/35 text-plum" },
    { label: "Crianças", value: stats.children, icon: Baby, color: "bg-pink-soft text-pink-deep" },
    { label: "Não poderão ir", value: stats.declined, icon: UserX, color: "bg-[#f7eef2] text-plum" },
  ];

  return (
    <main className="min-h-svh bg-[#fff9fc] text-plum">
      <header className="border-b border-lilac-deep/10 bg-white px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-lilac-soft text-lilac-deep"><Bird size={20} aria-hidden="true" /></span><div><p className="font-display text-2xl">Ágatha · 2 aninhos</p><p className="text-xs font-bold uppercase tracking-[.14em] text-plum/50">Confirmações</p></div></div>
          <button type="button" className="admin-action focus-ring" onClick={signOut}><LogOut size={17} aria-hidden="true" /> Sair</button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div><h1 className="font-display text-4xl sm:text-5xl">Painel da festa</h1><p className="mt-2 text-plum/65">Acompanhe quem vai celebrar este dia especial.</p></div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="admin-action focus-ring" onClick={() => loadRsvps(token)} disabled={loading}><RefreshCw size={17} className={loading ? "animate-spin" : ""} aria-hidden="true" /> Atualizar</button>
            <button type="button" className="admin-action admin-action-primary focus-ring" onClick={exportCsv} disabled={!filteredRecords.length}><Download size={17} aria-hidden="true" /> Exportar CSV</button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {cards.map(({ label, value, icon: Icon, color }, index) => (
            <article key={label} className={`rounded-[1.4rem] border border-white bg-white p-5 shadow-soft ${index === 0 ? "col-span-2 sm:col-span-1" : ""}`}>
              <span className={`grid size-10 place-items-center rounded-full ${color}`}><Icon size={19} aria-hidden="true" /></span>
              <strong className="font-display mt-4 block text-4xl">{value}</strong>
              <span className="mt-1 block text-sm font-semibold text-plum/55">{label}</span>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-[1.6rem] border border-lilac-deep/10 bg-white p-4 shadow-soft sm:p-6" aria-labelledby="rsvp-list-title">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div><h2 id="rsvp-list-title" className="font-display text-3xl">Lista de respostas</h2><p className="text-sm text-plum/55">{filteredRecords.length} resultado(s)</p></div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="admin-search"><Search size={17} aria-hidden="true" /><span className="sr-only">Pesquisar por nome</span><input type="search" placeholder="Pesquisar por nome" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
              <label className="sr-only" htmlFor="status-filter">Filtrar por status</label>
              <select id="status-filter" className="admin-select focus-ring" value={filter} onChange={(event) => setFilter(event.target.value as Filter)}>
                <option value="all">Todos</option><option value="yes">Confirmados</option><option value="no">Ausentes</option>
              </select>
            </div>
          </div>

          {message ? <p className="mt-5 rounded-xl bg-pink-soft p-4 text-sm font-semibold text-error" role="alert">{message}</p> : null}
          {successMessage ? <p className="mt-5 rounded-xl bg-leaf/20 p-4 text-sm font-semibold text-leaf-deep" role="status">{successMessage}</p> : null}

          <div className="mt-6 overflow-x-auto">
            <table className="admin-table">
              <thead><tr><th>Convidado</th><th>Status</th><th>Pessoas</th><th>Acompanhantes</th><th>Mensagem</th><th>Confirmado em</th><th>Ações</th></tr></thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td><strong>{record.full_name}</strong></td>
                    <td><span className={`status-badge ${record.attendance_status === "yes" ? "status-yes" : "status-no"}`}>{record.attendance_status === "yes" ? "Confirmado" : "Não poderá ir"}</span></td>
                    <td>{record.attendance_status === "yes" ? <><strong>{record.total_guests || 0}</strong><span>{record.companion_count || 0} acompanhante(s) · {record.children || 0} criança(s)</span></> : "—"}</td>
                    <td>{record.companion_names || "—"}</td><td className="max-w-xs">{record.message || "—"}</td><td>{formatDate(record.created_at)}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-delete focus-ring"
                        onClick={() => deleteRsvp(record)}
                        disabled={Boolean(deletingId)}
                        aria-label={`Excluir confirmação de ${record.full_name}`}
                      >
                        {deletingId === record.id ? <LoaderCircle className="animate-spin" size={16} aria-hidden="true" /> : <Trash2 size={16} aria-hidden="true" />}
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && !filteredRecords.length ? <p className="py-14 text-center text-plum/55">Nenhuma confirmação encontrada.</p> : null}
            {loading ? <p className="flex items-center justify-center gap-2 py-14 text-plum/55"><LoaderCircle className="animate-spin" size={18} aria-hidden="true" /> Atualizando...</p> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
