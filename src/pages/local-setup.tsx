import Head from 'next/head';
import { LocalSetup } from '../features/local/LocalSetup';

export default function LocalSetupPage() {
  return (
    <>
      <Head>
        <title>JoinHook Local Setup</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="theme-color" content="#061218" />
      </Head>
      <LocalSetup />
    </>
  );
}
