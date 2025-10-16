interface DocumentFile {
  name: string;
  url?: string;
}

export interface Event {
  date: string;
  title: string;
  description: string;
  files: DocumentFile[] | '-' | '—';
  type: 'success' | 'error' | 'warning' | 'info';
  category: string;
}

export interface EventIconProps {
  type: Event['type'];
}

export interface TimelineEventProps {
  event: Event;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface TypeConfig {
  bg: string;
  border: string;
  iconBg: string;
  text: string;
  dotBg: string;
}

export interface TypeConfigs {
  success: TypeConfig;
  error: TypeConfig;
  warning: TypeConfig;
  info: TypeConfig;
}