import { Component, inject, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router } from '@angular/router';

export type ViewType = 'map' | 'board' | 'timeline';

@Component({
    selector: 'app-header',
    imports: [MatButtonToggleModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    private readonly router = inject(Router);

    readonly initialViewType: ViewType | null = null;

    constructor() {
        this.initialViewType = this.getViewTypeFromUrl();
    }

    onViewTypeChange(value: ViewType): void {
        if (!value) return;
        this.router.navigate([value]);
    }

    private getViewTypeFromUrl(): ViewType | null {
        const url = this.router.url.split('/')[1];

        if (url === 'map' || url === 'board' || url === 'timeline') {
            return url as ViewType;
        }

        return null;
    }
}
