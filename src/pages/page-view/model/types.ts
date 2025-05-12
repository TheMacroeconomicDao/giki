import { Page, PageVisibility } from '@/entities/page';
import { Version } from '@/entities/version';

export interface PageViewParams {
  id: string;
}

export interface PageViewProps {
  id: string;
}

export interface PageViewState {
  loading: boolean;
  error: string | null;
  showHistory: boolean;
  selectedLanguage: string;
  page: Page | null;
}

export interface HistoryViewState {
  versions: Version[];
  loading: boolean;
  error: string | null;
} 