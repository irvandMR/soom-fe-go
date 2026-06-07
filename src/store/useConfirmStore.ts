import { create } from "zustand";

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default" | "success" | "warning" | "info";
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ConfirmStore {
  options: ConfirmOptions | null;
  open: (options: ConfirmOptions) => void;
  close: () => void;
}

export const useConfirmStore = create<ConfirmStore>((set) => ({
  options: null,
  open: (options) => set({ options }),
  close: () => set({ options: null }),
}));

// Helper satu baris — bisa dipanggil dari mana saja
export const confirm = (opts: ConfirmOptions) =>
  useConfirmStore.getState().open(opts);
