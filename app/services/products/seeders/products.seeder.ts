import { slug } from "@vigilio/express-core/helpers";
import { Brands } from "../entities/brands.entitiy";
import type { ProductsNormalStoreDto } from "../dtos/products_normal.dto";

export async function productsSeeder(empresa_id: number) {
    const response = await fetch("https://fakestoreapi.com/products");
    const result = await response.json();
    await Brands.create({
        name: "asdasdas",
        brand_code: "BRAND-00001",
        image: null,
        slug: "asadasd",
        empresa_id,
    });
    function products(i: number): ProductsNormalStoreDto[] {
        return result.map(
            (
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                prod: any
            ): ProductsNormalStoreDto => ({
                name: prod.title,
                price: prod.price,
                description: prod.description,
                images: [{ file: prod.image, dimension: 500 }],
                brand_id: 1,
                characteristics: [],
                discount: Math.floor(Math.random() * 21),
                enabled: true,
                slug: slug(prod.title),
                url: null,
                options: [{ features: [1], option_id: 1 }],
                category_id: i,
                empresa_id: empresa_id,
                cuota_config: null,
                subcategory_id: null,
                enabled_local: true,
                enabled_web: true,
            })
        );
    }
    return [
        {
            name: "Perros",
            category_code: "CAT-000001",
            image: [
                {
                    file: "https://cvfaunia.com/wp-content/uploads/2023/07/grupo-perros-diversas-razas-tamanos-colores-mirando-camara-creada-ia-generativa-1024x683.jpg",
                    dimension: 100,
                },
            ],
            icon: "<i class='fal fa-dog'></i>",
            slug: slug("dog"),
            products: products(1),
        },
        {
            name: "Gatos",
            category_code: "CAT-000002",
            image: [
                {
                    file: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRE-2LvjA13dLq4wV8tlg3Fk4qrwW15y8EC2pbEH37eA&s",
                    dimension: 100,
                },
            ],
            icon: "<i class='fal fa-cat'></i>",
            slug: slug("cat"),
            products: products(2),
        },
        {
            name: "Pez",
            category_code: "CAT-000003",
            image: [
                {
                    file: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRE-2LvjA13dLq4wV8tlg3Fk4qrwW15y8EC2pbEH37eA&s",
                    dimension: 100,
                },
            ],
            icon: "<i class='far fa-fish'></i>",
            slug: slug("pez"),
            products: products(3),
        },
        {
            name: "Mascotas pequeñas",
            category_code: "CAT-000004",
            image: [
                {
                    file: "https://fundaciondelcorazon.com/images/stories/iStock-949190756.jpg",
                    dimension: 100,
                },
            ],
            icon: "<i class='far fa-rabbit'></i>",
            slug: slug("Mascotas pequeñas"),
            products: products(4),
        },
        {
            name: "Reptiles",
            category_code: "CAT-000005",
            image: [
                {
                    file: "https://fundaciondelcorazon.com/images/stories/iStock-949190756.jpg",
                    dimension: 100,
                },
            ],
            icon: "<i class='far fa-turtle'></i>",
            slug: slug("Reptiles"),
            products: products(5),
        },
        {
            name: "Pájaros",
            category_code: "CAT-000006",
            image: [
                {
                    file: "https://fundaciondelcorazon.com/images/stories/iStock-949190756.jpg",
                    dimension: 100,
                },
            ],
            icon: "<i class='far fa-crow'></i>",
            slug: slug("Pajaros"),
            products: products(6),
        },
        {
            name: "Farmacía",
            category_code: "CAT-000007",
            image: [
                {
                    file: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLGeEBqr2VWaIvC0RUbP0MsIgRkfw_nnJbvg&s",
                    dimension: 100,
                },
            ],
            icon: "<i class='fal fa-prescription-bottle-alt'></i>",
            slug: slug("Farmacia"),
            products: products(7),
        },
    ];
}
