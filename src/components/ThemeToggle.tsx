import { useEffect, useState } from 'react';

type ColorMode = 'light' | 'dark';

const STORAGE_KEY = 'joinhook.color-mode';

function getPreferredMode(): ColorMode {
    if (typeof window === 'undefined') return 'light';

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyMode(mode: ColorMode) {
    document.documentElement.setAttribute('data-color-mode', mode);
    document.documentElement.style.colorScheme = mode;

    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (themeColor) themeColor.content = mode === 'dark' ? '#101613' : '#728d78';
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
    const [mode, setMode] = useState<ColorMode>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const preferred = getPreferredMode();
        setMode(preferred);
        applyMode(preferred);
        setMounted(true);
    }, []);

    const toggleMode = () => {
        const next: ColorMode = mode === 'dark' ? 'light' : 'dark';
        setMode(next);
        applyMode(next);
        window.localStorage.setItem(STORAGE_KEY, next);
    };

    const isDark = mounted && mode === 'dark';
    const nextLabel = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';

    return (
        <button
            type="button"
            className={`jh-theme-toggle${compact ? ' is-compact' : ''}`}
            onClick={toggleMode}
            aria-label={nextLabel}
            aria-pressed={isDark}
            title={nextLabel}
        >
            <span className="jh-theme-toggle-icon" aria-hidden="true">
                {isDark ? (
                    <svg viewBox="0 0 24 24" role="img">
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" role="img">
                        <path d="M20.7 15.1A8.5 8.5 0 0 1 8.9 3.3 8.5 8.5 0 1 0 20.7 15.1Z" />
                    </svg>
                )}
            </span>
            <span className="jh-theme-toggle-copy">
                <strong>{isDark ? 'Modo claro' : 'Modo noche'}</strong>
                {!compact && <small>{isDark ? 'Iluminar interfaz' : 'Reducir luminosidad'}</small>}
            </span>
        </button>
    );
}
