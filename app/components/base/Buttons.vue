<template>
  <div class="buttons">
    <BaseButton variant="outlined" size="medium" rounded @click="emit('back')">
      {{ backLabel }}
    </BaseButton>
    <BaseButton v-if="showNext" variant="primary" size="medium" rounded @click="emit('next')">
      {{ nextLabel }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
interface Props {
  backLabel?: string;
  nextLabel?: string;
  /** When false, only the back button is shown (e.g. subcategory drill-down uses row clicks instead). */
  showNext?: boolean;
}

withDefaults(defineProps<Props>(), {
  backLabel: 'Terug',
  nextLabel: 'Volgende',
  showNext: true,
});

const emit = defineEmits<{
  back: [];
  next: [];
}>();
</script>

<style scoped>
.buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
}
</style>
