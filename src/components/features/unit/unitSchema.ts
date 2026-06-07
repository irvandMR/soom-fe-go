import z from "zod";

export const unitSchema = z
  .object({
    code: z
      .string()
      .min(1, "Kode unit harus diisi")
      .max(10, "Kode unit maksimal 10 karakter"),
    name: z
      .string()
      .min(1, "Nama unit harus diisi")
      .max(100, "Nama unit maksimal 100 karakter"),
    symbol: z
      .string()
      .min(1, "Simbol unit harus diisi")
      .max(10, "Simbol unit maksimal 10 karakter"),
    have_conversion: z.boolean().default(false),
    base_unit: z.string().min(1, "Unit dasar harus diisi"),
    conversion_factor: z.number().default(1),
  })
  .superRefine((data, ctx) => {
    if (data.have_conversion) {
      if (!data.conversion_factor || data.conversion_factor <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Faktor konversi harus lebih besar dari 0",
          path: ["conversion_factor"],
        });
      }
    }
  });

export type UnitFormData = z.infer<typeof unitSchema>;
