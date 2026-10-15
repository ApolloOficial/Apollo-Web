/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_DATABRICKS_CORPORATE_URL?: string
  readonly VITE_DATABRICKS_SOLAR_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
