import { useEffect, useState } from 'react';

type InstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function CGEPwaStatus() {
    const [online, setOnline] = useState(() => typeof navigator === 'undefined' ? true : navigator.onLine);
    const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
    const [installed, setInstalled] = useState(() => typeof window === 'undefined' ? false : window.matchMedia('(display-mode: standalone)').matches);

    useEffect(() => {
        const goOnline = () => setOnline(true);
        const goOffline = () => setOnline(false);
        const captureInstall = (event: Event) => {
            event.preventDefault();
            setInstallPrompt(event as InstallPromptEvent);
        };
        const markInstalled = () => {
            setInstalled(true);
            setInstallPrompt(null);
        };

        window.addEventListener('online', goOnline);
        window.addEventListener('offline', goOffline);
        window.addEventListener('beforeinstallprompt', captureInstall);
        window.addEventListener('appinstalled', markInstalled);

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/app/cge-sw.js', { scope: '/app/' }).catch(() => {
                // The app remains usable online/local-first even if SW registration is unavailable.
            });
        }

        return () => {
            window.removeEventListener('online', goOnline);
            window.removeEventListener('offline', goOffline);
            window.removeEventListener('beforeinstallprompt', captureInstall);
            window.removeEventListener('appinstalled', markInstalled);
        };
    }, []);

    const install = async () => {
        if (!installPrompt) return;
        await installPrompt.prompt();
        const choice = await installPrompt.userChoice;
        if (choice.outcome === 'accepted') setInstallPrompt(null);
    };

    return (
        <div className="cge-pwa-status" aria-live="polite">
            <div className={online ? 'is-online' : 'is-offline'}>
                <span />
                <strong>{online ? 'En línea' : 'Sin conexión'}</strong>
                <small>{online ? 'Datos guardados localmente' : 'Puedes seguir trabajando'}</small>
            </div>
            {!installed && installPrompt && (
                <button type="button" onClick={install}>
                    Instalar app
                </button>
            )}
            {installed && <span className="cge-pwa-installed">Instalada</span>}
        </div>
    );
}
