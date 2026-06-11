import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface StepTwoData {
  plinth: unknown;
  front: unknown;
  side: unknown;
  handle: unknown;
}

const STEP_TWO_DEFAULT: StepTwoData = {
  plinth: null,
  front: null,
  side: null,
  handle: null,
};

export const useStepperStore = defineStore(
  'stepper',
  () => {
    const currentStep = ref(0);
    const stepOne = ref('');
    const stepTwo = ref<StepTwoData>({ ...STEP_TWO_DEFAULT });

    function setStep(step: number) {
      currentStep.value = Math.max(0, Math.floor(step));
    }

    function setStepOne(value: string) {
      stepOne.value = value;
    }

    function setStepTwoSelection<K extends keyof StepTwoData>(key: K, value: StepTwoData[K]) {
      stepTwo.value[key] = value;
    }

    function nextStep() {
      currentStep.value++;
    }

    function prevStep() {
      currentStep.value = Math.max(0, currentStep.value - 1);
    }

    function reset() {
      currentStep.value = 0;
      stepOne.value = '';
      stepTwo.value = { ...STEP_TWO_DEFAULT };
    }

    return {
      currentStep,
      stepOne,
      stepTwo,
      setStep,
      setStepOne,
      setStepTwoSelection,
      nextStep,
      prevStep,
      reset,
    };
  },
  {
    persist: true,
  },
);
