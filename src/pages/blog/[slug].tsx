import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { CTA, PageShell, SiteHead } from '@/components/JoinHookV3';
import { articles, type JoinHookArticle } from '@/data-joinhook-v3';

type Props={article:JoinHookArticle};
export default function ArticlePage({article}:Props){const path=`/blog/${article.slug}`;return <PageShell><SiteHead title={`${article.title} | JoinHook`} description={article.excerpt} path={path} type="article" jsonLd={{'@type':'BlogPosting','headline':article.title,'description':article.excerpt,'inLanguage':'es-CL','mainEntityOfPage':`https://joinhook.cl${path}/`,'author':{'@type':'Organization','name':'JoinHook'},'publisher':{'@id':'https://joinhook.cl/#organization'}}}/><article className="jh3-article-page"><header><span className="jh3-kicker">{article.category}</span><h1>{article.title}</h1><p className="jh3-lead">{article.excerpt}</p></header><div className="jh3-article-content"><section className="jh3-card jh3-article-section"><p>{article.intro}</p></section>{article.sections.map(([title,text])=><section className="jh3-card jh3-article-section" key={title}><h2>{title}</h2><p>{text}</p></section>)}<div className="jh3-article-back"><Link href="/blog">← Volver al blog</Link></div></div></article><CTA title="¿Quieres revisar un proceso similar en tu organización?"/></PageShell>}
export const getStaticPaths:GetStaticPaths=async()=>({paths:articles.map(a=>({params:{slug:a.slug}})),fallback:false});
export const getStaticProps:GetStaticProps<Props>=async({params})=>{const article=articles.find(a=>a.slug===params?.slug);if(!article)return{notFound:true};return{props:{article}}};
