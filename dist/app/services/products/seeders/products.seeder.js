"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsSeeder = productsSeeder;
const helpers_1 = require("@vigilio/express-core/helpers");
const brands_entitiy_1 = require("../entities/brands.entitiy");
function productsSeeder(empresa_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://fakestoreapi.com/products");
        const result = yield response.json();
        yield brands_entitiy_1.Brands.create({
            name: "asdasdas",
            brand_code: "BRAND-00001",
            image: null,
            slug: "asadasd",
            empresa_id,
        });
        function products(i) {
            return result.map((prod) => ({
                name: prod.title,
                price: prod.price,
                description: prod.description,
                images: [{ file: prod.image, dimension: 500 }],
                brand_id: 1,
                characteristics: [],
                discount: Math.floor(Math.random() * 21),
                enabled: true,
                slug: (0, helpers_1.slug)(prod.title),
                url: null,
                options: [{ features: [1], option_id: 1 }],
                category_id: i,
                empresa_id: empresa_id,
                subcategory_id: null,
            }));
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
                slug: (0, helpers_1.slug)("dog"),
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
                slug: (0, helpers_1.slug)("cat"),
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
                slug: (0, helpers_1.slug)("pez"),
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
                slug: (0, helpers_1.slug)("Mascotas pequeñas"),
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
                slug: (0, helpers_1.slug)("Reptiles"),
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
                slug: (0, helpers_1.slug)("Pajaros"),
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
                slug: (0, helpers_1.slug)("Farmacia"),
                products: products(7),
            },
        ];
    });
}
