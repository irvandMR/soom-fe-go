import { productService, type CreateProductPayload, type UpdateProductPayload } from "@/service/product.service";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

interface UseMutationOptions {
    onSuccess?: () => void
}

export function useCreateProduct({ onSuccess }: UseMutationOptions = {}) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateProductPayload) => productService.create(data),
        onSuccess: (_, val) => {
            queryClient.invalidateQueries({ queryKey: ["product"] })
            toast.success(`Produk "${val.name}" berhasil ditambahkan!`)
            onSuccess?.()
        },
        onError: () => {
            toast.error("Gagal menambahkan produk", {
                description: "Silahkan coba lagi"
            })
        }
    })
}

export function useUpdateProduct({ onSuccess }: UseMutationOptions = {}) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: UpdateProductPayload) => productService.update(data),
        onSuccess: (_, val) => {
            queryClient.invalidateQueries({ queryKey: ["product"] })
            toast.success(`Data produk "${val.name}" berhasil diperbarui!`)
            onSuccess?.()
        },
        onError: () => {
            toast.error("Gagal mamperbarui data", {
                description: "Silahakn coba lagi"
            })
        }
    })
}

export function useDeleteProduct() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => productService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product"] })
            toast.success("Produk berhasil dihapus")
        },
        onError: () => {
            toast.error("Gagal menghapus produk")
        }
    })
}