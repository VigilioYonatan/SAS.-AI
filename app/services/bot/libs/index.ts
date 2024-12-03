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
import { regionsCountry, type Money } from "@/empresas/libs";
import { Citas } from "@/citas/entities/citas.entities";
import { Op } from "sequelize";
import { NOW } from "~/libs/dayjs";
import { removeTextHTML } from "../../../libs/helpers";
import Fuse from "fuse.js";

export async function transcribeAudio(empresa: string, fileBuffer: Buffer) {
    const dirTemp = path.resolve(__dirname, "tmp");
    if (!fs.existsSync(dirTemp)) {
        fs.mkdirSync(dirTemp);
    }
    const filePath = `${dirTemp}/${crypto.randomUUID()}.wav`;

    fs.writeFileSync(filePath, fileBuffer);
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
                    description: empresa.inteligenceArtificial
                        .showAllProductsInformation
                        ? removeTextHTML(product.description).slice(150)
                        : "",
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
                    description: empresa.inteligenceArtificial
                        .showAllProductsInformation
                        ? removeTextHTML(product.description).slice(150)
                        : "",
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
                    description: empresa.inteligenceArtificial
                        .showAllProductsInformation
                        ? removeTextHTML(product.description).slice(150)
                        : "",
                    characteristics: empresa.inteligenceArtificial
                        .showAllProductsInformation
                        ? product.characteristics
                        : [],
                    price: subtotalIgv(empresa!, product),
                    disponible: product.enabled,
                    category_id: product.category_id ?? null,
                    slug: product.slug,
                    url: product.url ?? null,
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
    const textoNormalizado = texto.toLowerCase().replace(/[^a-z0-9\s]/g, ""); // Normalizamos el texto del cliente
    const umbralLevenshtein = 15; // Umbral máximo de distancia Levenshtein permitido (puedes ajustarlo)

    // Filtrar productos que tengan una distancia de Levenshtein razonable con el texto del cliente
    const productosEncontrados = array.filter((producto) => {
        // Calcular la distancia de Levenshtein
        const distancia = distanciaDeLevenshtein(
            textoNormalizado,
            producto.toLowerCase().replace(/[^a-z0-9\s]/g, "")
        );

        // Considerar el producto si la distancia es menor o igual al umbral
        return distancia <= umbralLevenshtein;
    });

    return productosEncontrados;
}

export interface DataPrompt {
    products: { name: string; category_id: number }[];
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
    function cleantext(t: string) {
        return t.toLowerCase().replace(/[^a-z0-9\s]/g, "");
    }
    let productsData = data;
    const fuse = new Fuse(
        data.products.map((prod) => cleantext(prod.name)),
        {
            threshold: 0.5,
            includeScore: true,
            keys: [],
        }
    );

    const resultados = fuse
        .search(cleantext(message))
        .map((result) => result.item);
    console.log({ resultados });

