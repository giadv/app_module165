import { HttpClient } from '@angular/common/http';
import {
    AfterViewInit,
    Component,
    computed,
    DestroyRef,
    effect,
    inject,
    signal,
} from '@angular/core';
import * as L from 'leaflet';
import { DatabaseService } from '../../core/services/database/database.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { LightPollution } from '../../shared/models/light-pollution';
import { MatSelectModule } from '@angular/material/select';
import { form, FormField } from '@angular/forms/signals';
import { GeoJsonObject, Feature, Geometry } from 'geojson';

interface PopupContent {
    name: string;
    value: string;
}

@Component({
    selector: 'app-map',
    imports: [MatProgressSpinnerModule, MatCardModule, MatSelectModule, FormField],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit {
    private readonly httpClient = inject(HttpClient);
    private readonly destroyRef = inject(DestroyRef);
    private readonly databaseService = inject(DatabaseService);

    readonly YEARS = Array.from({ length: 2024 - 2006 + 1 }, (_, i) => 2006 + i);

    private map: L.Map | null = null;
    private geoJsonLayer: L.GeoJSON<any, Geometry> | null = null;
    private geoJsonData: GeoJsonObject | null = null;

    readonly popupContent = signal<PopupContent | null>(null);
    readonly isLoading = signal<boolean>(true);
    readonly selectedYear = signal<number>(this.YEARS[this.YEARS.length - 1]);
    readonly form = form(this.selectedYear);

    private readonly data = signal<LightPollution[]>([]);
    private readonly filteredData = computed(() =>
        this.data().filter((item) => item.year === this.selectedYear()),
    );

    constructor() {
        effect(() => {
            this.filteredData(); // dépendance sur année + données
            this.refreshLayerColors();
        });
    }

    ngAfterViewInit(): void {
        this.initMap();
        this.loadData();

        requestAnimationFrame(() => this.map?.invalidateSize());

        this.destroyRef.onDestroy(() => {
            this.map?.remove();
            this.map = null;
        });
    }

    private loadData(): void {
        this.databaseService.getData().subscribe((data) => {
            this.data.set(data);
        });
    }

    private initMap(): void {
        this.map = L.map('map', {
            attributionControl: false,
            maxBoundsViscosity: 1,
            zoomSnap: 0,
        }).setView([0, 0], 2);

        this.httpClient.get<GeoJsonObject>('assets/custom.geo.json').subscribe((data) => {
            this.geoJsonData = data;
            this.createGeoJsonLayer();
            const bounds = this.geoJsonLayer!.getBounds();
            this.handleBounds(bounds);
            this.isLoading.set(false);
        });
    }

    private createGeoJsonLayer(): void {
        if (this.geoJsonLayer) {
            this.map?.removeLayer(this.geoJsonLayer);
        }
        this.geoJsonLayer = L.geoJSON(this.geoJsonData!, {
            style: (feature) => ({
                color: '#ffffff',
                weight: 1,
                fillColor: this.getColorForValue(
                    this.getValueForCountry(feature?.properties?.name),
                ),
                fillOpacity: 1,
            }),
            onEachFeature: (feature, layer) => {
                layer.on('mouseover', () => this.onMouseOver(feature, layer));
                layer.on('mouseout', () => this.onMouseOut(this.geoJsonLayer!, layer));
            },
        }).addTo(this.map!);
    }

    private refreshLayerColors(): void {
        if (!this.geoJsonLayer) return;
        this.geoJsonLayer.eachLayer((layer) => {
            const feature = (layer as any).feature as Feature<Geometry, any>;
            (layer as L.Path).setStyle({
                fillColor: this.getColorForValue(
                    this.getValueForCountry(feature?.properties?.name),
                ),
            });
        });
    }

    private handleBounds(bounds: L.LatLngBounds): void {
        if (bounds.isValid()) {
            const constrainedZoom = this.map!.getBoundsZoom(bounds, true);

            this.map!.setView(bounds.getCenter(), constrainedZoom);
            this.map!.setMaxBounds(bounds);
            this.map!.setMinZoom(constrainedZoom);
            this.map!.on('drag', () => this.map?.panInsideBounds(bounds, { animate: false }));
            this.map!.on('zoomend', () => this.map?.panInsideBounds(bounds, { animate: false }));
        }
    }

    private onMouseOver(feature: Feature<Geometry, any>, layer: L.Layer): void {
        (layer as L.Path).setStyle({
            color: '#ffffff',
            weight: 2,
            fillColor: '#765a71',
            fillOpacity: 1,
        });

        this.popupContent.set({
            name: feature.properties?.name || 'Unknown',
            value: this.getValueForCountry(feature.properties?.name)?.toString() || 'N/A',
        });
    }

    private onMouseOut(geoJsonLayer: L.GeoJSON<any, Geometry>, layer: L.Layer): void {
        geoJsonLayer.resetStyle(layer);
        this.popupContent.set(null);
    }

    private getValueForCountry(country?: string): number | null {
        if (!country) return null;

        if (this.isUSA(country)) {
            return this.getAvgForUSA();
        }

        const entry = this.filteredData().find((item) => item.country === country);
        return entry ? entry.value : null;
    }

    private getAvgForUSA(): number | null {
        const usaValue = this.filteredData().find((item) => item.country === 'United States');
        if (usaValue) return usaValue.value;

        const usaEntries = this.filteredData().filter((item) => this.isUSA(item.country));
        if (usaEntries.length === 0) return null;

        const avg = usaEntries.reduce((sum, item) => sum + item.value, 0) / usaEntries.length;
        return parseFloat(avg.toFixed(2));
    }

    private isUSA = (country: string): boolean => country.startsWith('United States');

    private getColorForValue(value: number | null): string {
        if (value === null) return '#8f8f8f';
        if (value < 3.5) return '#a00026';
        if (value < 4.0) return '#ad003f';
        if (value < 4.5) return '#b9205e';
        if (value < 5.0) return '#c43f77';
        if (value < 5.5) return '#ce5f90';
        if (value < 6.0) return '#d97fa9';
        if (value < 6.5) return '#e39fc2';
        if (value < 7.0) return '#eec0d9';
        return '#f7daef';
    }
}
