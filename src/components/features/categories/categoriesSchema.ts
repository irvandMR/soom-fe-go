import z from "zod";

export const categoriesSchema = z.object({
  code: z
    .string()
    .min(1, "Kode kategori harus diisi")
    .max(10, "Kode kategori maksimal 10 karakter"),
  name: z
    .string()
    .min(1, "Nama kategori harus diisi")
    .max(100, "Nama kategori maksimal 100 karakter"),
  type: z.string().min(1, "Type harus diisi"),
  is_active: z.boolean().default(false),
});

export type CategoriesFormData = z.infer<typeof categoriesSchema>;
