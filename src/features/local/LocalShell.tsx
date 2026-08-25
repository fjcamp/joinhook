import { useEffect, useMemo, useState } from 'react';
import styles from './LocalShell.module.css';
import { localDataGateway } from './services';
import type { LocalDashboard } from './types';

export function LocalShell() {
  const [dashboard, setDashboard] = useState<LocalDashboard | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    localDataGateway.getDashboard().then((data) => {
      setDashboard(data);
      setSelectedItem(data.business.catalog.find((item) => item.featured)?.id ?? data.business.catalog[0]?.id ?? null);
    });
  }, []);

  const signals = useMemo(() => {
    if (!dashboard) return {};
    return Object.fromEntries(dashboard.signals.map((signal) => [signal.kind, signal]));
  }, [dashboard]);

  if (!dashboard) {
    return <main className={styles.shell} aria-busy="true"><div className={styles.card}>Cargando JoinHook Local…</div></main>;
  }

  const { business, weather, location } = dashboard;

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>JoinHook <span>Local</span></div>
        <nav className={styles.nav} aria-label="Navegación principal">
          <button className={`${styles.pill} ${styles.active}`}>Descubrir</button>
          <button className={`${styles.pill} ${styles.secondary}`}>Mapa</button>
          <button className={`${styles.pill} ${styles.secondary}`}>En vivo</button>
          <button className={`${styles.pill} ${styles.secondary}`}>Planes</button>
          <button className={styles.pill}>ES</button>
          <button className={styles.pill}>+ Publicar</button>
        </nav>
      </header>

      <div className={styles.ticker}><b>Actualidad local</b> Festivales, emprendimiento y cultura regional · señales verificadas y contexto útil</div>

      <section className={styles.workspace}>
        <aside className={`${styles.column} ${styles.left}`}>
          <article className={`${styles.card} ${styles.map}`}>
            <span className={styles.kicker} style={{ position: 'absolute', left: 12, top: 11 }}>Ubicación</span>
            <span className={styles.locator}>⌖</span>
            <span className={styles.tiny} style={{ position: 'absolute', left: 12, bottom: 10 }}>{location.label} · referencia aproximada</span>
          </article>
          <article className={styles.card}><div className={styles.title}>Clima local</div><div className={styles.metric}>{weather.temperatureC}°</div><div className={styles.muted}>{weather.condition}</div><div className={styles.tiny}>{weather.outdoorStatus}</div></article>
          <article className={styles.card}><div className={styles.title}>Lo que dicen</div><div className={styles.muted}>★ {dashboard.rating} · {dashboard.ratingSource}</div><p className={styles.muted}>Información clara, cercana y útil para decidir qué hacer.</p></article>
          <article className={styles.card}><div className={styles.kicker}>Señal local</div><div className={styles.title}>Movimiento cercano</div><div className={styles.muted}>Emprendimientos, actividades y novedades ordenadas por relevancia, distancia y confianza.</div></article>
        </aside>

        <section className={`${styles.column} ${styles.center}`}>
          <article className={`${styles.card} ${styles.hero}`}>
            <div className={styles.heroBackdrop} />
            <div className={styles.heroContent}>
              <span className={styles.tag}>★ Destacado verificado</span>
              <h1>{business.name}</h1>
              <p>{business.category} · {business.city} · {business.distanceMeters} m · {business.openNow ? 'Abierto' : 'Cerrado'}</p>
              <p className={styles.muted}>{business.summary}</p>
              <div className={styles.actions}><button className={styles.button}>Cómo llegar</button><button className={`${styles.button} ${styles.primary}`}>WhatsApp</button><button className={`${styles.button} ${styles.warm}`}>Comprar</button><button className={styles.button}>Guardar</button></div>
            </div>
          </article>

          <article className={`${styles.card} ${styles.catalog}`}>
            <div className={styles.catalogHead}><span>◇ Catálogo</span><span className={styles.tiny}>Interacción sin scroll vertical</span></div>
            <div className={styles.items}>
              {business.catalog.map((item) => (
                <button key={item.id} className={`${styles.item} ${selectedItem === item.id ? styles.featured : ''}`} onClick={() => setSelectedItem(item.id)}>
                  <span className={styles.tiny}>{item.category}</span><span className={styles.price}>{item.name}</span><span className={styles.tiny}>{item.priceLabel}</span>
                </button>
              ))}
            </div>
          </article>
        </section>

        <aside className={`${styles.column} ${styles.right}`}>
          <article className={`${styles.card} ${styles.offer}`}><div className={styles.kicker}>Oferta destacada</div><div className={styles.title}>{signals.offer?.title}</div><div className={styles.muted}>{signals.offer?.summary}</div></article>
          <article className={`${styles.card} ${styles.editorial}`}><div className={styles.title}>{signals.editorial?.title}</div><div className={styles.muted}>{signals.editorial?.summary}</div></article>
          <article className={`${styles.card} ${styles.agency}`}><div className={styles.title}>{signals.tourism?.title}</div><div className={styles.muted}>{signals.tourism?.summary}</div><div className={styles.tiny}>● Operador verificado</div></article>
          <article className={`${styles.card} ${styles.community}`}><div className={styles.kicker}>✦ Espacio comunitario</div><div className={styles.title}>{signals.community?.title}</div><div className={styles.muted}>{signals.community?.summary}</div><button className={styles.button} style={{ marginTop: 10, width: '100%' }}>Conocer experiencia</button></article>
        </aside>
      </section>

      <footer className={styles.bottom}><button>◇ Descubrir</button><button>⌖ Mapa</button><button className={styles.pulse} aria-label="Acción principal" /><button>▣ Guardados</button></footer>
    </main>
  );
}
