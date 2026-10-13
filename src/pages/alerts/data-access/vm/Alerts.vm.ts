import type {
    WarningSeverity,
    WarningStatus,
    WarningType,
} from '../dto/Alerts.dto';

export interface AlertsFiltersViewModel {
    severity: WarningSeverity | '';
    status: WarningStatus | '';
    type: WarningType | '';
}

export const INITIAL_ALERT_FILTERS:
AlertsFiltersViewModel = {
    severity: '',
    status: '',
    type: '',
};

export const severityLabels:
Record<WarningSeverity, string> = {
    BAIXA: 'Baixa',
    MEDIA: 'Média',
    ALTA: 'Alta',
    CRITICA: 'Crítica',
};

export const statusLabels:
Record<WarningStatus, string> = {
    ATIVO: 'Ativo',
    RECONHECIDO: 'Reconhecido',
    RESOLVIDO: 'Resolvido',
};

export const typeLabels:
Record<WarningType, string> = {
    EFICIENCIA_BAIXA: 'Eficiência Baixa',
    FALHA_INVERSOR: 'Falha no Inversor',
    DANO_FISICO: 'Dano Físico',
    SUJIDADE: 'Sujidade',
    PONTO_QUENTE: 'Ponto Quente',
    CONEXAO: 'Conexão',
};