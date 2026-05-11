import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'map',
                pathMatch: 'full',
            },
            {
                path: 'map',
                loadComponent: () =>
                    import('./features/map/map.component').then((m) => m.MapComponent),
            },
            {
                path: 'board',
                loadComponent: () =>
                    import('./features/board/board.component').then((m) => m.BoardComponent),
            },
            {
                path: 'timeline',
                loadComponent: () =>
                    import('./features/timeline/timeline.component').then(
                        (m) => m.TimelineComponent,
                    ),
            },
        ],
    },
    {
        path: '**',
        redirectTo: '',
    },
];
