import { BACKS_PATH, defaultBacksResponse, type BackOption } from '../services/backs';

export type { BackOption };

export function useBacks() {
  const { data, pending, error, refresh } = useFetch<BackOption[]>(BACKS_PATH, {
    key: 'backs',
    default: defaultBacksResponse,
  });

  const backs = computed(() => data.value ?? []);

  return { backs, pending, error, refresh };
}
