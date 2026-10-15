/**
 * Aceita apenas links https válidos. Qualquer outro valor (vazio, texto solto,
 * http, javascript:) vira string vazia e a tela mostra o estado "não
 * configurado" em vez de montar o iframe.
 */
export function sanitizeEmbedUrl(raw) {
    const value = raw?.trim();
    if (!value)
        return '';
    try {
        const url = new URL(value);
        return url.protocol === 'https:' ? url.toString() : '';
    }
    catch {
        return '';
    }
}
/**
 * Os links de embed dos dashboards do Databricks vêm das variáveis de ambiente
 * VITE_DATABRICKS_CORPORATE_URL e VITE_DATABRICKS_SOLAR_URL (ver .env.example).
 */
export const METRICS_DASHBOARDS = {
    corporate: {
        title: 'Métricas corporativas',
        description: 'Acompanhe o resultado do seu time.',
        iframeTitle: 'Dashboard de métricas corporativas',
        embedUrl: sanitizeEmbedUrl(import.meta.env.VITE_DATABRICKS_CORPORATE_URL),
    },
    solar: {
        title: 'Métricas solares',
        description: 'Acompanhe os resultados das placas solares na empresa.',
        iframeTitle: 'Dashboard de métricas solares',
        embedUrl: sanitizeEmbedUrl(import.meta.env.VITE_DATABRICKS_SOLAR_URL),
    },
};
