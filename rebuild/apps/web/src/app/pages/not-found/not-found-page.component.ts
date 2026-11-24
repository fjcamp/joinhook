import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'jh-not-found-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="not-found">
      <p class="eyebrow">404 · PÁGINA NO ENCONTRADA</p>
      <h1>Esta página no está disponible.</h1>
      <p>Puede que la dirección haya cambiado o que el contenido ya no esté aquí.</p>
      <a routerLink="/">Volver al inicio <span aria-hidden="true">→</span></a>
    </section>
  `,
  styles: [`
    .not-found { width: min(100% - 3rem, 54rem); min-height: 55vh; margin: auto; padding: 7rem 0; }
    .eyebrow { color: var(--jh-accent); font-size: .7rem; font-weight: 700; letter-spacing: .14em; }
    h1 { max-width: 14ch; color: var(--jh-ink); font-family: var(--jh-display); font-size: clamp(2.8rem, 7vw, 5rem); font-weight: 500; letter-spacing: -.06em; }
    p:not(.eyebrow) { color: var(--jh-muted); line-height: 1.7; }
    a { display: inline-block; margin-top: 1rem; color: var(--jh-primary); font-weight: 700; text-decoration: none; }
  `],
})
export class NotFoundPageComponent {}
