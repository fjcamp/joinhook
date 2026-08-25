import Head from 'next/head';
import { LocalContentAdmin } from '../features/local/LocalContentAdmin';

export default function LocalAdminContentPage(){
  return <><Head><title>JoinHook Local · Contenido</title><meta name="robots" content="noindex,nofollow"/><meta name="theme-color" content="#061218"/></Head><LocalContentAdmin/></>;
}
