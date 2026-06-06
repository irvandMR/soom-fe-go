import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Unit } from "./useUnitQuery";

interface UnitCardProps {
  data: Unit;
  onEdit: (unit: Unit) => void;
  onDelete: (unit: Unit) => void;
}

export default function UnitCard({ data, onEdit, onDelete }: UnitCardProps) {
  return (
    <Card className="border-[var(--fandm-border)] shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Kiri: info unit */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Badge simbol */}
            <div className="w-10 h-10 rounded-lg bg-[var(--fandm-bg)] border border-[var(--fandm-border)] flex items-center justify-center shrink-0">
              <span className="text-sm font-mono font-semibold text-[var(--fandm-text)]">
                {data.Symbol}
              </span>
            </div>

            {/* Nama + tanggal */}
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--fandm-text)] truncate">
                {data.Name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(data.CreatedAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Kanan: aksi */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon-sm"
              icon={<Pencil size={13} />}
              iconOnly
              onClick={() => onEdit(data)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="icon-sm"
              icon={<Trash2 size={13} />}
              iconOnly
              onClick={() => onDelete(data)}
            >
              Hapus
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
