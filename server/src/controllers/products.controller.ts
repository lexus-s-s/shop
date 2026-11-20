import getProducts from "../services/products.service.js";
import type { Request, Response } from "express";

export async function listProducts(req: Request, res: Response) {
    const products = await getProducts()
    res.json(products)
}