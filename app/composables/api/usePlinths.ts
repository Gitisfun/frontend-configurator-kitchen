import { computed } from 'vue';
import type { PlinthOption } from '../../api/plinths';
import { PLINTHS_PATH, defaultPlinthsResponse } from '../../api/plinths';

export type { PlinthOption } from '../../api/plinths';

export function usePlinths() {
  const { data, pending, error, refresh } = useFetch<PlinthOption[]>(PLINTHS_PATH, {
    key: 'plinths',
    default: defaultPlinthsResponse,
  });

  const plinths = computed(() => data.value ?? []);

  return { plinths, pending, error, refresh };
}
