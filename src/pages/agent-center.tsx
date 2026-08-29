import Head from 'next/head';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

type Health = {
  status: string;
  database?: { status: string; latencyMs: number };
  registry?: { agents: number };
  modelProvider?: { id: string; available: boolean };
  tools?: { githubConfigured: boolean; available: number };
  killSwitch?: { enabled: boolean };
};

type Dashboard = {
  pendingApprovals: number;
  running: number;
  failed: number;
  waitingConfiguration: number;
  totalTasks: number;
  totalCostUsd: number;
};

type Run = {
  id: string;
  status: string;
  risk?: string;
  spentCostUsd?: number;
  result?: { text?: string; summary?: string; mode?: string } | null;
  createdAt?: string;
  steps?: Array<{ id: string; agentId: string; status: string; output?: { text?: string }; error?: string | null }>;
};

type Task = {
  id: string;
  objective: string;
  project?: string | null;
  status: string;
  risk: string;
  createdAt: string;
  runs?: Run[];
};

type Approval = {
  id: string;
  action: string;
  risk: string;
  status: string;
  createdAt: string;
  run?: { id: string; task?: Task };
};

type Agent = {
  id: string;
  name: string;
  mission: string;
  authority: string;
  riskCeiling: string;
};

class UnauthorizedError extends Error {}

