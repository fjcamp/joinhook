import { generateGlobalCssVariables } from '@/utils/theme-style-utils';
import { useEffect } from 'react';
import '../css/main.css';
import '../css/redesign.css';

export default function MyApp({ Component, pageProps }) {
    const { global, ...page } = pageProps || {};
    const { theme } = global || {};

    const cssVars = theme ? generateGlobalCssVariables(theme) : '';

    useEffect(() => {
        document.body.setAttribute('data-theme', page.colors || 'colors-a');
    }, [page.colors]);

    return (
        <>
            <style jsx global>{`
                :root {
                    ${cssVars}
                }
            `}</style>
            <Component {...pageProps} />
        </>
    );
}
