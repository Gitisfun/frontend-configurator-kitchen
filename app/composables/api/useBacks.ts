import { computed } from 'vue';
import type { BackOption } from '../../api/backs';
import { BACKS_PATH, defaultBacksResponse } from '../../api/backs';

export type { BackOption } from '../../api/backs';

export function useBacks() {
  const { data, pending, error, refresh } = useFetch<BackOption[]>(BACKS_PATH, {
    key: 'backs',
    default: defaultBacksResponse,
  });

  const backs = computed(() => data.value ?? []);

  return { backs, pending, error, refresh };
}