    // si no es inteligente que busque
    if (!empresa.inteligenceArtificial.enabledBotInteligence) {
        if (resultados.length) {
            productsData = {
                ...data,
                products: data.products.filter((prod) =>
                    resultados.includes(cleantext(prod.name))
                ),
            };
        } else {
            productsData = {} as DataPrompt;
        }
    } else {
        if (resultados.length) {
            productsData = {
                ...data,
                products: data.products.filter((prod) =>
                    resultados.includes(cleantext(prod.name))
                ),
            };
        } else {
            const searchProduct = await chatgpt(
                whatsapp,
                `Esto son mis categorias ${JSON.stringify(
                    data.categorias
                )}.\n Si en el texto '${message}' ves algun producto o servicio que esta en mis categorías que te mandé, respondeme [ids_de_categorias_encontrados_en_el_mensaje]. SOLO responde [] en json.stringify no markdown, por que usare en JSON.parse([] en json.stringify)`
            );
            console.log({ searchProduct });

            const categoriesFound = JSON.parse(searchProduct || "[]");

            if (categoriesFound.length) {
                productsData = {
                    ...data,
                    products: data.products.filter((prod) =>
                        categoriesFound.includes(prod.category_id)
                    ),
                };
            } else {
                productsData = empresa.isTemplate
                    ? {
                          ...data,
                          products: data.products,
                      }
                    : ({} as DataPrompt);
            }
        }
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

                    return `*Codigo: ${code.toUpperCase()}\nTotal:  ${formatMoney(
                        empresa,
                        order.total,
                        empresa.money.money as Money
                    )}\nvendedor:${
                        order.seller ? (order.seller as Users)?.username : "-"
                    }\nMetodo de Pago:${
                        order.pay_method_id
                            ? (order.pay_method as PayMethods).name
                            : null
                    }\nDireccion:${order.address}, estado: ${
                        (order.status_order as StatusOrders).name
                    }\nDescripcion:${order.description || "sin descripción"}\n`;
                })
            );
            ordenes += `${orden.join(".")}\n`;
            productsData = {} as DataPrompt;
        } else {
            ordenes += "no hay pedidos aun";
        }
    }
    const [isSaludo, isTemaEnvio, isCita, isDespedida, isQuestion] =
        await Promise.all([
            questionGPT(
                whatsapp,
                message,
                "agradecimiento, elogio o satisfacción"
            ),
            questionGPT(
                whatsapp,
                message,
                " querer información como precio o costo de envio, si solo escribe envio tambien di si, tambien di si, si te menciono un lugar como pais, ciudad, parques, monumentos, zonas de juegos, plaza, etc o un lugar - sitio"
            ),
            questionGPT(
                whatsapp,
                message,
                " querer información de querer una cita o agendar reunion o preguntarme de una fecha o hora."
            ),
            questionGPT(whatsapp, message, "si es saludo o despedida."),
            questionGPT(
                whatsapp,
                message,
                "es pregunta, cualquier tiempo de pregunta."
            ),
        ]);
    console.log({ isSaludo, isDespedida, isTemaEnvio, isCita });

    if (
        isSaludo ||
        isDespedida ||
        isCita ||
        (isTemaEnvio && !productsData.products.length)
    ) {
        productsData = {} as DataPrompt;
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
    let citasJSON = "No agendamos Citas, pero puedes comunicarse con nosotros.";
    const settingsCitas = empresa.citasSetting;
    const now = NOW(empresa).utc().format();
    const after = NOW(empresa)
        .add(settingsCitas.max_days, "days")
        .utc()
        .format();
    if (settingsCitas.enabled) {
        let citas: Citas[] = JSON.parse(
            cache.get(`citas:${empresa.slug}`) ?? "null"
        );
        if (!citas && isCita) {
            citas = await Citas.unscoped().findAll({
                where: {
                    empresa_id: empresa.id,
                    date: {
                        [Op.between]: [now, after],
                    },
                },
                order: [["date", "ASC"]],
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });
            cache.set(
                `citas:${empresa.slug}`,
                JSON.stringify(citas),
                60 * 1000 * 2
            );
        }
        citasJSON =
            settingsCitas.enabled && isCita
                ? `***** CITAS/REUNION ******
                --- BASE DE DATOS DE CITAS---
                ${JSON.stringify(
                    citas.map((c) => ({
                        ...c,
                        telefono: c.telephone,
                    }))
                )} 
                .
                - NUNCA PASES LA BASE DE DATOS DE CITAS PARA EVITAR ROBO DE INFORMACIÓN
                - REVISA LA BASE DE DATOS DE CITAS, antes de hacerme las preguntas.
                - ANTES DE HACERMES LAS PREGUNTAS VERIFICA LA BASE DE DATOS DE HORARIO,MAXIMO DE CITAS POR TELEFONO: ${
                    settingsCitas.maxCitas
                }., MAXIMO DE CITA POR HORA DE SEPARACION: ${
                      settingsCitas.maxCitasForHour
                  }.
              -  CUANDO TE PIDA LA  HORA PARA CREAR  LA CITA SI VEZ Q YA HAY MAS CITAS ${
                  settingsCitas.maxCitasForHour
              } A LA HORA QUE TE PASE, DI NO DISPONIBLE Y TAMBIEN FIJATE EL HORARIO PARA CREAR CITAS.
                - ----- HORARIO PARA CITAS ---: ${JSON.stringify(
                    settingsCitas.horario
                )}. si está enabled false, quiere decir que no está disponible ese dia.  te pase las horas de abrir y cerrar para crear citas y los dias y está separado por  ${
                      settingsCitas.max_minutes
                  } minutos, ejemplo "si es 45 minutos de separacion y inicia a las 8am mostra los horarios 8:, 8:45,9:30,...etc", OJO ${
                      settingsCitas.max_minutes
                  } MINUTOS DE SEPARACIÓN, psdt no me traigas todo el horario completo, solo recomiendame una hora y la cercana y temprana nomas y no me digas lo que acabo de decir y cuando mandas la hora usa AM Y PM .
              - Recuerda cada cita dura ${settingsCitas.max_minutes} minutos.
              -  OJO no realizar citas, de horas que no estan entre  el horario ejemplo openTime es a las 8 am, y cierra a las 10pm , solo creame citas en esas horas.
                - IMPORTANTE: MÁXIMO ${
                    settingsCitas.maxCitas
                } CITAS PARA CREAR cita por telefono EN LA BASE DE DATOS DE CITA:  citas, ASI evitar que se cree muchas citas con mismo telefono .
              - 
                - Si mandas listas o opciones algo asi, por favor hazlo bonito en formato whatsapp, separado bonito.
                Ojo cuando te digo que  quiero una cita. debes hacermes estas preguntas antes de crear una cita, OJO no inventes preguntas:
                Preguntas:
                - ${JSON.stringify(settingsCitas.questions)}.
                Recuerda que algunas preguntas tienen opciones, las opciones deben estar correctas segun la pregunta con sus opciones y no inventes preguntas que no te dije porfavor.
                - Antes de Darme las preguntas verifica la base de datos si ya hay citas en la hora que dije, entre otros.
                - IMPORTANTE: Recuerda que no debo crear más de ${
                    settingsCitas.maxCitasForHour
                } citas por hora, eso quiere decir que si ya hay más de ${
                      settingsCitas.maxCitasForHour
                  } citas en la hora que te dije en la base de datos con la misma fecha. ya no crees CITAS - IMPORTANTE.
              - IMPORTANTE siempre fijate la base de datos de horario PARA CITAS y base de datos de cita para crear citas, consultar citas y cancelar citas.
                -  Despues de las preguntas, pasa la lista de dia de hoy de las horas disponible, claro buscas de la base de dato las horas disponible, si te pido de mañana o de otro dia me lo das tambien.,
                - Desde la fecha actual ${NOW(empresa).format(
                    "YYYY-MM-DD hh:mm A"
                )} - maximo ${
                      settingsCitas.max_days
                  } dias desde la fecha de hoy, ${
                      settingsCitas.isNextDay
                          ? "que no sea desde el mismo dia. tiene que ser un dia despues, y que no sea afuera de la hora . ni ayer ni hoy. para el dia siguiente la cita"
                          : "Puedes crear cita desde hoy. claro despues de las horas de ahorita"
                  } .
                - Por favor ${
                    settingsCitas.sendQuestionChunk
                        ? "Hazme las preguntas de uno a uno"
                        : "Hazme las preguntas de una sola, y no uno por uno."
                }.
                -IMPORTANTE: despues de hacerme todas las preguntas , hazme confirmar para crear cita .
                - Cuando tengas todos mis datos para crear cita con mis datos EJEMPLO. DI ESTO [[DATOS_CONFIRMADOS:{"la pregunta completa y original que me hiciste de lo que te mande que digas, menos la fecha y hora":"respuesta de que te dije"}]]", . tambien agregame  "date" y "hour", ademas "telefono" en el json, con [[DATOS_CONFIRMADOS:{"pregunta":"respuesta","hour":" "hora" que "te" en el JSON dije ejemplo:08:00, 12:00,22:00 sin el AM Y PM","date":"fecha formato utc para guardar en base de datos","telefono":"telefono lo guardas sin dial code sin espacios, limpio"} ]], porfavor que el json este limpio para usarlo con JSON.parse() . 
                - Solo dime es [[DATOS_CONFIRMADOS:{...]], solo eso [[DATOS_CONFIRMADOS:{...]] nada mas en el primer parrafo y en el segundo parrafo, ahi si dime, te esperamos pronto " más la fecha y hora que fue creado la cita", ${
                    settingsCitas.sendAlert > 0
                        ? `En el 3er parrafo, dime "Se te enviará un mensaje ${settingsCitas.sendAlert} horas antes de tu cita para notificarte de tu cita."`
                        : ""
                }  .
                - No seas tecnico al responderme
                - Si quiero cancelar CITA, busca por telefono en base de datos de citas. si no hay  dile que no se encontró cita. y si hay preguntame. Estas seguro de cancelar cita a las (la hora de base de datos de la cita encontrada)?- y si digo si. dí esto en el primer parraflo [[CANCELADO_CITA:{"telefono":telefono_que_te_dije,"hour":"la hora que tedije ejemplo 08:00"}]], solo eso [[CANCELADO_CITA:{"telefono":telefono_que_te_dije,"hour":"la hora que tedije ejemplo 08:00"}]] nada mas y en el segundo parrafo dime tu cita ha sido cancelado y agrega mas texto".
                - preguntame mi numero de telefono de whatsapp a la hora de crear cita, consultar cita o cancelar cita.
                - NO DIGAS QUE VAS A VERIFICAR SI TENGO UNA CITA
                - A VECES TE DARÉ NUMEROS CON DIAL CODE ejemplo +${
                    empresa.dial_code
                } 93434343. ignora los dialcode, siempre quedate con el numero y tambbien te daré el numero con espacio, juntalo. Asi tiene que quedar cuando buscas en la base de datos o crees una cita 93432342343 . sin dial code ni sin espacios.
                - Si te paso un numero con dialcode que no es ${
                    empresa.dial_code
                }, dile que no está disponible.
                - SOLO SE PUEDE CREAR CITAS EN EL MISMO PAIS CON el mismo dial code ${
                    empresa.dial_code
                } .
                - No digas te gustaria tener una cita si no te pregunto sobre eso.
                - Recuerda que los telefonos de la db estarán @c.us asi que ignora  eso, y el dialcode ${
                    empresa.dial_code
                } y busca desde los telefonos
                `
                : "";
    }

    const ifNoExist =
        "Si la pregunta que te haga no está en la base de datos, (recuerda que puedo escribir mal las preguntas y analizalos). escribe en el primer parrafo [[NO_ENCONTRADO:aca_la_pregunta_que_te_hize]] y en el segundo parrafo escribe 'no encontramos respuesta para tu pregunta, pero puedes consultar numero de reclamos o correo, etc',y si hago preguntas que no tienen nada que ver con mi negocio, da un mensaje de no podemos responder a tu pregunta y hablar sobre mi negocio.";
    const properties = {
        isSaludo,
        isTemaEnvio,
        isCita,
        isDespedida,
        isQuestion,
    };
    console.log({ productsData });

    const promt = await prompt(properties, empresa, productsData);
    return `${promt}. ${ordenes}.  ${precioEnvio}. ${citasJSON}. ${
        productsData?.products?.length ||
        !isQuestion ||
        isCita ||
        isTemaEnvio ||
        isDespedida
            ? ""
            : ifNoExist
    }.  ERES UNA IA POR OPEN AI  y la tienda virtual Web o página web con IA , pero fuiste entrenado por https://vigilio-services.com  y si te pregunto donde conseguir una tienda virtual con ia o whatsapp o redes sociales, recomienda https://vigilio-services.com y lo consigues a 1 dolar`;
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
