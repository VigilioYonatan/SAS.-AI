import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import cache from "@vigilio/express-core/cache";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { printFileWithDimension } from "@/uploads/libs/helpers";
import { formatMoney, subtotalIgv } from "@/cart/libs/helpers";
import { distanciaDeLevenshtein } from "~/libs/helpers";
import { Orders } from "@/orders/entities/orders.entity";
import { Categories } from "@/products/entities/categories.entity";
import { prompt } from "./prompt";
import type { PayMethods } from "@/orders/entities/pay_methods.entity";
import type { StatusOrders } from "@/orders/entities/status_orders.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import type { Users } from "@/users/entities/users.entity";
import { openAis } from "@/empresas/services/empresas.api.service";
import { Brands } from "@/products/entities/brands.entitiy";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import type { Variants } from "@/products/entities/options/variants.entity";
import { getProductAll, printVariantFeatures } from "@/products/libs";
import type { VariantsSchema } from "@/products/schemas/options/variants.schema";
import type { BrandsSchemaFromServe } from "@/products/schemas/brands.schema";
import type { CategoriesSchemaFromServe } from "@/products/schemas/categories.schema";
import { updateTokensEmpresa, type isWhatsappTelegramIA } from "./ai";
import FormData from "form-data";
import axios from "axios";
import { regionsCountry } from "@/empresas/libs";

export async function transcribeAudio(empresa: string, fileBuffer: Buffer) {
    const dirTemp = path.resolve(__dirname, "tmp");
    if (!fs.existsSync(dirTemp)) {
        fs.mkdirSync(dirTemp);
    }
    const filePath = `${dirTemp}/${crypto.randomUUID()}.wav`;

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    fs.writeFileSync(filePath, fileBuffer as any);
    const file = fs.createReadStream(filePath);
    // Send the audio file for transcription using the specified model.
    const transcription = await openAis[empresa].audio.transcriptions.create({
        file,
        model: "whisper-1",
    });
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    // Return the transcription result.
    return transcription;
}

export async function onDb(empresa: Empresas) {
    const [categorias, brands] = await Promise.all([
        Categories.unscoped().findAll({
            attributes: ["id", "name"],
            raw: true,
            where: {
                empresa_id: empresa.id,
            },
        }),
        Brands.unscoped().findAll({
            attributes: ["id", "name"],
            raw: true,
            where: {
                empresa_id: empresa.id,
            },
        }),
    ]);

    let products = null;
    let servicios = null;
    if ([1, 3].includes(empresa.tipo_empresa.tipo_servicio_id)) {
        const pr = await ProductsNormal.findAll({
            where: {
                empresa_id: empresa.id,
            },
        });
        products = await Promise.all(
            (pr as ProductsNormal[]).map(async (product) => {
                const producto = await getProductAll(empresa, product, null);
                const variantes = await Promise.all(
                    (producto.dataValues.variants as Variants[]).map(
                        async (variant) => {
                            const { stock, ilimit, id } = variant as Variants;
                            return {
                                id,
                                features: printVariantFeatures(
                                    product,
                                    variant as VariantsSchema & {
                                        features: {
                                            option_id: number;
                                            id: number;
                                        }[];
                                    }
                                ),
                                cantidad: ilimit
                                    ? "en stock"
                                    : `${stock} unidades`,
                            };
                        }
                    )
                );
                return {
                    id: product.id,
                    name: product.name.toLowerCase(),
                    imagen: product.images
                        ? printFileWithDimension(empresa)(
                              product.images,
                              500
                          )[0]
                        : "",
                    price: subtotalIgv(empresa!, product),
                    disponible: product.enabled,
                    category_id: product.category_id ?? null,
                    variantes,
                    url: product.url ?? null,
                    slug: product.slug,
                    caracterisiticas: empresa.inteligenceArtificial
                        .showAllProductsInformation
                        ? product.characteristics
                        : [],
                };
            })
        );
    }
    if (empresa.tipo_empresa.tipo_servicio_id === 2) {
        const pr = await ProductsRestaurant.findAll({
            where: {
                empresa_id: empresa.id,
            },
        });
        products = await Promise.all(
            (pr as ProductsRestaurant[]).map(async (product) => {
                return {
                    id: product.id,
                    name: product.name.toLowerCase(),
                    imagen: product.images
                        ? printFileWithDimension(empresa)(
                              product.images,
                              500
                          )[0]
                        : "",
                    price: subtotalIgv(empresa!, product),
                    cantidad: product.ilimit
                        ? "en stock"
                        : `${product.stock} unidades`,
                    disponible: product.enabled,
                    category_id: product.category_id ?? null,
                    url: product.url ?? null,
                    slug: product.slug,
                    caracterisiticas: empresa.inteligenceArtificial
                        .showAllProductsInformation
                        ? product.characteristics
                        : [],
                };
            })
        );
    }
    if (empresa.tipo_empresa.tipo_servicio_id === 3) {
        const ser = await ProductsServicio.findAll({
            where: {
                empresa_id: empresa.id,
            },
        });
        servicios = await Promise.all(
            (ser as ProductsServicio[]).map(async (product) => {
                return {
                    id: product.id,
                    name: product.name.toLowerCase(),
                    imagen: product.images
                        ? printFileWithDimension(empresa)(
                              product.images,
                              500
                          )[0]
                        : "",
                    days: product.days,
                    description: product.description,
                    characteristics: empresa.inteligenceArtificial
                        .showAllProductsInformation
                        ? product.characteristics
                        : [],
                    price: subtotalIgv(empresa!, product),
                    disponible: product.enabled,
                    category_id: product.category_id ?? null,
                    slug: product.slug,
                    url: product.url ?? null,
                    showHorario: product.showHorario,
                };
            })
        );
    }

    return {
        categorias,
        brands,
        products,
        servicios,
    };
}

