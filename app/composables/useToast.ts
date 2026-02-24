import { ref } from 'vue';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  dismissible?: boolean;
}

const toasts = ref<ToastItem[]>([]);

const DEFAULT_DURATION = 5000;

function addToast(type: ToastType, message: string, options?: { title?: string; dismissible?: boolean; duration?: number }): string {
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const item: ToastItem = {
    id,
    type,
    message,
    title: options?.title,
    dismissible: options?.dismissible ?? true,
  };
  toasts.value = [...toasts.value, item];

  const duration = options?.duration ?? DEFAULT_DURATION;
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
}

function removeToast(id: string): void {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

export function useToast() {
  return {
    toasts,
    success: (message: string, options?: { title?: string; dismissible?: boolean; duration?: number }) => addToast('success', message, options),
    info: (message: string, options?: { title?: string; dismissible?: boolean; duration?: number }) => addToast('info', message, options),
    warning: (message: string, options?: { title?: string; dismissible?: boolean; duration?: number }) => addToast('warning', message, options),
    error: (message: string, options?: { title?: string; dismissible?: boolean; duration?: number }) => addToast('error', message, options),
    dismiss: removeToast,
  };
}
