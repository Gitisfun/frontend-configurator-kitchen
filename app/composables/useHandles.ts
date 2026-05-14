import { HANDLES_PATH, defaultHandlesResponse, type HandleOption } from '../services/handles';

export type { HandleOption };

export function useHandles() {
  const { data, pending, error, refresh } = useFetch<HandleOption[]>(HANDLES_PATH, {
    key: 'handles',
    default: defaultHandlesResponse,
  });

  const handles = computed(() => data.value ?? []);

  return { handles, pending, error, refresh };
}
