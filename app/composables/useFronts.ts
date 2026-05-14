import { FRONTS_PATH, defaultFrontsResponse, type FrontOption } from '../services/fronts';

export type { FrontOption };

export function useFronts() {
  const { data, pending, error, refresh } = useFetch<FrontOption[]>(FRONTS_PATH, {
    key: 'fronts',
    default: defaultFrontsResponse,
  });

  const fronts = computed(() => data.value ?? []);

  return { fronts, pending, error, refresh };
}
