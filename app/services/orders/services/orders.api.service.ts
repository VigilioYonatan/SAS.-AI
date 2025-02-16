import { Injectable } from "@vigilio/express-core";
import { Orders } from "../entities/orders.entity";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import { generateCodeEntity } from "~/libs/helpers";
import type { OrdersUpdateDto } from "../dtos/orders.update.dto";
import { InvoicesApiService } from "./invoices.api.service";
import {
    STATUSORDER,
    crdGenerate,
    getOrder,
    onGuideSunat,
    onInvoiceSunat,
    onNoteSunat,
    pdfGenerate,
    usersMostOrders,
    xmlGenerate,
} from "../libs";
import type { Request } from "express";
import { invoiceSendSunatApi } from "../sunat/invoice.send.api";
import { DetailOrdersApiService } from "./detail_orders.api.service";
import { Invoices } from "../entities/invoices.entity";
import { NotesApiService } from "./notes.api.service";
import { ProductsApiService } from "@/products/services/products.api.service";
import { formatMoney, subtotal, subtotalIgv } from "@/cart/libs/helpers";
import type { OrdersStoreDto } from "../dtos/orders.store.dto";
import { Op, type WhereOptions } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { GuidesApiService } from "./guides.api.service";
import { DetailOrders } from "../entities/detail_orders.entity";
import type { Notes } from "../entities/notes.entity";
import { noteSendSunatApi } from "../sunat/note.send.api";
import enviroments from "~/config/enviroments.config";
import { invoicePDFSunatApi } from "../sunat/invoice.pdf.api";
import type { SunatInvoiceDto } from "../sunat/dtos/sunat.invoice.dto";
import { NOW, TimePeru, formatTime, restarDays } from "~/libs/dayjs";
import type { InvoiceResponseSunat } from "../schemas/invoices.schema";
import type { NoteResponseSunat } from "../schemas/notes.schema";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { guideSendSunatApi } from "../sunat/guide.send.api";
import { notePDFSunatApi } from "../sunat/note.pdf.api";
import { UbigeoApiService } from "@/ubigeo/services/ubigeo.api.service";
import type { SunatNoteDto } from "../sunat/dtos/sunat.note.dto";
import type { SunatGuideDto } from "../sunat/dtos/sunat.guide.dto";
import { guidePDFSunatApi } from "../sunat/guide.pdf.api";
import { Users } from "@/users/entities/users.entity";
import type { RequestVigilio } from "~/config/types";
import { Variants } from "@/products/entities/options/variants.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { ProductsServicio } from "@/products/entities/products_servicio.entity";
import { whatsappSendFileApi, whatsappSendMessageApi } from "@/bot/api";
import { BASE_URL, DIALCODE, type Money } from "@/empresas/libs";
import { Product, productEntityId } from "@/products/libs";
import { ticketHTML } from "../libs/ticket";
import type { PASARELA } from "@/payments/libs";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { CitasApiService } from "@/citas/services/citas.api.service";
import { UsersApiService } from "@/users/services/users.api.service";
import type { UsersStoreDto } from "@/users/dtos/users.store.dto";
import { slug } from "@vigilio/express-core/helpers";
import { ROLES } from "@/users/libs";
import { Citas } from "@/citas/entities/citas.entities";
import webpush from "@/notificactions/libs/webpush";
import { printFileWithDimension } from "@/uploads/libs/helpers";
import { sendMessageToClient } from "@/bot/libs/ai";

@Injectable()
export class OrdersApiService {
    constructor(
        private readonly productsApiService: ProductsApiService,
        private readonly invoicesApiService: InvoicesApiService,
        private readonly notesApiService: NotesApiService,
        private readonly guidesApiService: GuidesApiService,
        private readonly detailOrdersApiService: DetailOrdersApiService,
        private readonly ubigeoApiService: UbigeoApiService,
        private readonly usersApiService: UsersApiService,
        private readonly citasApiService: CitasApiService
    ) {}

    async index(empresa: Empresas) {
        const data = await Orders.findAll({
            where: {
                empresa_id: empresa.id,
            },
        });
        return {
            success: true,
            data,
        };
    }

