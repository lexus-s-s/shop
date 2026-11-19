import { prisma } from "./lib/prisma.js";

type DummyProduct = {
    title: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    thumbnail: string;
};

type GroupNode = {
    name: string;
    groups?: Record<string, GroupNode>;
    categories?: string[];
};

const TREE: Record<string, GroupNode> = {
    men: {
        name: "Мужчинам",
        groups: {
            "men-clothing": { name: "Одежда", categories: ["mens-shirts"] },
            "men-shoes": { name: "Обувь", categories: ["mens-shoes"] },
            "men-accessories": { name: "Аксессуары", categories: ["mens-watches"] },
        },
    },
    women: {
        name: "Женщинам",
        groups: {
            "women-clothing": { name: "Одежда", categories: ["tops", "womens-dresses"] },
            "women-shoes": { name: "Обувь", categories: ["womens-shoes"] },
            "women-accessories": {
                name: "Аксессуары",
                categories: ["womens-bags", "womens-jewellery", "womens-watches"],
            },
        },
    },
    electronics: {
        name: "Электроника",
        categories: ["laptops", "smartphones", "tablets", "mobile-accessories"],
    },
    "beauty-care": {
        name: "Красота",
        categories: ["beauty", "fragrances", "skin-care"],
    },
    home: {
        name: "Дом",
        categories: ["furniture", "home-decoration", "kitchen-accessories", "groceries"],
    },
    transport: {
        name: "Транспорт и спорт",
        categories: ["motorcycle", "vehicle", "sports-accessories"],
    },
};

function upsertCategory(slug: string, name: string, parentId: number | null) {
    return prisma.category.upsert({
        where: { slug },
        update: { name, parentId },
        create: { name, slug, parentId },
    });
}

async function main() {
    const res = await fetch("https://dummyjson.com/products?limit=0");
    if (!res.ok) throw new Error("DummyJSON ответил: " + res.status);
    const { products } = (await res.json()) as { products: DummyProduct[] };

    const parentIdByCategory = new Map<string, number>();

    async function createGroups(nodes: Record<string, GroupNode>, parentId: number | null) {
        for (const [slug, node] of Object.entries(nodes)) {
            const group = await upsertCategory(slug, node.name, parentId);
            for (const c of node.categories ?? []) parentIdByCategory.set(c, group.id);
            if (node.groups) await createGroups(node.groups, group.id);
        }
    }
    await createGroups(TREE, null);

    const slugs = [...new Set(products.map((p) => p.category))];
    const categoryIdBySlug = new Map<string, number>();
    for (const slug of slugs) {
        const name = slug.replace(/-/g, " ");
        const parentId = parentIdByCategory.get(slug) ?? null;
        const category = await upsertCategory(slug, name, parentId);
        categoryIdBySlug.set(slug, category.id);
    }

    await prisma.product.deleteMany();
    await prisma.product.createMany({
        data: products.map((p) => {
            const categoryId = categoryIdBySlug.get(p.category);
            if (categoryId === undefined) throw new Error("Нет категории: " + p.category);
            return {
                name: p.title,
                description: p.description,
                priceCents: Math.round(p.price * 100),
                stock: p.stock,
                imageUrl: p.thumbnail,
                categoryId,
            };
        }),
    });

    console.log(`Seed готов: ${slugs.length} категорий DummyJSON, ${products.length} товаров`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());