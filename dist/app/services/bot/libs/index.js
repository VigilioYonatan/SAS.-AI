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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcribeAudio = transcribeAudio;
exports.onDb = onDb;
exports.promptReplace = promptReplace;
exports.chatgpt = chatgpt;
exports.questionGPT = questionGPT;
exports.interpretarImagen = interpretarImagen;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const cache_1 = __importDefault(require("@vigilio/express-core/cache"));
const helpers_1 = require("@/cart/libs/helpers");
const helpers_2 = require("~/libs/helpers");
const orders_entity_1 = require("@/orders/entities/orders.entity");
const categories_entity_1 = require("@/products/entities/categories.entity");
const prompt_1 = require("./prompt");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
const empresas_api_service_1 = require("@/empresas/services/empresas.api.service");
const brands_entitiy_1 = require("@/products/entities/brands.entitiy");
const products_restaurant_entity_1 = require("@/products/entities/products_restaurant.entity");
const products_servicio_entity_1 = require("@/products/entities/products_servicio.entity");
const libs_1 = require("@/products/libs");
const ai_1 = require("./ai");
const form_data_1 = __importDefault(require("form-data"));
const axios_1 = __importDefault(require("axios"));
const libs_2 = require("@/empresas/libs");
const citas_entities_1 = require("@/citas/entities/citas.entities");
const sequelize_1 = require("sequelize");
const dayjs_1 = require("~/libs/dayjs");
const helpers_3 = require("../../../libs/helpers");
const fuse_js_1 = __importDefault(require("fuse.js"));
function transcribeAudio(empresa, fileBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        const dirTemp = node_path_1.default.resolve(__dirname, "tmp");
        if (!node_fs_1.default.existsSync(dirTemp)) {
            node_fs_1.default.mkdirSync(dirTemp);
        }
        const filePath = `${dirTemp}/${node_crypto_1.default.randomUUID()}.wav`;
        node_fs_1.default.writeFileSync(filePath, fileBuffer);
        const file = node_fs_1.default.createReadStream(filePath);
        const transcription = yield empresas_api_service_1.openAis[empresa].audio.transcriptions.create({
            file,
            model: "whisper-1",
        });
        if (node_fs_1.default.existsSync(filePath)) {
            node_fs_1.default.unlinkSync(filePath);
        }
        return transcription;
    });
}
function onDb(empresa) {
    return __awaiter(this, void 0, void 0, function* () {
        const [categorias, brands] = yield Promise.all([
            categories_entity_1.Categories.unscoped().findAll({
                attributes: ["id", "name"],
                raw: true,
                where: {
                    empresa_id: empresa.id,
                },
            }),
            brands_entitiy_1.Brands.unscoped().findAll({
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
            const pr = yield products_normal_entity_1.ProductsNormal.findAll({
                where: {
                    empresa_id: empresa.id,
                },
            });
            products = yield Promise.all(pr.map((product) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const producto = yield (0, libs_1.getProductAll)(empresa, product, null, false);
                const variantes = yield Promise.all(producto.dataValues.variants.map((variant) => __awaiter(this, void 0, void 0, function* () {
                    const { stock, ilimit, id, images } = variant;
                    return {
                        id,
                        features: (0, libs_1.printVariantFeatures)(product, variant),
                        unidades: ilimit
                            ? "en stock"
                            : stock > 0
                                ? `${stock || 0} unidades`
                                : "agotado",
                        images,
                    };
                })));
                return {
                    id: product.id,
                    name: product.name.toLowerCase(),
                    images: product.images
                        ? JSON.stringify(product.images
                            .filter((file) => file.dimension === 500)
                            .map((f) => f.file))
                        : "",
                    price: (0, helpers_1.subtotalIgv)(empresa, product),
                    disponible: product.enabled,
                    category_id: (_a = product.category_id) !== null && _a !== void 0 ? _a : null,
                    variantes,
                    url: (_b = product.url) !== null && _b !== void 0 ? _b : null,
                    slug: product.slug,
                    caracterisiticas: empresa.inteligenceArtificial
                        .showAllProductsInformation
                        ? product.characteristics
                        : [],
                    description: empresa.inteligenceArtificial
                        .showAllProductsInformation
                        ? (_c = (0, helpers_3.removeTextHTML)(product.description)) === null || _c === void 0 ? void 0 : _c.slice(150)
                        : "",
                    tipo: "producto",
                };
            })));
        }
        if (empresa.tipo_empresa.tipo_servicio_id === 2) {
            const pr = yield products_restaurant_entity_1.ProductsRestaurant.findAll({
                where: {
                    empresa_id: empresa.id,
                },
            });
            products = yield Promise.all(pr.map((product) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                return {
                    id: product.id,
                    name: product.name.toLowerCase(),
                    imagen: product.images
                        ? product.images.filter((file) => file.dimension === 500)[0].file
                        : "",
                    price: (0, helpers_1.subtotalIgv)(empresa, product),
                    unidades: product.ilimit
                        ? "en stock"
                        : product.stock > 0
                            ? `${product.stock || 0} unidades`
                            : "agotado",
                    disponible: product.enabled,
                    category_id: (_a = product.category_id) !== null && _a !== void 0 ? _a : null,
                    url: (_b = product.url) !== null && _b !== void 0 ? _b : null,
                    slug: product.slug,
                    caracterisiticas: empresa.inteligenceArtificial
                        .showAllProductsInformation
                        ? product.characteristics
                        : [],
                    description: empresa.inteligenceArtificial
                        .showAllProductsInformation
                        ? (_c = (0, helpers_3.removeTextHTML)(product.description)) === null || _c === void 0 ? void 0 : _c.slice(150)
                        : "",
                    tipo: "producto",
                };
            })));
        }
        if (empresa.tipo_empresa.tipo_servicio_id === 3) {
            const ser = yield products_servicio_entity_1.ProductsServicio.findAll({
                where: {
                    empresa_id: empresa.id,
                },
            });
            servicios = yield Promise.all(ser.map((product) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                return {
                    id: product.id,
                    name: product.name.toLowerCase(),
                    imagen: product.images
                        ? product.images.filter((file) => file.dimension === 500)[0].file
                        : "",
                    days: product.days,
                    description: empresa.inteligenceArtificial
                        .showAllProductsInformation
                        ? (_a = (0, helpers_3.removeTextHTML)(product.description)) === null || _a === void 0 ? void 0 : _a.slice(500)
                        : "",
                    characteristics: empresa.inteligenceArtificial
                        .showAllProductsInformation
                        ? product.characteristics
                        : [],
                    price: (0, helpers_1.subtotalIgv)(empresa, product),
                    disponible: product.enabled,
                    category_id: (_b = product.category_id) !== null && _b !== void 0 ? _b : null,
                    slug: product.slug,
                    url: (_c = product.url) !== null && _c !== void 0 ? _c : null,
                    tipo: "servicio",
                };
            })));
        }
        return {
            categorias,
            brands,
            products,
            servicios,
        };
    });
}
function encontrarPalabrasSimilares(texto, array) {
    const textoNormalizado = texto.toLowerCase().replace(/[^a-z0-9\s]/g, "");
    const umbralLevenshtein = 15;
    const productosEncontrados = array.filter((producto) => {
        const distancia = (0, helpers_2.distanciaDeLevenshtein)(textoNormalizado, producto.toLowerCase().replace(/[^a-z0-9\s]/g, ""));
        return distancia <= umbralLevenshtein;
    });
    return productosEncontrados;
}
function promptReplace(whatsapp, message, empresa) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        let data = JSON.parse((_a = cache_1.default.get(`db-${empresa.slug}`)) !== null && _a !== void 0 ? _a : "null");
        if (!data) {
            data = (yield onDb(empresa));
            if (data.products.length > 20) {
                cache_1.default.set(`db-${empresa.slug}`, JSON.stringify(data), empresa.inteligenceArtificial.hour_update * 60 * 1000 * 60);
            }
        }
        function cleantext(t) {
            return t.toLowerCase().replace(/[^a-z0-9\s]/g, "");
        }
        let productsData = data;
        const fuse = new fuse_js_1.default(data.products.map((prod) => cleantext(prod.name)), {
            threshold: 0.6,
            includeScore: true,
            keys: [],
        });
        const resultados = fuse
            .search(cleantext(message))
            .map((result) => result.item);
        if (!empresa.inteligenceArtificial.enabledBotInteligence) {
            if (resultados.length) {
                productsData = Object.assign(Object.assign({}, data), { products: data.products.filter((prod) => resultados.includes(cleantext(prod.name))) });
            }
            else {
                productsData = {};
            }
        }
        else {
            if (resultados.length) {
                productsData = Object.assign(Object.assign({}, data), { products: data.products.filter((prod) => resultados.includes(cleantext(prod.name))) });
            }
            else {
                const searchProduct = yield chatgpt(whatsapp, `Esto son mis categorias ${JSON.stringify(data.categorias)}.\n Si en el texto '${message}', ves algun producto o servicio que puede estar en mis categorías que te mandé (ejemplo en el mensaje samsung galaxy s7 y tengo en mi categorias celulares, me traes [id_category_celulares], etc), respondeme json [id_de_categorias_de_productosservicios_encontrados] . solo traeme el json, no digas nada mas`);
                const cleanProducts = searchProduct && searchProduct !== "[]"
                    ? searchProduct
                        .split("\n")
                        .slice(1)
                        .join("\n")
                        .replace(/\\n/g, "")
                        .replace(/^\s*json\s*\n/, "")
                        .trim()
                    : "[]";
                let categoriesFound = [];
                try {
                    categoriesFound = JSON.parse(cleanProducts);
                }
                catch (error) { }
                console.log({ categoriesFound });
                if (categoriesFound.length) {
                    productsData = Object.assign(Object.assign({}, data), { products: data.products.filter((prod) => categoriesFound.map(Number).includes(prod.category_id)) });
                }
                else {
                    productsData = Object.assign(Object.assign({}, data), { products: data.products });
                }
            }
        }
        const regex = /ord-[0-9]+/g;
        const coincidencias = message.toLowerCase().match(regex);
        let ordenes = "";
        if (empresa.inteligenceArtificial.settings.enabled_order) {
            ordenes =
                "ó Si te pido informacion de pedido: decime que los codigo empiezan en ORD- \n Ordenes:\n";
            if (coincidencias === null || coincidencias === void 0 ? void 0 : coincidencias.length) {
                const orden = yield Promise.all(coincidencias === null || coincidencias === void 0 ? void 0 : coincidencias.map((code) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const order = yield orders_entity_1.Orders.findOne({
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
                    return `*Codigo: ${code.toUpperCase()}\nTotal:  ${(0, helpers_1.formatMoney)(empresa, order.total, empresa.money.money)}\nvendedor:${order.seller ? (_a = order.seller) === null || _a === void 0 ? void 0 : _a.username : "-"}\nMetodo de Pago:${order.pay_method_id
                        ? order.pay_method.name
                        : null}\nDireccion:${order.address || "-"}, estado: ${order.status_order.name}\nDescripcion:${order.description || "sin descripción"}\n`;
                })));
                ordenes += `${orden.join(".")}\n`;
                productsData = {};
            }
            else {
                ordenes += "no hay pedidos aun";
            }
        }
        const [isSaludo, isTemaEnvio, isCita, isDespedida, isQuestion] = yield Promise.all([
            questionGPT(whatsapp, message, "agradecimiento, elogio o satisfacción"),
            questionGPT(whatsapp, message, " querer información como precio o costo de envio, si solo escribe envio tambien di si, tambien di si, si te menciono un lugar como pais, ciudad, parques, monumentos, zonas de juegos, plaza, etc o un lugar - sitio"),
            questionGPT(whatsapp, message, " querer información de querer una cita o agendar reunion o preguntarme de una fecha o hora."),
            questionGPT(whatsapp, message, "si es saludo o despedida."),
            questionGPT(whatsapp, message, "es pregunta, cualquier tiempo de pregunta (recuerda que tambien es válido preguntas que no tengan ¿?!)."),
        ]);
        if (isSaludo ||
            isDespedida ||
            isCita ||
            (isTemaEnvio && !((_b = productsData === null || productsData === void 0 ? void 0 : productsData.products) === null || _b === void 0 ? void 0 : _b.length))) {
            productsData = {};
        }
        let precioEnvio = "";
        if (isTemaEnvio && empresa.enable_sell_country) {
            let dbPais = JSON.parse((_c = cache_1.default.get(`price_country:${empresa.id}`)) !== null && _c !== void 0 ? _c : "null");
            if (!dbPais) {
                const hours24 = 60 * 60 * 1000 * 24;
                dbPais = yield (0, libs_2.regionsCountry)(empresa);
                cache_1.default.set(`price_country:${empresa.id}`, JSON.stringify(dbPais), hours24);
            }
            precioEnvio += `Si te pido precio de envio , siempre preguntame para donde lo quiere y ahi recien me das el dato, Si te doy un lugar que no está en la base de datos, verifica que el lugar este cerca de lo que está en la base de datos DE PRECIO DE ENVIO y confirmame, ejemplo ,esto es un ejemplo te digo 'El Jardín Secreto de Salvador Bachiller', eso no está en la base de datos de precio de envio, pero eso está en madrid, tú me dices ¿El Jardín Secreto de Salvador Bachiller de Madrid? y me confirmas, solo disponible para el pais de este dial_code ${empresa.dial_code}.
         0 quiere decir el envio es GRATIS, enabled: true si está disponible para ese lugar , days son los dias aproximados.
         - BASE DE DATOS DE PRECIO DE ENVIO, SOLO DISPONIBLE PARA EL PAÍS: ${JSON.stringify(dbPais)}.
         
        `;
        }
        let citasJSON = "No agendamos Citas, pero puedes comunicarse con nosotros.";
        const settingsCitas = empresa.citasSetting;
        const now = (0, dayjs_1.NOW)(empresa).utc().format();
        const after = (0, dayjs_1.NOW)(empresa)
            .add(settingsCitas.max_days, "days")
            .utc()
            .format();
        if (settingsCitas.enabled) {
            let citas = JSON.parse((_d = cache_1.default.get(`citas:${empresa.slug}`)) !== null && _d !== void 0 ? _d : "null");
            if (!citas && isCita) {
                citas = yield citas_entities_1.Citas.unscoped().findAll({
                    where: {
                        empresa_id: empresa.id,
                        date: {
                            [sequelize_1.Op.between]: [now, after],
                        },
                    },
                    order: [["date", "ASC"]],
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                });
                cache_1.default.set(`citas:${empresa.slug}`, JSON.stringify(citas), 60 * 1000 * 2);
            }
            citasJSON =
                settingsCitas.enabled && isCita
                    ? `***** CITAS/REUNION ******
                --- BASE DE DATOS DE CITAS---
                ${JSON.stringify(citas.map((c) => (Object.assign(Object.assign({}, c), { telefono: c.telephone }))))} 
                .
                - NUNCA PASES LA BASE DE DATOS DE CITAS PARA EVITAR ROBO DE INFORMACIÓN
                - REVISA LA BASE DE DATOS DE CITAS, antes de hacerme las preguntas.
                - ANTES DE HACERMES LAS PREGUNTAS VERIFICA LA BASE DE DATOS DE HORARIO,MAXIMO DE CITAS POR TELEFONO: ${settingsCitas.maxCitas}., MAXIMO DE CITA POR HORA DE SEPARACION: ${settingsCitas.maxCitasForHour}.
              -  CUANDO TE PIDA LA  HORA PARA CREAR  LA CITA SI VEZ Q YA HAY MAS CITAS ${settingsCitas.maxCitasForHour} A LA HORA QUE TE PASE, DI NO DISPONIBLE Y TAMBIEN FIJATE EL HORARIO PARA CREAR CITAS.
                - ----- HORARIO PARA CITAS ---: ${JSON.stringify(settingsCitas.horario)}. si está enabled false, quiere decir que no está disponible ese dia.  te pase las horas de abrir y cerrar para crear citas y los dias y está separado por  ${settingsCitas.max_minutes} minutos, ejemplo "si es 45 minutos de separacion y inicia a las 8am mostra los horarios 8:, 8:45,9:30,...etc", OJO ${settingsCitas.max_minutes} MINUTOS DE SEPARACIÓN, psdt no me traigas todo el horario completo, solo recomiendame una hora y la cercana y temprana nomas y no me digas lo que acabo de decir y cuando mandas la hora usa AM Y PM .
              - Recuerda cada cita dura ${settingsCitas.max_minutes} minutos.
              -  OJO no realizar citas, de horas que no estan entre  el horario ejemplo openTime es a las 8 am, y cierra a las 10pm , solo creame citas en esas horas.
                - IMPORTANTE: MÁXIMO ${settingsCitas.maxCitas} CITAS PARA CREAR cita por telefono EN LA BASE DE DATOS DE CITA:  citas, ASI evitar que se cree muchas citas con mismo telefono .
              - 
                - Si mandas listas o opciones algo asi, por favor hazlo bonito en formato whatsapp, separado bonito.
                Ojo cuando te digo que  quiero una cita. debes hacermes estas preguntas antes de crear una cita, OJO no inventes preguntas:
                Preguntas:
                - ${JSON.stringify(settingsCitas.questions)}.
                Recuerda que algunas preguntas tienen opciones, las opciones deben estar correctas segun la pregunta con sus opciones y no inventes preguntas que no te dije porfavor.
                - Antes de Darme las preguntas verifica la base de datos si ya hay citas en la hora que dije, entre otros.
                - IMPORTANTE: Recuerda que no debo crear más de ${settingsCitas.maxCitasForHour} citas por hora, eso quiere decir que si ya hay más de ${settingsCitas.maxCitasForHour} citas en la hora que te dije en la base de datos con la misma fecha. ya no crees CITAS - IMPORTANTE.
              - IMPORTANTE siempre fijate la base de datos de horario PARA CITAS y base de datos de cita para crear citas, consultar citas y cancelar citas.
                -  Despues de las preguntas, pasa la lista de dia de hoy de las horas disponible, claro buscas de la base de dato las horas disponible, si te pido de mañana o de otro dia me lo das tambien.,
                - Desde la fecha actual ${(0, dayjs_1.NOW)(empresa).format("YYYY-MM-DD hh:mm A")} - maximo ${settingsCitas.max_days} dias desde la fecha de hoy, ${settingsCitas.isNextDay
                        ? "que no sea desde el mismo dia. tiene que ser un dia despues, y que no sea afuera de la hora . ni ayer ni hoy. para el dia siguiente la cita"
                        : "Puedes crear cita desde hoy. claro despues de las horas de ahorita"} .
                - Por favor ${settingsCitas.sendQuestionChunk
                        ? "Hazme las preguntas de uno a uno"
                        : "Hazme las preguntas de una sola, y no uno por uno."}.
                -IMPORTANTE: despues de hacerme todas las preguntas , hazme confirmar para crear cita .
                - Cuando tengas todos mis datos para crear cita con mis datos EJEMPLO. DI ESTO [[DATOS_CONFIRMADOS:{"la pregunta completa y original que me hiciste de lo que te mande que digas, menos la fecha y hora":"respuesta de que te dije"}]]", . tambien agregame  "date" y "hour", ademas "telefono" en el json, con [[DATOS_CONFIRMADOS:{"pregunta":"respuesta","hour":" "hora" que "te" en el JSON dije ejemplo:08:00, 12:00,22:00 sin el AM Y PM","date":"fecha formato utc para guardar en base de datos","telefono":"telefono lo guardas sin dial code sin espacios, limpio"} ]], porfavor que el json este limpio para usarlo con JSON.parse() . 
                - Solo dime es [[DATOS_CONFIRMADOS:{...]], solo eso [[DATOS_CONFIRMADOS:{...]] nada mas en el primer parrafo y en el segundo parrafo, ahi si dime, te esperamos pronto " más la fecha y hora que fue creado la cita", ${settingsCitas.sendAlert > 0
                        ? `En el 3er parrafo, dime "Se te enviará un mensaje ${settingsCitas.sendAlert} horas antes de tu cita para notificarte de tu cita."`
                        : ""}  .
                - No seas tecnico al responderme
                - Si quiero cancelar CITA, busca por telefono en base de datos de citas. si no hay  dile que no se encontró cita. y si hay preguntame. Estas seguro de cancelar cita a las (la hora de base de datos de la cita encontrada)?- y si digo si. dí esto en el primer parraflo [[CANCELADO_CITA:{"telefono":telefono_que_te_dije,"hour":"la hora que tedije ejemplo 08:00"}]], solo eso [[CANCELADO_CITA:{"telefono":telefono_que_te_dije,"hour":"la hora que tedije ejemplo 08:00"}]] nada mas y en el segundo parrafo dime tu cita ha sido cancelado y agrega mas texto".
                - preguntame mi numero de telefono de whatsapp a la hora de crear cita, consultar cita o cancelar cita.
                - NO DIGAS QUE VAS A VERIFICAR SI TENGO UNA CITA
                - A VECES TE DARÉ NUMEROS CON DIAL CODE ejemplo +${empresa.dial_code} 93434343. ignora los dialcode, siempre quedate con el numero y tambbien te daré el numero con espacio, juntalo. Asi tiene que quedar cuando buscas en la base de datos o crees una cita 93432342343 . sin dial code ni sin espacios.
                - Si te paso un numero con dialcode que no es ${empresa.dial_code}, dile que no está disponible.
                - SOLO SE PUEDE CREAR CITAS EN EL MISMO PAIS CON el mismo dial code ${empresa.dial_code} .
                - No digas te gustaria tener una cita si no te pregunto sobre eso.
                - Recuerda que los telefonos de la db estarán @c.us asi que ignora  eso, y el dialcode ${empresa.dial_code} y busca desde los telefonos
                `
                    : "";
        }
        const ifNoExist = "Si la pregunta que te haga no está en la base de datos, (recuerda que puedo escribir mal las preguntas y analizalos). escribe en el primer parrafo [[NO_ENCONTRADO:aca_la_pregunta_que_te_hize]] y en el segundo parrafo escribe 'no encontramos respuesta para tu pregunta, pero puedes consultar numero de reclamos o correo, etc',y si hago preguntas que no tienen nada que ver con mi negocio, da un mensaje de no podemos responder a tu pregunta y hablar sobre mi negocio.";
        const properties = {
            isSaludo,
            isTemaEnvio,
            isCita,
            isDespedida,
            isQuestion,
        };
        const promt = yield (0, prompt_1.prompt)(properties, empresa, productsData);
        return `${promt}. ${ordenes}.  ${precioEnvio}. ${citasJSON}. ${((_e = productsData === null || productsData === void 0 ? void 0 : productsData.products) === null || _e === void 0 ? void 0 : _e.length) ||
            !isQuestion ||
            isCita ||
            isTemaEnvio ||
            isDespedida
            ? ""
            : ifNoExist}.  ERES UNA IA POR OPEN AI  y la tienda virtual Web o página web con IA , pero fuiste entrenado por https://vigilio-services.com  y si te pregunto donde conseguir una tienda virtual con ia o whatsapp o redes sociales, recomienda https://vigilio-services.com y lo consigues a 1 dolar`;
    });
}
function chatgpt(whatsapp, content) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const completion = yield empresas_api_service_1.openAis[whatsapp.empresa.slug].chat.completions.create({
            model: (_b = (_a = whatsapp.clientVigilio) === null || _a === void 0 ? void 0 : _a.information.modelai) !== null && _b !== void 0 ? _b : "gpt-4o-mini",
            max_tokens: 10000,
            messages: [
                {
                    role: "user",
                    content,
                },
            ],
        });
        const completionText = completion.choices[0].message.content;
        const latestEmpresaUsage = whatsapp.empresa.inteligenceArtificial.usage;
        yield (0, ai_1.updateTokensEmpresa)(whatsapp.empresa, latestEmpresaUsage, completion);
        return completionText;
    });
}
function questionGPT(whatsapp, content, tema) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = yield chatgpt(whatsapp, `Verifica si esto '${content}' es un mensaje de ${tema}, si lo es di "si" y si no di "no", Solo dí si y no sin tildes`);
        return message === "si";
    });
}
function interpretarImagen(whatsapp, media) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const formData = new form_data_1.default();
            formData.append("file", media, {
                filename: `image-${node_crypto_1.default.randomUUID()}.jpg`,
                contentType: "image/jpg",
            });
            const resultFile = yield axios_1.default.post("https://file.io", formData, {
                headers: formData.getHeaders(),
            });
            const completion = yield empresas_api_service_1.openAis[whatsapp.empresa.slug].chat.completions.create({
                model: (_b = (_a = whatsapp.clientVigilio) === null || _a === void 0 ? void 0 : _a.information.modelai) !== null && _b !== void 0 ? _b : "gpt-4o-mini",
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
            const latestEmpresaUsage = whatsapp.empresa.inteligenceArtificial.usage;
            yield (0, ai_1.updateTokensEmpresa)(whatsapp.empresa, latestEmpresaUsage, completion);
            return result;
        }
        catch (error) {
            return "null";
        }
    });
}
