import { PLINTHS_PATH, defaultPlinthsResponse, type PlinthOption } from '../services/plinths';

export type { PlinthOption };

export function usePlinths() {
  const { data, pending, error, refresh } = useFetch<PlinthOption[]>(PLINTHS_PATH, {
    key: 'plinths',
    default: defaultPlinthsResponse,
  });

  const plinths = computed(() => data.value ?? []);

  return { plinths, pending, error, refresh };
}