    async earningMonth(empresa: Empresas, year: string, month: string) {
        const startDate = new Date(Number(year), Number(month) - 1, 1); // Restamos 1 al mes porque en JavaScript los meses van de 0 a 11
        // Luego, calculamos la fecha de fin del mes
        const endDate = new Date(Number(year), Number(month), 0); // Usamos el día 0 del mes siguiente para obtener el último día del mes actual

        const where: WhereOptions = {
            createdAt: {
                [Op.between]: [startDate, endDate],
            },
            empresa_id: empresa.id,
        };
        const [
            earning,
            ordersTotal,
            ordersTotalPay,
            ordersTotalError,
            orderDelivery,
            orderLocal,
            detailOrders,
            mostUser,
            rating,
            usersMostOrder,
        ] = await Promise.all([
            Orders.unscoped().findOne({
                attributes: [
                    [Sequelize.fn("SUM", Sequelize.col("total")), "total"],
                ],
                where: {
                    ...where,
                    status_order_id: STATUSORDER.entregado,
                },
            }),
            Orders.unscoped().count({
                where: {
                    ...where,
                },
            }),
            Orders.unscoped().count({
                where: {
                    ...where,
                    status_order_id: STATUSORDER.pagado,
                },
            }),
            Orders.unscoped().count({
                where: {
                    ...where,
                    status_order_id: STATUSORDER.problema,
                },
            }),
            Orders.unscoped().count({
                where: {
                    ...where,
                    isDelivery: true,
                },
            }),
            Orders.unscoped().count({
                where: {
                    ...where,
                    isDelivery: false,
                },
            }),
            DetailOrders.unscoped().findAll({
                where,
            }),
            Orders.unscoped().findAll({
                attributes: [
                    "user_id",
                    [Sequelize.fn("COUNT", "user_id"), "order_count"],
                ],
                group: ["user_id"],
                order: [[Sequelize.literal("order_count"), "DESC"]],
                limit: 1,
                raw: true, // Obtener resultados como objetos JSON planos
                where,
            }),
            Orders.unscoped().findAll({
                attributes: [
                    [Sequelize.fn("SUM", Sequelize.col("total")), "total"],
                    [Sequelize.fn("DATE", Sequelize.col("createdAt")), "time"],
                ],
                where: {
                    status_order_id: STATUSORDER.entregado,
                    ...where,
                },
                group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
            }),
            usersMostOrders(empresa, where),
        ]);

        const orders = {
            ganancias: earning ? earning.total : 0,
            ordersTotal,
            ordersTotalPay,
            ordersTotalError,
            orderDelivery,
            orderLocal,
            mostUser,
        };

        const productsNormalMost = await detailOrders.reduce(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (acc: any, order: any) => {
                acc[order.product_normal_id] =
                    (acc[order.product_normal_id] || 0) + 1;
                return acc;
            },
            {}
        );
        const productsRestaurantMost = await detailOrders.reduce(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (acc: any, order: any) => {
                acc[order.product_restaurant_id] =
                    (acc[order.product_restaurant_id] || 0) + 1;
                return acc;
            },
            {}
        );
        const productsServicioMost = await detailOrders.reduce(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (acc: any, order: any) => {
                acc[order.product_servicio_id] =
                    (acc[order.product_servicio_id] || 0) + 1;
                return acc;
            },
            {}
        );

        const obj = {
            ...productsNormalMost,
            ...productsRestaurantMost,
            ...productsServicioMost,
        };

        const topThreeProductIds = await Promise.all(
            Object.keys(obj)
                .sort((a, b) => obj[b] - obj[a])
                .slice(0, 3)
                .filter((ord) => ord !== "null")
                .map(async (ord) => {
                    let producto = null;
                    const { product } = await this.productsApiService.show(
                        empresa,
                        ord,
                        false,
                        false,
                        null,
                        false
                    );
                    producto = product;
                    if (!product) {
                        const { product } = await this.productsApiService.show(
                            empresa,
                            ord,
                            true,
                            false,
                            null,
                            false
                        );
                        producto = product;
                    }
                    return {
                        id: producto.id,
                        name: producto.name,
                        image: producto.images,
                    };
                })
        );
        const ratingArray = rating.map(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (res: { get: (arg0: string) => any }) => ({
                value: res.get("total"),
                time: res.get("time"),
            })
        );
        return {
            success: true,
            results: {
                orders,
                topThreeProductIds,
                ratingArray,
                usersMostOrders: usersMostOrder,
            },
        };
    }

    async show(empresa: Empresas, order_code: string) {
        let order = await Orders.findOne({
            where: { order_code, empresa_id: empresa.id },
        });
        if (!order) {
            throw new NotFoundException(
                `No se encontró un orden con ${order_code}`
            );
        }
        order = await getOrder(empresa, order, true);

        return {
            success: true,
            order,
        };
    }
    // imprimir pdf
    async pdf(
        order_code: string,
        type: "note" | "invoice" | "guide" | "recibo",
        empresa: Empresas
    ) {
        const { order } = await this.show(empresa, order_code);
        if (!["note", "invoice", "guide", "recibo"].includes(type))
            throw new BadRequestException("Solo note, guide o invoice");

        let sunat: null | SunatInvoiceDto | SunatGuideDto = null;
        const vendedor = `${(order.user as Users)?.name ?? ""} ${
            (order.user as Users)?.lastname ?? ""
        }`;

        if (
            (order.dataValues.invoice && type === "invoice") ||
            (order.dataValues.invoice && type === "recibo")
        ) {
            sunat = await onInvoiceSunat({
                detail_orders: order.dataValues.details_orders,
                empresa,
                invoice: order.dataValues.invoice as Invoices,
                order,
                vendedor,
            });
        }
        if (order.dataValues.note && type === "note") {
            sunat = await onNoteSunat({
                detail_orders: order.dataValues.details_orders,
                empresa,
                note: order.dataValues.note,
                order,
                invoice: order.dataValues.invoice,
                vendedor,
            });
        }

        if (order.dataValues.guide && type === "guide") {
            sunat = await onGuideSunat({
                detail_orders: order.dataValues.details_orders,
                empresa,
                order,
                vendedor,
                guide: order.dataValues.guide,
            });
        }
        if (!sunat) throw new BadRequestException("No hubo nota o comprobante");
        const typePDF =
            type === "invoice" || type === "recibo"
                ? (order.dataValues.invoice as Invoices).kind_invoice_code ===
                      "01" ||
                  (order.dataValues.invoice as Invoices).kind_invoice_code ===
                      "03"
                    ? "invoice"
                    : "recibo"
                : type === "note"
                ? "note"
                : "guide";

        const result = await pdfGenerate({
            empresa,
            sunat,
            order,
            type: typePDF,
        });

        return result;
    }
    async html(
        order_code: string,
        type: "note" | "invoice" | "guide" | "recibo",
        empresa: Empresas
    ) {
        const { order } = await this.show(empresa, order_code);
        if (!["note", "invoice", "guide", "recibo"].includes(type))
            throw new BadRequestException("Solo note, guide o invoice");
        const vendedor = `${(order.user as Users)?.name ?? ""} ${
            (order.user as Users)?.lastname ?? ""
        }`;
        let sunat: null | SunatInvoiceDto | SunatGuideDto = null;
        let stringHTML = "";

        if (order.dataValues.invoice && type === "invoice") {
            sunat = await onInvoiceSunat({
                detail_orders: order.dataValues.details_orders,
                empresa,
                invoice: order.dataValues.invoice as Invoices,
                order,
                vendedor,
            });
            stringHTML = await invoicePDFSunatApi(sunat as SunatInvoiceDto);
        }

        if (order.dataValues.invoice && type === "recibo") {
            sunat = await onInvoiceSunat({
                detail_orders: order.dataValues.details_orders,
                empresa,
                invoice: order.dataValues.invoice as Invoices,
                order,
                vendedor,
            });
            stringHTML = await ticketHTML(order, empresa);
        }
        if (order.dataValues.note && type === "note") {
            sunat = await onNoteSunat({
                detail_orders: order.dataValues.details_orders,
                empresa,
                note: order.dataValues.note,
                order,
                invoice: order.dataValues.invoice,
                vendedor,
            });
            stringHTML = await notePDFSunatApi(sunat as SunatNoteDto);
        }
        if (order.dataValues.guide && type === "guide") {
            sunat = await onGuideSunat({
                detail_orders: order.dataValues.details_orders,
                empresa,
                order,
                vendedor,
                guide: order.dataValues.guide,
            });

            stringHTML = await guidePDFSunatApi(sunat as SunatGuideDto);
        }

        if (!sunat) throw new BadRequestException("No hubo nota o comprobante");
        return stringHTML;
    }