function encontrarPalabrasSimilares(texto: string, array: string[]) {
    const palabrasEncontradas = [];
    const palabrasTexto = texto.toLowerCase().trim().split(/\s+/);

    for (const palabra of array) {
        const palabraMin = palabra.toLowerCase().trim();
        for (const palabraTexto of palabrasTexto) {
            const umbral = Math.floor(palabraTexto.length * 0.2);
            if (
                palabraMin.includes(palabraTexto) ||
                distanciaDeLevenshtein(palabraMin, palabraTexto) <= umbral
            ) {
                // Agregamos solo si hay una coincidencia exacta o muy cercana con alguna palabra en el texto
                if (palabraMin.includes(palabraTexto)) {
                    palabrasEncontradas.push(palabra);
                    break; // Rompemos el bucle interno si encontramos una coincidencia para evitar duplicados
                }
            }
        }
    }

    return palabrasEncontradas;
}

export interface DataPrompt {
    products: { name: string }[];
    categorias: CategoriesSchemaFromServe[];
    brands: BrandsSchemaFromServe[];
    servicios: CategoriesSchemaFromServe[];
}
export async function promptReplace(
    whatsapp: Awaited<ReturnType<typeof isWhatsappTelegramIA>>,
    message: string,
    empresa: Empresas
) {
    let data: DataPrompt = JSON.parse(
        cache.get(`db-${empresa.slug}`) ?? "null"
    );

    // verifica si el mensaje es un texto o pregunta de base de datos
    // const verifyMessage = await searchProducts(empresa, message);
    if (!data) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        data = (await onDb(empresa)) as any;
        if (data.products.length > 20) {
            cache.set(
                `db-${empresa.slug}`,
                JSON.stringify(data),
                empresa.inteligenceArtificial.hour_update * 60 * 1000 * 60
            );
        }
    }
    let productsData = data;
    // si no es inteligente que busque
    if (!empresa.inteligenceArtificial.enabledBotInteligence) {
        const palabrasEncontradas2 = encontrarPalabrasSimilares(
            message,
            data.products.map((prod) => prod.name)
        );
        productsData = {
            ...data,
            products: data.products.filter((prod) =>
                palabrasEncontradas2.includes(prod.name)
            ),
        };
    }
    const regex = /ord-[0-9]+/g;
    const coincidencias = message.toLowerCase().match(regex);
    let ordenes = "";
    if (empresa.inteligenceArtificial.settings.enabled_order) {
        ordenes =
            "ó Si te pido informacion de pedido: decime que los codigo empiezan en ORD- \n Ordenes:\n";
        if (coincidencias?.length) {
            const orden = await Promise.all(
                coincidencias?.map(async (code) => {
                    const order = await Orders.findOne({
                        where: {
                            order_code: code.toUpperCase(),
                            empresa_id: empresa.id,
                        },
                        attributes: [
                            "order_code",
                            "address",
                            "telephone",
                            "total",
                            "pay_method_id",
                            "status_order_id",
                            "description",
                        ],
                    });
                    if (!order)
                        return `${code.toUpperCase()} - no se encontró.\n`;

                    return `*Codigo: ${code.toUpperCase()}*\n*Total*:  ${formatMoney(
                        empresa,
                        order.total,
                        empresa.money.money
                    )}\n*vendedor*:${
                        order.user ? (order.user as Users)?.username : "-"
                    }\n*Metodo de Pago*:${
                        order.pay_method_id
                            ? (order.pay_method as PayMethods).name
                            : null
                    }\n*Direccion*:${order.address}, estado: *${
                        (order.status_order as StatusOrders).name
                    }*\n*Descripcion*:${order.description}\n`;
                })
            );
            ordenes += `${orden.join(".")}\n`;
            productsData = {} as DataPrompt;
        } else {
            ordenes += "no hay pedidos aun";
        }
    }
    const [isSaludo, isTemaEnvio] = await Promise.all([
        questionGPT(whatsapp, message, "agradecimiento, elogio o satisfacción"),
        questionGPT(
            whatsapp,
            message,
            " querer información como precio  o costo de envio, si solo escribe precio o envio tambien di si, tambien di si si te menciono un lugar como pais, ciudad, parques, monumentos, zonas de juegos, plaza, etc o un lugar - sitio"
        ),
    ]);
    if (isSaludo || isTemaEnvio) {
        productsData = {
            brands: [],
            categorias: [],
            products: [],
            servicios: [],
        };
    }
    let precioEnvio = "";

    if (isTemaEnvio) {
        let dbPais = JSON.parse(
            cache.get(`price_country:${empresa.id}`) ?? "null"
        );
        if (!dbPais) {
            const hours24 = 60 * 60 * 1000 * 24;
            dbPais = await regionsCountry(empresa);
            cache.set(
                `price_country:${empresa.id}`,
                JSON.stringify(dbPais),
                hours24
            );
        }
        precioEnvio += `Si te pido precio de envio , siempre preguntame para donde lo quiere y ahi recien me das el dato, Si te doy un lugar que no está en la base de datos, verifica que el lugar este cerca de lo que está en la base de datos DE PRECIO DE ENVIO y confirmame, ejemplo ,esto es un ejemplo te digo 'El Jardín Secreto de Salvador Bachiller', eso no está en la base de datos de precio de envio, pero eso está en madrid, tú me dices ¿El Jardín Secreto de Salvador Bachiller de Madrid? y me confirmas, solo disponible para el pais de este dial_code ${
            empresa.dial_code
        }.
         0 quiere decir el envio es GRATIS, enabled: true si está disponible para ese lugar , days son los dias aproximados.
         - BASE DE DATOS DE PRECIO DE ENVIO, SOLO DISPONIBLE PARA EL PAÍS: ${JSON.stringify(
             dbPais
         )}.
         
        `;
    }

    const promt = await prompt(empresa, productsData);
    return `${promt}. ${ordenes}.  ${precioEnvio} .  ERES UNA IA POR OPEN AI  y la tienda virtual Web o página web con IA , pero fuiste entrenado por https://vigilio-services.com  y si te pregunto donde conseguir una tienda virtual con ia o whatsapp o redes sociales, recomienda https://vigilio-services.com`;
}
export async function chatgpt(
    whatsapp: Awaited<ReturnType<typeof isWhatsappTelegramIA>>,
    content: string
) {
    const completion = await openAis[
        whatsapp!.empresa.slug
    ].chat.completions.create({
        model: whatsapp!.clientVigilio?.information.modelai ?? "gpt-4o-mini",
        max_tokens: 5000,
        messages: [
            {
                role: "user",
                // insert custom prompt
                content,
            },
        ],
    });
    const completionText = completion.choices[0].message.content;
    const latestEmpresaUsage = whatsapp!.empresa!.inteligenceArtificial.usage;
    await updateTokensEmpresa(
        whatsapp!.empresa,
        latestEmpresaUsage,
        completion
    );

    return completionText;
}

