import { getStoredStepperStep } from '~/stores/stepper';

export default defineNuxtPlugin(() => {
  const stepper = useStepperStore();
  stepper.setStep(getStoredStepperStep());
});
