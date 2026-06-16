import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Ingredients } from "@/types/ingredients.type";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { stockInIngredientSchema, type StockInIngredientFormData } from "./ingredientSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useStockInIngredient } from "./useIngredientMutation";
import { Loader2 } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

interface FormModalStockInIngredientProps {
    open: boolean;
    onClose: () => void;
    ingredientData?: Ingredients | null;
}
export default function FormModalStockInIngredient({ open, onClose, ingredientData }: FormModalStockInIngredientProps) {
    const stockInMutation = useStockInIngredient({ onSuccess: onClose })
    const isPending = stockInMutation.isPending



    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<StockInIngredientFormData>({
        resolver: zodResolver(stockInIngredientSchema) as any,
        defaultValues: {
            ingredient_id: ingredientData?.id || "",
            quantity: 1,
            purchase_price: 0,
            notes: "",
        },
    })

    const quantity = watch("quantity")
    const purchasePrice = watch("purchase_price")
    const pricePerUnit = quantity > 0 && purchasePrice > 0
        ? purchasePrice / quantity
        : null

    useEffect(() => {
        if (open && ingredientData) {
            reset({
                ingredient_id: ingredientData.id,
                quantity: 1,
                purchase_price: 0,
                notes: "",
            })
        }
    }, [open, ingredientData, reset])



    const onSubmit = (data: StockInIngredientFormData) => {
        const payload = {
            ingredient_id: ingredientData?.id || "",
            quantity: data.quantity,
            purchase_price: data.purchase_price,
            notes: data.notes,
        }

        stockInMutation.mutate(payload)
    }

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Stock {ingredientData?.name}</DialogTitle>
                    <DialogDescription>
                        Masukkan jumlah stock <strong>{ingredientData?.name.toLowerCase()}</strong> yang ingin ditambahkan
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-2">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[var(--fandm-text)]">
                            Nama Bahan Baku
                        </label>
                        <Input placeholder="Contoh: Tepung Terigu" value={ingredientData?.name ?? ""} disabled className="disabled:opacity-60" />

                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[var(--fandm-text)]">
                            Minimal Stock tersedia
                        </label>
                        <span>{ingredientData?.min_stock} <Badge variant="info">{ingredientData?.unit_symbol}</Badge> </span>

                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[var(--fandm-text)]">
                            Jumlah Stock
                        </label>
                        {/* <Input placeholder="Contoh: 100" {...register("quantity")} /> */}
                        <InputGroup>
                            <InputGroupInput type="number" placeholder="500" {...register("quantity", { valueAsNumber: true })} />
                            <InputGroupAddon align="inline-end">{ingredientData?.unit_symbol}</InputGroupAddon>
                        </InputGroup>

                        {errors.quantity && (
                            <p className="text-xs text-red-500">{errors.quantity.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[var(--fandm-text)]">
                            Harga Beli
                        </label>
                        <div className="flex h-8 w-full rounded-lg border border-input bg-transparent text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 overflow-hidden">
                            <span className="flex items-center px-2.5 bg-muted/50 border-r border-input text-muted-foreground text-xs font-medium shrink-0 select-none">
                                Rp
                            </span>
                            <input
                                type="number"
                                placeholder="0"
                                className="flex-1 min-w-0 px-2.5 py-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                {...register("purchase_price", { valueAsNumber: true })}
                            />
                        </div>

                        {errors.purchase_price && (
                            <p className="text-xs text-red-500">{errors.purchase_price.message}</p>
                        )}
                    </div>
                    {/* Preview harga per unit — otomatis dihitung */}
                    {pricePerUnit !== null && (
                        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[var(--status-info-bg)] border border-[var(--status-info-text)]/20">
                            <span className="text-xs text-[var(--status-info-text)]">
                                Harga per <strong>{ingredientData?.unit_symbol ?? "unit"}</strong>
                            </span>
                            <span className="text-xs font-semibold text-[var(--status-info-text)]">
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    maximumFractionDigits: 0,
                                }).format(pricePerUnit)}
                            </span>
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[var(--fandm-text)]">
                            Catatan
                        </label>
                        <Textarea placeholder="Contoh: Beli di pasar" {...register("notes")} />

                    </div>
                </div>
                <DialogFooter className="pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        onClick={handleSubmit(onSubmit)}
                    >
                        {isPending && <Loader2 size={14} className="animate-spin mr-1.5" />}
                        Tambah Stock
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}