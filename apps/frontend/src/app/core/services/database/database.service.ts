import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { LightPollution } from '../../../shared/models/light-pollution';

const API_URL = 'http://localhost:3000/api/light-pollution';

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
    private readonly httpClient = inject(HttpClient);
    private data: LightPollution[] | null = null;

    getData(): Observable<LightPollution[]> {
        if (this.data) {
            return of(this.data);
        }
        return this.httpClient.get<LightPollution[]>(API_URL).pipe(
            tap((data) => {
                this.data = data;
            }),
        );
    }
}