    // agregar orden
    async store(
        ordersStoreDto: OrdersStoreDto,
        req: RequestVigilio,
        type: PASARELA = "normal",
        moneyConvert: number | null = null,
        comision?: {
            pasarela_comision?: boolean;
        } // to diference paypal o pasarela
    ) {
        const empresa = req.empresa;
        const { invoice, details_orders, ...rest } = ordersStoreDto;
        const { pasarela_comision = false } = comision || {
            pasarela_comision: false,
        };
        let user: null | Users = null;
        const moneyConverter = moneyConvert ? moneyConvert : req.moneyConverter;
        if (ordersStoreDto.telephone) {
            user = await Users.findOne({
                where: {
                    telephone: ordersStoreDto.telephone,
                    empresa_id: empresa.id,
                },
            });

            if (user && !user.enabled) {
                throw new BadRequestException(
                    "No está permitido a realizar pedidos."
                );
            }

            // verifica si hay un usuario
            if (user && ordersStoreDto.password) {
                throw new BadRequestException(
                    "Ya existe una cuenta de este usuario, Inicia sesión."
                );
            }
            if (!user) {
                const userName = `${ordersStoreDto.fullName}${Math.random()
                    .toString(32)
                    .slice(3, 6)}`;
                const token: string = crypto.randomUUID();
                const [byFullName, byTelephone, byEmail] = await Promise.all([
                    Users.findOne({
                        where: {
                            username: ordersStoreDto.fullName,
                            empresa_id: empresa.id,
                        },
                        raw: true,
                    }),
                    Users.findOne({
                        where: {
                            telephone: ordersStoreDto.telephone,
                            empresa_id: empresa.id,
                        },
                        raw: true,
                    }),
                    Users.findOne({
                        where: {
                            email: ordersStoreDto.email,
                            empresa_id: empresa.id,
                        },
                        raw: true,
                    }),
                ]);

                if (byFullName) {
                    throw new BadRequestException(
                        "Ya existe un usuario con este nombre de usuario",
                        { body: "fullName" }
                    );
                }
                if (byTelephone) {
                    throw new BadRequestException(
                        "Ya existe un usuario con este telefono",
                        { body: "telephone" }
                    );
                }
                if (byEmail) {
                    throw new BadRequestException(
                        "Ya existe un usuario con este correo electrónico",
                        { body: "email" }
                    );
                }
                const { user: usuario } = await this.usersApiService.store(
                    empresa,
                    {
                        telephone: ordersStoreDto.telephone,
                        enabled: false,
                        username: userName,
                        name: ordersStoreDto.fullName!,
                        address: ordersStoreDto.address || null,
                        city_id: ordersStoreDto.city_id || null,
                        birthday: new Date(),
                        lastname: "",
                        password: ordersStoreDto.password,
                        role_id: ROLES.user,
                        map_marker: ordersStoreDto.map_marker || null,
                        empresa_id: empresa.id,
                        email: ordersStoreDto.email || null,
                        identification_number:
                            ordersStoreDto.invoice?.identification_number ||
                            null,
                        reference: ordersStoreDto.reference || null,
                        buys: [],
                        slug: slug(userName),
                        speciality: null,
                    } as UsersStoreDto
                );
                user = usuario;
                await usuario.update({ token });
                try {
                    const name = empresa.whatsapp_mode!.find(
                        (w) => w.name === "docker"
                    )!.name;
                    await sendMessageToClient(
                        empresa,
                        name,
                        `${empresa.dial_code}${ordersStoreDto.telephone}@c.us`,
                        `Hola *${
                            usuario.username
                        }*.\nYa puedes acceder a tu cuenta, ingresa al siguiente link:\n*${BASE_URL(
                            empresa
                        )}/auth/confirmed-account?token=${token}*`
                    );
                } catch (error) {}
            }
        }

        if (!empresa.isOpen)
            throw new BadRequestException(empresa.whatsappconfig.enabled);
        const findDay = empresa.schedule.find(
            (day) => day.id === NOW(empresa).day()
        );

        if (
            NOW(empresa).isAfter(formatTime(empresa, findDay!.openTime)) &&
            NOW(empresa).isBefore(formatTime(empresa, findDay!.closeTime)) &&
            findDay!.enabled
        ) {
        } else {
            throw new BadRequestException(empresa.whatsappconfig.cerrado);
        }

        const detailsOrder = await Promise.all(
            details_orders.map(async (detail_order) => {
                const typeProduct = productEntityId(
                    empresa,
                    ordersStoreDto.isService
                );

                const { product } = await this.productsApiService.show(
                    empresa,
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    (detail_order as any)[typeProduct],
                    ordersStoreDto.isService,
                    true,
                    null,
                    false
                );

                let disc = null;
                let quantity = detail_order.quantity;
                if (product instanceof ProductsNormal) {
                    // encontrar variant
                    const variant = (
                        product.dataValues.variants as Variants[]
                    ).find((variant) => variant.id === detail_order.variant_id);

                    if (
                        !variant ||
                        !product?.enabled ||
                        (!variant.ilimit && variant.stock! < 1) ||
                        (!variant.ilimit &&
                            variant.stock! < detail_order.quantity)
                    ) {
                        throw new BadRequestException(
                            `Hubo un problema al realizar la compra en uno de los productos ${product.name.slice(
                                0,
                                13
                            )}-${variant?.sku}..., ${
                                !product?.enabled ? "No disponible" : ""
                            } ${variant?.stock! < 1 ? "Se acabó stock" : ""}`
                        );
                    }
                    if (detail_order.coupon) {
                        const { discount } =
                            await this.productsApiService.coupon(
                                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                (detail_order as any)[typeProduct],
                                detail_order.coupon,
                                empresa,
                                ordersStoreDto.isService
                            );

                        disc = discount;
                    }
                }
                const producto = product as
                    | ProductsRestaurant
                    | ProductsServicio;
                if (producto instanceof ProductsRestaurant) {
                    if (
                        !producto ||
                        !producto?.enabled ||
                        (!producto.ilimit && producto.stock! < 1) ||
                        (!producto.ilimit &&
                            producto.stock! < detail_order.quantity)
                    ) {
                        throw new BadRequestException(
                            `Hubo un problema al realizar la compra en uno de los productos ${product.name.slice(
                                0,
                                13
                            )}..., ${
                                !producto?.enabled ? "No disponible" : ""
                            } ${producto?.stock! < 1 ? "Se acabó stock" : ""}`
                        );
                    }
                }
                if (producto instanceof ProductsServicio) {
                    const day = producto.days.find(
                        (d) => d.name === detail_order.variante
                    );
                    if (!day) {
                        const date = (product as ProductsServicio).showHorario
                            ? detail_order.variante
                            : null;
                        if (date) {
                            const hour = date.split("T")[1];
                            const time = date.split("T")[0];
                            const citas = await Citas.findAll({
                                where: {
                                    date: time,
                                    hour: {
                                        [Op.like]: `${hour.split(":")[0]}%`,
                                    },
                                    empresa_id: empresa.id,
                                },
                            });

                            if (
                                citas.length >
                                empresa.citasSetting.maxCitasForHour
                            ) {
                                throw new BadRequestException(
                                    "Ya hay citas a esa hora."
                                );
                            }
                        }
                    } else {
                        quantity = day.cantidad;
                    }
                }

                if (detail_order.coupon) {
                    const { discount } = await this.productsApiService.coupon(
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        (detail_order as any)[typeProduct],
                        detail_order.coupon,
                        empresa,
                        ordersStoreDto.isService
                    );
                    disc = discount;
                }

                return {
                    subtotal: subtotalIgv(empresa, product, disc) * quantity,
                };
            })
        );

        const total = detailsOrder.reduce((ins, prod) => {
            return ins + prod.subtotal;
        }, 0);
        let totalWithDistrict = total;

        if (ordersStoreDto.city_id) {
            const { data } = await this.ubigeoApiService.citiesShow(
                empresa,
                ordersStoreDto.city_id
            );
            const priceShip = empresa.enabled_igv
                ? subtotal(data.dataValues.priceShipping, empresa.igv, true)
                : data.dataValues.priceShipping;
            totalWithDistrict = totalWithDistrict + priceShip;
        }

        /* verificamos que el total del cliente y servidor sean iguales */
        if (ordersStoreDto.total.toFixed(2) !== totalWithDistrict.toFixed(2))
            throw new BadRequestException(
                "Hubo un error al realizar esta orden."
            );

        const order = new Orders({
            ...rest,
            igv: empresa!.enabled_igv,
            pasarela_comision,
            moneyChange: moneyConverter,
            is_pasarela_client: empresa!.enabledClientPayComision,
            empresa_id: empresa.id,
            user_id: user ? user.id : null,
            type_pasarela: type,
        });
        order.order_code = await generateCodeEntity(
            Orders,
            "order_code" as keyof Orders,
            "ORD",
            empresa
        );
        await order.save();

        if (invoice) {
            const { correlativo } =
                await this.invoicesApiService.latestCorrelativo(
                    empresa,
                    invoice.kind_invoice_code
                );
            const serie =
                invoice.kind_invoice_code === "00"
                    ? "R001"
                    : invoice.kind_invoice_code === "01"
                    ? "F001"
                    : "B001";

            await this.invoicesApiService.store({
                ...invoice!,
                serie,
                order_id: order.id,
                cdr_path: null,
                xml_path: null,
                correlativo,
                response_sunat: null,
                empresa_id: empresa.id,
            });
        }
        const detailsOrders = await Promise.all(
            details_orders.map(async (detail_order) => {
                const productID = productEntityId(
                    empresa,
                    ordersStoreDto.isService
                );
                const [newDetailOrder, { product }] = await Promise.all([
                    this.detailOrdersApiService.store(empresa, {
                        ...detail_order,
                        order_id: order.id,
                    }),
                    this.productsApiService.show(
                        empresa,
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        (detail_order as any)[
                            productID as keyof typeof detail_order
                        ],
                        ordersStoreDto.isService,
                        true,
                        null,
                        false
                    ),
                ]);
                if (product instanceof ProductsServicio) {
                    const date = product.showHorario
                        ? detail_order.variante?.split("T")
                        : null;
                    if (date) {
                        await this.citasApiService.store(empresa, {
                            telephone: ordersStoreDto.telephone!,
                            answers: {},
                            description: `Se confirmó cita ${order.order_code}`,
                            hour: date.at(-1)!,
                            date: detail_order.variante as unknown as Date,
                        });
                    }
                    // const
                }
                if (product instanceof ProductsNormal) {
                    // encontrar variant
                    const variant = (
                        product.dataValues.variants as Variants[]
                    ).find(
                        (variant) => variant.id === detail_order.variant_id
                    )!;
                    if (!variant?.ilimit) {
                        // reatamos la cantidad del stock de los productos
                        const stock = variant.stock! - detail_order.quantity;
                        await Variants.update(
                            { stock },
                            { where: { id: variant.id } }
                        );
                    }
                }
                const producto = product as
                    | ProductsRestaurant
                    | ProductsServicio;
                if (producto instanceof ProductsRestaurant) {
                    if (!producto?.ilimit) {
                        // reatamos la cantidad del stock de los productos
                        const quantity =
                            producto.stock! - detail_order.quantity;
                        await producto.update({ stock: quantity });
                    }
                }

                // si hay cupon descontar el cupon de uso
                if (detail_order.coupon) {
                    const { coupon } = await this.productsApiService.coupon(
                        product.id,
                        detail_order.coupon,
                        empresa,
                        ordersStoreDto.isService
                    );
                    if (coupon) {
                        if (coupon.max_use > 0) {
                            const decrease = coupon.max_use - 1;
                            await coupon.update({ max_use: decrease });
                        }
                    }
                }
                return `*${product.name}${
                    ` ${detail_order.variante || ""}` || ""
                }* - ${detail_order.quantity} UND - *${formatMoney(
                    empresa,
                    detail_order.price,
                    empresa.money.money as Money
                )}*`;
            })
        );
        try {
            if (empresa.enabledSendMessage && ordersStoreDto.telephone) {
                const telephone = `${empresa.dial_code}${ordersStoreDto.telephone}@c.us`;
                const name = empresa.whatsapp_mode!.find(
                    (w) => w.name === "docker"
                )!.name;
                await sendMessageToClient(
                    empresa,
                    name,
                    telephone,
                    empresa.dial_code === "55"
                        ? `Olá 😊, aqui está o código do seu pedido ${order.order_code}.\n Não se esqueça de nos perguntar o status do seu pedido, digitando o código do pedido.`
                        : `Hola 😊, Su orden *${
                              order.order_code
                          }*.\n${detailsOrders.join(
                              "\n"
                          )}.\n\nTotal: *${formatMoney(
                              empresa,
                              ordersStoreDto.total,
                              empresa.money.money as Money
                          )}*  ${
                              moneyConverter !== 1
                                  ? `- *${formatMoney(
                                        empresa,
                                        ordersStoreDto.total * moneyConverter,
                                        "DOLARES"
                                    )}*`
                                  : ""
                          }\n\nNo olvides preguntar el estado de tu orden, digitando el *código* del orden ó en ${BASE_URL(
                              empresa
                          )}/pedidos?code=${order.order_code}`
                );
            }
        } catch (error) {}

        return {
            success: true,
            order,
            details_orders,
        };
    }
    // actualizar orden
    async update(props: {
        order_code: string;
        ordersUpdateDto: OrdersUpdateDto;
        req: Request;
    }) {
        const { invoice, note, isService, ...rest } = props.ordersUpdateDto;
        const empresa = (props.req as RequestVigilio).empresa!;
        const user = props.req.user as Users;

        // const subFacturacion = (
        //     props.req as RequestVigilio
        // ).permissionWeb.subFacturacion();
        const subFacturacion = true; //!
        const { order } = await this.show(empresa, props.order_code);
        const vendedor = `${user?.name ?? ""} ${user?.lastname ?? ""}`;

        if (
            rest.status_order_id === STATUSORDER.pagado ||
            rest.status_order_id === STATUSORDER.entregado
        ) {
            await this.onInvoice({
                order,
                empresa,
                ordersUpdateDto: props.ordersUpdateDto,
                vendedor,
                subFacturacion,
            });
        }

        if (
            rest.status_order_id === STATUSORDER.enviando ||
            rest.status_order_id === STATUSORDER.pagado
        ) {
            await this.onGuides({
                order,
                empresa,
                ordersUpdateDto: props.ordersUpdateDto,
                vendedor,
                subFacturacion,
            });
        }
        // si no envio factura o boleta y tenga el sunat props
        if (
            rest.status_order_id === STATUSORDER.problema &&
            empresa.dial_code === "51"
        ) {
            await this.onNote({
                order,
                empresa,
                ordersUpdateDto: props.ordersUpdateDto,
                vendedor,
                subFacturacion,
            });
        }
        const usuario = order.user as Users;

        if (usuario?.subscription && usuario?.enabledNotification) {
            if (
                order.status_order_id !== STATUSORDER.enviando &&
                props.ordersUpdateDto.status_order_id === STATUSORDER.entregado
            ) {
                const payload = {
                    title: `Tu pedido ${order.order_code} ha sido entregado correctamente.`,
                    message: `Hola ${usuario.name}, tu pedido ${order.order_code} ha sido entregado correctamente.`, // Asegúrate de que content sea el mensaje que quieres enviar
                    url: `${BASE_URL(empresa)}/pedidos?code=${
                        order.order_code
                    }`, // URL dinámica
                    logo: empresa.logo
                        ? printFileWithDimension(empresa)(empresa.logo!, 100)[0]
                        : "",
                    tag: "pedido-entregado",
                };
                await webpush.sendNotification(
                    usuario.subscription,
                    JSON.stringify(payload)
                );
            }
            if (
                order.status_order_id !== STATUSORDER.enviando &&
                props.ordersUpdateDto.status_order_id === STATUSORDER.enviando
            ) {
                const payload = {
                    title: `Tu pedido ${order.order_code} está siendo enviando a su destino.`,
                    message: `Hola ${usuario.name}, tu pedido ${order.order_code} está siendo enviando a su destino.`, // Asegúrate de que content sea el mensaje que quieres enviar
                    url: `${BASE_URL(empresa)}/pedidos?code=${
                        order.order_code
                    }`, // URL dinámica
                    logo: empresa.logo
                        ? printFileWithDimension(empresa)(empresa.logo!, 100)[0]
                        : "",
                    tag: "pedido-entregado",
                };
                await webpush.sendNotification(
                    usuario.subscription,
                    JSON.stringify(payload)
                );
            }
        }

        if (
            props.ordersUpdateDto.status_order_id === STATUSORDER.entregado &&
            order.status_order_id !== STATUSORDER.entregado &&
            order.user_id
        ) {
            const user = await Users.findByPk(order.user_id);
            const buys: { title: string; date: Date | null; order: string }[] =
                await Promise.all(
                    (order.dataValues.details_orders as DetailOrders[]).map(
                        async (prod) => {
                            const product = await Product(
                                empresa,
                                order.isService
                            ).findOne({
                                where: {
                                    id: prod[
                                        productEntityId(
                                            empresa,
                                            order.isService
                                        ) as keyof typeof prod
                                    ],
                                    empresa_id: empresa.id,
                                },
                            });
                            return {
                                order: order.order_code,
                                title: `${product.name}  ${
                                    prod.variante ? `- ${prod.variante}` : ""
                                }`,
                                date:
                                    product instanceof ProductsServicio &&
                                    product.days.length
                                        ? (NOW(empresa)
                                              .add(
                                                  product.days.find(
                                                      (pr) =>
                                                          pr.name ===
                                                          prod.variante
                                                  )?.days ?? 0,
                                                  "day"
                                              )
                                              .format() as unknown as Date)
                                        : null,
                            };
                        }
                    )
                );

            await user?.update({
                buys: [...buys, ...(user.buys ?? []).slice(0, 20)],
            });
        }

        if (
            rest.status_order_id === STATUSORDER.problema &&
            order.status_order_id !== STATUSORDER.problema
        ) {
            //  se resetea la cantidad y cupon
            await Promise.all(
                (order.dataValues.details_orders as DetailOrders[]).map(
                    async (detail_order) => {
                        const productId = productEntityId(empresa, isService);
                        const { product } = await this.productsApiService.show(
                            empresa,
                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                            (detail_order as any)[productId],
                            isService,
                            true,
                            null,
                            false
                        );
                        // encontrar variant
                        if (product instanceof ProductsNormal) {
                            const variant = (
                                product.dataValues.variants as Variants[]
                            ).find(
                                (variant) =>
                                    variant.id === detail_order.variant_id
                            );
                            if (!variant?.ilimit) {
                                // reatamos la cantidad del stock de los productos
                                const stock =
                                    variant!.stock! + detail_order.quantity;
                                await Variants.update(
                                    { stock },
                                    { where: { id: variant?.id } }
                                );
                            }
                        }
                        const producto = product as
                            | ProductsRestaurant
                            | ProductsServicio;
                        if (producto instanceof ProductsRestaurant) {
                            if (!producto?.ilimit) {
                                // reatamos la cantidad del stock de los productos
                                const quantity =
                                    producto!.stock! + detail_order.quantity;
                                await product.update({ stock: quantity });
                            }
                        }

                        // si hay cupon descontar el cupon de uso
                        if (detail_order.coupon) {
                            const { coupon } =
                                await this.productsApiService.coupon(
                                    detail_order.coupon,
                                    product.id,
                                    empresa,
                                    isService
                                );
                            if (coupon) {
                                if (coupon.max_use > 0) {
                                    const decrease = coupon.max_use + 1;
                                    await coupon.update({
                                        max_use: decrease,
                                    });
                                }
                            }
                        }
                    }
                )
            );
        }
        await order.update({ ...rest, seller_id: user ? user.id : null });
        return {
            success: true,
            order,
        };
    }

