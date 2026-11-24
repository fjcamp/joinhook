import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SitePageContent } from '../../content/site-pages';

const fallbackPage: SitePageContent = {
  path: '',
  eyebrow: 'JOINHOOK',
  title: 'Acompañamiento para proyectos turísticos.',
  intro: 'Estamos preparando esta página.',
  sections: [],
};

@Component({
  selector: 'jh-content-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './content-page.component.html',
  styleUrl: './content-page.component.css',
})
export class ContentPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data,
  });

  readonly page = computed(
    () => (this.routeData()['page'] as SitePageContent | undefined) ?? fallbackPage,
  );
}
