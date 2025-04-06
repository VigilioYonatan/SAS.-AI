import {
    array,
    boolean,
    Input,
    maxValue,
    minValue,
    nullable,
    number,
    object,
    string,
    union,
} from "@vigilio/valibot";

const event_click = object({
    element: string(),
    waitElement: string(),
});

const categoryPrincipal = object({
    ssr: boolean(),
    web_url: string(),
    event_click: nullable(event_click),
    container_element: string(),
    image_url: nullable(string()),
    categoria_url: nullable(string()),
    card: object({
        id: nullable(string()),
        element: string(),
        name: string(),
        url: string(),
        image: nullable(string()),
    }),
});
export type CategoryPrincipalSchema = Input<typeof categoryPrincipal>;

const categoryCustom = object({
    web_url: string(),
    categories: array(
        object({
            id: string(),
            element: string(),
            name: string(),
            url: string(),
            image: nullable(string()),
        })
    ),
});
export type CategoryCustomSchema = Input<typeof categoryCustom>;

const eventVigilio = object({
    element: string(),
    data: array(
        object({
            key: string(),
            element: nullable(string()),
            attr: string(), // "attr:src" | "text" | "html";
            isContainElement: boolean(),
            reduce_url: nullable(string()),
        })
    ),
    max_length: nullable(number()),
});
export type EventVigilioSchema = Input<typeof eventVigilio>;

export const scrappingSchema = object({
    id: number(),
    web_url: string(),
    hours: number([minValue(12), maxValue(48)]),
    categories: nullable(union([categoryPrincipal, categoryCustom])),
    products: nullable(
        object({
            ssr: object({
                enabled: boolean(),
                query: string(),
                page_not_found: nullable(string()),
            }),
            web_url: nullable(string()),
            event_click: nullable(event_click),
            next_click: nullable(event_click),
            container_element: string(),
            product_url: nullable(string()),
            image_url: nullable(string()),
            limit: nullable(number()),
            card: object({
                element: string(),
                name: string(),
                url: string(),
                price: nullable(string()),
                quantity: nullable(string()),
                image: nullable(string()),
            }),
        })
    ),
    product: nullable(
        object({
            ssr: union([boolean(), string()]),
            event_click: nullable(event_click),
            container_element: string(),
            card: object({
                name: string(),
                url: string(),
                price: nullable(string()),
                quantity: nullable(string()),
                description: nullable(string()),
                marca: nullable(string()),
                images: nullable(string()),
                variants: nullable(string()),
                discount: nullable(string()),
            }),
        })
    ),
    //
    pages: array(
        object({
            web_url: string(),
            ssr: boolean(),
            renderer: array(
                object({
                    container_element: string(),
                    title: string(),
                    when: nullable(string()),
                    event: array(eventVigilio),
                })
            ),
        })
    ),
});

export type ScrappingSchema = Input<typeof scrappingSchema>;
export interface ProductIA {
    name: string | null;
    url: string | null;
    image: string | null;
    images: string[] | null;
    price: string | null;
    quantity: string | null;
    marca: string | null;
    description: string | null;
    variants: string | null;
    category: string;
    discount: string | null;
}
export interface CategoryIA {
    id: string;
    image: string | null;
    name: string;
    url: string;
}
