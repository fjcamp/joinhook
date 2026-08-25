import Head from 'next/head';
import { LocalOperators } from '../features/local/LocalOperators';

export default function LocalAdminUsersPage() {
  return (
    <>
      <Head>
        <title>JoinHook Local · Operadores</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="theme-color" content="#061218" />
      </Head>
      <LocalOperators />
    </>
  );
}
