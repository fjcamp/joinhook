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

        const videoCleanup: Array<() => void> = [];
        document.querySelectorAll<HTMLVideoElement>('video').forEach((video, index) => {
            const progress = new Set<number>();
            const label = video.dataset.analyticsName || video.getAttribute('aria-label') || video.getAttribute('title') || `video-${index + 1}`;
            const onPlay = () => trackJoinHookEvent('video_start', { video_title: label.slice(0, 100) });
            const onTime = () => {
                if (!Number.isFinite(video.duration) || video.duration <= 0) return;
                const percent = Math.round((video.currentTime / video.duration) * 100);
                [25, 50, 75].forEach((threshold) => {
                    if (percent >= threshold && !progress.has(threshold)) {
                        progress.add(threshold);
                        trackJoinHookEvent('video_progress', { video_title: label.slice(0, 100), video_percent: threshold });
                    }
                });
            };
            const onEnded = () => trackJoinHookEvent('video_complete', { video_title: label.slice(0, 100) });
            video.addEventListener('play', onPlay);
            video.addEventListener('timeupdate', onTime);
            video.addEventListener('ended', onEnded);
            videoCleanup.push(() => {
                video.removeEventListener('play', onPlay);
                video.removeEventListener('timeupdate', onTime);
                video.removeEventListener('ended', onEnded);
            });
        });

        return () => {
            window.removeEventListener('scroll', onScroll);
            document.removeEventListener('click', clickHandler, true);
            observer?.disconnect();
            videoCleanup.forEach((cleanup) => cleanup());
        };
    }, [router.asPath]);

    return null;
}
