import { z } from "zod";

export const listProductsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
});