import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export function MetricsDashboardFrame({ embedUrl, title }) {
    const [loadedUrl, setLoadedUrl] = useState('');
    if (!embedUrl) {
        return (_jsxs("div", { className: "metrics-frame metrics-frame--empty", role: "status", children: [_jsx("strong", { children: "Dashboard ainda n\u00E3o configurado" }), _jsx("p", { children: "O link do Databricks para esta tela ainda n\u00E3o foi informado." })] }));
    }
    const loading = loadedUrl !== embedUrl;
    return (_jsxs("div", { className: "metrics-frame", "aria-busy": loading, children: [loading && _jsx("p", { className: "metrics-frame__loading", children: "Carregando..." }), _jsx("iframe", { className: "metrics-frame__iframe", src: embedUrl, title: title, loading: "lazy", allowFullScreen: true, referrerPolicy: "strict-origin-when-cross-origin", onLoad: () => setLoadedUrl(embedUrl) })] }));
}