    async onInvoice(props: {
        ordersUpdateDto: OrdersUpdateDto;
        order: Orders;
        empresa: Empresas;
        vendedor: string;
        subFacturacion: boolean;
    }) {
        const { empresa, order, ordersUpdateDto, subFacturacion, vendedor } =
            props;
        const { invoice, isService } = ordersUpdateDto;
        const detail_orders = order.dataValues.details_orders as DetailOrders[];
        const getInvoice = order.dataValues.invoice;
        if (invoice) {
            let files: {
                xml_path: string | null;
                cdr_path: string | null;
                response_sunat: InvoiceResponseSunat | null;
            } = {
                xml_path: getInvoice?.xml_path ?? null,
                cdr_path: getInvoice?.cdr_path ?? null,
                response_sunat: getInvoice?.response_sunat ?? null,
            };
            if (!getInvoice) {
                const { correlativo } =
                    await this.invoicesApiService.latestCorrelativo(
                        empresa,
                        invoice.kind_invoice_code
                    );
                const serie =
                    invoice?.kind_invoice_code === "00"
                        ? "R001"
                        : invoice?.kind_invoice_code === "01"
                        ? "F001"
                        : "B001";
                invoice.correlativo = correlativo;
                invoice.serie = serie;
            }

            const sunat = await onInvoiceSunat({
                detail_orders,
                empresa,
                invoice,
                order,
                vendedor,
            });
            // solo peru
            if (empresa.dial_code === DIALCODE.peru) {
                // si no existe pdf path que cree y guarda y si tiene subfacturacion
                if (
                    !files.xml_path &&
                    (invoice.kind_invoice_code === "01" ||
                        invoice.kind_invoice_code === "03")
                ) {
                    const xml = await xmlGenerate({
                        empresa,
                        sunat,
                        order,
                        type: "invoice",
                    });
                    files = { ...files, xml_path: xml };
                }

                // le dio enviar sunat y no habia enviado a sunat antes y que no pase de 2 dias
                const limitInvoice =
                    restarDays(
                        empresa,
                        NOW(empresa).format(),
                        TimePeru(empresa, order.createdAt!)
                            .add(enviroments.VITE_DIASFACTURASBOLETA, "day")
                            .diff(NOW(empresa))
                    ) < 0;
                if (
                    invoice.send_sunat &&
                    !getInvoice?.send_sunat &&
                    subFacturacion &&
                    limitInvoice &&
                    (invoice.kind_invoice_code === "01" ||
                        invoice.kind_invoice_code === "03")
                ) {
                    const { sunatResponse } = await invoiceSendSunatApi(sunat);
                    // crdGenerate
                    if (!sunatResponse.success) {
                        invoice.send_sunat = false; // No se envio a sunat por que hubo error . asi que falso
                        throw new BadRequestException(
                            JSON.stringify(sunatResponse.error)
                        );
                    }
                    const cdr = await crdGenerate({
                        cdrzip: sunatResponse.cdrZip,
                        empresa,
                        orderCode: props.order.order_code,
                    });
                    files = {
                        ...files,
                        cdr_path: cdr,
                        response_sunat: {
                            cdrResponse: sunatResponse.cdrResponse,
                            error: sunatResponse.error,
                        },
                    };
                }
            }

            if (
                ordersUpdateDto.telephone &&
                ordersUpdateDto.send_message &&
                empresa.enabledSendMessage
            ) {
                const type =
                    invoice?.kind_invoice_code === "01"
                        ? "FACTURA"
                        : invoice?.kind_invoice_code === "03"
                        ? "BOLETA"
                        : "COMPROBANTE";
                try {
                    const telephone = `${empresa.dial_code}${ordersUpdateDto.telephone}@c.us`;
                    const name = empresa.whatsapp_mode!.find(
                        (w) => w.name === "docker"
                    )!.name;
                    await sendMessageToClient(
                        empresa,
                        name,
                        telephone,
                        empresa.whatsappconfig.thank.replace(
                            "{COMPROBANTE}",
                            type
                        )
                    );

                    const { pdfBuffer, file } = await pdfGenerate({
                        empresa,
                        sunat,
                        order,
                        type:
                            invoice?.kind_invoice_code === "01" ||
                            invoice?.kind_invoice_code === "03"
                                ? "invoice"
                                : "recibo",
                    });
                    const name2 = empresa.whatsapp_mode!.find(
                        (w) => w.name === "docker"
                    )!.name;

                    await whatsappSendFileApi(empresa, name2, {
                        telephone,
                        file: new File([pdfBuffer], file, {
                            type: "application/pdf",
                        }),
                        options: { sendMediaAsDocument: true },
                        delay: 1,
                    });
                    await sendMessageToClient(
                        empresa,
                        name,
                        telephone,
                        empresa.whatsappconfig.thank2.replace(
                            "{URL}",
                            BASE_URL(empresa)
                        )
                    );
                } catch (error) {}
            }
            if (getInvoice) {
                if (!getInvoice.send_sunat) {
                    await this.invoicesApiService.update(
                        empresa,
                        String(getInvoice.id),
                        {
                            ...invoice!,
                            ...files,
                            order_id: order.id,
                            empresa_id: empresa.id,
                        }
                    );
                }
            } else {
                await this.invoicesApiService.store({
                    ...invoice!,
                    ...files,
                    order_id: order.id,
                    empresa_id: empresa.id,
                });
            }
        }
    }
    async onNote(props: {
        ordersUpdateDto: OrdersUpdateDto;
        order: Orders;
        empresa: Empresas;
        vendedor: string;
        subFacturacion: boolean;
    }) {
        const detail_orders = props.order.dataValues.details_orders;
        const getInvoice = props.order.dataValues.invoice;
        if (getInvoice) {
            const {
                empresa,
                order,
                ordersUpdateDto,
                subFacturacion,
                vendedor,
            } = props;
            const { note, isService } = ordersUpdateDto;
            if (note) {
                const getNote = (await getInvoice.$get("note")) as Notes;
                // si no existe nota
                let files: {
                    xml_path: string | null;
                    cdr_path: string | null;
                    response_sunat: NoteResponseSunat | null;
                } = {
                    xml_path: getNote?.xml_path ?? null,
                    cdr_path: getNote?.cdr_path ?? null,
                    response_sunat: getNote?.response_sunat ?? null,
                };
                if (!getNote) {
                    const { correlativo } =
                        await this.notesApiService.latestCorrelativo(
                            empresa,
                            note.kind_invoice_code
                        );

                    const type =
                        getInvoice.kind_invoice_code === "01" ? "F" : "B";
                    const serie =
                        note.kind_invoice_code === "07"
                            ? `${type}C01`
                            : `${type}D01`;
                    note.correlativo = correlativo;
                    note.serie = serie;
                }
                const sunat = await onNoteSunat({
                    detail_orders,
                    empresa,
                    note,
                    order,
                    invoice: getInvoice,
                    vendedor,
                });
                if (
                    props.ordersUpdateDto.status_order_id ===
                        STATUSORDER.problema &&
                    (note.kind_invoice_code === "07" || // solo nota de creditos y notas de debito
                        note.kind_invoice_code === "08")
                ) {
                    // si no existe pdf path ni xml_path que cree y guarda
                    if (!files.xml_path) {
                        const xml = await xmlGenerate({
                            empresa,
                            sunat,
                            order,
                            type: "note",
                        });
                        files = { ...files, xml_path: xml };
                    }

                    // le dio enviar sunat y no habia enviado a sunat antes
                    if (
                        note.send_sunat &&
                        !getNote?.send_sunat &&
                        subFacturacion
                    ) {
                        const { sunatResponse } = await noteSendSunatApi(sunat);
                        // crdGenerate
                        if (!sunatResponse.success) {
                            note.send_sunat = false; // No se envio a sunat por que hubo error . asi que falso
                            throw new BadRequestException(
                                JSON.stringify(sunatResponse.error)
                            );
                        }
                        const cdr = await crdGenerate({
                            cdrzip: sunatResponse.cdrZip,
                            empresa,
                            orderCode: props.order.order_code,
                        });
                        files = {
                            ...files,
                            cdr_path: cdr,
                            response_sunat: {
                                cdrResponse: sunatResponse.cdrResponse,
                                error: sunatResponse.error,
                            },
                        };
                    }
                }
                const type =
                    note?.kind_invoice_code === "01"
                        ? "FACTURA"
                        : note?.kind_invoice_code === "08"
                        ? "BOLETA"
                        : "RECIBO";
                if (
                    ordersUpdateDto.telephone &&
                    ordersUpdateDto.send_message &&
                    empresa.enabledSendMessage
                ) {
                    try {
                        const telephone = `${empresa.dial_code}${ordersUpdateDto.telephone}@c.us`;
                        const name2 = empresa.whatsapp_mode!.find(
                            (w) => w.name === "docker"
                        )!.name;

                        await whatsappSendMessageApi(empresa, name2, {
                            telephone,
                            message: empresa.whatsappconfig.sendpdf.replace(
                                "{COMPROBANTE}",
                                type
                            ),
                            delay: 3,
                            options: { linkPreview: false },
                        });

                        const { pdfBuffer, file } = await pdfGenerate({
                            empresa,
                            sunat,
                            order,
                            type: "note",
                        });
                        const media = new File([pdfBuffer], file, {
                            type: "application/pdf",
                        });
                        await whatsappSendFileApi(empresa, name2, {
                            telephone,
                            file: media,
                            options: { sendMediaAsDocument: true },
                            delay: 4,
                        });

                        await sendMessageToClient(
                            empresa,
                            name2,
                            telephone,
                            empresa.whatsappconfig.thank2.replace(
                                "{URL}",
                                BASE_URL(empresa)
                            )
                        );
                    } catch (error) {}
                }
                if (getNote) {
                    if (!getNote.send_sunat) {
                        await this.notesApiService.update(
                            empresa,
                            String(getNote.id),
                            {
                                ...note!,
                                ...files,
                                invoice_id: getInvoice.id,
                                order_id: order.id,
                                empresa_id: empresa.id,
                            }
                        );
                    }
                } else {
                    await this.notesApiService.store({
                        ...note!,
                        ...files,
                        invoice_id: getInvoice.id,
                        order_id: order.id,
                        empresa_id: empresa.id,
                    });
                }
            }
        }
    }
    async onGuides(props: {
        ordersUpdateDto: OrdersUpdateDto;
        order: Orders;
        empresa: Empresas;
        vendedor: string;
        subFacturacion: boolean;
    }) {
        const detail_orders = props.order.dataValues
            .details_orders as DetailOrders[];
        const getGuide = props.order.dataValues.guide;
        const { empresa, order, ordersUpdateDto, subFacturacion, vendedor } =
            props;
        const { guide } = ordersUpdateDto;
        if (guide) {
            // si no existe nota
            let files: {
                xml_path: string | null;
                cdr_path: string | null;
                response_sunat: NoteResponseSunat | null;
            } = {
                xml_path: getGuide?.xml_path ?? null,
                cdr_path: getGuide?.cdr_path ?? null,
                response_sunat: getGuide?.response_sunat ?? null,
            };
            if (!getGuide) {
                const { correlativo } =
                    await this.guidesApiService.latestCorrelativo(
                        empresa,
                        guide.kind_guide_code
                    );

                guide.correlativo = correlativo;
                guide.serie = "T001";
            }
            const sunat = await onGuideSunat({
                detail_orders,
                empresa,
                guide: { ...guide, empresa_id: empresa.id },
                order,
                vendedor,
            });
            if (
                props.ordersUpdateDto.status_order_id ===
                    STATUSORDER.enviando &&
                guide.kind_guide_code === "09"
            ) {
                // si no existe pdf path ni xml_path que cree y guarda
                if (!files.xml_path) {
                    const xml = await xmlGenerate({
                        empresa,
                        sunat,
                        order,
                        type: "guide",
                    });

                    files = { ...files, xml_path: xml };
                }

                // le dio enviar sunat y no habia enviado a sunat antes
                if (
                    guide.send_sunat &&
                    !getGuide?.send_sunat &&
                    subFacturacion
                ) {
                    const { sunatResponse } = await guideSendSunatApi(sunat);
                    // crdGenerate
                    if (!sunatResponse.success) {
                        guide.send_sunat = false; // No se envio a sunat por que hubo error . asi que falso
                        throw new BadRequestException(
                            JSON.stringify(sunatResponse.error)
                        );
                    }
                    const cdr = await crdGenerate({
                        cdrzip: sunatResponse.cdrZip,
                        empresa,
                        orderCode: props.order.order_code,
                    });
                    files = {
                        ...files,
                        cdr_path: cdr,
                        response_sunat: {
                            cdrResponse: sunatResponse.cdrResponse,
                            error: sunatResponse.error,
                        },
                    };
                }
            }

            if (getGuide) {
                await this.guidesApiService.update(
                    empresa,
                    String(getGuide.id),
                    {
                        ...guide!,
                        ...files,
                        order_id: order.id,
                        empresa_id: empresa.id,
                    }
                );
            } else {
                await this.guidesApiService.store({
                    ...guide!,
                    ...files,
                    empresa_id: empresa.id,
                    order_id: order.id,
                });
            }
        }
        if (
            ordersUpdateDto.status_order_id === STATUSORDER.enviando &&
            empresa.enabledSendMessage
        ) {
            try {
                const products = await Promise.all(
                    detail_orders.map(async (prod, i) => {
                        // no hay guias para servicios
                        const product = await Product(empresa, false).findOne({
                            where: {
                                id: prod[
                                    productEntityId(
                                        empresa,
                                        false
                                    ) as keyof typeof prod
                                ],
                                empresa_id: empresa.id,
                            },
                            attributes: ["id", "name"],
                        });
                        if (!product)
                            throw new BadRequestException(
                                "No se encontró ese producto"
                            );
                        return `${i + 1} - *Producto*: ${
                            product.name
                        }, *Precio Total*: ${formatMoney(
                            empresa,
                            prod.price,
                            (props.order.moneyChange === 1
                                ? empresa.money.money
                                : "DOLARES") as Money
                        )}, *Cantidad*: ${prod.quantity} UND.\n`;
                    })
                );
                const telephone = `${empresa.dial_code}${ordersUpdateDto.telephone}@c.us`;
                const name2 = empresa.whatsapp_mode!.find(
                    (w) => w.name === "docker"
                )!.name;

                await sendMessageToClient(
                    empresa,
                    name2,
                    telephone,
                    empresa.whatsappconfig.thank2.replace(
                        "{URL}",
                        BASE_URL(empresa)
                    )
                );
            } catch (error) {}
        }
    }
}
