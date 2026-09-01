import { useRouter } from 'next/router';
import { trackJoinHookEvent } from '@/lib/joinhook-web';

export function JoinHookWhatsApp() {
    const router = useRouter();
    const phone = (process.env.NEXT_PUBLIC_JOINHOOK_WHATSAPP || '').replace(/\D/g, '');
    if (!phone) return null;

    const text = encodeURIComponent('Hola JoinHook, me gustaría conversar sobre una necesidad o proyecto.');
    const href = `https://wa.me/${phone}?text=${text}`;

    return (
        <a
            className="jh-whatsapp-fab"
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label="Hablar con JoinHook por WhatsApp"
            onClick={() => trackJoinHookEvent('click_whatsapp', { page: router.asPath, section: 'floating-contact' })}
        >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a9.8 9.8 0 0 0-8.4 14.8L2.2 22l5.3-1.4A9.9 9.9 0 1 0 12 2Zm0 17.9a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1-1.5-.7-2.5-1.4-3.5-3.1-.3-.5.3-.5.8-1.4.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.2-.2-.2-.3-.3Z"/></svg>
            <span>Hablar con JoinHook</span>
        </a>
    );
}
