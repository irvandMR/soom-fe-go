import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Categories } from "@/types/categories.type";
import { CircleCheck, CircleX, Pencil, Trash2 } from "lucide-react";

interface CategoriesCardProps {
  data: Categories;
  onEdit: (categorie: Categories) => void;
  onDelete: (categorie: Categories) => void;
}

export default function CategoriesCard({
  data,
  onDelete,
  onEdit,
}: CategoriesCardProps) {
  return (
    <Card className="border-[var(--fandm-border)] shadow-none">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {data.Code}
              </span>
              {data.IsActive ? (
                <CircleCheck size={13} className="text-green-500 shrink-0" />
              ) : (
                <CircleX size={13} className="text-red-500 shrink-0" />
              )}
            </div>

            <span className="text-sm font-medium text-foreground truncate">
              {data.Name}
            </span>

            <span className="text-xs self-start text-[var(--fandm-text-muted)] rounded-full">
              {data.Type}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 mt-0.5">
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
