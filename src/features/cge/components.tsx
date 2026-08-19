import { PropsWithChildren, ReactNode } from 'react';

export function CGEIcon({ name }: { name: string }) {
    const icons: Record<string, ReactNode> = {
        resumen: <><path d="M4 13h6V4H4zM14 20h6V9h-6zM4 20h6v-3H4zM14 5h6V4h-6z" /></>,
        inventario: <><path d="M4 7l8-4 8 4-8 4-8-4z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/></>,
        compras: <><path d="M4 5h2l2 10h8l2-7H7"/><circle cx="10" cy="19" r="1"/><circle cx="17" cy="19" r="1"/></>,
        mermas: <><path d="M12 3v10"/><path d="M7.5 8.5L12 13l4.5-4.5"/><path d="M5 17h14"/><path d="M7 21h10"/></>,
        proveedores: <><path d="M3 20V8l6-4 6 4v12"/><path d="M15 11h6v9H3"/><path d="M7 12h4M7 16h4"/></>,
        respaldo: <><path d="M5 19h14V8H5z"/><path d="M8 8V4h8v4M12 11v5M9.5 13.5L12 16l2.5-2.5"/></>,
        plus: <><path d="M12 5v14M5 12h14"/></>,
        search: <><circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/></>,
        alert: <><path d="M12 3l10 18H2L12 3z"/><path d="M12 9v5M12 18h.01"/></>,
        chevron: <><path d="M9 6l6 6-6 6"/></>,
        close: <><path d="M6 6l12 12M18 6L6 18"/></>
    };
    return <svg className="cge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name] || icons.resumen}</svg>;
}

export function CGEStatCard({ label, value, detail, tone = 'sage' }: { label: string; value: string; detail: string; tone?: 'sage' | 'clay' | 'gold' | 'stone' }) {
    return <article className={`cge-stat cge-stat-${tone}`}><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>;
}

export function CGEBadge({ children, tone = 'neutral' }: PropsWithChildren<{ tone?: 'neutral' | 'good' | 'warn' | 'danger' }>) {
    return <span className={`cge-badge cge-badge-${tone}`}>{children}</span>;
}

export function CGEField({ label, children, hint }: PropsWithChildren<{ label: string; hint?: string }>) {
    return <label className="cge-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}

export function CGEModal({ title, eyebrow, onClose, children }: PropsWithChildren<{ title: string; eyebrow?: string; onClose: () => void }>) {
    return <div className="cge-modal-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
        <section className="cge-modal" role="dialog" aria-modal="true" aria-label={title}>
            <header><div>{eyebrow && <small>{eyebrow}</small>}<h2>{title}</h2></div><button type="button" onClick={onClose} aria-label="Cerrar"><CGEIcon name="close" /></button></header>
            <div className="cge-modal-body">{children}</div>
        </section>
    </div>;
}

export function CGEEmpty({ title, text }: { title: string; text: string }) {
    return <div className="cge-empty"><div className="cge-empty-mark">✦</div><strong>{title}</strong><p>{text}</p></div>;
}
