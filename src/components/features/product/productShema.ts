import z from "zod";

export const productCreateShema = z.object({
    code: z.string().nonempty("Tidak boleh kosong"),
    name: z.string().nonempty("Tidak boleh kosong"),
    unit_id: z.string().nonempty("Tidak boleh kosong"),
    category_id: z.string().nonempty("Tidak boleh kosong"),
    type: z.string().nonempty("Tidak boleh kosong"),
    is_active: z.boolean().default(false),
})

export type ProductFormData = z.infer<typeof productCreateShema>;
