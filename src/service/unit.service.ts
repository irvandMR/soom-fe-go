import api from "@/lib/axios";

export interface CreateUnitPayload {
  code: string;
  name: string;
  symbol: string;
  have_conversion: boolean;
  base_unit?: string;
  conversion_factor?: number;
}

export interface UpdateUnitPayload extends CreateUnitPayload {
  id: string;
}

export const unitService = {
  getById: (id: string) => {
    return api.get(`/uoms/${id}`);
  },

  create: (data: CreateUnitPayload) => {
    return api.post("/uoms", data);
  },

  update: (data: UpdateUnitPayload) => {
    return api.post("/uoms/update", data);
  },

  delete: (id: string) => {
    return api.delete(`/uoms/${id}`);
  },
};
