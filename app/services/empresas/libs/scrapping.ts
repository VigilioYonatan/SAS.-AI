import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";
import type {
    CategoryIA,
    CategoryPrincipalSchema,
    ProductIA,
    ScrappingSchema,
} from "../schemas/scrapping.schema";
export async function getCategories(
    settings: ScrappingSchema
): Promise<CategoryIA[]> {
    let html: string | null = null;
    const categoriesSettings = settings.categories as CategoryPrincipalSchema;

    try {
        if (!categoriesSettings.ssr) {
            let dom: JSDOM | null = null;
            try {
                dom = await JSDOM.fromURL(categoriesSettings.web_url, {
                    runScripts: "dangerously",
                    resources: "usable",
                    pretendToBeVisual: false,
                });
                await delayDocument(dom.window.document);
                if (categoriesSettings.event_click) {
                    const evtClick = dom.window.document.querySelector(
                        categoriesSettings.event_click.element
                    ) as HTMLElement;
                    evtClick?.click();
                    await waitForComponent(
                        dom.window.document,
                        categoriesSettings.event_click.waitElement
                    );
                }

                html = dom.serialize();
                dom.window.close();
            } catch (error) {}
        } else {
            const responseweb = await fetch(categoriesSettings.web_url);
            html = await responseweb.text();
        }

        const $ = cheerio.load(html!);
        const navCatContent = $(categoriesSettings.container_element);

        let categories: CategoryIA[] = [];
        navCatContent
            .find(categoriesSettings.card.element)
            .each((index, element) => {
                const name =
                    $(element)
                        .find(categoriesSettings.card.name)
                        .text()
                        .trim() || "";
                const image = categoriesSettings.card.image
                    ? (
                          $(element)
                              .find(categoriesSettings.card.image)
                              .attr("src") || ""
                      ).trim() || ""
                    : "";
                const url =
                    $(element).find(categoriesSettings.card.url).attr("href") ||
                    "";
                const deleteUrlCategoria = categoriesSettings.categoria_url
                    ? url.replace(categoriesSettings.categoria_url, "")
                    : url;
                categories = [
                    ...categories,
                    {
                        id: String(index + 1),
                        name,
                        url: deleteUrlCategoria,
                        image: categoriesSettings.image_url
                            ? image.replace(categoriesSettings.image_url, "")
                            : image,
                    },
                ];
            });

        return categories;
    } catch (error) {
        return [];
    }
}
export async function getProductsNoSSR(
    settings: ScrappingSchema,
    categoria: CategoryIA
): Promise<ProductIA[]> {
    try {
        let productos: ProductIA[] = [];
        let dom: JSDOM | null = null;
        try {
            dom = await JSDOM.fromURL(settings.products!.web_url, {
                runScripts: "dangerously",
                resources: "usable",
                pretendToBeVisual: false,
            });
            await delayDocument(dom.window.document);
        } catch (error) {}

        let block = true;
        const limit = 12;

        while (block) {
            await delayDocument(dom!.window.document);
            const shop_container = dom!.window.document.querySelector(
                settings.products!.container_element
            )!;
            const cards = shop_container.querySelectorAll(
                settings.products!.card.element
            );
            if (cards.length !== limit) {
                block = false;
            }
            let products: ProductIA[] = [];
            for (const card of cards) {
                const name =
                    card.querySelector(settings.products!.card.name)
                        ?.textContent || "";
                const price = settings.products!.card.price
                    ? card.querySelector(settings.products!.card.price)
                          ?.textContent || ""
                    : "";
                const quantity = settings.products!.card.quantity
                    ? card.querySelector(settings.products!.card.quantity)
                          ?.textContent || ""
                    : "";
                let image = settings.products!.card.image
                    ? (
                          card.querySelector(
                              settings.products!.card.image
                          ) as HTMLImageElement
                      ).src || ""
                    : "";
                let url = settings.products!.card.url
                    ? card
                          .querySelector(settings.products!.card.url)
                          ?.getAttribute("href") || ""
                    : "";

                url = settings.products!.product_url
                    ? (url || "").replace(settings.products!.product_url, "")
                    : url;
                image = settings.products!.image_url
                    ? (image || "").replace(settings.products!.image_url, "")
                    : image;
                products = [
                    ...products,
                    {
                        name: removeTextIAHTML(name),
                        quantity: removeTextIAHTML(quantity),
                        price: removeTextIAHTML(price),
                        image,
                        url,
                        description: null,
                        images: [],
                        marca: null,
                        variants: null,
                        category: categoria.id,
                        discount: null,
                    },
                ];
            }
            productos = [...productos, ...products];
            if (settings.products!.next_click) {
                const paginatorElement = dom!.window.document.querySelector(
                    settings.products!.next_click.element
                ) as HTMLButtonElement;
                if (paginatorElement) {
                    paginatorElement.click();
                    await waitForComponent(
                        dom!.window.document,
                        settings.products!.next_click.waitElement
                    );
                } else {
                    block = false;
                }
            }
        }
        dom!.window.close();
        return productos;
    } catch (error) {
        return [];
    }
}
export async function getProductsSSR(
    settings: ScrappingSchema,
    categoria: CategoryIA
) {
    let productos: ProductIA[] = [];

    let hayMasPaginas = true;
    let pageNumber = 1;
    while (hayMasPaginas) {
        const url = settings.categories?.web_url
            ? `${settings.categories?.web_url}${categoria.url}`
            : categoria.url;
        try {
            const response = await fetch(
                `${url}?${settings.products!.ssr.query}=${pageNumber}`
            );
            const result = await response.text();
            const $ = cheerio.load(result);
            const navCatContent = $(settings.products!.container_element);
            if (settings.products!.ssr.page_not_found) {
                const pageNotFound = $(settings.products!.ssr.page_not_found);
                if (pageNotFound.length) {
                    hayMasPaginas = false;
                    break;
                }
            }
            const products: ProductIA[] = [];

            const productCard = navCatContent.find(
                settings.products!.card.element
            );

            if (productCard.length < 1) {
                hayMasPaginas = false;
                break;
            }
            if (productCard.length !== settings.products!.limit) {
                hayMasPaginas = false;
                break;
            }
            productCard.each((_, element) => {
                const name = removeTextIAHTML(
                    $(element)
                        .find(settings.products!.card.name)
                        .text()
                        .trim() || ""
                );
                let url =
                    $(element).find(settings.products!.card.url).attr("href") ||
                    "";
                const price = settings.products!.card.price
                    ? $(element).find(settings.products!.card.price).text() ||
                      ""
                    : "";
                const quantity = settings.products!.card.quantity
                    ? $(element)
                          .find(settings.products!.card.quantity)
                          .text() || ""
                    : "";
                let image = settings.products!.card.url
                    ? $(element)
                          .find(settings.products!.card.url)
                          .attr("src") || ""
                    : "";
                url = settings.products!.product_url
                    ? url.replace(settings.products!.product_url, "")
                    : url;
                image = settings.products!.image_url
                    ? image.replace(settings.products!.image_url, "")
                    : image;
                products.push({
                    name,
                    url,
                    price: removeTextIAHTML(price),
                    quantity: removeTextIAHTML(quantity),
                    category: categoria.id,
                    description: null,
                    image,
                    images: [],
                    marca: null,
                    variants: null,
                    discount: null,
                });
            });
            // if (
            //     JSON.stringify(products) === JSON.stringify(productCard)
            // ) {
            //     hayMasPaginas = false;
            //     break;
            // }
            pageNumber++;
            productos = [...productos, ...products];
        } catch (error) {
            hayMasPaginas = false;
        }
    }
    return productos;
}
export async function getProduct(
    settings: ScrappingSchema,
    product: ProductIA
): Promise<ProductIA> {
    let html: string | null = null;
    if (!settings.product!.ssr) {
        let dom: JSDOM | null = null;
        try {
            dom = await JSDOM.fromURL(settings.web_url, {
                runScripts: "dangerously",
                resources: "usable",
                pretendToBeVisual: false,
            });
            await new Promise((resolve) => {
                dom!.window.document.addEventListener(
                    "DOMContentLoaded",
                    resolve
                );
            });

            if (settings.product!.event_click) {
                const evtClick = dom.window.document.querySelector(
                    settings.product!.event_click.element
                ) as HTMLElement;
                evtClick?.click();
                await waitForComponent(
                    dom.window.document,
                    settings.product!.event_click.waitElement
                );
            }
            html = dom.serialize();
            dom.window.close();
        } catch (error) {}
    } else {
        const responseweb = await fetch(settings.web_url);
        html = await responseweb.text();
    }
    const $ = cheerio.load(html!);
    const content = $(settings.product!.container_element);
    $(content).find(settings.product!.card.name).text().trim() || "";
    const name = removeTextIAHTML(
        $(content).find(settings.product!.card.name).text().trim()
    );
    const description = removeTextIAHTML(
        settings.product!.card.description
            ? $(content)
                  .find(settings.product!.card.description)
                  .text()
                  .trim() || ""
            : ""
    );
    const price = removeTextIAHTML(
        (settings.product!.card.price
            ? $(content).find(settings.product!.card.price).text().trim() ||
              product.price
            : product.price) || ""
    );
    const quantity = removeTextIAHTML(
        (settings.product!.card.quantity
            ? $(content).find(settings.product!.card.quantity).text() ||
              product.quantity
            : product.quantity) || ""
    );
    const discount = removeTextIAHTML(
        settings.product!.card.discount
            ? $(content).find(settings.product!.card.discount).text()
            : ""
    );
    const marca = removeTextIAHTML(
        settings.product!.card.marca
            ? $(content).find(settings.product!.card.marca).text() || ""
            : ""
    );
    const variants = removeTextIAHTML(
        settings.product!.card.variants
            ? $(content).find(settings.product!.card.variants).html() || ""
            : ""
    );
    const imagesHTML = settings.product!.card.images
        ? $(content).find(settings.product!.card.images)
        : null;
    const images: string[] = [];
    imagesHTML?.each((_, element) => {
        images.push($(element).attr("src") || "");
    });
    return {
        ...product,
        quantity,
        images,
        name,
        description,
        marca,
        variants,
        price,
        discount,
    };
}

// HELPERS TO SCRAPPING
export function removeTextIAHTML(
    value: string,
    space = "<br/>",
    maxlength: number | null = null
) {
    const texto = value
        .replace(/<img[^>]*src=["'](.*?)["'][^>]*>/gi, "$1")
        .replace(/<a[^>]*href=["'](.*?)["'][^>]*>(.*?)<\/a>/gi, "$1")
        .replace(/<\/?[^>]+(>|$)/gi, "")
        .replace(/\s*\n\s*|\s{2,}/g, space)
        .trim();
    if (maxlength) {
        // resumir texto
        return texto;
    }
    return texto;
}

export function waitForComponent(
    document: Document | Element | HTMLElement,
    selector: string,
    timeout = 10000
) {
    return new Promise((resolve, reject) => {
        if (!Number.isNaN(Number(selector))) {
            setTimeout(
                () => resolve(true),
                Number(selector) > 20 ? 20 : Number(selector) * 1000
            );
        } else {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(
                        new Error(
                            `Tiempo de espera agotado: No se encontró "${selector}"`
                        )
                    );
                }
            }, 100);
        }
    });
}

export function delayDocument(document: Document) {
    return new Promise((resolve) => {
        document.addEventListener("load", resolve);
    });
}
