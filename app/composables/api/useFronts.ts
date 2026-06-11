import { computed } from 'vue';
import type { FrontOption } from '../../api/fronts';
import { FRONTS_PATH, defaultFrontsResponse } from '../../api/fronts';

export type { FrontOption } from '../../api/fronts';

export function useFronts() {
  const { data, pending, error, refresh } = useFetch<FrontOption[]>(FRONTS_PATH, {
    key: 'fronts',
    default: defaultFrontsResponse,
  });

  const fronts = computed(() => data.value ?? []);

  return { fronts, pending, error, refresh };
}
