import { prisma } from "../lib/prisma.js"

function getProducts() {
    return prisma.product.findMany({
        orderBy: {
            id: 'asc',
        },
        take: 10
    })
}
export default getProducts