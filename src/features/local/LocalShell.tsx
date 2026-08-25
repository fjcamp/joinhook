import { FormEvent, useEffect, useMemo, useState } from 'react';
import styles from './LocalShell.module.css';
import { discoverLocalBusinesses } from './supabaseGateway';
import { readSavedIds, toggleSavedId } from './storage';
import { useLocalDashboard } from './useLocalDashboard';
import type { BusinessDiscoveryItem } from './types';

const statusLabel = { loading: 'Cargando', ready: 'En vivo', stale: 'Últimos datos', degraded: 'Modo contingencia', error: 'Sin datos' } as const;
type Panel = 'none' | 'context' | 'signals' | 'discover';

export function LocalShell() {
  const [activeBusinessId, setActiveBusinessId] = useState<string | undefined>();
  const { dashboard, runtime, refresh } = useLocalDashboard(activeBusinessId);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [mobilePanel, setMobilePanel] = useState<Panel>('none');
  const [query, setQuery] = useState('');
  const [businesses, setBusinesses] = useState<BusinessDiscoveryItem[]>([]);
  const [discoverBusy, setDiscoverBusy] = useState(false);
  const [discoverError, setDiscoverError] = useState('');

  useEffect(() => {
    setSavedIds(readSavedIds());
    if ('serviceWorker' in navigator) void navigator.serviceWorker.register('/local-sw.js', { scope: '/' }).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!dashboard) return;
    setSelectedItem(dashboard.business.catalog.find((item) => item.featured)?.id ?? dashboard.business.catalog[0]?.id ?? null);
  }, [dashboard?.business.id]);

  const signals = useMemo(() => dashboard ? Object.fromEntries(dashboard.signals.map((signal) => [signal.kind, signal])) : {}, [dashboard]);

  async function loadDiscovery(search = query) {
    if (!dashboard) return;
    setDiscoverBusy(true);
    setDiscoverError('');
    try {
      const rows = await discoverLocalBusinesses(dashboard.location, search);
      setBusinesses(rows);
    } catch {
      setBusinesses([]);
      setDiscoverError('No fue posible consultar negocios cercanos.');
    } finally {
      setDiscoverBusy(false);
    }
  }

  async function openDiscovery() {
    setMobilePanel('discover');
    await loadDiscovery();
  }

  async function searchDiscovery(event: FormEvent) {
    event.preventDefault();
    await loadDiscovery(query);
  }

  function selectBusiness(item: BusinessDiscoveryItem) {
    setActiveBusinessId(item.id);
    setSelectedItem(null);
    setMobilePanel('none');
  }

  if (!dashboard) {
    return <main className={styles.shell} aria-busy="true"><div className={styles.loadingCard}><div className={styles.spinner} /><strong>Preparando JoinHook Local</strong><span>{runtime.status === 'error' ? 'No fue posible recuperar información.' : 'Organizando señales cercanas…'}</span>{runtime.status === 'error' && <button className={styles.button} onClick={() => void refresh()}>Reintentar</button>}</div></main>;
  }

  const { business, weather, location } = dashboard;
  const isSaved = savedIds.includes(business.id);
  const updated = runtime.lastUpdated ? new Date(runtime.lastUpdated).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) : '—';
  const toggleSaved = () => setSavedIds(toggleSavedId(business.id));
  const openExternal = (url?: string) => { if (url) window.open(url, '_blank', 'noopener,noreferrer'); };
  const distanceLabel = business.distanceMeters > 0 ? ` · ${business.distanceMeters} m` : '';

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>JoinHook <span>Local</span></div>
        <div className={`${styles.runtime} ${runtime.online ? styles.online : styles.offline}`} title={`Actualizado ${updated}`}><span className={styles.statusDot} /> {runtime.online ? statusLabel[runtime.status] : 'Sin conexión'}</div>
        <nav className={styles.nav} aria-label="Navegación principal">
          <button className={`${styles.pill} ${styles.active}`} onClick={() => void openDiscovery()}>Descubrir</button>
          <button className={`${styles.pill} ${styles.secondary}`} onClick={() => setMobilePanel('context')}>Mapa</button>
          <button className={`${styles.pill} ${styles.secondary}`} onClick={() => setMobilePanel('signals')}>En vivo</button>
          <button className={styles.pill} onClick={() => void refresh()}>↻</button>
        </nav>
      </header>

      <div className={styles.ticker}><b>Actualidad local</b><span>Territorio, comercio, turismo y comunidad · fuentes diferenciadas · actualizado {updated}</span></div>

      <section className={styles.workspace}>
        <aside className={`${styles.column} ${styles.left}`}>
          <article className={`${styles.card} ${styles.map}`}><span className={styles.kicker}>Ubicación</span><span className={styles.locator}>⌖</span><span className={styles.tiny}>{location.label} · {runtime.locationPermission === 'granted' ? 'GPS' : 'referencia aproximada'}</span></article>
          <article className={styles.card}><div className={styles.title}>Clima local</div><div className={styles.weatherLine}><div className={styles.metric}>{weather.temperatureC}°</div><div><div className={styles.muted}>{weather.condition}</div><div className={styles.tiny}>{weather.windKmh != null ? `Viento ${weather.windKmh} km/h` : ''}</div></div></div><div className={styles.tiny}>{weather.outdoorStatus}</div><div className={styles.source}>{weather.source ?? 'Fuente no disponible'}</div></article>
          <article className={styles.card}><div className={styles.title}>Lo que dicen</div><div className={styles.muted}>★ {dashboard.rating} · {dashboard.ratingSource}</div><p className={styles.muted}>La valoración comunitaria se muestra separada de publicidad y contenido editorial.</p></article>
          <article className={styles.card}><div className={styles.kicker}>Señal local</div><div className={styles.title}>Movimiento cercano</div><div className={styles.muted}>Relevancia, distancia, vigencia y verificación se combinan sin ocultar contenido patrocinado.</div></article>
        </aside>

        <section className={`${styles.column} ${styles.center}`}>
          <article className={`${styles.card} ${styles.hero}`}>
            <div className={styles.heroBackdrop} />
            <div className={styles.heroContent}>
              <span className={styles.tag}>★ {business.verification === 'verified' ? 'Destacado verificado' : 'Destacado local'}</span>
              <h1>{business.name}</h1>
              <p>{business.category} · {business.city}{distanceLabel} · {business.openNow ? 'Abierto' : 'Cerrado'}</p>
              <p className={styles.muted}>{business.summary}</p>
              <div className={styles.actions}>
                <button className={styles.button} onClick={() => openExternal(business.directionsUrl)}>Cómo llegar</button>
                <button className={`${styles.button} ${styles.primary}`} onClick={() => openExternal(business.contactUrl)}>Contactar</button>
                <button className={`${styles.button} ${styles.warm}`} onClick={() => void openDiscovery()}>Explorar cerca</button>
                <button className={`${styles.button} ${isSaved ? styles.saved : ''}`} onClick={toggleSaved}>{isSaved ? '✓ Guardado' : 'Guardar'}</button>
              </div>
            </div>
          </article>

          <article className={`${styles.card} ${styles.catalog}`}>
            <div className={styles.catalogHead}><span>◇ Catálogo</span><span className={styles.tiny}>Desplazamiento horizontal</span></div>
            <div className={styles.items}>{business.catalog.map((item) => <button key={item.id} className={`${styles.item} ${selectedItem === item.id ? styles.featured : ''}`} onClick={() => setSelectedItem(item.id)}><span className={styles.tiny}>{item.category}</span><span className={styles.price}>{item.name}</span><span className={styles.tiny}>{item.priceLabel}</span></button>)}</div>
          </article>
        </section>

        <aside className={`${styles.column} ${styles.right}`}>
          <article className={`${styles.card} ${styles.offer}`}><div className={styles.kicker}>Patrocinado</div><div className={styles.title}>{signals.offer?.title}</div><div className={styles.muted}>{signals.offer?.summary}</div><div className={styles.source}>{signals.offer?.sourceLabel}</div></article>
          <article className={`${styles.card} ${styles.editorial}`}><div className={styles.kicker}>Editorial</div><div className={styles.title}>{signals.editorial?.title}</div><div className={styles.muted}>{signals.editorial?.summary}</div><div className={styles.source}>{signals.editorial?.sourceLabel}</div></article>
          <article className={`${styles.card} ${styles.agency}`}><div className={styles.kicker}>Turismo</div><div className={styles.title}>{signals.tourism?.title}</div><div className={styles.muted}>{signals.tourism?.summary}</div><div className={styles.source}>● {signals.tourism?.sourceLabel}</div></article>
          <article className={`${styles.card} ${styles.community}`}><div className={styles.kicker}>✦ Comunidad</div><div className={styles.title}>{signals.community?.title}</div><div className={styles.muted}>{signals.community?.summary}</div><div className={styles.source}>{signals.community?.sourceLabel}</div></article>
        </aside>
      </section>

      <footer className={styles.bottom}><button onClick={() => void openDiscovery()}>◇ Descubrir</button><button onClick={() => setMobilePanel('context')}>⌖ Contexto</button><button className={styles.pulse} aria-label="Actualizar" onClick={() => void refresh()} /><button onClick={toggleSaved}>▣ {isSaved ? 'Guardado' : 'Guardar'}</button></footer>

      {mobilePanel !== 'none' && <div className={`${styles.mobileDrawer} ${mobilePanel === 'discover' ? styles.discoveryDrawer : ''}`} role="dialog" aria-modal="true">
        <div className={styles.drawerHead}><strong>{mobilePanel === 'context' ? 'Contexto local' : mobilePanel === 'signals' ? 'Señales locales' : 'Descubrir cerca'}</strong><button onClick={() => setMobilePanel('none')}>×</button></div>
        {mobilePanel === 'context' && <div className={styles.drawerGrid}><div className={styles.card}>⌖ {location.label}</div><div className={styles.card}>{weather.temperatureC}° · {weather.condition}</div></div>}
        {mobilePanel === 'signals' && <div className={styles.drawerGrid}>{dashboard.signals.map((signal) => <div className={styles.card} key={signal.id}><b>{signal.title}</b><div className={styles.muted}>{signal.summary}</div></div>)}</div>}
        {mobilePanel === 'discover' && <>
          <form className={styles.discoveryToolbar} onSubmit={searchDiscovery}><input aria-label="Buscar negocios" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar comercio, categoría o ciudad" /><button className={styles.button} disabled={discoverBusy}>{discoverBusy ? 'Buscando…' : 'Buscar'}</button></form>
          {discoverError && <div className={styles.discoveryMessage}>{discoverError}</div>}
          {!discoverBusy && !discoverError && businesses.length === 0 && <div className={styles.discoveryMessage}>No hay resultados publicados para esta búsqueda.</div>}
          <div className={styles.discoveryRail}>{businesses.slice(0, 10).map((item) => <button key={item.id} className={`${styles.discoveryCard} ${item.id === business.id ? styles.discoverySelected : ''}`} onClick={() => selectBusiness(item)}><span className={styles.kicker}>{item.verification === 'verified' ? '✓ Verificado' : item.category}</span><strong>{item.name}</strong><span>{item.category} · {item.city}</span><small>{item.distanceMeters != null ? `${item.distanceMeters < 1000 ? `${item.distanceMeters} m` : `${(item.distanceMeters / 1000).toFixed(1)} km`} · ` : ''}{item.openNow ? 'Abierto' : 'Cerrado'}</small></button>)}</div>
        </>}
      </div>}
    </main>
  );
}
