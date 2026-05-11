import { AfterViewInit, Component, inject, signal, viewChild } from '@angular/core';
import { DatabaseService } from '../../core/services/database/database.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LightPollution } from '../../shared/models/light-pollution';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
    selector: 'app-board',
    imports: [MatTableModule, ScrollingModule, MatSortModule],
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss',
})
export class BoardComponent implements AfterViewInit {
    private readonly databaseService = inject(DatabaseService);
    readonly COLUMNS = ['no', 'year', 'country', 'value'];

    readonly data = signal<MatTableDataSource<LightPollution>>(new MatTableDataSource());
    readonly sort = viewChild.required(MatSort);
    readonly isLoading = signal<boolean>(true);

    ngAfterViewInit(): void {
        this.databaseService.getData().subscribe((data) => {
            const dataSource = new MatTableDataSource(data);
            dataSource.sort = this.sort();
            this.data.set(dataSource);
            this.isLoading.set(false);
        });
    }
}
