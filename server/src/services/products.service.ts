import { prisma } from "../lib/prisma.js"

async function getProducts(page: number, pageSize: number) {
    const total = await prisma.product.count();
    const skip = (page - 1) * pageSize
    const items = await prisma.product.findMany({
        orderBy: {
            id: 'asc',
        },
        skip,
        take: pageSize
    })
    return { items, total };
}
export default getProducts