import { prisma } from "../lib/prisma.js"

async function getProducts(page: number, pageSize: number, search: string | undefined) {

    const where = search ? { name: { contains: search } } : {};
    const skip = (page - 1) * pageSize
    const total = await prisma.product.count({ where });
    const items = await prisma.product.findMany({
        where,
        orderBy: {
            id: 'asc',
        },
        skip,
        take: pageSize
    })
    return { items, total };
}
export default getProducts