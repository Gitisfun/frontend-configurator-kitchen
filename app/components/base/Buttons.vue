<template>
  <div class="buttons">
    <BaseButton variant="outlined" size="medium" rounded @click="emit('back')">
      {{ backLabel }}
    </BaseButton>
    <BaseButton variant="primary" size="medium" rounded @click="emit('next')">
      {{ nextLabel }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
interface Props {
  backLabel?: string;
  nextLabel?: string;
}

withDefaults(defineProps<Props>(), {
  backLabel: 'Terug',
  nextLabel: 'Volgende',
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
