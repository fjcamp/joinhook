import Head from 'next/head';
import { LocalImport } from '../features/local/LocalImport';

export default function LocalImportPage() {
  return (
    <>
      <Head>
        <title>JoinHook Local Import</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="theme-color" content="#061218" />
      </Head>
      <LocalImport />
    </>
  );
}
