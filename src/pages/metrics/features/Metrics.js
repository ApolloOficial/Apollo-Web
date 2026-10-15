import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, NavLink } from 'react-router-dom';
import { paths } from '../../../routes/paths';
import { METRICS_DASHBOARDS } from '../data-access/config/Metrics.config';
import '../Metrics.css';
import { MetricsDashboardFrame } from './dashboard-frame/MetricsDashboardFrame';
export function MetricsFeature({ type }) {
    const dashboard = METRICS_DASHBOARDS[type];
    return (_jsxs("section", { className: "metrics-page", children: [_jsxs("nav", { className: "metrics-page__breadcrumb", "aria-label": "Navega\u00E7\u00E3o estrutural", children: [_jsx(Link, { to: paths.home, children: "In\u00EDcio" }), _jsx("span", { children: "\u203A" }), _jsx("strong", { children: "M\u00E9tricas" })] }), _jsxs("header", { className: "metrics-page__heading", children: [_jsx("h1", { children: dashboard.title }), _jsx("p", { children: dashboard.description })] }), _jsxs("nav", { className: "metrics-page__tabs", "aria-label": "Tipo de m\u00E9trica", children: [_jsx(NavLink, { to: paths.metricsCorporate, children: "Corporativas" }), _jsx(NavLink, { to: paths.metricsSolar, children: "Solares" })] }), _jsx(MetricsDashboardFrame, { embedUrl: dashboard.embedUrl, title: dashboard.iframeTitle }, type)] }));
}
