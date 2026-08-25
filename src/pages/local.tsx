import Head from 'next/head';
import { LocalShell } from '../features/local/LocalShell';

export default function JoinHookLocalPage() {
  return (
    <>
      <Head>
        <title>JoinHook Local</title>
        <meta name="description" content="Descubrimiento local, comercio, turismo, contenidos y comunidad en una interfaz de pantalla única." />
        <meta name="theme-color" content="#0B2028" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/local.webmanifest" />
      </Head>
      <LocalShell />
    </>
  );
}
