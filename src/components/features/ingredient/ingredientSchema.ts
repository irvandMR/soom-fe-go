import z from "zod";

export const ingredientSchema = z.object({
  category_id: z.string().nonempty("Tidak boleh kosong"),
  unit_id: z.string().nonempty("Tidak boleh kosong"),
  name: z.string().min(1, "Nama tidak boleh kosong"),
  min_stock: z.coerce.number().min(0, "Minimal Stock tidak boleh negatif"),
  is_active: z.boolean().default(false),
});

export type IngredientFormData = z.infer<typeof ingredientSchema>;

export const stockInIngredientSchema = z.object({
  ingredient_id: z.string().nonempty("Tidak boleh kosong"),
  quantity: z.coerce.number().min(1, "Jumlah stock harus diisi"),
  purchase_price: z.coerce.number().min(0, "Harga beli tidak boleh negatif"),
  notes: z.string().optional(),
});

export type StockInIngredientFormData = z.infer<typeof stockInIngredientSchema>;