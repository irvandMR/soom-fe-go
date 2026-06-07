import { useConfirmStore } from "@/store/useConfirmStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  AlertTriangle,
  Trash2,
  Info,
  HelpCircle,
  CheckCircle,
} from "lucide-react";

// Icon & warna otomatis berdasarkan variant
const MEDIA_CONFIG = {
  danger: { icon: <Trash2 size={20} />, bg: "bg-red-100 text-red-600" },
  warning: {
    icon: <AlertTriangle size={20} />,
    bg: "bg-amber-100 text-amber-600",
  },
  default: { icon: <HelpCircle size={20} />, bg: "bg-blue-100 text-blue-600" },
  info: { icon: <Info size={20} />, bg: "bg-blue-100 text-blue-600" },
  success: {
    icon: <CheckCircle size={20} />,
    bg: "bg-green-100 text-green-600",
  },
};

export default function ConfirmDialog() {
  const { options, close } = useConfirmStore();

  const media = MEDIA_CONFIG[options?.variant ?? "default"];

  const handleConfirm = () => {
    options?.onConfirm();
    close();
  };

  const handleCancel = () => {
    options?.onCancel?.();
    close();
  };

  return (
    <AlertDialog open={!!options} onOpenChange={(open) => !open && close()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* Icon */}
          <AlertDialogMedia className={media.bg}>{media.icon}</AlertDialogMedia>

          <AlertDialogTitle>{options?.title}</AlertDialogTitle>
          {options?.description && (
            <AlertDialogDescription>
              {options.description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {options?.cancelLabel ?? "Batal"}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={options?.variant === "danger" ? "destructive" : "default"}
            onClick={handleConfirm}
          >
            {options?.confirmLabel ?? "Ya, lanjutkan"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
