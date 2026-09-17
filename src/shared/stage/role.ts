import {
  STAGE_QUERY_KEY,
  STAGE_QUERY_VALUE,
  type StageRole,
} from './constants';

export function isStageSearch(search: string): boolean {
  const normalized = search.startsWith('?') ? search.slice(1) : search;
  return new URLSearchParams(normalized).get(STAGE_QUERY_KEY) === STAGE_QUERY_VALUE;
}

export function withStageParam(search: string): string {
  const params = new URLSearchParams(
    search.startsWith('?') ? search.slice(1) : search,
  );
  params.set(STAGE_QUERY_KEY, STAGE_QUERY_VALUE);
  return `?${params.toString()}`;
}

export function stripStageParam(search: string): string {
  const params = new URLSearchParams(
    search.startsWith('?') ? search.slice(1) : search,
  );
  params.delete(STAGE_QUERY_KEY);
  const next = params.toString();
  return next ? `?${next}` : '';
}

export function buildStageUrl(href: string): string {
  const url = new URL(href);
  url.searchParams.set(STAGE_QUERY_KEY, STAGE_QUERY_VALUE);
  return url.toString();
}

export function getStageRole(): StageRole {
  return isStageSearch(window.location.search) ? 'stage' : 'controller';
}
