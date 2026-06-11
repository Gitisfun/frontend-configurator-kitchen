import { computed } from 'vue';
import type { HandleOption } from '../../api/handles';
import { HANDLES_PATH, defaultHandlesResponse } from '../../api/handles';

export type { HandleOption } from '../../api/handles';

export function useHandles() {
  const { data, pending, error, refresh } = useFetch<HandleOption[]>(HANDLES_PATH, {
    key: 'handles',
    default: defaultHandlesResponse,
  });

  const handles = computed(() => data.value ?? []);

  return { handles, pending, error, refresh };
}
