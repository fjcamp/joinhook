import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { trackJoinHookEvent } from '@/lib/joinhook-web';

const DOWNLOAD_RE = /\.(pdf|zip|csv|xlsx?|docx?|pptx?|rar|7z)(?:$|\?)/i;

export function JoinHookBehaviorAnalytics() {
    const router = useRouter();

    useEffect(() => {
        const onRoute = (url: string) => {
            window.setTimeout(() => trackJoinHookEvent('page_view', { page_location: `${window.location.origin}${url}` }), 0);
        };
        router.events.on('routeChangeComplete', onRoute);
        return () => router.events.off('routeChangeComplete', onRoute);
    }, [router.events]);

    useEffect(() => {
        const seenScroll = new Set<number>();
        function onScroll() {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            if (max <= 0) return;
            const percent = Math.round((window.scrollY / max) * 100);
            [25, 50, 75, 90].forEach((threshold) => {
                if (percent >= threshold && !seenScroll.has(threshold)) {
                    seenScroll.add(threshold);
                    trackJoinHookEvent('scroll_depth', { percent_scrolled: threshold });
                }
            });
        }
        window.addEventListener('scroll', onScroll, { passive: true });

        const clickHandler = (event: MouseEvent) => {
            const target = event.target as HTMLElement | null;
            const link = target?.closest('a') as HTMLAnchorElement | null;
            const button = target?.closest('button') as HTMLButtonElement | null;
            const action = link || button;
            if (!action) return;
            const label = (action.getAttribute('aria-label') || action.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
            if (action.classList.contains('jh3-button')) trackJoinHookEvent('cta_click', { cta_label: label });
            if (link) {
                const href = link.href;
                if (DOWNLOAD_RE.test(href)) trackJoinHookEvent('file_download', { file_url: href.split('?')[0] });
                try {
                    const url = new URL(href, window.location.href);
                    if (url.origin !== window.location.origin && !url.hostname.endsWith('wa.me')) trackJoinHookEvent('outbound_click', { destination_host: url.hostname });
                    if (url.pathname.startsWith('/proyectos') || url.pathname.startsWith('/herramientas')) trackJoinHookEvent('product_view', { destination_path: url.pathname });
                    if (url.pathname.startsWith('/soluciones')) trackJoinHookEvent('service_view', { destination_path: url.pathname });
                } catch { /* ignore invalid URLs */ }
            }
        };
        document.addEventListener('click', clickHandler, true);

        const sections = Array.from(document.querySelectorAll<HTMLElement>('main section'));
        const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || entry.intersectionRatio < 0.45) return;
                const section = entry.target as HTMLElement;
                if (section.dataset.jhTracked === '1') return;
                section.dataset.jhTracked = '1';
                const heading = section.querySelector('h1,h2,h3')?.textContent?.trim().replace(/\s+/g, ' ').slice(0, 100) || `section-${sections.indexOf(section) + 1}`;
                trackJoinHookEvent('section_view', { section_name: heading });
            });
        }, { threshold: [0.45] }) : null;
        sections.forEach((section) => observer?.observe(section));

        return () => {
            window.removeEventListener('scroll', onScroll);
            document.removeEventListener('click', clickHandler, true);
            observer?.disconnect();
        };
    }, [router.asPath]);

    return null;
}
