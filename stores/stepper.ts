import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const STEPPER_STORAGE_KEY = 'configurator-stepper-step';
export const STEP_ONE_STORAGE_KEY = 'step one';
export const STEP_TWO_STORAGE_KEY = 'step two';

/** Step two selections (plinth, front, side, handle) – stored as plain JSON */
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

export function getStoredStepperStep(): number {
  if (import.meta.server) return 0;
  try {
    const raw = localStorage.getItem(STEPPER_STORAGE_KEY);
    if (raw === null) return 0;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function getStoredStepOne(): string {
  if (import.meta.server) return '';
  try {
    const raw = localStorage.getItem(STEP_ONE_STORAGE_KEY);
    return raw ?? '';
  } catch {
    return '';
  }
}

function saveStep(step: number): void {
  if (import.meta.server) return;
  try {
    localStorage.setItem(STEPPER_STORAGE_KEY, String(step));
  } catch {
    // ignore
  }
}

function saveStepOne(value: string): void {
  if (import.meta.server) return;
  try {
    localStorage.setItem(STEP_ONE_STORAGE_KEY, value);
  } catch {
    // ignore
  }
}

export function getStoredStepTwo(): StepTwoData {
  if (import.meta.server) return { ...STEP_TWO_DEFAULT };
  try {
    const raw = localStorage.getItem(STEP_TWO_STORAGE_KEY);
    if (raw === null) return { ...STEP_TWO_DEFAULT };
    const parsed = JSON.parse(raw) as StepTwoData;
    return {
      plinth: parsed.plinth ?? null,
      front: parsed.front ?? null,
      side: parsed.side ?? null,
      handle: parsed.handle ?? null,
    };
  } catch {
    return { ...STEP_TWO_DEFAULT };
  }
}

function saveStepTwo(value: StepTwoData): void {
  if (import.meta.server) return;
  try {
    localStorage.setItem(STEP_TWO_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const useStepperStore = defineStore('stepper', () => {
  const currentStep = ref(getStoredStepperStep());
  const stepOne = ref(getStoredStepOne());
  const stepTwo = ref<StepTwoData>(getStoredStepTwo());

  watch(
    currentStep,
    (step) => {
      saveStep(step);
    },
    { immediate: false }
  );

  watch(
    stepOne,
    (value) => {
      saveStepOne(value);
    },
    { immediate: false }
  );

  watch(
    stepTwo,
    (value) => {
      saveStepTwo(value);
    },
    { immediate: false, deep: true }
  );

  function setStep(step: number) {
    const value = Math.max(0, Math.floor(step));
    currentStep.value = value;
  }

  function setStepOne(value: string) {
    stepOne.value = value;
  }

  function setStepTwoSelection<K extends keyof StepTwoData>(key: K, value: StepTwoData[K]) {
    stepTwo.value = { ...stepTwo.value, [key]: value };
  }

  function nextStep() {
    currentStep.value += 1;
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
});
