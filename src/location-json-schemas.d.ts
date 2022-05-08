// @todo: add type definitions to the module
declare module '@brokalys/location-json-schemas' {
  export interface BaseProperties {
    name: string;
    id: string;
  }

  export type LatviaFeatureProperties = { Level: number } & BaseProperties;
  export type LatviaGeoJsonFeature = GeoJSON.Feature<
    GeoJSON.MultiPolygon,
    LatviaFeatureProperties
  >;

  export type RigaFeatureProperties = { gid: number } & BaseProperties;
  export type RigaGeoJsonFeature = GeoJSON.Feature<
    GeoJSON.Polygon,
    RigaFeatureProperties
  >;

  export const latvia: GeoJSON.FeatureCollection<
    GeoJSON.MultiPolygon,
    LatviaFeatureProperties
  >;
  export const riga: GeoJSON.FeatureCollection<
    GeoJSON.Polygon,
    RigaFeatureProperties
  >;
}
