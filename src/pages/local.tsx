import Head from 'next/head';
import { LocalShell } from '../features/local/LocalShell';

export default function JoinHookLocalPage() {
  return (
    <>
      <Head>
        <title>JoinHook Local</title>
        <meta name="description" content="Descubrimiento local, comercio, turismo, contenidos y comunidad en una interfaz de pantalla única." />
        <meta name="theme-color" content="#061218" />
      </Head>
      <LocalShell />
    </>
  );
}
