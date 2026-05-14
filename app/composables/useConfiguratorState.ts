import { computed, ref } from 'vue';
import { PICKER_KEY_PLINTH, PICKER_KEY_FRONT, PICKER_KEY_SIDE_PANEL, PICKER_KEY_HANDLE, type ConfiguratorPickerKey } from '../constants/configurator';
import type { FrontOption } from '../models/front';
import type { PlinthOption } from '../models/plinth';
import type { BackOption } from '../models/back';
import type { HandleOption } from '../models/handle';
import { useStepperStore } from '../../stores/stepper';

export type PickerKey = ConfiguratorPickerKey;

export function useConfiguratorState() {
  const stepper = useStepperStore();
  const plinthPanelOpen = ref(false);
  const plinthSelection = computed<PlinthOption | null>({
    get: () => stepper.stepTwo.plinth as PlinthOption | null,
    set: (v) => stepper.setStepTwoSelection('plinth', v),
  });
  const frontPanelOpen = ref(false);
  const frontSelection = computed<FrontOption | null>({
    get: () => stepper.stepTwo.front as FrontOption | null,
    set: (v) => stepper.setStepTwoSelection('front', v),
  });
  const sidePanelOpen = ref(false);
  const sideSelection = computed<BackOption | null>({
    get: () => stepper.stepTwo.side as BackOption | null,
    set: (v) => stepper.setStepTwoSelection('side', v),
  });
  const handlePanelOpen = ref(false);
  const handleSelection = computed<HandleOption | null>({
    get: () => stepper.stepTwo.handle as HandleOption | null,
    set: (v) => stepper.setStepTwoSelection('handle', v),
  });

  function onPickerClick(key: ConfiguratorPickerKey | string) {
    if (key === PICKER_KEY_PLINTH) {
      plinthPanelOpen.value = true;
    } else if (key === PICKER_KEY_FRONT) {
      frontPanelOpen.value = true;
    } else if (key === PICKER_KEY_SIDE_PANEL) {
      sidePanelOpen.value = true;
    } else if (key === PICKER_KEY_HANDLE) {
      handlePanelOpen.value = true;
    } else {
      console.log('Picker clicked:', key);
    }
  }

  return {
    plinthPanelOpen,
    plinthSelection,
    frontPanelOpen,
    frontSelection,
    sidePanelOpen,
    sideSelection,
    handlePanelOpen,
    handleSelection,
    onPickerClick,
  };
}
