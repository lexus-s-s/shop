import getProducts from "../services/products.service.js";
import type { Request, Response } from "express";
import { listProductsQuerySchema } from "../schema/products.schema.js";

export async function listProducts(req: Request, res: Response) {
    const result = listProductsQuerySchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json(result.error.issues)
    }
    const { page, pageSize } = result.data;
    const { items, total } = await getProducts(page, pageSize);
    res.json({ items, total, page, pageSize })

}

