// src/components/common/OverlayLoading.tsx
import { useLoadingStore } from "@/store/useLoadingStore";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function OverlayLoading() {
  const { isLoading } = useLoadingStore();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20"
        >
          <div className="bg-white rounded-xl px-6 py-4 flex items-center gap-3 shadow-lg">
            <Loader2
              size={20}
              className="animate-spin text-[var(--fandm-primary)] shrink-0"
            />
            <span className="text-sm text-[var(--fandm-text)] font-medium">
              Memuat...
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
