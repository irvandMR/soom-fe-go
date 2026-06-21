import api from "@/lib/axios";

export interface CreateProductPayload {
    name: string;
    code: string;
    category_id: string;
    type: string;
    unit_id: string;
    is_active: boolean;
}

export interface UpdateProductPayload extends CreateProductPayload {
    id: string;
}

export const productService = {
    getById: (id: string) => {
        return api.get(`/product/${id}`)
    },
    create: (data: CreateProductPayload) => {
        return api.post("/product", data)
    },
    update: (data: UpdateProductPayload) => {
        return api.post("/product/update", data)
    },
    delete: (id: string) => {
        return api.delete(`/product/${id}`)
    }
}