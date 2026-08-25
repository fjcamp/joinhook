import Head from 'next/head';
import { LocalAdmin } from '../features/local/LocalAdmin';

export default function LocalAdminPage() {
  return (
    <>
      <Head>
        <title>JoinHook Local Admin</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="theme-color" content="#061218" />
      </Head>
      <LocalAdmin />
    </>
  );
}
