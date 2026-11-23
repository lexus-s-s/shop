import getProducts from "../services/products.service.js";
import type { Request, Response } from "express";

const pageSize = 20

export async function listProducts(req: Request, res: Response) {
    const page = Math.max(1, Number(req.query.page) || 1)
    const { items, total } = await getProducts(page, pageSize);
    res.json({ items, total, page, pageSize })
}