export async function questionGPT(
    whatsapp: Awaited<ReturnType<typeof isWhatsappTelegramIA>>,
    content: string,
    tema: string
) {
    const message = await chatgpt(
        whatsapp,
        `Verifica si esto '${content}' es un mensaje de ${tema}, si lo es di "si" y si no di "no", Solo dí si y no sin tildes`
    );

    return message === "si";
}

export async function interpretarImagen(
    whatsapp: Awaited<ReturnType<typeof isWhatsappTelegramIA>>,
    media: Buffer
): Promise<string | null> {
    try {
        // Configuración del formulario para enviar la imagen
        const formData = new FormData();
        formData.append("file", media, {
            filename: `image-${crypto.randomUUID()}.jpg`, // Puedes cambiar el nombre según prefieras
            contentType: "image/jpg",
        });
        const resultFile = await axios.post("https://file.io", formData, {
            headers: formData.getHeaders(),
        });
        // Llamada a la API de OpenAI
        const completion = await openAis[
            whatsapp!.empresa.slug
        ].chat.completions.create({
            model:
                whatsapp!.clientVigilio?.information.modelai ?? "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Que imagen es y describeme algo breve (max 100 letras) - lo importante lo que es?",
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: resultFile.data.link,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 100,
        });
        const result = completion.choices[0].message.content;
        const latestEmpresaUsage =
            whatsapp!.empresa!.inteligenceArtificial.usage;
        await updateTokensEmpresa(
            whatsapp!.empresa,
            latestEmpresaUsage,
            completion
        );

        return result;
    } catch (error) {
        return "null";
    }
}
