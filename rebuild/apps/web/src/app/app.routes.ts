import type { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { ContentPageComponent } from './pages/content/content-page.component';
import { NotFoundPageComponent } from './pages/not-found/not-found-page.component';
import { sitePages } from './content/site-pages';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'JoinHook — Del potencial turístico a un proyecto con dirección',
  },
  ...sitePages.map((page) => ({
    path: page.path,
    component: ContentPageComponent,
    data: { page },
    title: page.title,
  })),
  {
    path: '**',
    component: NotFoundPageComponent,
    title: 'Página no encontrada — JoinHook',
  },
];
