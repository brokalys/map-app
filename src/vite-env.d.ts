/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUGSNAG_KEY: string;
  readonly VITE_GOOGLE_MAPS_KEY: string;
  readonly VITE_API_ENDPOINT: string;
  readonly VITE_STATIC_API_ENDPOINT: string;
  readonly VITE_BROKALYS_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
