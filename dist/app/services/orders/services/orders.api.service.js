"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const orders_entity_1 = require("../entities/orders.entity");
const express_core_2 = require("@vigilio/express-core");
const helpers_1 = require("~/libs/helpers");
const invoices_api_service_1 = require("./invoices.api.service");
const libs_1 = require("../libs");
const invoice_send_api_1 = require("../sunat/invoice.send.api");
const detail_orders_api_service_1 = require("./detail_orders.api.service");
const notes_api_service_1 = require("./notes.api.service");
const products_api_service_1 = require("@/products/services/products.api.service");
const helpers_2 = require("@/cart/libs/helpers");
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const guides_api_service_1 = require("./guides.api.service");
const detail_orders_entity_1 = require("../entities/detail_orders.entity");
const note_send_api_1 = require("../sunat/note.send.api");
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
const invoice_pdf_api_1 = require("../sunat/invoice.pdf.api");
const dayjs_1 = require("~/libs/dayjs");
const guide_send_api_1 = require("../sunat/guide.send.api");
const note_pdf_api_1 = require("../sunat/note.pdf.api");
const ubigeo_api_service_1 = require("@/ubigeo/services/ubigeo.api.service");
const guide_pdf_api_1 = require("../sunat/guide.pdf.api");
const users_entity_1 = require("@/users/entities/users.entity");
const variants_entity_1 = require("@/products/entities/options/variants.entity");
const products_restaurant_entity_1 = require("@/products/entities/products_restaurant.entity");
const products_servicio_entity_1 = require("@/products/entities/products_servicio.entity");
const api_1 = require("@/bot/api");
const libs_2 = require("@/empresas/libs");
const libs_3 = require("@/products/libs");
const ticket_1 = require("../libs/ticket");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
const citas_api_service_1 = require("@/citas/services/citas.api.service");
const users_api_service_1 = require("@/users/services/users.api.service");
const helpers_3 = require("@vigilio/express-core/helpers");
const libs_4 = require("@/users/libs");
const citas_entities_1 = require("@/citas/entities/citas.entities");
let OrdersApiService = class OrdersApiService {
    constructor(productsApiService, invoicesApiService, notesApiService, guidesApiService, detailOrdersApiService, ubigeoApiService, usersApiService, citasApiService) {
        this.productsApiService = productsApiService;
        this.invoicesApiService = invoicesApiService;
        this.notesApiService = notesApiService;
        this.guidesApiService = guidesApiService;
        this.detailOrdersApiService = detailOrdersApiService;
        this.ubigeoApiService = ubigeoApiService;
        this.usersApiService = usersApiService;
        this.citasApiService = citasApiService;
    }
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield orders_entity_1.Orders.findAll({
                where: {
                    empresa_id: empresa.id,
                },
            });
            return {
                success: true,
                data,
            };
        });
    }
    earningMonth(empresa, year, month) {
        return __awaiter(this, void 0, void 0, function* () {
            const startDate = new Date(Number(year), Number(month) - 1, 1);
            const endDate = new Date(Number(year), Number(month), 0);
            const where = {
                createdAt: {
                    [sequelize_1.Op.between]: [startDate, endDate],
                },
                empresa_id: empresa.id,
            };
            const [earning, ordersTotal, ordersTotalPay, ordersTotalError, orderDelivery, orderLocal, detailOrders, mostUser, rating, usersMostOrder,] = yield Promise.all([
                orders_entity_1.Orders.unscoped().findOne({
                    attributes: [
                        [sequelize_typescript_1.Sequelize.fn("SUM", sequelize_typescript_1.Sequelize.col("total")), "total"],
                    ],
                    where: Object.assign(Object.assign({}, where), { status_order_id: libs_1.STATUSORDER.entregado }),
                }),
                orders_entity_1.Orders.unscoped().count({
                    where: Object.assign({}, where),
                }),
                orders_entity_1.Orders.unscoped().count({
                    where: Object.assign(Object.assign({}, where), { status_order_id: libs_1.STATUSORDER.pagado }),
                }),
                orders_entity_1.Orders.unscoped().count({
                    where: Object.assign(Object.assign({}, where), { status_order_id: libs_1.STATUSORDER.problema }),
                }),
                orders_entity_1.Orders.unscoped().count({
                    where: Object.assign(Object.assign({}, where), { isDelivery: true }),
                }),
                orders_entity_1.Orders.unscoped().count({
                    where: Object.assign(Object.assign({}, where), { isDelivery: false }),
                }),
                detail_orders_entity_1.DetailOrders.unscoped().findAll({
                    where,
                }),
                orders_entity_1.Orders.unscoped().findAll({
                    attributes: [
                        "user_id",
                        [sequelize_typescript_1.Sequelize.fn("COUNT", "user_id"), "order_count"],
                    ],
                    group: ["user_id"],
                    order: [[sequelize_typescript_1.Sequelize.literal("order_count"), "DESC"]],
                    limit: 1,
                    raw: true,
                    where,
                }),
                orders_entity_1.Orders.unscoped().findAll({
                    attributes: [
                        [sequelize_typescript_1.Sequelize.fn("SUM", sequelize_typescript_1.Sequelize.col("total")), "total"],
                        [sequelize_typescript_1.Sequelize.fn("DATE", sequelize_typescript_1.Sequelize.col("createdAt")), "time"],
                    ],
                    where: Object.assign({ status_order_id: libs_1.STATUSORDER.entregado }, where),
                    group: [sequelize_typescript_1.Sequelize.fn("DATE", sequelize_typescript_1.Sequelize.col("createdAt"))],
                }),
                (0, libs_1.usersMostOrders)(empresa, where),
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
            const productsNormalMost = yield detailOrders.reduce((acc, order) => {
                acc[order.product_normal_id] =
                    (acc[order.product_normal_id] || 0) + 1;
                return acc;
            }, {});
            const productsRestaurantMost = yield detailOrders.reduce((acc, order) => {
                acc[order.product_restaurant_id] =
                    (acc[order.product_restaurant_id] || 0) + 1;
                return acc;
            }, {});
            const productsServicioMost = yield detailOrders.reduce((acc, order) => {
                acc[order.product_servicio_id] =
                    (acc[order.product_servicio_id] || 0) + 1;
                return acc;
            }, {});
            const obj = Object.assign(Object.assign(Object.assign({}, productsNormalMost), productsRestaurantMost), productsServicioMost);
            const topThreeProductIds = yield Promise.all(Object.keys(obj)
                .sort((a, b) => obj[b] - obj[a])
                .slice(0, 3)
                .filter((ord) => ord !== "null")
                .map((ord) => __awaiter(this, void 0, void 0, function* () {
                let producto = null;
                const { product } = yield this.productsApiService.show(empresa, ord, false, false, null, false);
                producto = product;
                if (!product) {
                    const { product } = yield this.productsApiService.show(empresa, ord, true, false, null, false);
                    producto = product;
                }
                return {
                    id: producto.id,
                    name: producto.name,
                    image: producto.images,
                };
            })));
            const ratingArray = rating.map((res) => ({
                value: res.get("total"),
                time: res.get("time"),
            }));
            return {
                success: true,
                results: {
                    orders,
                    topThreeProductIds,
                    ratingArray,
                    usersMostOrders: usersMostOrder,
                },
            };
        });
    }
    show(empresa, order_code) {
        return __awaiter(this, void 0, void 0, function* () {
            let order = yield orders_entity_1.Orders.findOne({
                where: { order_code, empresa_id: empresa.id },
            });
            if (!order) {
                throw new express_core_2.NotFoundException(`No se encontró un orden con ${order_code}`);
            }
            order = yield (0, libs_1.getOrder)(empresa, order, true);
            return {
                success: true,
                order,
            };
        });
    }
    pdf(order_code, type, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const { order } = yield this.show(empresa, order_code);
            if (!["note", "invoice", "guide", "recibo"].includes(type))
                throw new express_core_2.BadRequestException("Solo note, guide o invoice");
            let sunat = null;
            const vendedor = `${(_b = (_a = order.user) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""} ${(_d = (_c = order.user) === null || _c === void 0 ? void 0 : _c.lastname) !== null && _d !== void 0 ? _d : ""}`;
            if ((order.dataValues.invoice && type === "invoice") ||
                (order.dataValues.invoice && type === "recibo")) {
                sunat = yield (0, libs_1.onInvoiceSunat)({
                    detail_orders: order.dataValues.details_orders,
                    empresa,
                    invoice: order.dataValues.invoice,
                    order,
                    vendedor,
                });
            }
            if (order.dataValues.note && type === "note") {
                sunat = yield (0, libs_1.onNoteSunat)({
                    detail_orders: order.dataValues.details_orders,
                    empresa,
                    note: order.dataValues.note,
                    order,
                    invoice: order.dataValues.invoice,
                    vendedor,
                });
            }
            if (order.dataValues.guide && type === "guide") {
                sunat = yield (0, libs_1.onGuideSunat)({
                    detail_orders: order.dataValues.details_orders,
                    empresa,
                    order,
                    vendedor,
                    guide: order.dataValues.guide,
                });
            }
            if (!sunat)
                throw new express_core_2.BadRequestException("No hubo nota o comprobante");
            const typePDF = type === "invoice" || type === "recibo"
                ? order.dataValues.invoice.kind_invoice_code ===
                    "01" ||
                    order.dataValues.invoice.kind_invoice_code ===
                        "03"
                    ? "invoice"
                    : "recibo"
                : type === "note"
                    ? "note"
                    : "guide";
            const result = yield (0, libs_1.pdfGenerate)({
                empresa,
                sunat,
                order,
                type: typePDF,
            });
            return result;
        });
    }
    html(order_code, type, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const { order } = yield this.show(empresa, order_code);
            if (!["note", "invoice", "guide", "recibo"].includes(type))
                throw new express_core_2.BadRequestException("Solo note, guide o invoice");
            const vendedor = `${(_b = (_a = order.user) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""} ${(_d = (_c = order.user) === null || _c === void 0 ? void 0 : _c.lastname) !== null && _d !== void 0 ? _d : ""}`;
            let sunat = null;
            let stringHTML = "";
            if (order.dataValues.invoice && type === "invoice") {
                sunat = yield (0, libs_1.onInvoiceSunat)({
                    detail_orders: order.dataValues.details_orders,
                    empresa,
                    invoice: order.dataValues.invoice,
                    order,
                    vendedor,
                });
                stringHTML = yield (0, invoice_pdf_api_1.invoicePDFSunatApi)(sunat);
            }
            if (order.dataValues.invoice && type === "recibo") {
                sunat = yield (0, libs_1.onInvoiceSunat)({
                    detail_orders: order.dataValues.details_orders,
                    empresa,
                    invoice: order.dataValues.invoice,
                    order,
                    vendedor,
                });
                stringHTML = yield (0, ticket_1.ticketHTML)(order, empresa);
            }
            if (order.dataValues.note && type === "note") {
                sunat = yield (0, libs_1.onNoteSunat)({
                    detail_orders: order.dataValues.details_orders,
                    empresa,
                    note: order.dataValues.note,
                    order,
                    invoice: order.dataValues.invoice,
                    vendedor,
                });
                stringHTML = yield (0, note_pdf_api_1.notePDFSunatApi)(sunat);
            }
            if (order.dataValues.guide && type === "guide") {
                sunat = yield (0, libs_1.onGuideSunat)({
                    detail_orders: order.dataValues.details_orders,
                    empresa,
                    order,
                    vendedor,
                    guide: order.dataValues.guide,
                });
                stringHTML = yield (0, guide_pdf_api_1.guidePDFSunatApi)(sunat);
            }
            if (!sunat)
                throw new express_core_2.BadRequestException("No hubo nota o comprobante");
            return stringHTML;
        });
    }
    store(ordersStoreDto_1, req_1) {
        return __awaiter(this, arguments, void 0, function* (ordersStoreDto, req, type = "normal", moneyConvert = null, comision) {
            var _a;
            const empresa = req.empresa;
            const { invoice, details_orders } = ordersStoreDto, rest = __rest(ordersStoreDto, ["invoice", "details_orders"]);
            const { pasarela_comision = false } = comision || {
                pasarela_comision: false,
            };
            let user = null;
            const moneyConverter = moneyConvert ? moneyConvert : req.moneyConverter;
            if (ordersStoreDto.telephone) {
                user = yield users_entity_1.Users.findOne({
                    where: {
                        telephone: ordersStoreDto.telephone,
                        empresa_id: empresa.id,
                    },
                });
                if (user && !user.enabled) {
                    throw new express_core_2.BadRequestException("No está permitido a realizar pedidos.");
                }
                if (user && ordersStoreDto.password) {
                    throw new express_core_2.BadRequestException("Ya existe una cuenta de este usuario.");
                }
                if (!user) {
                    const userName = `${ordersStoreDto.fullName}${Math.random()
                        .toString(32)
                        .slice(3, 6)}`;
                    const token = crypto.randomUUID();
                    const [byFullName, byTelephone, byEmail] = yield Promise.all([
                        users_entity_1.Users.findOne({
                            where: {
                                username: ordersStoreDto.fullName,
                                empresa_id: empresa.id,
                            },
                            raw: true,
                        }),
                        users_entity_1.Users.findOne({
                            where: {
                                telephone: ordersStoreDto.telephone,
                                empresa_id: empresa.id,
                            },
                            raw: true,
                        }),
                        users_entity_1.Users.findOne({
                            where: {
                                email: ordersStoreDto.email,
                                empresa_id: empresa.id,
                            },
                            raw: true,
                        }),
                    ]);
                    if (byFullName) {
                        throw new express_core_2.BadRequestException("Ya existe un usuario con este nombre de usuario", { body: "fullName" });
                    }
                    if (byTelephone) {
                        throw new express_core_2.BadRequestException("Ya existe un usuario con este telefono", { body: "telephone" });
                    }
                    if (byEmail) {
                        throw new express_core_2.BadRequestException("Ya existe un usuario con este correo electrónico", { body: "email" });
                    }
                    const { user: usuario } = yield this.usersApiService.store(empresa, {
                        telephone: ordersStoreDto.telephone,
                        enabled: false,
                        username: userName,
                        name: ordersStoreDto.fullName,
                        address: ordersStoreDto.address || null,
                        city_id: ordersStoreDto.city_id || null,
                        birthday: new Date(),
                        lastname: "",
                        password: ordersStoreDto.password,
                        role_id: libs_4.ROLES.user,
                        map_marker: ordersStoreDto.map_marker || null,
                        empresa_id: empresa.id,
                        email: ordersStoreDto.email || null,
                        identification_number: ((_a = ordersStoreDto.invoice) === null || _a === void 0 ? void 0 : _a.identification_number) ||
                            null,
                        reference: ordersStoreDto.reference || null,
                        buys: [],
                        slug: (0, helpers_3.slug)(userName),
                        speciality: null,
                    });
                    user = usuario;
                    yield usuario.update({ token });
                    try {
                        yield (0, api_1.whatsappSendMessageApi)(empresa, {
                            telephone: `${empresa.dial_code}${ordersStoreDto.telephone}@c.us`,
                            message: `Hola *${usuario.username}*.\nYa puedes acceder a tu cuenta, ingresa al siguiente link:\n*${(0, libs_2.BASE_URL)(empresa)}/auth/confirmed-account?token=${token}*`,
                            delay: 3,
                        });
                    }
                    catch (error) { }
                }
            }
            if (!empresa.isOpen)
                throw new express_core_2.BadRequestException(empresa.whatsappconfig.enabled);
            const findDay = empresa.schedule.find((day) => day.id === (0, dayjs_1.NOW)(empresa).day());
            if ((0, dayjs_1.NOW)(empresa).isAfter((0, dayjs_1.formatTime)(empresa, findDay.openTime)) &&
                (0, dayjs_1.NOW)(empresa).isBefore((0, dayjs_1.formatTime)(empresa, findDay.closeTime)) &&
                findDay.enabled) {
            }
            else {
                throw new express_core_2.BadRequestException(empresa.whatsappconfig.cerrado);
            }
            const detailsOrder = yield Promise.all(details_orders.map((detail_order) => __awaiter(this, void 0, void 0, function* () {
                const typeProduct = (0, libs_3.productEntityId)(empresa, ordersStoreDto.isService);
                const { product } = yield this.productsApiService.show(empresa, detail_order[typeProduct], ordersStoreDto.isService, true, null, false);
                let disc = null;
                let quantity = detail_order.quantity;
                if (product instanceof products_normal_entity_1.ProductsNormal) {
                    const variant = product.dataValues.variants.find((variant) => variant.id === detail_order.variant_id);
                    if (!variant ||
                        !(product === null || product === void 0 ? void 0 : product.enabled) ||
                        (!variant.ilimit && variant.stock < 1) ||
                        (!variant.ilimit &&
                            variant.stock < detail_order.quantity)) {
                        throw new express_core_2.BadRequestException(`Hubo un problema al realizar la compra en uno de los productos ${product.name.slice(0, 13)}-${variant === null || variant === void 0 ? void 0 : variant.sku}..., ${!(product === null || product === void 0 ? void 0 : product.enabled) ? "No disponible" : ""} ${(variant === null || variant === void 0 ? void 0 : variant.stock) < 1 ? "Se acabó stock" : ""}`);
                    }
                    if (detail_order.coupon) {
                        const { discount } = yield this.productsApiService.coupon(detail_order[typeProduct], detail_order.coupon, empresa, ordersStoreDto.isService);
                        disc = discount;
                    }
                }
                const producto = product;
                if (producto instanceof products_restaurant_entity_1.ProductsRestaurant) {
                    if (!producto ||
                        !(producto === null || producto === void 0 ? void 0 : producto.enabled) ||
                        (!producto.ilimit && producto.stock < 1) ||
                        (!producto.ilimit &&
                            producto.stock < detail_order.quantity)) {
                        throw new express_core_2.BadRequestException(`Hubo un problema al realizar la compra en uno de los productos ${product.name.slice(0, 13)}..., ${!(producto === null || producto === void 0 ? void 0 : producto.enabled) ? "No disponible" : ""} ${(producto === null || producto === void 0 ? void 0 : producto.stock) < 1 ? "Se acabó stock" : ""}`);
                    }
                }
                if (producto instanceof products_servicio_entity_1.ProductsServicio) {
                    const day = producto.days.find((d) => d.name === detail_order.variante);
                    if (!day) {
                        const date = product.showHorario
                            ? detail_order.variante
                            : null;
                        if (date) {
                            const hour = date.split("T")[1];
                            const time = date.split("T")[0];
                            const citas = yield citas_entities_1.Citas.findAll({
                                where: {
                                    date: time,
                                    hour: {
                                        [sequelize_1.Op.like]: `${hour.split(":")[0]}%`,
                                    },
                                    empresa_id: empresa.id,
                                },
                            });
                            if (citas.length >
                                empresa.citasSetting.maxCitasForHour) {
                                throw new express_core_2.BadRequestException("Ya hay citas a esa hora.");
                            }
                        }
                    }
                    else {
                        quantity = day.cantidad;
                    }
                }
                if (detail_order.coupon) {
                    const { discount } = yield this.productsApiService.coupon(detail_order[typeProduct], detail_order.coupon, empresa, ordersStoreDto.isService);
                    disc = discount;
                }
                return {
                    subtotal: (0, helpers_2.subtotalIgv)(empresa, product, disc) * quantity,
                };
            })));
            const total = detailsOrder.reduce((ins, prod) => {
                return ins + prod.subtotal;
            }, 0);
            let totalWithDistrict = total;
            if (ordersStoreDto.city_id) {
                const { data } = yield this.ubigeoApiService.citiesShow(empresa, ordersStoreDto.city_id);
                const priceShip = empresa.enabled_igv
                    ? (0, helpers_2.subtotal)(data.dataValues.priceShipping, empresa.igv, true)
                    : data.dataValues.priceShipping;
                totalWithDistrict = totalWithDistrict + priceShip;
            }
            if (ordersStoreDto.total.toFixed(2) !== totalWithDistrict.toFixed(2))
                throw new express_core_2.BadRequestException("Hubo un error al realizar esta orden.");
            const order = new orders_entity_1.Orders(Object.assign(Object.assign({}, rest), { igv: empresa.enabled_igv, pasarela_comision, moneyChange: moneyConverter, is_pasarela_client: empresa.enabledClientPayComision, empresa_id: empresa.id, user_id: user ? user.id : null, type_pasarela: type }));
            order.order_code = yield (0, helpers_1.generateCodeEntity)(orders_entity_1.Orders, "order_code", "ORD", empresa);
            yield order.save();
            if (invoice) {
                const { correlativo } = yield this.invoicesApiService.latestCorrelativo(empresa, invoice.kind_invoice_code);
                const serie = invoice.kind_invoice_code === "00"
                    ? "R001"
                    : invoice.kind_invoice_code === "01"
                        ? "F001"
                        : "B001";
                yield this.invoicesApiService.store(Object.assign(Object.assign({}, invoice), { serie, order_id: order.id, cdr_path: null, xml_path: null, correlativo, response_sunat: null, empresa_id: empresa.id }));
            }
            const detailsOrders = yield Promise.all(details_orders.map((detail_order) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const productID = (0, libs_3.productEntityId)(empresa, ordersStoreDto.isService);
                const [newDetailOrder, { product }] = yield Promise.all([
                    this.detailOrdersApiService.store(empresa, Object.assign(Object.assign({}, detail_order), { order_id: order.id })),
                    this.productsApiService.show(empresa, detail_order[productID], ordersStoreDto.isService, true, null, false),
                ]);
                if (product instanceof products_servicio_entity_1.ProductsServicio) {
                    const date = product.showHorario
                        ? (_a = detail_order.variante) === null || _a === void 0 ? void 0 : _a.split("T")
                        : null;
                    if (date) {
                        yield this.citasApiService.store(empresa, {
                            telephone: ordersStoreDto.telephone,
                            answers: {},
                            description: `Se confirmó cita ${order.order_code}`,
                            hour: date.at(-1),
                            date: detail_order.variante,
                        });
                    }
                }
                if (product instanceof products_normal_entity_1.ProductsNormal) {
                    const variant = product.dataValues.variants.find((variant) => variant.id === detail_order.variant_id);
                    if (!(variant === null || variant === void 0 ? void 0 : variant.ilimit)) {
                        const stock = variant.stock - detail_order.quantity;
                        yield variants_entity_1.Variants.update({ stock }, { where: { id: variant.id } });
                    }
                }
                const producto = product;
                if (producto instanceof products_restaurant_entity_1.ProductsRestaurant) {
                    if (!(producto === null || producto === void 0 ? void 0 : producto.ilimit)) {
                        const quantity = producto.stock - detail_order.quantity;
                        yield producto.update({ stock: quantity });
                    }
                }
                if (detail_order.coupon) {
                    const { coupon } = yield this.productsApiService.coupon(product.id, detail_order.coupon, empresa, ordersStoreDto.isService);
                    if (coupon) {
                        if (coupon.max_use > 0) {
                            const decrease = coupon.max_use - 1;
                            yield coupon.update({ max_use: decrease });
                        }
                    }
                }
                return `*${product.name}${` ${detail_order.variante}` || ""}* - ${detail_order.quantity} UND - *${(0, helpers_2.formatMoney)(empresa, detail_order.price, empresa.money.money)}*`;
            })));
            try {
                if (empresa.enabledSendMessage && ordersStoreDto.telephone) {
                    const telephone = `${empresa.dial_code}${ordersStoreDto.telephone}@c.us`;
                    yield (0, api_1.whatsappSendMessageApi)(empresa, {
                        telephone,
                        message: empresa.dial_code === "55"
                            ? `Olá 😊, aqui está o código do seu pedido ${order.order_code}.\n Não se esqueça de nos perguntar o status do seu pedido, digitando o código do pedido.`
                            : `Hola 😊, Su orden *${order.order_code}*.\n${detailsOrders.join("\n")}.\n\nTotal: *${(0, helpers_2.formatMoney)(empresa, ordersStoreDto.total, empresa.money.money)}*  ${moneyConverter !== 1
                                ? `- *${(0, helpers_2.formatMoney)(empresa, ordersStoreDto.total *
                                    moneyConverter, "DOLARES")}*`
                                : ""}\n\nNo olvides preguntar el estado de tu orden, digitando el *código* del orden ó en ${(0, libs_2.BASE_URL)(empresa)}/pedidos?code=${order.order_code}`,
                        delay: 4,
                        options: { linkPreview: false },
                    });
                }
            }
            catch (error) { }
            return {
                success: true,
                order,
                details_orders,
            };
        });
    }
    update(props) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const _d = props.ordersUpdateDto, { invoice, note, isService } = _d, rest = __rest(_d, ["invoice", "note", "isService"]);
            const empresa = props.req.empresa;
            const user = props.req.user;
            const subFacturacion = true;
            const { order } = yield this.show(empresa, props.order_code);
            const vendedor = `${(_a = user === null || user === void 0 ? void 0 : user.name) !== null && _a !== void 0 ? _a : ""} ${(_b = user === null || user === void 0 ? void 0 : user.lastname) !== null && _b !== void 0 ? _b : ""}`;
            if (rest.status_order_id === libs_1.STATUSORDER.pagado ||
                rest.status_order_id === libs_1.STATUSORDER.entregado) {
                yield this.onInvoice({
                    order,
                    empresa,
                    ordersUpdateDto: props.ordersUpdateDto,
                    vendedor,
                    subFacturacion,
                });
            }
            if (rest.status_order_id === libs_1.STATUSORDER.enviando ||
                rest.status_order_id === libs_1.STATUSORDER.pagado) {
                yield this.onGuides({
                    order,
                    empresa,
                    ordersUpdateDto: props.ordersUpdateDto,
                    vendedor,
                    subFacturacion,
                });
            }
            if (rest.status_order_id === libs_1.STATUSORDER.problema &&
                empresa.dial_code === "51") {
                yield this.onNote({
                    order,
                    empresa,
                    ordersUpdateDto: props.ordersUpdateDto,
                    vendedor,
                    subFacturacion,
                });
            }
            if (props.ordersUpdateDto.status_order_id === libs_1.STATUSORDER.entregado &&
                order.status_order_id !== libs_1.STATUSORDER.entregado &&
                order.user_id) {
                const user = yield users_entity_1.Users.findByPk(order.user_id);
                const buys = yield Promise.all(order.dataValues.details_orders.map((prod) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const product = yield (0, libs_3.Product)(empresa, order.isService).findOne({
                        where: {
                            id: prod[(0, libs_3.productEntityId)(empresa, order.isService)],
                            empresa_id: empresa.id,
                        },
                    });
                    return {
                        order: order.order_code,
                        title: `${product.name}  ${prod.variante ? `- ${prod.variante}` : ""}`,
                        date: product instanceof products_servicio_entity_1.ProductsServicio &&
                            product.days.length
                            ? (0, dayjs_1.NOW)(empresa)
                                .add((_b = (_a = product.days.find((pr) => pr.name ===
                                prod.variante)) === null || _a === void 0 ? void 0 : _a.days) !== null && _b !== void 0 ? _b : 0, "day")
                                .format()
                            : null,
                    };
                })));
                yield (user === null || user === void 0 ? void 0 : user.update({
                    buys: [...buys, ...((_c = user.buys) !== null && _c !== void 0 ? _c : []).slice(0, 20)],
                }));
            }
            if (rest.status_order_id === libs_1.STATUSORDER.problema &&
                order.status_order_id !== libs_1.STATUSORDER.problema) {
                yield Promise.all(order.dataValues.details_orders.map((detail_order) => __awaiter(this, void 0, void 0, function* () {
                    const productId = (0, libs_3.productEntityId)(empresa, isService);
                    const { product } = yield this.productsApiService.show(empresa, detail_order[productId], isService, true, null, false);
                    if (product instanceof products_normal_entity_1.ProductsNormal) {
                        const variant = product.dataValues.variants.find((variant) => variant.id === detail_order.variant_id);
                        if (!(variant === null || variant === void 0 ? void 0 : variant.ilimit)) {
                            const stock = variant.stock + detail_order.quantity;
                            yield variants_entity_1.Variants.update({ stock }, { where: { id: variant === null || variant === void 0 ? void 0 : variant.id } });
                        }
                    }
                    const producto = product;
                    if (producto instanceof products_restaurant_entity_1.ProductsRestaurant) {
                        if (!(producto === null || producto === void 0 ? void 0 : producto.ilimit)) {
                            const quantity = producto.stock + detail_order.quantity;
                            yield product.update({ stock: quantity });
                        }
                    }
                    if (detail_order.coupon) {
                        const { coupon } = yield this.productsApiService.coupon(detail_order.coupon, product.id, empresa, isService);
                        if (coupon) {
                            if (coupon.max_use > 0) {
                                const decrease = coupon.max_use + 1;
                                yield coupon.update({
                                    max_use: decrease,
                                });
                            }
                        }
                    }
                })));
            }
            yield order.update(Object.assign(Object.assign({}, rest), { seller_id: user ? user.id : null }));
            return {
                success: true,
                order,
            };
        });
    }
    onInvoice(props) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { empresa, order, ordersUpdateDto, subFacturacion, vendedor } = props;
            const { invoice, isService } = ordersUpdateDto;
            const detail_orders = order.dataValues.details_orders;
            const getInvoice = order.dataValues.invoice;
            if (invoice) {
                let files = {
                    xml_path: (_a = getInvoice === null || getInvoice === void 0 ? void 0 : getInvoice.xml_path) !== null && _a !== void 0 ? _a : null,
                    cdr_path: (_b = getInvoice === null || getInvoice === void 0 ? void 0 : getInvoice.cdr_path) !== null && _b !== void 0 ? _b : null,
                    response_sunat: (_c = getInvoice === null || getInvoice === void 0 ? void 0 : getInvoice.response_sunat) !== null && _c !== void 0 ? _c : null,
                };
                if (!getInvoice) {
                    const { correlativo } = yield this.invoicesApiService.latestCorrelativo(empresa, invoice.kind_invoice_code);
                    const serie = (invoice === null || invoice === void 0 ? void 0 : invoice.kind_invoice_code) === "00"
                        ? "R001"
                        : (invoice === null || invoice === void 0 ? void 0 : invoice.kind_invoice_code) === "01"
                            ? "F001"
                            : "B001";
                    invoice.correlativo = correlativo;
                    invoice.serie = serie;
                }
                const sunat = yield (0, libs_1.onInvoiceSunat)({
                    detail_orders,
                    empresa,
                    invoice,
                    order,
                    vendedor,
                });
                if (empresa.dial_code === libs_2.DIALCODE.peru) {
                    if (!files.xml_path &&
                        (invoice.kind_invoice_code === "01" ||
                            invoice.kind_invoice_code === "03")) {
                        const xml = yield (0, libs_1.xmlGenerate)({
                            empresa,
                            sunat,
                            order,
                            type: "invoice",
                        });
                        files = Object.assign(Object.assign({}, files), { xml_path: xml });
                    }
                    const limitInvoice = (0, dayjs_1.restarDays)(empresa, (0, dayjs_1.NOW)(empresa).format(), (0, dayjs_1.TimePeru)(empresa, order.createdAt)
                        .add(enviroments_config_1.default.VITE_DIASFACTURASBOLETA, "day")
                        .diff((0, dayjs_1.NOW)(empresa))) < 0;
                    if (invoice.send_sunat &&
                        !(getInvoice === null || getInvoice === void 0 ? void 0 : getInvoice.send_sunat) &&
                        subFacturacion &&
                        limitInvoice &&
                        (invoice.kind_invoice_code === "01" ||
                            invoice.kind_invoice_code === "03")) {
                        const { sunatResponse } = yield (0, invoice_send_api_1.invoiceSendSunatApi)(sunat);
                        if (!sunatResponse.success) {
                            invoice.send_sunat = false;
                            throw new express_core_2.BadRequestException(JSON.stringify(sunatResponse.error));
                        }
                        const cdr = yield (0, libs_1.crdGenerate)({
                            cdrzip: sunatResponse.cdrZip,
                            empresa,
                            orderCode: props.order.order_code,
                        });
                        files = Object.assign(Object.assign({}, files), { cdr_path: cdr, response_sunat: {
                                cdrResponse: sunatResponse.cdrResponse,
                                error: sunatResponse.error,
                            } });
                    }
                }
                if (ordersUpdateDto.telephone &&
                    ordersUpdateDto.send_message &&
                    empresa.enabledSendMessage) {
                    const type = (invoice === null || invoice === void 0 ? void 0 : invoice.kind_invoice_code) === "01"
                        ? "FACTURA"
                        : (invoice === null || invoice === void 0 ? void 0 : invoice.kind_invoice_code) === "03"
                            ? "BOLETA"
                            : "COMPROBANTE";
                    try {
                        const telephone = `${empresa.dial_code}${ordersUpdateDto.telephone}@c.us`;
                        yield (0, api_1.whatsappSendMessageApi)(empresa, {
                            telephone,
                            message: empresa.whatsappconfig.thank.replace("{COMPROBANTE}", type),
                            delay: 3,
                        });
                        const { pdfBuffer, file } = yield (0, libs_1.pdfGenerate)({
                            empresa,
                            sunat,
                            order,
                            type: (invoice === null || invoice === void 0 ? void 0 : invoice.kind_invoice_code) === "01" ||
                                (invoice === null || invoice === void 0 ? void 0 : invoice.kind_invoice_code) === "03"
                                ? "invoice"
                                : "recibo",
                        });
                        yield (0, api_1.whatsappSendFileApi)(empresa, {
                            telephone,
                            file: new File([pdfBuffer], file, {
                                type: "application/pdf",
                            }),
                            options: { sendMediaAsDocument: true },
                            delay: 1,
                        });
                        yield (0, api_1.whatsappSendMessageApi)(empresa, {
                            telephone,
                            message: empresa.whatsappconfig.thank2.replace("{URL}", (0, libs_2.BASE_URL)(empresa)),
                            delay: 3,
                            options: { linkPreview: false },
                        });
                    }
                    catch (error) { }
                }
                if (getInvoice) {
                    if (!getInvoice.send_sunat) {
                        yield this.invoicesApiService.update(empresa, String(getInvoice.id), Object.assign(Object.assign(Object.assign({}, invoice), files), { order_id: order.id, empresa_id: empresa.id }));
                    }
                }
                else {
                    yield this.invoicesApiService.store(Object.assign(Object.assign(Object.assign({}, invoice), files), { order_id: order.id, empresa_id: empresa.id }));
                }
            }
        });
    }
    onNote(props) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const detail_orders = props.order.dataValues.details_orders;
            const getInvoice = props.order.dataValues.invoice;
            if (getInvoice) {
                const { empresa, order, ordersUpdateDto, subFacturacion, vendedor, } = props;
                const { note, isService } = ordersUpdateDto;
                if (note) {
                    const getNote = (yield getInvoice.$get("note"));
                    let files = {
                        xml_path: (_a = getNote === null || getNote === void 0 ? void 0 : getNote.xml_path) !== null && _a !== void 0 ? _a : null,
                        cdr_path: (_b = getNote === null || getNote === void 0 ? void 0 : getNote.cdr_path) !== null && _b !== void 0 ? _b : null,
                        response_sunat: (_c = getNote === null || getNote === void 0 ? void 0 : getNote.response_sunat) !== null && _c !== void 0 ? _c : null,
                    };
                    if (!getNote) {
                        const { correlativo } = yield this.notesApiService.latestCorrelativo(empresa, note.kind_invoice_code);
                        const type = getInvoice.kind_invoice_code === "01" ? "F" : "B";
                        const serie = note.kind_invoice_code === "07"
                            ? `${type}C01`
                            : `${type}D01`;
                        note.correlativo = correlativo;
                        note.serie = serie;
                    }
                    const sunat = yield (0, libs_1.onNoteSunat)({
                        detail_orders,
                        empresa,
                        note,
                        order,
                        invoice: getInvoice,
                        vendedor,
                    });
                    if (props.ordersUpdateDto.status_order_id ===
                        libs_1.STATUSORDER.problema &&
                        (note.kind_invoice_code === "07" ||
                            note.kind_invoice_code === "08")) {
                        if (!files.xml_path) {
                            const xml = yield (0, libs_1.xmlGenerate)({
                                empresa,
                                sunat,
                                order,
                                type: "note",
                            });
                            files = Object.assign(Object.assign({}, files), { xml_path: xml });
                        }
                        if (note.send_sunat &&
                            !(getNote === null || getNote === void 0 ? void 0 : getNote.send_sunat) &&
                            subFacturacion) {
                            const { sunatResponse } = yield (0, note_send_api_1.noteSendSunatApi)(sunat);
                            if (!sunatResponse.success) {
                                note.send_sunat = false;
                                throw new express_core_2.BadRequestException(JSON.stringify(sunatResponse.error));
                            }
                            const cdr = yield (0, libs_1.crdGenerate)({
                                cdrzip: sunatResponse.cdrZip,
                                empresa,
                                orderCode: props.order.order_code,
                            });
                            files = Object.assign(Object.assign({}, files), { cdr_path: cdr, response_sunat: {
                                    cdrResponse: sunatResponse.cdrResponse,
                                    error: sunatResponse.error,
                                } });
                        }
                    }
                    const type = (note === null || note === void 0 ? void 0 : note.kind_invoice_code) === "01"
                        ? "FACTURA"
                        : (note === null || note === void 0 ? void 0 : note.kind_invoice_code) === "08"
                            ? "BOLETA"
                            : "RECIBO";
                    if (ordersUpdateDto.telephone &&
                        ordersUpdateDto.send_message &&
                        empresa.enabledSendMessage) {
                        try {
                            const telephone = `${empresa.dial_code}${ordersUpdateDto.telephone}@c.us`;
                            yield (0, api_1.whatsappSendMessageApi)(empresa, {
                                telephone,
                                message: empresa.whatsappconfig.sendpdf.replace("{COMPROBANTE}", type),
                                delay: 3,
                                options: { linkPreview: false },
                            });
                            const { pdfBuffer, file } = yield (0, libs_1.pdfGenerate)({
                                empresa,
                                sunat,
                                order,
                                type: "note",
                            });
                            const media = new File([pdfBuffer], file, {
                                type: "application/pdf",
                            });
                            yield (0, api_1.whatsappSendFileApi)(empresa, {
                                telephone,
                                file: media,
                                options: { sendMediaAsDocument: true },
                                delay: 4,
                            });
                            yield (0, api_1.whatsappSendMessageApi)(empresa, {
                                telephone,
                                message: empresa.whatsappconfig.thank2.replace("{URL}", (0, libs_2.BASE_URL)(empresa)),
                                delay: 4,
                                options: { linkPreview: false },
                            });
                        }
                        catch (error) { }
                    }
                    if (getNote) {
                        if (!getNote.send_sunat) {
                            yield this.notesApiService.update(empresa, String(getNote.id), Object.assign(Object.assign(Object.assign({}, note), files), { invoice_id: getInvoice.id, order_id: order.id, empresa_id: empresa.id }));
                        }
                    }
                    else {
                        yield this.notesApiService.store(Object.assign(Object.assign(Object.assign({}, note), files), { invoice_id: getInvoice.id, order_id: order.id, empresa_id: empresa.id }));
                    }
                }
            }
        });
    }
    onGuides(props) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const detail_orders = props.order.dataValues
                .details_orders;
            const getGuide = props.order.dataValues.guide;
            const { empresa, order, ordersUpdateDto, subFacturacion, vendedor } = props;
            const { guide } = ordersUpdateDto;
            if (guide) {
                let files = {
                    xml_path: (_a = getGuide === null || getGuide === void 0 ? void 0 : getGuide.xml_path) !== null && _a !== void 0 ? _a : null,
                    cdr_path: (_b = getGuide === null || getGuide === void 0 ? void 0 : getGuide.cdr_path) !== null && _b !== void 0 ? _b : null,
                    response_sunat: (_c = getGuide === null || getGuide === void 0 ? void 0 : getGuide.response_sunat) !== null && _c !== void 0 ? _c : null,
                };
                if (!getGuide) {
                    const { correlativo } = yield this.guidesApiService.latestCorrelativo(empresa, guide.kind_guide_code);
                    guide.correlativo = correlativo;
                    guide.serie = "T001";
                }
                const sunat = yield (0, libs_1.onGuideSunat)({
                    detail_orders,
                    empresa,
                    guide: Object.assign(Object.assign({}, guide), { empresa_id: empresa.id }),
                    order,
                    vendedor,
                });
                if (props.ordersUpdateDto.status_order_id ===
                    libs_1.STATUSORDER.enviando &&
                    guide.kind_guide_code === "09") {
                    if (!files.xml_path) {
                        const xml = yield (0, libs_1.xmlGenerate)({
                            empresa,
                            sunat,
                            order,
                            type: "guide",
                        });
                        files = Object.assign(Object.assign({}, files), { xml_path: xml });
                    }
                    if (guide.send_sunat &&
                        !(getGuide === null || getGuide === void 0 ? void 0 : getGuide.send_sunat) &&
                        subFacturacion) {
                        const { sunatResponse } = yield (0, guide_send_api_1.guideSendSunatApi)(sunat);
                        if (!sunatResponse.success) {
                            guide.send_sunat = false;
                            throw new express_core_2.BadRequestException(JSON.stringify(sunatResponse.error));
                        }
                        const cdr = yield (0, libs_1.crdGenerate)({
                            cdrzip: sunatResponse.cdrZip,
                            empresa,
                            orderCode: props.order.order_code,
                        });
                        files = Object.assign(Object.assign({}, files), { cdr_path: cdr, response_sunat: {
                                cdrResponse: sunatResponse.cdrResponse,
                                error: sunatResponse.error,
                            } });
                    }
                }
                if (getGuide) {
                    yield this.guidesApiService.update(empresa, String(getGuide.id), Object.assign(Object.assign(Object.assign({}, guide), files), { order_id: order.id, empresa_id: empresa.id }));
                }
                else {
                    yield this.guidesApiService.store(Object.assign(Object.assign(Object.assign({}, guide), files), { empresa_id: empresa.id, order_id: order.id }));
                }
            }
            if (ordersUpdateDto.status_order_id === libs_1.STATUSORDER.enviando &&
                empresa.enabledSendMessage) {
                try {
                    const products = yield Promise.all(detail_orders.map((prod, i) => __awaiter(this, void 0, void 0, function* () {
                        const product = yield (0, libs_3.Product)(empresa, false).findOne({
                            where: {
                                id: prod[(0, libs_3.productEntityId)(empresa, false)],
                                empresa_id: empresa.id,
                            },
                            attributes: ["id", "name"],
                        });
                        if (!product)
                            throw new express_core_2.BadRequestException("No se encontró ese producto");
                        return `${i + 1} - *Producto*: ${product.name}, *Precio Total*: ${(0, helpers_2.formatMoney)(empresa, prod.price, (props.order.moneyChange === 1
                            ? empresa.money.money
                            : "DOLARES"))}, *Cantidad*: ${prod.quantity} UND.\n`;
                    })));
                    const telephone = `${empresa.dial_code}${ordersUpdateDto.telephone}@c.us`;
                    yield (0, api_1.whatsappSendMessageApi)(empresa, {
                        telephone,
                        message: empresa.dial_code === "55"
                            ? `Olá 😊, somos ${empresa.name_empresa}. \n Seu pedido ${order.order_code}:\n Está sendo enviado para o seu endereço ${order.address}.\n${products}                          `
                            : `Hola 😊, Somos ${empresa.name_empresa}. \n Su orden *${order.order_code}*:\n Se está enviando su pedido a su domicilio ${order.address}.\n${products}`,
                        delay: 3,
                        options: { linkPreview: false },
                    });
                }
                catch (error) { }
            }
        });
    }
};
exports.OrdersApiService = OrdersApiService;
exports.OrdersApiService = OrdersApiService = __decorate([
    (0, express_core_1.Injectable)(),
    __metadata("design:paramtypes", [products_api_service_1.ProductsApiService,
        invoices_api_service_1.InvoicesApiService,
        notes_api_service_1.NotesApiService,
        guides_api_service_1.GuidesApiService,
        detail_orders_api_service_1.DetailOrdersApiService,
        ubigeo_api_service_1.UbigeoApiService,
        users_api_service_1.UsersApiService,
        citas_api_service_1.CitasApiService])
], OrdersApiService);
