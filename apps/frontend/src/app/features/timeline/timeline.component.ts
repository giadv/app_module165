import { AfterViewInit, Component, effect, inject, signal } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatabaseService } from '../../core/services/database/database.service';
import { LightPollution } from '../../shared/models/light-pollution';

@Component({
    selector: 'app-timeline',
    imports: [MatSliderModule, MatTableModule],
    templateUrl: './timeline.component.html',
    styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements AfterViewInit {
    private readonly databaseService = inject(DatabaseService);

    readonly MIN_YEAR = 2006;
    readonly MAX_YEAR = 2024;
    readonly COLUMNS = ['no', 'country', 'value'];

    readonly value = signal(this.MAX_YEAR);
    private readonly data = signal<LightPollution[]>([]);
    readonly topDataSource = signal<MatTableDataSource<LightPollution & { no: number }>>(
        new MatTableDataSource(),
    );
    readonly bottomDataSource = signal<MatTableDataSource<LightPollution & { no: number }>>(
        new MatTableDataSource(),
    );

    constructor() {
        effect(() => {
            const filteredData = this.data().filter((item) => item.year === this.value());
            const sortedData = [...filteredData]
                .sort((a, b) => b.value - a.value)
                .map((item, index) => ({ ...item, no: index + 1 }));

            this.topDataSource.set(new MatTableDataSource(sortedData.slice(0, 5)));
            this.bottomDataSource.set(new MatTableDataSource(sortedData.slice(-5)));
        });
    }

    ngAfterViewInit(): void {
        this.databaseService.getData().subscribe((data) => {
            this.data.set(data);
        });
    }
}
