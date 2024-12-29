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
exports.PAYMETHOD = exports.STATUSORDER = exports.isValiRUC = exports.isValidDni = exports.ordersTransferenciaImage = void 0;
exports.pdfGenerate = pdfGenerate;
exports.xmlGenerate = xmlGenerate;
exports.generatePdfBuffer = generatePdfBuffer;
exports.crdGenerate = crdGenerate;
exports.onInvoiceSunat = onInvoiceSunat;
exports.onNoteSunat = onNoteSunat;
exports.onGuideSunat = onGuideSunat;
exports.getOrder = getOrder;
exports.detailInvoice = detailInvoice;
exports.usersMostOrders = usersMostOrders;
const helpers_1 = require("@/uploads/libs/helpers");
const invoice_pdf_api_1 = require("../sunat/invoice.pdf.api");
const express_core_1 = require("@vigilio/express-core");
const invoice_xml_api_1 = require("../sunat/invoice.xml.api");
const note_pdf_api_1 = require("../sunat/note.pdf.api");
const note_xml_api_1 = require("../sunat/note.xml.api");
const helpers_2 = require("@/cart/libs/helpers");
const kind_credit_notes_entity_1 = require("../entities/kind_credit_notes.entity");
const kind_debit_notes_entity_1 = require("../entities/kind_debit_notes.entity");
const ticket_1 = require("./ticket");
const orders_entity_1 = require("../entities/orders.entity");
const node_fs_1 = __importDefault(require("node:fs"));
const libs_1 = require("@/payments/libs");
const guide_pdf_api_1 = require("../sunat/guide.pdf.api");
const libs_2 = require("@/products/libs");
const sequelize_1 = require("sequelize");
const provinces_seeder_1 = require("@/ubigeo/seeders/peru/provinces.seeder");
const regions_empresa_entity_1 = require("@/ubigeo/entities/regions_empresa.entity");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
const products_servicio_entity_1 = require("@/products/entities/products_servicio.entity");
const products_restaurant_entity_1 = require("@/products/entities/products_restaurant.entity");
const wkhtmltopdf_1 = __importDefault(require("wkhtmltopdf"));
const node_stream_1 = require("node:stream");
const dayjs_1 = require("~/libs/dayjs");
const users_entity_1 = require("@/users/entities/users.entity");
const libs_3 = require("@/users/libs");
exports.ordersTransferenciaImage = [800];
exports.isValidDni = new RegExp(/^\d{8}$/);
exports.isValiRUC = new RegExp(/^(10|20)\d{9}$/);
exports.STATUSORDER = {
    pendiente: 1,
    confirmado: 2,
    preparado: 3,
    enviando: 4,
    pagado: 5,
    entregado: 6,
    problema: 7,
};
exports.PAYMETHOD = {
    efectivo: 1,
    tarjeta: 2,
    yape: 3,
    paypal: 4,
    transferencia: 5,
    otro: 6,
};
function pdfGenerate(props_1) {
    return __awaiter(this, arguments, void 0, function* (props, save = false) {
        try {
            let pdf = null;
            if (props.type === "invoice") {
                pdf = yield (0, invoice_pdf_api_1.invoicePDFSunatApi)(props.sunat);
            }
            if (props.type === "note") {
                pdf = yield (0, note_pdf_api_1.notePDFSunatApi)(props.sunat);
            }
            if (props.type === "guide") {
                pdf = yield (0, guide_pdf_api_1.guidePDFSunatApi)(props.sunat);
            }
            if (props.type === "recibo") {
                pdf = yield (0, ticket_1.ticketHTML)(props.order, props.empresa);
            }
            const buffer = yield generatePdfBuffer(pdf, {
                pageWidth: "95mm",
                pageHeight: "385mm",
            });
            const nameFile = `/${props.empresa.slug}-${props.order.order_code}-${props.type}.pdf`;
            const file = `${props.empresa.slug}/sunat`;
            if (!node_fs_1.default.existsSync(`${(0, helpers_1.pathUploads)()}/${file}`)) {
                node_fs_1.default.mkdirSync(`${(0, helpers_1.pathUploads)()}/${file}`);
            }
            if (save) {
                if (node_fs_1.default.existsSync(`${(0, helpers_1.pathUploads)()}/${file}${nameFile}`)) {
                    node_fs_1.default.unlinkSync(`${(0, helpers_1.pathUploads)()}/${file}${nameFile}`);
                }
                node_fs_1.default.writeFileSync(`${(0, helpers_1.pathUploads)()}/${file}${nameFile}`, buffer);
            }
            return { file: `${file}${nameFile}`, pdfBuffer: buffer };
        }
        catch (error) {
            throw new express_core_1.InternalServerErrorException(`PDF no se subio correctamente, comunicarte con desarrollador, Posible error: no está disponible web de factura, ${error.message}`);
        }
    });
}
function xmlGenerate(props) {
    return __awaiter(this, void 0, void 0, function* () {
        let xml = null;
        if (props.type === "invoice") {
            xml = yield (0, invoice_xml_api_1.invoiceXMLSunatApi)(props.sunat);
        }
        if (props.type === "note") {
            xml = yield (0, note_xml_api_1.noteXMLSunatApi)(props.sunat);
        }
        const nameFile = `/${props.empresa.slug}-${props.order.order_code}-${props.type}.xml`;
        const file = `${props.empresa.slug}/sunat`;
        if (!node_fs_1.default.existsSync(`${(0, helpers_1.pathUploads)()}/${file}`)) {
            node_fs_1.default.mkdirSync(`${(0, helpers_1.pathUploads)()}/${file}`);
        }
        if (node_fs_1.default.existsSync(`${(0, helpers_1.pathUploads)()}/${file}${nameFile}`)) {
            node_fs_1.default.unlinkSync(`${(0, helpers_1.pathUploads)()}/${file}${nameFile}`);
        }
        node_fs_1.default.writeFileSync(`${(0, helpers_1.pathUploads)()}/${file}${nameFile}`, xml);
        return `${file}${nameFile}`;
    });
}
function generatePdfBuffer(html, options) {
    return new Promise((resolve, reject) => {
        const output = new node_stream_1.PassThrough();
        const chunks = [];
        (0, wkhtmltopdf_1.default)(html, options, (err) => {
            if (err) {
                reject(err.message);
            }
        }).pipe(output);
        output.on("data", (chunk) => {
            chunks.push(chunk);
        });
        output.on("end", () => {
            resolve(Buffer.concat(chunks));
        });
        output.on("error", (err) => {
            reject(err);
        });
    });
}
function crdGenerate(props) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = `${props.empresa.slug}/sunat/${props.empresa.slug}-${props.orderCode}-${Date.now().toString(32).slice(3)}.cdr`;
        if (node_fs_1.default.existsSync(`${(0, helpers_1.pathUploads)()}/${file}`)) {
            node_fs_1.default.unlinkSync(`${(0, helpers_1.pathUploads)()}/${file}`);
        }
        node_fs_1.default.writeFileSync(`${(0, helpers_1.pathUploads)()}/${file}`, props.cdrzip);
        return file;
    });
}
function onInvoiceSunat(_a) {
    return __awaiter(this, arguments, void 0, function* ({ invoice, detail_orders, empresa, order, vendedor, }) {
        var _b, _c, _d;
        const client = {
            tipoDoc: invoice.identification_number ? invoice.document_code : "0",
            rznSocial: (_b = invoice.razon_social) !== null && _b !== void 0 ? _b : "Cliente General",
            numDoc: (_c = invoice.identification_number) !== null && _c !== void 0 ? _c : "00000000",
        };
        const addressEmpresa = empresa.address;
        const address = {
            ubigeo: addressEmpresa.city.code,
            departamento: addressEmpresa.city.region.name,
            provincia: (_d = provinces_seeder_1.provincesSeeder.find((pro) => pro.department_id ===
                addressEmpresa.city.region.code)) === null || _d === void 0 ? void 0 : _d.name,
            distrito: addressEmpresa.city.name,
            urbanizacion: addressEmpresa.urbanizacion,
            direccion: addressEmpresa.direccion,
            codLocal: addressEmpresa.codLocal,
        };
        const details = yield detailInvoice(empresa, detail_orders, order);
        return {
            ublVersion: "2.1",
            tipoOperacion: "0101",
            tipoDoc: invoice.kind_invoice_code,
            serie: invoice.serie,
            correlativo: String(invoice.correlativo),
            tipoMoneda: order.moneyChange === 1 ? "PEN" : "USD",
            fechaEmision: invoice.createdAt
                ? (0, dayjs_1.TimePeru)(empresa, invoice.createdAt).toDate()
                : (0, dayjs_1.NOW)(empresa).toDate(),
            formaPago: {
                moneda: order.moneyChange === 1 ? "PEN" : "USD",
                tipo: "Contado",
            },
            client,
            details,
            company: Object.assign({ logo: empresa.logo
                    ? node_fs_1.default
                        .readFileSync(`${(0, helpers_1.pathUploads)()}/${empresa.slug}/${empresa.logo[0].file}`)
                        .toString("base64")
                    : "", certificado: empresa.certificado
                    ? node_fs_1.default
                        .readFileSync(`${(0, helpers_1.pathUploads)()}/${empresa.slug}/${empresa.certificado[0].file}`)
                        .toString("base64")
                    : null, condicion_pago: order.pay_method.name, telephone: empresa.telephoneFirst, vendedor,
                address }, empresa.company),
        };
    });
}
function onNoteSunat(_a) {
    return __awaiter(this, arguments, void 0, function* ({ note, detail_orders, empresa, invoice, order, vendedor, }) {
        var _b, _c, _d;
        const notekind = note.kind_invoice_code === "07"
            ? yield kind_credit_notes_entity_1.KindCreditNotes.findByPk(note.kind_credit_notes_code)
            : yield kind_debit_notes_entity_1.KindDebitNotes.findByPk(note.kind_debit_notes_code);
        const client = {
            tipoDoc: note.identification_number ? note.document_code : "0",
            rznSocial: (_b = note.razon_social) !== null && _b !== void 0 ? _b : "Cliente General",
            numDoc: (_c = note.identification_number) !== null && _c !== void 0 ? _c : "00000000",
        };
        const addressEmpresa = empresa.address;
        const address = {
            ubigeo: addressEmpresa.city.code,
            departamento: addressEmpresa.city.region.name,
            provincia: (_d = provinces_seeder_1.provincesSeeder.find((pro) => pro.department_id ===
                addressEmpresa.city.region.code)) === null || _d === void 0 ? void 0 : _d.name,
            distrito: addressEmpresa.city.name,
            urbanizacion: addressEmpresa.urbanizacion,
            direccion: addressEmpresa.direccion,
            codLocal: addressEmpresa.codLocal,
        };
        const details = yield detailInvoice(empresa, detail_orders, order);
        return {
            ublVersion: "2.1",
            tipoOperacion: "0101",
            correlativo: String(note.correlativo),
            tipoDoc: note.kind_invoice_code,
            serie: note.serie,
            codMotivo: note.kind_invoice_code === "07"
                ? note.kind_credit_notes_code
                : note.kind_debit_notes_code,
            desMotivo: notekind.name,
            numDocfectado: `${invoice.serie}-${invoice.correlativo}`,
            tipDocAfectado: invoice.kind_invoice_code,
            tipoMoneda: order.moneyChange === 1 ? "PEN" : "USD",
            fechaEmision: note.createdAt
                ? (0, dayjs_1.TimePeru)(empresa, note.createdAt).toDate()
                : (0, dayjs_1.NOW)(empresa).toDate(),
            formaPago: {
                moneda: order.moneyChange === 1 ? "PEN" : "USD",
                tipo: "Contado",
            },
            client,
            details,
            company: Object.assign({ logo: empresa.logo
                    ? node_fs_1.default
                        .readFileSync(`${(0, helpers_1.pathUploads)()}/${empresa.slug}/${empresa.logo[0].file}`)
                        .toString("base64")
                    : "", certificado: empresa.certificado
                    ? node_fs_1.default
                        .readFileSync(`${(0, helpers_1.pathUploads)()}/${empresa.slug}/${empresa.certificado[0].file}`)
                        .toString("base64")
                    : null, condicion_pago: order.pay_method.name, telephone: empresa.telephoneFirst, vendedor,
                address }, empresa.company),
        };
    });
}
function onGuideSunat(_a) {
    return __awaiter(this, arguments, void 0, function* ({ guide, detail_orders, empresa, order, vendedor, }) {
        var _b;
        const addressEmpresa = empresa.address;
        const address = {
            ubigeo: addressEmpresa.city.code,
            departamento: addressEmpresa.city.region.name,
            provincia: (_b = provinces_seeder_1.provincesSeeder.find((pro) => pro.department_id ===
                addressEmpresa.city.region.code)) === null || _b === void 0 ? void 0 : _b.name,
            distrito: addressEmpresa.city.name,
            urbanizacion: addressEmpresa.urbanizacion,
            direccion: addressEmpresa.direccion,
            codLocal: addressEmpresa.codLocal,
        };
        const items = yield detailInvoice(empresa, detail_orders, order);
        return {
            version: "2022",
            correlativo: String(guide.correlativo),
            tipoDoc: guide.kind_guide_code,
            serie: guide.serie,
            fechaEmision: guide.createdAt ? new Date(guide.createdAt) : new Date(),
            destinatario: {
                numDoc: guide.destinatario.identification_number,
                rznSocial: guide.destinatario.razon_social,
                tipoDoc: guide.destinatario.document_code,
            },
            envio: {
                codTraslado: guide.datos_envio.motivo_traslado,
                modTraslado: guide.datos_envio.modalidad_traslado,
                fecTraslado: guide.datos_envio.fecha_initial_traslado,
                llegada: {
                    direccion: guide.datos_envio.punta_llegada.address,
                    ubigeo: guide.datos_envio.punta_llegada.ubigeo,
                },
                partida: {
                    direccion: guide.datos_envio.punta_partida.address,
                    ubigeo: guide.datos_envio.punta_partida.ubigeo,
                },
                transportista: {
                    numDoc: guide.datos_envio.dato_transportista.identification_number,
                    rznSocial: guide.datos_envio.dato_transportista.razon_social,
                    tipoDoc: guide.datos_envio.dato_transportista.document_code,
                },
                pesoTotal: guide.datos_envio.peso_total,
                undPesoTotal: guide.datos_envio.unidad,
            },
            details: items.map((prod) => ({
                codigo: prod.codProducto,
                descripcion: prod.descripcion,
                unidad: prod.unidad,
                cantidad: prod.cantidad,
            })),
            company: Object.assign({ logo: empresa.logo
                    ? node_fs_1.default
                        .readFileSync(`${(0, helpers_1.pathUploads)()}/${empresa.slug}/${empresa.logo[0].file}`)
                        .toString("base64")
                    : "", certificado: empresa.certificado
                    ? node_fs_1.default
                        .readFileSync(`${(0, helpers_1.pathUploads)()}/${empresa.slug}/${empresa.certificado[0].file}`)
                        .toString("base64")
                    : null, condicion_pago: order.pay_method.name, telephone: empresa.telephoneFirst, vendedor,
                address }, empresa.company),
        };
    });
}
function getOrder(empresa_1, order_1) {
    return __awaiter(this, arguments, void 0, function* (empresa, order, showDetailsOrder = true) {
        const [details_orders, invoice, guide] = yield Promise.all([
            showDetailsOrder
                ? order.$get("details_orders", {
                    include: [
                        {
                            model: products_normal_entity_1.ProductsNormal,
                            attributes: ["id", "product_code", "name", "images", "slug"],
                        },
                        {
                            model: products_servicio_entity_1.ProductsServicio,
                            attributes: ["id", "product_code", "name", "images", "slug"],
                        },
                        {
                            model: products_restaurant_entity_1.ProductsRestaurant,
                            attributes: ["id", "product_code", "name", "images", "slug"],
                        },
                    ],
                })
                : [],
            order.$get("invoice"),
            order.$get("guide"),
        ]);
        let note = null;
        if (invoice) {
            note = yield invoice.$get("note");
        }
        order.dataValues.guide = guide;
        order.dataValues.invoice = invoice;
        if (showDetailsOrder) {
            order.dataValues.details_orders = details_orders;
        }
        order.dataValues.note = note;
        let city = null;
        if (order.city) {
            const regionsEmpresa = yield regions_empresa_entity_1.RegionsEmpresa.findOne({
                where: {
                    empresa_id: empresa.id,
                    region_id: order.city.region_id,
                },
            });
            city = Object.assign(Object.assign({}, order.city.toJSON()), { days: regionsEmpresa === null || regionsEmpresa === void 0 ? void 0 : regionsEmpresa.days, enabled: regionsEmpresa === null || regionsEmpresa === void 0 ? void 0 : regionsEmpresa.enabled, priceShipping: regionsEmpresa === null || regionsEmpresa === void 0 ? void 0 : regionsEmpresa.priceShipping });
        }
        order.dataValues.city = city;
        return order;
    });
}
function detailInvoice(empresa, detail_orders, order) {
    return __awaiter(this, void 0, void 0, function* () {
        const IGV = order.igv ? empresa.igv : 0;
        const lengthDetails = order.dataValues.details_orders.reduce((total, obj) => total + obj.quantity, 0);
        const city = order.city_id ? order.dataValues.city : null;
        const ig = city
            ? order.igv
                ? (0, helpers_2.subtotal)(city.priceShipping, empresa.igv, true)
                : city.priceShipping
            : 0;
        const details = yield Promise.all(detail_orders.map((prod) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const product = yield (0, libs_2.Product)(empresa, order.isService).findOne({
                where: {
                    id: prod[(0, libs_2.productEntityId)(empresa, order.isService)],
                    empresa_id: empresa.id,
                },
            });
            if (!product)
                throw new express_core_1.NotFoundException(`Hubo un error al encontrar este producto ${prod[(0, libs_2.productEntityId)(empresa, order.isService)]}`);
            const priceWithoutIGV = order.igv
                ? prod.price / ((100 + IGV) / 100) / prod.quantity
                : prod.price / prod.quantity;
            let priceWithPasarelaCommission = priceWithoutIGV;
            const total = order.total - ig;
            if (order.is_pasarela_client) {
                if (order.pasarela_comision) {
                    const totalw = total / ((100 + IGV) / 100);
                    priceWithPasarelaCommission =
                        (totalw +
                            (0, libs_1.pasarelaComision)(empresa, totalw, (_a = order.type_pasarela) !== null && _a !== void 0 ? _a : "normal")) /
                            lengthDetails;
                }
                if (order.paypal_token) {
                    priceWithPasarelaCommission =
                        ((0, libs_1.paypalComision)(total / ((100 + IGV) / 100), order.moneyChange) *
                            order.moneyChange) /
                            lengthDetails;
                }
            }
            return {
                tipAfeIgv: 10,
                codProducto: product.product_code,
                descripcion: `${product.name}${prod.variant_id || order.isService ? ` / ${prod.variante}` : ""}`,
                unidad: order.isService ? "ZZ" : "NIU",
                cantidad: prod.quantity,
                mtoValorUnitario: priceWithPasarelaCommission * order.moneyChange,
                mtoValorVenta: (priceWithPasarelaCommission * prod.quantity) * order.moneyChange,
                mtoBaseIgv: (priceWithPasarelaCommission * prod.quantity) * order.moneyChange,
                mtoPrecioUnitario: (0, helpers_2.subtotal)(priceWithPasarelaCommission, IGV, true) * order.moneyChange,
                igv: (priceWithPasarelaCommission * prod.quantity * (IGV / 100)) *
                    order.moneyChange,
                totalImpuestos: (priceWithPasarelaCommission * prod.quantity * (IGV / 100)) *
                    order.moneyChange,
                porcentajeIgv: IGV,
                factorIcbper: null,
                icbper: null,
            };
        })));
        if (city && city.priceShipping > 0) {
            details.push({
                tipAfeIgv: 10,
                codProducto: "0",
                descripcion: `Precio de Envio - ${city.name}`,
                unidad: "NIU",
                cantidad: 1,
                mtoValorUnitario: city.priceShipping * order.moneyChange,
                mtoValorVenta: city.priceShipping * order.moneyChange,
                mtoBaseIgv: city.priceShipping * order.moneyChange,
                mtoPrecioUnitario: (0, helpers_2.subtotal)(city.priceShipping, IGV, true) * order.moneyChange,
                igv: (city.priceShipping * (IGV / 100)) * order.moneyChange,
                totalImpuestos: (city.priceShipping * (IGV / 100)) * order.moneyChange,
                porcentajeIgv: IGV,
                factorIcbper: null,
                icbper: null,
            });
        }
        return details;
    });
}
function usersMostOrders(empresa, date) {
    return __awaiter(this, void 0, void 0, function* () {
        const orders = yield orders_entity_1.Orders.unscoped().findAll({
            where: Object.assign({ status_order_id: exports.STATUSORDER.entregado, user_id: {
                    [sequelize_1.Op.ne]: null,
                }, empresa_id: empresa.id }, date),
            attributes: ["id", "user_id"],
            include: [
                {
                    model: users_entity_1.Users,
                    attributes: ["id", "photo", "username", "slug"],
                    where: {
                        role_id: libs_3.ROLES.user,
                    },
                    as: "user",
                },
            ],
        });
        const groupedById = {};
        for (const item of orders) {
            const id = item.user_id;
            if (groupedById[id]) {
                groupedById[id].cantidad++;
            }
            else {
                groupedById[id] = {
                    id: id,
                    cantidad: 1,
                    user: item.user,
                };
            }
        }
        const arrayGroup = Object.values(groupedById).sort((a, b) => b.cantidad -
            a.cantidad);
        return arrayGroup;
    });
}
