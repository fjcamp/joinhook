import Head from 'next/head';
import { useRouter } from 'next/router';
import { generateGlobalCssVariables } from '@/utils/theme-style-utils';
import { CGEPwaStatus } from '@/features/cge/pwa';
import { useEffect } from 'react';
import '../css/main.css';
import '../css/redesign.css';
import '../css/redesign-light.css';
import '../css/cge.css';
import '../css/cge-v02.css';
import '../css/cge-pwa.css';
import '../css/cge-launch.css';

export default function MyApp({ Component, pageProps }) {
    const { global, ...page } = pageProps || {};
    const { theme } = global || {};
    const router = useRouter();
    const isCGEApp = router.pathname === '/app/control-gastronomico-express';

    const cssVars = theme ? generateGlobalCssVariables(theme) : '';

    useEffect(() => {
        document.body.setAttribute('data-theme', page.colors || 'colors-a');
    }, [page.colors]);

    return (
        <>
            <Head>
                <link rel="icon" href={isCGEApp ? '/icons/cge-icon.svg' : '/favicon.svg'} type="image/svg+xml" />
            </Head>
            {isCGEApp && (
                <Head>
                    <link rel="manifest" href="/cge-manifest.webmanifest" />
                    <meta name="application-name" content="Control Gastronómico Express" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                    <meta name="apple-mobile-web-app-title" content="Control Gastro" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="theme-color" content="#728d78" />
                </Head>
            )}
            <style jsx global>{`
                :root {
                    ${cssVars}
                }
            `}</style>
            <Component {...pageProps} />
            {isCGEApp && <CGEPwaStatus />}
        </>
    );
}