async function agentApi(path: string, init?: RequestInit) {
  const response = await fetch(`/api/agent-center/${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (response.status === 401) throw new UnauthorizedError('owner_session_required');
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.message || payload?.error || `HTTP ${response.status}`);
  return payload;
}

function money(value?: number) {
  return `$${Number(value ?? 0).toFixed(4)}`;
}

function dateTime(value?: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('es-CL', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}

function statusTone(status?: string) {
  if (['SUCCEEDED', 'APPROVED', 'READY'].includes(status ?? '')) return 'good';
  if (['FAILED', 'REJECTED', 'BLOCKED', 'CRITICAL'].includes(status ?? '')) return 'bad';
  if (['RUNNING', 'WAITING_APPROVAL', 'PENDING'].includes(status ?? '')) return 'warn';
  return 'neutral';
}

export default function AgentCenterPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [accessKey, setAccessKey] = useState('');
  const [health, setHealth] = useState<Health | null>(null);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [objective, setObjective] = useState('');
  const [project, setProject] = useState('JoinHook OS');
  const [repository, setRepository] = useState('fjcamp/joinhook-os');
  const [baseBranch, setBaseBranch] = useState('main');
  const [maxCostUsd, setMaxCostUsd] = useState('0.25');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (silent = false) => {
    if (!silent) setError('');
    try {
      const [healthData, dashboardData, taskData, approvalData, registryData] = await Promise.all([
        agentApi('health/details'),
        agentApi('dashboard'),
        agentApi('tasks?limit=30'),
        agentApi('approvals?status=PENDING'),
        agentApi('registry'),
      ]);
      setHealth(healthData);
      setDashboard(dashboardData);
      setTasks(taskData.tasks ?? []);
      setApprovals(approvalData.approvals ?? []);
      setAgents(registryData.agents ?? []);
      setAuthenticated(true);
    } catch (cause) {
      if (cause instanceof UnauthorizedError) {
        setAuthenticated(false);
        return;
      }
      if (!silent) setError(String(cause));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!authenticated) return;
    const timer = window.setInterval(() => void load(true), 8000);
    return () => window.clearInterval(timer);
  }, [authenticated, load]);

  const latestRuns = useMemo(
    () => tasks.map((task) => ({ task, run: task.runs?.[0] })).filter((item) => item.run),
    [tasks],
  );

  async function login(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/agent-center-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessKey }),
      });
      if (!response.ok) throw new Error('Clave de acceso incorrecta.');
      setAccessKey('');
      setAuthenticated(true);
      await load();
    } catch (cause) {
      setError(String(cause));
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch('/api/agent-center-auth/logout', { method: 'POST' });
    setAuthenticated(false);
    setTasks([]);
    setApprovals([]);
    setSelectedTask(null);
  }

  async function createTask(event: FormEvent) {
    event.preventDefault();
    if (objective.trim().length < 5) return;
    setBusy(true);
    setError('');
    try {
      const constraints: Record<string, string> = {};
      if (repository.trim()) constraints.repository = repository.trim();
      if (baseBranch.trim()) constraints.baseBranch = baseBranch.trim();

      const payload = await agentApi('tasks', {
        method: 'POST',
        body: JSON.stringify({
          objective: objective.trim(),
          project: project.trim() || undefined,
          constraints,
          requestedOutput: {
            format: 'implementation_result',
            preferPullRequest: true,
            includeEvidence: true,
            includeRisks: true,
          },
          maxCostUsd: Math.max(0, Number(maxCostUsd) || 0.25),
          tokenBudget: 16000,
          toolBudget: 16,
        }),
      });
      setObjective('');
      if (payload?.task?.id) await openTask(payload.task.id);
      await load();
    } catch (cause) {
      setError(String(cause));
    } finally {
      setBusy(false);
    }
  }

  async function openTask(taskId: string) {
    try {
      const data = await agentApi(`tasks/${encodeURIComponent(taskId)}`);
      setSelectedTask(data);
    } catch (cause) {
      setError(String(cause));
    }
  }

  async function decideApproval(id: string, approved: boolean) {
    if (!window.confirm(approved ? '¿Autorizar esta ejecución de alto riesgo?' : '¿Rechazar esta ejecución?')) return;
    setBusy(true);
    try {
      await agentApi(`approvals/${encodeURIComponent(id)}/decision`, {
        method: 'POST',
        body: JSON.stringify({
          approved,
          rationale: approved ? 'Aprobado por el propietario desde JoinHook Agent Center.' : 'Rechazado por el propietario desde JoinHook Agent Center.',
        }),
      });
      await load();
    } catch (cause) {
      setError(String(cause));
    } finally {
      setBusy(false);
    }
  }

  async function toggleKillSwitch(enabled: boolean) {
    if (!window.confirm(enabled ? 'Esto detendrá la ejecución autónoma de agentes. ¿Continuar?' : '¿Reactivar la ejecución de agentes?')) return;
    setBusy(true);
    try {
      await agentApi('kill-switch', {
        method: 'POST',
        body: JSON.stringify({ enabled, reason: enabled ? 'Owner emergency stop' : 'Owner re-enabled runtime' }),
      });
      await load();
    } catch (cause) {
      setError(String(cause));
    } finally {
      setBusy(false);
    }
  }

  if (authenticated === null) {
    return <main className="center"><p>Verificando Agent Center…</p><style jsx>{styles}</style></main>;
  }

  if (!authenticated) {
    return (
      <>
        <Head>
          <title>Agent Center · JoinHook</title>
          <meta name="robots" content="noindex,nofollow" />
        </Head>
        <main className="loginShell">
          <form className="loginCard" onSubmit={login}>
            <div className="brandMark">JH</div>
            <p className="eyebrow">JOINHOOK · CONTROL PRIVADO</p>
            <h1>Agent Center</h1>
            <p>Acceso del propietario al Orchestrator, aprobaciones, auditoría y ejecución de proyectos.</p>
            <label>
              Clave de acceso
              <input type="password" autoComplete="current-password" value={accessKey} onChange={(event) => setAccessKey(event.target.value)} required />
            </label>
            <button disabled={busy}>{busy ? 'Verificando…' : 'Ingresar'}</button>
            {error && <div className="errorBox">{error}</div>}
          </form>
        </main>
        <style jsx>{styles}</style>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Agent Center · JoinHook</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="theme-color" content="#07151b" />
      </Head>
      <main className="shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">JOINHOOK BUSINESS OS</p>
            <h1>Agent Center</h1>
          </div>
          <div className="topActions">
            <span className={`status ${health?.status === 'ok' ? 'good' : 'bad'}`}>{health?.status === 'ok' ? 'Control Plane online' : 'Control Plane con alerta'}</span>
            <button className="ghost" onClick={() => void load()} disabled={busy}>Actualizar</button>
            <button className="ghost" onClick={logout}>Salir</button>
          </div>
        </header>

        {error && <div className="errorBox">{error}</div>}

        <section className="metrics">
          <article><span>En ejecución</span><strong>{dashboard?.running ?? 0}</strong></article>
          <article><span>Aprobaciones</span><strong>{dashboard?.pendingApprovals ?? 0}</strong></article>
          <article><span>Fallidos</span><strong>{dashboard?.failed ?? 0}</strong></article>
          <article><span>Esperando IA</span><strong>{dashboard?.waitingConfiguration ?? 0}</strong></article>
          <article><span>Tareas</span><strong>{dashboard?.totalTasks ?? 0}</strong></article>
          <article><span>Costo acumulado</span><strong>{money(dashboard?.totalCostUsd)}</strong></article>
        </section>

        <section className="gridMain">
          <article className="panel composer">
            <div className="panelHead">
              <div><p className="eyebrow">ORCHESTRATOR</p><h2>¿Qué necesitas que haga JoinHook?</h2></div>
              <span className={`status ${health?.modelProvider?.available ? 'good' : 'warn'}`}>{health?.modelProvider?.available ? 'Modelo disponible' : 'Modelo sin configurar'}</span>
            </div>
            <form onSubmit={createTask}>
              <textarea value={objective} onChange={(event) => setObjective(event.target.value)} placeholder="Ej.: Continúa el desarrollo de SnowWise, revisa el repositorio, corrige lo pendiente, ejecuta QA y prepara un pull request con evidencia." rows={6} />
              <div className="formGrid">
                <label>Proyecto<input value={project} onChange={(event) => setProject(event.target.value)} /></label>
                <label>Repositorio<input value={repository} onChange={(event) => setRepository(event.target.value)} placeholder="owner/repo" /></label>
                <label>Rama base<input value={baseBranch} onChange={(event) => setBaseBranch(event.target.value)} /></label>
                <label>Tope USD<input type="number" min="0" step="0.01" value={maxCostUsd} onChange={(event) => setMaxCostUsd(event.target.value)} /></label>
              </div>
              <div className="submitRow">
                <p>El Orchestrator activará solo los especialistas necesarios. Cambios de alto riesgo quedan esperando tu aprobación.</p>
                <button disabled={busy || objective.trim().length < 5}>{busy ? 'Procesando…' : 'Crear tarea'}</button>
              </div>
            </form>
          </article>

          <aside className="panel runtime">
            <div className="panelHead"><div><p className="eyebrow">RUNTIME</p><h2>Estado</h2></div></div>
            <dl>
              <div><dt>Base de datos</dt><dd>{health?.database?.status ?? '—'} · {health?.database?.latencyMs ?? 0} ms</dd></div>
              <div><dt>Agentes</dt><dd>{health?.registry?.agents ?? agents.length}</dd></div>
              <div><dt>Proveedor</dt><dd>{health?.modelProvider?.id ?? '—'}</dd></div>
              <div><dt>GitHub tools</dt><dd>{health?.tools?.githubConfigured ? 'Configurado' : 'Sin configurar'}</dd></div>
              <div><dt>Kill switch</dt><dd>{health?.killSwitch?.enabled ? 'ACTIVO' : 'Inactivo'}</dd></div>
            </dl>
            <button className={health?.killSwitch?.enabled ? 'safeButton' : 'dangerButton'} disabled={busy} onClick={() => void toggleKillSwitch(!health?.killSwitch?.enabled)}>
              {health?.killSwitch?.enabled ? 'Reactivar agentes' : 'Detener agentes'}
            </button>
          </aside>
        </section>

        {approvals.length > 0 && (
          <section className="panel approvals">
            <div className="panelHead"><div><p className="eyebrow">HUMAN GATE</p><h2>Aprobaciones pendientes</h2></div><span className="status warn">{approvals.length}</span></div>
            <div className="approvalList">
              {approvals.map((approval) => (
                <article key={approval.id}>
                  <div><span className={`status ${statusTone(approval.risk)}`}>{approval.risk}</span><strong>{approval.run?.task?.objective ?? approval.action}</strong><small>{dateTime(approval.createdAt)}</small></div>
                  <div className="inlineButtons"><button className="ghost" onClick={() => void decideApproval(approval.id, false)}>Rechazar</button><button onClick={() => void decideApproval(approval.id, true)}>Autorizar</button></div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="gridLower">
          <article className="panel">
            <div className="panelHead"><div><p className="eyebrow">RUNS</p><h2>Actividad reciente</h2></div></div>
            <div className="taskList">
              {latestRuns.length === 0 && <p className="muted">Todavía no hay ejecuciones.</p>}
              {latestRuns.map(({ task, run }) => (
                <button className="taskRow" key={task.id} onClick={() => void openTask(task.id)}>
                  <div><strong>{task.objective}</strong><small>{task.project || 'Sin proyecto'} · {dateTime(task.createdAt)}</small></div>
                  <div className="taskMeta"><span className={`status ${statusTone(run?.status)}`}>{run?.status}</span><span>{money(run?.spentCostUsd)}</span></div>
                </button>
              ))}
            </div>
          </article>

          <article className="panel detail">
            <div className="panelHead"><div><p className="eyebrow">RESULTADO</p><h2>Detalle de tarea</h2></div></div>
            {!selectedTask && <p className="muted">Selecciona una ejecución para ver plan, agentes, evidencia y resultado.</p>}
            {selectedTask && (
              <div className="detailContent">
                <h3>{selectedTask.objective}</h3>
                <div className="chips"><span className={`status ${statusTone(selectedTask.status)}`}>{selectedTask.status}</span><span className="status neutral">{selectedTask.risk}</span></div>
                {(selectedTask.runs ?? []).slice(0, 1).map((run: Run) => (
                  <div key={run.id}>
                    <h4>Resultado del Orchestrator</h4>
                    <pre>{run.result?.text || run.result?.summary || (run.result ? JSON.stringify(run.result, null, 2) : 'Aún sin resultado final.')}</pre>
                    <h4>Especialistas</h4>
                    <div className="stepList">
                      {(run.steps ?? []).map((step) => (
                        <div key={step.id}><span className={`status ${statusTone(step.status)}`}>{step.status}</span><strong>{step.agentId}</strong>{step.error && <small>{step.error}</small>}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>

        <section className="panel agentsPanel">
          <div className="panelHead"><div><p className="eyebrow">REGISTRY</p><h2>Agentes corporativos</h2></div><span className="status neutral">{agents.length}</span></div>
          <div className="agentGrid">
            {agents.map((agent) => (
              <article key={agent.id}><div><strong>{agent.name}</strong><span>{agent.authority} · techo {agent.riskCeiling}</span></div><p>{agent.mission}</p></article>
            ))}
          </div>
        </section>
      </main>
      <style jsx>{styles}</style>
    </>
  );
}

const styles = `
  :global(body){margin:0;background:#061116;color:#edf8f6;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
  *{box-sizing:border-box}.shell{min-height:100vh;padding:28px;max-width:1600px;margin:0 auto}.center,.loginShell{min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 20% 20%,#12323a 0,#061116 44%)}
  .loginCard{width:min(460px,100%);background:linear-gradient(145deg,#0d2027,#09181e);border:1px solid #1c3b43;border-radius:22px;padding:34px;box-shadow:0 28px 90px #0008}.brandMark{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;background:#d7ff71;color:#071116;font-weight:900;margin-bottom:24px}.loginCard h1,.topbar h1{margin:4px 0 8px;font-size:clamp(28px,4vw,46px)}.loginCard p{color:#a9c1c4;line-height:1.6}.loginCard label{display:grid;gap:8px;margin-top:22px;color:#cce0e1}.loginCard input{width:100%}
  .eyebrow{margin:0;color:#86a6aa;font-size:11px;letter-spacing:.18em;font-weight:800}.topbar{display:flex;justify-content:space-between;gap:24px;align-items:center;margin-bottom:22px}.topActions,.inlineButtons,.submitRow,.chips{display:flex;gap:10px;align-items:center}.topActions{flex-wrap:wrap;justify-content:flex-end}
  button,input,textarea{font:inherit}input,textarea{border:1px solid #23434b;background:#07171c;color:#efffff;border-radius:12px;padding:12px 13px;outline:none}input:focus,textarea:focus{border-color:#9ed95f;box-shadow:0 0 0 3px #9ed95f1a}textarea{width:100%;resize:vertical;min-height:132px;line-height:1.5}button{border:0;border-radius:11px;padding:11px 16px;background:#d7ff71;color:#071116;font-weight:800;cursor:pointer}button:disabled{opacity:.45;cursor:not-allowed}.ghost{background:#10242b;color:#dcebec;border:1px solid #26434b}.dangerButton{background:#ff776f;color:#210603;width:100%}.safeButton{background:#9de0bd;color:#062014;width:100%}
  .metrics{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:14px}.metrics article,.panel{background:linear-gradient(145deg,#0b1d23,#08171c);border:1px solid #18363e;box-shadow:0 14px 44px #0004}.metrics article{border-radius:16px;padding:16px}.metrics span{display:block;color:#86a3a7;font-size:12px;margin-bottom:10px}.metrics strong{font-size:22px}.panel{border-radius:18px;padding:20px}.gridMain{display:grid;grid-template-columns:minmax(0,2.2fr) minmax(280px,.8fr);gap:14px;margin-bottom:14px}.panelHead{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:18px}.panelHead h2{margin:5px 0 0;font-size:20px}.formGrid{display:grid;grid-template-columns:2fr 2fr 1fr 1fr;gap:10px;margin-top:10px}.formGrid label{display:grid;gap:7px;font-size:12px;color:#8ea8ab}.submitRow{justify-content:space-between;margin-top:14px}.submitRow p{max-width:720px;color:#829ca0;font-size:12px;line-height:1.5}.runtime dl{margin:0 0 18px}.runtime dl div{display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #173039;padding:11px 0}.runtime dt{color:#78979b}.runtime dd{margin:0;text-align:right}.status{display:inline-flex;align-items:center;border-radius:999px;padding:5px 9px;font-size:10px;font-weight:850;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}.status.good{background:#15382b;color:#9af0bc}.status.warn{background:#433819;color:#ffe08a}.status.bad{background:#48201e;color:#ffaaa5}.status.neutral{background:#173039;color:#adcbce}
  .approvals{margin-bottom:14px;border-color:#544518}.approvalList{display:grid;gap:10px}.approvalList article{display:flex;align-items:center;justify-content:space-between;gap:18px;background:#171a12;border:1px solid #3d371b;border-radius:13px;padding:13px}.approvalList article>div:first-child{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:8px 12px}.approvalList strong{font-size:13px}.approvalList small{grid-column:2;color:#7f9698}
  .gridLower{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}.taskList{display:grid;gap:8px;max-height:520px;overflow:auto}.taskRow{width:100%;display:flex;justify-content:space-between;text-align:left;gap:18px;background:#09191f;color:#e8f6f4;border:1px solid #17343c;padding:13px}.taskRow:hover{border-color:#355b63}.taskRow>div:first-child{display:grid;gap:6px;min-width:0}.taskRow strong{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.taskRow small{color:#769397}.taskMeta{display:flex;gap:10px;align-items:center;color:#86a4a8;font-size:11px}.detailContent h3{line-height:1.4}.detailContent h4{margin:20px 0 8px;color:#9bb5b8}.detail pre{white-space:pre-wrap;word-break:break-word;background:#061116;border:1px solid #17333a;border-radius:12px;padding:14px;max-height:350px;overflow:auto;color:#cfe2df;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;line-height:1.6}.stepList{display:grid;gap:8px}.stepList div{display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:center;background:#09191f;border:1px solid #173039;border-radius:10px;padding:10px}.stepList small{grid-column:2;color:#ffaaa5}.muted{color:#78969a;line-height:1.6}
  .agentGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.agentGrid article{background:#09191f;border:1px solid #17333a;border-radius:13px;padding:14px}.agentGrid article>div{display:flex;justify-content:space-between;gap:10px}.agentGrid span{font-size:10px;color:#719095}.agentGrid p{color:#89a4a7;font-size:12px;line-height:1.5;margin-bottom:0}.errorBox{background:#3c1818;border:1px solid #6a2d29;color:#ffb5b0;border-radius:12px;padding:12px 14px;margin:12px 0;white-space:pre-wrap}
  @media(max-width:1100px){.metrics{grid-template-columns:repeat(3,1fr)}.formGrid{grid-template-columns:1fr 1fr}.agentGrid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:760px){.shell{padding:16px}.topbar,.submitRow,.approvalList article{align-items:stretch;flex-direction:column}.topActions{justify-content:flex-start}.metrics{grid-template-columns:1fr 1fr}.gridMain,.gridLower{grid-template-columns:1fr}.formGrid,.agentGrid{grid-template-columns:1fr}.approvalList article>div:first-child{grid-template-columns:1fr}.approvalList small{grid-column:1}.taskRow{flex-direction:column}.taskMeta{justify-content:space-between}}
`;
