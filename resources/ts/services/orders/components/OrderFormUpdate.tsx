import { useForm } from "react-hook-form";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import type { OrdersSchemaFromServer } from "../schemas/orders.schema";
import { valibotVigilio } from "~/libs/valibot";
import { useEffect, useMemo } from "preact/hooks";
import { statusOrdersIndexApi } from "../apis/status_orders.index.api";
import { ordersUpdateApi } from "../apis/orders.update.api";
import {
    ordersUpdateDto,
    type OrdersUpdateDto,
} from "../dtos/orders.update.dto";
import Form from "~/components/form";
import { kindInvoiceIndexApi } from "../apis/kind_invoice.index.api";
import { invoicesLatestCorrelativoApi } from "../apis/invoices.lastestCorrelativo.api";
import { dniApi, type DniApiMutation } from "../apis/others/dni.api";
import {
    isValidRUC,
    isValidDni,
    isValidPhoneNumber,
    STATUSORDER,
    MOTIVOTRASLADO,
    MODALIDADTRASLADO,
    UNIDADMEDIDAD,
} from "../libs";
import { rucApi, type RucMutation } from "../apis/others/ruc.api";
import { notesLatestCorrelativoApi } from "../apis/notes.latestCorrelativo.api";
import { payMethodsIndexApi } from "../apis/pay_methods.index.api";
import {
    NOW,
    TimePeru,
    formatDateTwo,
    handlerError,
    restarDays,
} from "~/libs/helpers";
import { kindCreditNotesIndexApi } from "../apis/kind_credit_notes.index.api";
import { kindDebitNotesIndexApi } from "../apis/kind_debit_notes.index.api";
import { subFacturacion } from "~/config/guards";
import { documentsIndexApi } from "../apis/documents.index.api";
import LoaderSubmit from "~/components/LoaderSubmit";
import LogoImage from "~/components/LogoImage";
import useTemporizador from "~/hooks/useTemporizador";
import AlertDanger from "~/components/Alerts/AlertDanger";
import enviroments from "~/config";
import { guidesLatestCorrelativoApi } from "../apis/guides.latestCorrelativo.api";
import TableDetailsOrder from "./TableDetailsOrder";
import { citiesIndexApi } from "@/ubigeo/apis/citites.api.index";
import useSocketStore from "~/stores/socket.store";
import { formSelectNumber } from "~/components/form/FormSelect";
import { floorMesasIndexApi } from "../apis/mesas/floors.mesas.index.api";
import { floorsIndexApi } from "../apis/mesas/floors.index.api";
import { Input, merge, nullable, number, object } from "@vigilio/valibot";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
const orderUpdateAdminDto = merge([
    ordersUpdateDto,
    object({
        floor_id: nullable(number()),
    }),
]);
type OrderUpdateAdminDto = Input<typeof orderUpdateAdminDto>;
interface OrderFormUpdateProps {
    order: OrdersSchemaFromServer;
    refetch: (clean?: boolean) => void;
    showRefetch: (clean?: boolean) => void;
}

function OrderFormUpdate({
    order,
    refetch,
    showRefetch,
}: OrderFormUpdateProps) {
    const statusOrdersIndexQuery = statusOrdersIndexApi();
    const payMethodsIndexQuery = payMethodsIndexApi();
    const kindInvoiceIndexQuery = kindInvoiceIndexApi();
    const ordersUpdateApiMutation = ordersUpdateApi(order.order_code);
    const invoicesLatestCorrelativoQuery = invoicesLatestCorrelativoApi();
    const notesLatestCorrelativoQuery = notesLatestCorrelativoApi();
    const guidesLatestCorrelativoQuery = guidesLatestCorrelativoApi();
    const floorMesasQuery = floorMesasIndexApi();
    const floorsIndexQuery = floorsIndexApi();
    const dniMutation = dniApi();
    const rucMutation = rucApi();
    const { io } = useSocketStore();

    const ordersUpdateDtoForm = useForm<OrderUpdateAdminDto>({
        resolver: valibotVigilio(orderUpdateAdminDto),
        mode: "all",
        defaultValues: useMemo(() => {
            return {
                address: order.address,
                pay_method_id: order.pay_method_id,
                status_order_id: order.status_order_id,
                telephone: order.telephone,
                total: order.total,
                description: order.description,
                send_message: false,
                invoice: order.invoice,
                note: order.note,
                guide: order.guide
                    ? {
                          ...order.guide,
                          datos_envio: {
                              ...order.guide!.datos_envio,
                              fecha_initial_traslado: formatDateTwo(
                                  order.guide!.datos_envio
                                      .fecha_initial_traslado!,
                                  "YYYY-MM-DD"
                              )! as Date,
                          },
                      }
                    : null,
                isDelivery: order.isDelivery,
                transferencia_image: order.transferencia_image,
                city_id: order.city_id,
                mesa_id: order.mesa_id ?? null,
                floor_id: order.mesa ? order.mesa!.floor!.id : null,
                email: order.email ?? null,
                reference: order.reference ?? null,
                isService: order.isService,
            };
        }, []),
    });

    function onOrdersUpdateDtoForm(body: OrdersUpdateDto) {
        if (
            body.status_order_id === STATUSORDER.entregado &&
            order.status_order_id !== STATUSORDER.pagado &&
            !order.invoice
        ) {
            sweetAlert({
                icon: "warning",
                title: "La orden necesita estar <b>pagado correctamente</b> para ser entregado.",
            });
            return;
        }

        // cuando pulsa el estado de pagado y no hay comprobantes creado y no es ticket
        if (
            !order.invoice &&
            statusOrder === STATUSORDER.pagado &&
            body.invoice?.kind_invoice_code !== "00"
        ) {
            //  obligatorio document code
            if (!invoiceDocumentCode) {
                ordersUpdateDtoForm.setError("invoice.document_code", {
                    message: "Este campo es obligatorio.",
                });
                return;
            }
            // --------        DNI          ---------
            //  obligatorio numero de identidad
            // if (!identificationNumber) {
            // 	ordersUpdateDtoForm.setError("invoice.identification_number", {
            // 		message: "Este campo es obligatorio.",
            // 	});
            // 	return;
            // }
            //  obligatorio  razon social
            // if (!razon_social) {
            // 	ordersUpdateDtoForm.setError("invoice.razon_social", {
            // 		message: "Este campo es obligatorio.",
            // 	});
            // 	return;
            // }
            if (body.invoice?.identification_number) {
                if (
                    invoiceDocumentCode === "1" &&
                    !isValidDni.test(body.invoice.identification_number)
                ) {
                    //  validar dni
                    ordersUpdateDtoForm.setError(
                        "invoice.identification_number",
                        {
                            message: "Dni no valido",
                        }
                    );
                    ordersUpdateDtoForm.setValue("invoice.razon_social", "");
                    return;
                }
                if (
                    invoiceDocumentCode === "6" &&
                    !isValidRUC.test(body.invoice.identification_number)
                ) {
                    //  validar ruc
                    ordersUpdateDtoForm.setError(
                        "invoice.identification_number",
                        {
                            message: "Ruc no valido",
                        }
                    );
                    ordersUpdateDtoForm.setValue("invoice.razon_social", "");
                    return;
                }
            }
        }

        if (
            order.invoice?.send_sunat &&
            order.invoice.kind_invoice_code !== "00" &&
            statusOrder === STATUSORDER.problema
        ) {
            if (!body.note?.kind_invoice_code) {
                ordersUpdateDtoForm.setError("note.kind_invoice_code", {
                    message: "Este campo es obligatorio.",
                });
                return;
            }
            if (body.note) {
                if (kindInvoiceNote === "07" && !noteKindCreditNotesCode) {
                    ordersUpdateDtoForm.setError(
                        "note.kind_credit_notes_code",
                        {
                            message: "Este campo es obligatorio.",
                        }
                    );
                    return;
                }
                if (kindInvoiceNote === "08" && !noteKindDebitNotesCode) {
                    ordersUpdateDtoForm.setError("note.kind_debit_notes_code", {
                        message: "Este campo es obligatorio.",
                    });
                    return;
                }
            }
        }

        sweetModal({
            customIcon:
                "<i class='fas fa-store text-3xl dark:text-white text-secondary-dark mb-2' />",
            title: "¿Estas seguro de realizar está acción?",
            text: `<div class="flex flex-col gap-2">
            <p>
                Orden de estado: <b>${
                    arrayStatusOrders.find(
                        (status) => status.key === body.status_order_id
                    )?.value
                }</b>
            </p>
            ${
                body.status_order_id === STATUSORDER.pagado
                    ? `<p>Metódo de pago: <b>${
                          arrayPayMethods.find(
                              (pay) => pay.key === body.pay_method_id
                          )?.value
                      }</b></p><p>Tipo de  combrobante: <b>${
                          arrayKindInvoices.find(
                              (invoice) =>
                                  invoice.key ===
                                  body.invoice?.kind_invoice_code
                          )?.value
                      }</b></p>  ${
                          body.invoice?.kind_invoice_code !== "00"
                              ? `<p>Numbero de Identificación: <b>${body.invoice?.identification_number}</b></p><p>Razon Social: <b>${body.invoice?.razon_social}</b></p>`
                              : ""
                      }`
                    : ""
            }
            ${
                body.status_order_id === STATUSORDER.problema
                    ? `<p>Tipo de  combrobante: <b>${
                          arrayKindInvoices.find(
                              (invoice) =>
                                  invoice.key === body.note?.kind_invoice_code
                          )?.value
                      }</b></p><p>Numbero de Identificación: <b>${
                          body.note?.identification_number
                      }</b></p><p>Razon Social: <b>${
                          body.note?.razon_social
                      }</b></p>`
                    : ""
            } ${
                body.status_order_id === STATUSORDER.enviando && body.guide
                    ? `<p>Tipo de  combrobante: <b>${
                          arrayKindInvoices.find(
                              (invoice) =>
                                  invoice.key === body.guide?.kind_guide_code
                          )?.value
                      }</b></p><p>Datos: <div class="break-words text-wrap">
                     <p>Destinario - Numero de Identificación: <b>${
                         body.guide?.destinatario.identification_number
                     }</b></p>
                      <p>Destinario - Razon Social: <b>${
                          body.guide?.destinatario.razon_social
                      }</b></p>
                       <p>Datos de envio Transportista - Numero de Identificación: <b>${
                           body.guide?.datos_envio.dato_transportista
                               .identification_number
                       }</b></p>
                         <p>Datos de envio Transportista - Razón social: <b>${
                             body.guide?.datos_envio.dato_transportista
                                 .razon_social
                         }</b></p>
                         ...
                      </div>`
                    : ""
            }
            <p>
               
            </p>
        </div>`,
            showCancelButton: true,
        }).then(async ({ isConfirmed }) => {
            if (isConfirmed) {
                ordersUpdateApiMutation.mutate(body, {
                    onSuccess(data) {
                        if (data.success) {
                            if (refetch) {
                                refetch(false);
                            }
                            if (
                                data.order.mesa_id &&
                                data.order.status_order_id !==
                                    STATUSORDER.entregado
                            ) {
                                io?.emit("floors_mesas:index");
                            }
                            showRefetch(false);
                            sweetAlert({
                                icon: "success",
                                title: `Orden Modificado correctamente ${order.order_code}`,
                            });
                        }
                    },
                    onError(error) {
                        handlerError(ordersUpdateDtoForm, error);
                    },
                });
            }
        });
    }

    const payMethod = ordersUpdateDtoForm.watch("pay_method_id");
    const kindInvoice = ordersUpdateDtoForm.watch("invoice.kind_invoice_code");
    const kindInvoiceNote = ordersUpdateDtoForm.watch("note.kind_invoice_code");
    const noteKindCreditNotesCode = ordersUpdateDtoForm.watch(
        "note.kind_credit_notes_code"
    );
    const noteKindDebitNotesCode = ordersUpdateDtoForm.watch(
        "note.kind_debit_notes_code"
    );

    const statusOrder = ordersUpdateDtoForm.watch("status_order_id");
    const identificationNumber = ordersUpdateDtoForm.watch(
        "invoice.identification_number"
    );
    const telephone = ordersUpdateDtoForm.watch("telephone");
    const invoiceDocumentCode = ordersUpdateDtoForm.watch(
        "invoice.document_code"
    );
    const invoiceSerie = ordersUpdateDtoForm.watch("invoice.serie");
    const invoiceCorrelativo = ordersUpdateDtoForm.watch("invoice.correlativo");
    const noteSerie = ordersUpdateDtoForm.watch("note.serie");
    const noteCorrelativo = ordersUpdateDtoForm.watch("note.correlativo");

    const kind_guides_code = ordersUpdateDtoForm.watch("guide.kind_guide_code");

    const destinatarioDocumentCode = ordersUpdateDtoForm.watch(
        "guide.destinatario.document_code"
    );
    const destinatarioIdentificationNumber = ordersUpdateDtoForm.watch(
        "guide.destinatario.identification_number"
    );
    const datoTransportistaDocumentCode = ordersUpdateDtoForm.watch(
        "guide.datos_envio.dato_transportista.document_code"
    );
    const datoTransportistaIdentificationNumber = ordersUpdateDtoForm.watch(
        "guide.datos_envio.dato_transportista.identification_number"
    );
    const kindGuidesCode = ordersUpdateDtoForm.watch("guide.kind_guide_code");
    const guideCorrelativo = ordersUpdateDtoForm.watch("guide.correlativo");
    const guideSerie = ordersUpdateDtoForm.watch("guide.serie");
    const floorId = ordersUpdateDtoForm.watch("floor_id");

    const arrayFloors = useMemo(
        () =>
            floorsIndexQuery.isSuccess && floorsIndexQuery.data
                ? floorsIndexQuery.data.data.map((floor) => ({
                      key: floor.id,
                      value: floor.name,
                  }))
                : [],
        [floorsIndexQuery]
    );
    const arrayMesas = useMemo(
        () =>
            floorMesasQuery.isSuccess && floorMesasQuery.data
                ? floorMesasQuery.data.data.map((floor) => ({
                      key: floor.id,
                      value: floor.mesa_code,
                  }))
                : [],
        [floorMesasQuery]
    );
    useEffect(() => {
        if (floorId) {
            floorMesasQuery.mutate(floorId);
        }
    }, [floorId]);
    const arrayKindInvoices = useMemo(
        () =>
            kindInvoiceIndexQuery.isSuccess && kindInvoiceIndexQuery.data
                ? kindInvoiceIndexQuery.data.data.map((kind) => ({
                      key: kind.code,
                      value: kind.name,
                  }))
                : [],
        [kindInvoiceIndexQuery]
    );

    const arrayStatusOrders = useMemo(
        () =>
            statusOrdersIndexQuery.isSuccess && statusOrdersIndexQuery.data
                ? statusOrdersIndexQuery.data.data
                      .map((statusorder) => ({
                          key: statusorder.id,
                          value: statusorder.name,
                      }))
                      .filter(
                          (so) =>
                              order.status_order_id === STATUSORDER.problema
                                  ? so.key === STATUSORDER.problema
                                  : so // si ya hubo problema, que solo aparesca eso
                      )
                      .filter((so) =>
                          !order.isDelivery
                              ? so.key !== STATUSORDER.enviando &&
                                so.key !== STATUSORDER.pendiente
                              : so
                      ) // si es mesa que no aparesca enviar
                      .filter((so) =>
                          order.status_order_id === STATUSORDER.pagado // si el orden ya esta pagado . solo que me muestre hubo un problema
                              ? so.key === STATUSORDER.pagado ||
                                so.key === STATUSORDER.entregado ||
                                so.key === STATUSORDER.enviando ||
                                so.key === STATUSORDER.problema
                              : so
                      )
                      .filter((so) =>
                          order.status_order_id === STATUSORDER.entregado // si el orden ya esta pagado . solo que me muestre hubo un problema
                              ? so.key === STATUSORDER.entregado ||
                                so.key === STATUSORDER.problema
                              : so
                      )
                : [],
        [statusOrdersIndexQuery]
    );

    const arrayPayMethods = useMemo(
        () =>
            payMethodsIndexQuery.isSuccess && payMethodsIndexQuery.data
                ? payMethodsIndexQuery.data.data.map((statusorder) => ({
                      key: statusorder.id,
                      value: statusorder.name,
                  }))
                : [],
        [payMethodsIndexQuery]
    );

    useEffect(() => {
        if (kindInvoice && !order.invoice) {
            ordersUpdateDtoForm.clearErrors();
            ordersUpdateDtoForm.setValue("invoice.send_sunat", false);
            ordersUpdateDtoForm.setValue("invoice.identification_number", null);
            ordersUpdateDtoForm.setValue("invoice.razon_social", null);
            ordersUpdateDtoForm.setValue("invoice.document_code", null);
            if (kindInvoice === "00") {
                ordersUpdateDtoForm.setValue("invoice", {
                    serie: "R001",
                    razon_social: null,
                    document_code: null,
                    send_sunat: false,
                    identification_number: null,
                    kind_invoice_code: "00",
                    correlativo: "",
                });
            }
            if (kindInvoice === "01") {
                ordersUpdateDtoForm.setValue("invoice.serie", "F001");
                ordersUpdateDtoForm.setValue("invoice.document_code", "6"); //6 ruc
            }
            if (kindInvoice === "03") {
                ordersUpdateDtoForm.setValue("invoice.serie", "B001");
                ordersUpdateDtoForm.setValue("invoice.document_code", "1"); //1 dni
            }
            invoicesLatestCorrelativoQuery.mutate(kindInvoice, {
                onSuccess(data) {
                    ordersUpdateDtoForm.setValue(
                        "invoice.correlativo",
                        data.correlativo
                    );
                },
            });
        }
    }, [kindInvoice]);
    useEffect(() => {
        if (kindInvoiceNote && order.invoice) {
            if (kindInvoiceNote === "07") {
                ordersUpdateDtoForm.setValue(
                    "note.serie",
                    `${order.invoice.kind_invoice_code === "01" ? "F" : "B"}C01`
                );
            }
            if (kindInvoiceNote === "08") {
                ordersUpdateDtoForm.setValue(
                    "note.serie",
                    `${order.invoice.kind_invoice_code === "01" ? "F" : "B"}D01`
                );
            }
            if (["07", "08"].includes(kindInvoiceNote) && !order.note) {
                notesLatestCorrelativoQuery.mutate(kindInvoiceNote, {
                    onSuccess(data) {
                        if (data.success) {
                            ordersUpdateDtoForm.setValue(
                                "note.correlativo",
                                data.correlativo
                            );
                        }
                    },
                });
                ordersUpdateDtoForm.setValue(
                    "note.document_code",
                    order.invoice.document_code!
                );
                ordersUpdateDtoForm.setValue(
                    "note.identification_number",
                    order.invoice.identification_number!
                );
                ordersUpdateDtoForm.setValue(
                    "note.razon_social",
                    order.invoice.razon_social!
                );
            }
        }
    }, [kindInvoiceNote]);
    useEffect(() => {
        if (kind_guides_code) {
            if (kind_guides_code === "09") {
                ordersUpdateDtoForm.setValue("guide.serie", "T001");
                guidesLatestCorrelativoQuery.mutate(kind_guides_code, {
                    onSuccess(data) {
                        if (data.success) {
                            ordersUpdateDtoForm.setValue(
                                "guide.correlativo",
                                data.correlativo
                            );
                        }
                    },
                });
            }
        } else {
            if (!order.guide) {
                ordersUpdateDtoForm.setValue("guide", null);
            }
        }
    }, [kind_guides_code]);

    useEffect(() => {
        if (!payMethod) {
            ordersUpdateDtoForm.setValue("invoice", null);
        }
    }, [payMethod]);

    useEffect(() => {
        if (!telephone || !isValidPhoneNumber.test(telephone)) {
            ordersUpdateDtoForm.setValue("send_message", false);
        }
    }, [telephone]);

    useEffect(() => {
        if (!order.guide) {
            ordersUpdateDtoForm.setValue("guide", null);
        }
        if (!order.invoice) {
            ordersUpdateDtoForm.setValue("invoice", null);
        }
    }, [statusOrder]);

    useEffect(() => {
        if (identificationNumber?.length && !order.invoice) {
            ordersUpdateDtoForm.clearErrors("invoice.razon_social");

            if (invoiceDocumentCode === "1") {
                if (isValidDni.test(identificationNumber)) {
                    dniMutation.mutate(identificationNumber, {
                        onSuccess(data) {
                            ordersUpdateDtoForm.setValue(
                                "invoice.razon_social",
                                data.data.nombre_completo
                            );
                        },
                        onError() {
                            ordersUpdateDtoForm.setValue(
                                "invoice.razon_social",
                                ""
                            );
                            ordersUpdateDtoForm.setError(
                                "invoice.identification_number",
                                {
                                    message: "DNI no valido",
                                }
                            );
                        },
                    });
                } else {
                    ordersUpdateDtoForm.setValue("invoice.razon_social", "");
                    ordersUpdateDtoForm.setError(
                        "invoice.identification_number",
                        {
                            message: "DNI no valido",
                        }
                    );
                }
            }
            if (invoiceDocumentCode === "6") {
                if (isValidRUC.test(identificationNumber)) {
                    rucMutation.mutate(identificationNumber, {
                        onSuccess(data) {
                            ordersUpdateDtoForm.setValue(
                                "invoice.razon_social",
                                data.result.razon_social
                            );
                        },
                        onError() {
                            ordersUpdateDtoForm.setValue(
                                "invoice.razon_social",
                                ""
                            );
                            ordersUpdateDtoForm.setError(
                                "invoice.identification_number",
                                {
                                    message: "RUC no valido",
                                }
                            );
                        },
                    });
                } else {
                    ordersUpdateDtoForm.setValue("invoice.razon_social", "");
                    ordersUpdateDtoForm.setError(
                        "invoice.identification_number",
                        {
                            message: "RUC no valido",
                        }
                    );
                }
            }
        }
    }, [invoiceDocumentCode, identificationNumber]);

    useEffect(() => {
        if (order.invoice && !order.note) {
            ordersUpdateDtoForm.unregister("note.kind_credit_notes_code");
            ordersUpdateDtoForm.unregister("note.kind_debit_notes_code");
        }
        if (kindInvoiceNote && !order.note) {
            ordersUpdateDtoForm.setValue("note.kind_credit_notes_code", null);
            ordersUpdateDtoForm.setValue("note.kind_debit_notes_code", null);
        }
    }, [kindInvoiceNote]);
    useEffect(() => {
        if (order.invoice) {
            ordersUpdateDtoForm.resetField("note");
        }
    }, [statusOrder]);

    // guide

    useEffect(() => {
        if (!kindGuidesCode) {
            ordersUpdateDtoForm.unregister("guide.datos_envio");
            ordersUpdateDtoForm.unregister("guide.correlativo");
            ordersUpdateDtoForm.unregister("guide.destinatario");
        }
    }, [kindGuidesCode]);
    useEffect(() => {
        if (destinatarioDocumentCode === "1") {
            if (isValidDni.test(destinatarioIdentificationNumber)) {
                dniMutation.mutate(destinatarioIdentificationNumber, {
                    onSuccess(data) {
                        ordersUpdateDtoForm.setValue(
                            "guide.destinatario.razon_social",
                            data.data.nombre_completo
                        );
                        ordersUpdateDtoForm.clearErrors(
                            "guide.destinatario.razon_social"
                        );
                    },
                    onError() {
                        ordersUpdateDtoForm.setValue(
                            "guide.destinatario.razon_social",
                            ""
                        );
                        ordersUpdateDtoForm.setError(
                            "guide.destinatario.identification_number",
                            {
                                message: "DNI no valido",
                            }
                        );
                    },
                });
            } else {
                ordersUpdateDtoForm.setValue(
                    "guide.destinatario.razon_social",
                    ""
                );
                ordersUpdateDtoForm.setError(
                    "guide.destinatario.identification_number",
                    {
                        message: "DNI no valido",
                    }
                );
            }
        }
        if (destinatarioDocumentCode === "6") {
            if (isValidRUC.test(destinatarioIdentificationNumber)) {
                rucMutation.mutate(destinatarioIdentificationNumber, {
                    onSuccess(data) {
                        ordersUpdateDtoForm.setValue(
                            "guide.destinatario.razon_social",
                            data.result.razon_social
                        );
                        ordersUpdateDtoForm.clearErrors(
                            "guide.destinatario.razon_social"
                        );
                    },
                    onError() {
                        ordersUpdateDtoForm.setValue(
                            "guide.destinatario.razon_social",
                            ""
                        );
                        ordersUpdateDtoForm.setError(
                            "guide.destinatario.identification_number",
                            {
                                message: "RUC no valido",
                            }
                        );
                    },
                });
            } else {
                ordersUpdateDtoForm.setValue(
                    "guide.destinatario.razon_social",
                    ""
                );
                ordersUpdateDtoForm.setError(
                    "guide.destinatario.identification_number",
                    {
                        message: "RUC no valido",
                    }
                );
            }
        }
    }, [destinatarioDocumentCode, destinatarioIdentificationNumber]);

    useEffect(() => {
        if (datoTransportistaDocumentCode === "1") {
            if (isValidDni.test(datoTransportistaIdentificationNumber)) {
                dniMutation.mutate(datoTransportistaIdentificationNumber, {
                    onSuccess(data) {
                        ordersUpdateDtoForm.setValue(
                            "guide.datos_envio.dato_transportista.razon_social",
                            data.data.nombre_completo
                        );
                        ordersUpdateDtoForm.clearErrors(
                            "guide.datos_envio.dato_transportista.razon_social"
                        );
                    },
                    onError() {
                        ordersUpdateDtoForm.setValue(
                            "guide.datos_envio.dato_transportista.razon_social",
                            ""
                        );
                        ordersUpdateDtoForm.setError(
                            "guide.datos_envio.dato_transportista.identification_number",
                            {
                                message: "DNI no valido",
                            }
                        );
                    },
                });
            } else {
                ordersUpdateDtoForm.setValue(
                    "guide.datos_envio.dato_transportista.razon_social",
                    ""
                );
                ordersUpdateDtoForm.setError(
                    "guide.datos_envio.dato_transportista.identification_number",
                    {
                        message: "DNI no valido",
                    }
                );
            }
        }
        if (datoTransportistaDocumentCode === "6") {
            if (isValidRUC.test(datoTransportistaIdentificationNumber)) {
                rucMutation.mutate(datoTransportistaIdentificationNumber, {
                    onSuccess(data) {
                        ordersUpdateDtoForm.setValue(
                            "guide.datos_envio.dato_transportista.razon_social",
                            data.result.razon_social
                        );
                        ordersUpdateDtoForm.clearErrors(
                            "guide.datos_envio.dato_transportista.razon_social"
                        );
                    },
                    onError() {
                        ordersUpdateDtoForm.setValue(
                            "guide.datos_envio.dato_transportista.razon_social",
                            ""
                        );
                        ordersUpdateDtoForm.setError(
                            "guide.datos_envio.dato_transportista.identification_number",
                            {
                                message: "RUC no valido",
                            }
                        );
                    },
                });
            } else {
                ordersUpdateDtoForm.setValue(
                    "guide.datos_envio.dato_transportista.razon_social",
                    ""
                );
                ordersUpdateDtoForm.setError(
                    "guide.datos_envio.dato_transportista.identification_number",
                    {
                        message: "RUC no valido",
                    }
                );
            }
        }
    }, [datoTransportistaDocumentCode, datoTransportistaIdentificationNumber]);

    return (
        <>
            <Form
                className="w-full  relative"
                onSubmit={onOrdersUpdateDtoForm}
                {...ordersUpdateDtoForm}
            >
                <div class="overflow-auto dark:bg-admin-terciary bg-paper-light rounded-md mb-3 w-full dark:border-none ">
                    <TableDetailsOrder order={order} />
                </div>
                <>
                    {order.mesa_id ? (
                        <>
                            <Form.control.select
                                title="Piso"
                                name={"floor_id" as keyof OrdersUpdateDto}
                                placeholder="Seleccionar Piso"
                                array={arrayFloors}
                                options={{
                                    setValueAs: formSelectNumber,
                                }}
                                isLoading={floorsIndexQuery.isLoading || false}
                            />
                            {floorId ? (
                                <Form.control.select
                                    title="Mesa"
                                    name={"mesa_id" as keyof OrdersUpdateDto}
                                    placeholder="Seleccionar Mesa"
                                    array={arrayMesas}
                                    options={{
                                        setValueAs: formSelectNumber,
                                    }}
                                    isLoading={
                                        floorMesasQuery.isLoading || false
                                    }
                                />
                            ) : null}
                        </>
                    ) : null}
                </>
                {/*  */}
                <Form.control.select
                    name={"status_order_id" as keyof OrdersUpdateDto}
                    title="Estado de orden"
                    array={arrayStatusOrders}
                    placeholder="Escoger estado de orden"
                    options={{
                        setValueAs: (value) =>
                            Number(value) > 0 ? Number(value) : null,
                    }}
                    isLoading={statusOrdersIndexQuery.isLoading || false}
                    question={
                        <div class="w-[300px]">
                            <ul class="flex flex-col text-sm font-normal text-start list-disc ml-4 ">
                                <li>
                                    <b>Pendiente:</b> La orden está apunto de
                                    ser confirmado, no fue pagado.
                                </li>
                                <li>
                                    <b>Confirmado:</b> La orden fue confirmado
                                    correctamente.
                                </li>
                                <li>
                                    <b>Preparado:</b> La orden ya está
                                    preparado, listo para enviar.
                                </li>
                                <li>
                                    <b>Enviado:</b> La orden está siendo
                                    enviado.
                                </li>
                                <li>
                                    <b>Pagado Correctamente:</b> La orden fue
                                    pagado correctamente, pero el producto no
                                    fue entregado.
                                </li>
                                <li>
                                    <b>Entregado Correctamente:</b> La orden
                                    entregado.
                                </li>
                                <li>
                                    <b>Hubo un problema:</b> La orden tuvo un
                                    problema. el cliente realizó mal el pago,
                                    tarjeta mal , no tenía saldo, otros
                                    problemas, etc.
                                </li>
                            </ul>
                        </div>
                    }
                />
                <>
                    {statusOrder === STATUSORDER.pagado ? (
                        <Form.control.select
                            name={"pay_method_id" as keyof OrdersUpdateDto}
                            title="Metodo de pago"
                            array={arrayPayMethods}
                            placeholder="Escoger metodo de pago"
                            disabled={!!order.invoice}
                            options={{
                                setValueAs: (value) =>
                                    Number(value) > 0 ? Number(value) : null,
                            }}
                            isLoading={payMethodsIndexQuery.isLoading || false}
                        />
                    ) : null}
                    <>
                        {statusOrder === STATUSORDER.pagado ||
                        statusOrder === STATUSORDER.problema ? (
                            <EmpresaForm
                                kindInvoice={kindInvoice}
                                invoiceSerie={invoiceSerie}
                                invoiceCorrelativo={invoiceCorrelativo}
                                arrayKindInvoices={arrayKindInvoices}
                                statusOrder={statusOrder}
                                order={order}
                                noteSerie={noteSerie}
                                noteCorrelativo={noteCorrelativo}
                                kindInvoiceNote={kindInvoiceNote}
                                payMethod={payMethod}
                            />
                        ) : null}
                        {statusOrder === STATUSORDER.enviando &&
                        storageEmpresa?.dial_code === "51" ? (
                            <>
                                <Form.control.select
                                    name="guide.kind_guide_code"
                                    title="Tipo de guía de Remisión (opcional)"
                                    placeholder="Ninguno"
                                    array={[
                                        {
                                            key: "09",
                                            value: "Guía de Remisión del Remitente",
                                        },
                                    ]}
                                />
                                {kindGuidesCode ? (
                                    <GuideForm
                                        Form={Form}
                                        guideCorrelativo={guideCorrelativo}
                                        guideSerie={guideSerie}
                                        order={order}
                                        dniMutation={dniMutation}
                                        rucMutation={rucMutation}
                                    />
                                ) : null}
                            </>
                        ) : null}
                    </>
                </>
                <>
                    {statusOrder === STATUSORDER.pagado && kindInvoice ? (
                        <InvoiceForm
                            kindInvoice={kindInvoice}
                            dniMutation={dniMutation}
                            rucMutation={rucMutation}
                            order={order}
                            invoiceDocumentCode={invoiceDocumentCode}
                        />
                    ) : null}
                    {statusOrder === STATUSORDER.problema &&
                    order.invoice &&
                    kindInvoiceNote ? (
                        <NoteForm
                            kindInvoice={kindInvoice}
                            kindInvoiceNote={kindInvoiceNote}
                            order={order}
                        />
                    ) : null}
                    <>
                        {statusOrder === STATUSORDER.enviando ||
                        statusOrder === STATUSORDER.pagado ||
                        (statusOrder === STATUSORDER.problema &&
                            order.invoice?.send_sunat) ? (
                            <>
                                <div class="flex flex-col lg:flex-row gap-2 w-full">
                                    <Form.control
                                        name={
                                            "telephone" as keyof OrdersUpdateDto
                                        }
                                        title="Numero de celular"
                                        ico={
                                            <span>
                                                +{storageEmpresa!.dial_code}
                                            </span>
                                        }
                                        placeholder="9XXXXXXXX"
                                        question="Si deseas enviar el comprobante pdf a whatsapp o estado de orden."
                                    />
                                    {telephone &&
                                    isValidPhoneNumber.test(telephone) ? (
                                        <Form.control.toggle
                                            name={
                                                "send_message" as keyof OrdersUpdateDto
                                            }
                                            title={
                                                <span>
                                                    {statusOrder ===
                                                    STATUSORDER.enviando
                                                        ? "Enviar 'enviando el producto' a "
                                                        : statusOrder ===
                                                          STATUSORDER.pagado
                                                        ? "Enviar comprobante"
                                                        : statusOrder ===
                                                          STATUSORDER.problema
                                                        ? "Enviar comprobante"
                                                        : null}{" "}
                                                    <i class="fa-brands fa-whatsapp text-lg" />
                                                </span>
                                            }
                                        />
                                    ) : null}
                                </div>
                            </>
                        ) : null}
                        <>
                            {statusOrder === STATUSORDER.pagado ||
                            statusOrder === STATUSORDER.problema ? (
                                <Form.control.area
                                    title="Descripcion de esta orden"
                                    placeholder=""
                                    name={
                                        "description" as keyof OrdersUpdateDto
                                    }
                                />
                            ) : null}
                        </>
                    </>
                </>
                <div class="flex gap-2 items-center">
                    <Form.button.submit
                        title="Guardar Cambios"
                        ico={null}
                        className="py-2 px-4"
                        disabled={
                            ordersUpdateApiMutation.isLoading ||
                            dniMutation.isLoading ||
                            rucMutation.isLoading ||
                            false
                        }
                        isLoading={ordersUpdateApiMutation.isLoading || false}
                    />
                    {ordersUpdateApiMutation.isLoading ? (
                        <span class="dark:text-white text-sm">
                            Guardando cambios...
                        </span>
                    ) : null}
                </div>
            </Form>
        </>
    );
}
interface InvoiceFormProps {
    kindInvoice: string;
    dniMutation: DniApiMutation;
    invoiceDocumentCode: string | null;
    rucMutation: RucMutation;
    order: OrdersSchemaFromServer;
}
function InvoiceForm({
    kindInvoice,
    dniMutation,
    invoiceDocumentCode,
    rucMutation,
    order,
}: InvoiceFormProps) {
    const empresa = useEmpresastore();

    return (
        <div class="my-6">
            {/*  */}
            {kindInvoice === "01" || kindInvoice === "03" ? (
                <>
                    <span class="dark:text-white my-2 block text-sm">
                        Informacion del cliente
                    </span>
                    <div class="flex gap-1 w-full items-center">
                        <Form.control
                            name={"invoice.identification_number"}
                            title={
                                kindInvoice === "01"
                                    ? "Registro Único de Contribuyentes (RUC)"
                                    : kindInvoice === "03"
                                    ? "Documento de identidad (DNI)"
                                    : ""
                            }
                            placeholder="Digite su documento"
                            disabled={!!order.invoice}
                            type="tel"
                        />
                        {dniMutation.isLoading || rucMutation.isLoading ? (
                            <div class="mt-2">
                                <LoaderSubmit />
                            </div>
                        ) : null}
                    </div>
                    <Form.control
                        title={
                            invoiceDocumentCode === "1"
                                ? "Nombre"
                                : "Razon Social"
                        }
                        disabled={!!order.invoice}
                        name={"invoice.razon_social"}
                        placeholder={
                            invoiceDocumentCode === "1"
                                ? "Digite su nombre"
                                : "Digite su razon social"
                        }
                    />
                    <div class="flex w-full gap-2 items-center">
                        {!order.invoice?.send_sunat &&
                        empresa.state!.certificado &&
                        restarDays(
                            NOW().toDate(),
                            TimePeru(order.createdAt)
                                .add(enviroments.VITE_DIASFACTURASBOLETA, "day")
                                .diff(NOW())
                        ) < 0 ? (
                            <>
                                {" "}
                                <Form.control.toggle
                                    name={
                                        "invoice.send_sunat" as keyof OrdersUpdateDto
                                    }
                                    title="Enviar Sunat"
                                    disabled={
                                        order.invoice?.send_sunat || false
                                    }
                                />
                            </>
                        ) : null}
                        {restarDays(
                            NOW().toDate(),
                            TimePeru(order.createdAt)
                                .add(enviroments.VITE_DIASFACTURASBOLETA, "day")
                                .diff(NOW())
                        ) < 0 && !order.invoice?.send_sunat ? (
                            <span class="dark:text-white text-xs font-normal">
                                Tienes{" "}
                                <b>
                                    {useTemporizador({
                                        initialTime: TimePeru(order.createdAt)
                                            .add(
                                                enviroments.VITE_DIASFACTURASBOLETA,
                                                "day"
                                            )
                                            .diff(NOW()),
                                    })}
                                </b>{" "}
                                para emitir esta{" "}
                                {kindInvoice === "01"
                                    ? "Factura"
                                    : kindInvoice === "03"
                                    ? "Boleta"
                                    : null}
                            </span>
                        ) : null}

                        {order.invoice?.send_sunat ? (
                            <span class="dark:text-white my-3">
                                <i class="fa-solid fa-check mr-2" /> Emitido a
                                sunat correctamente
                            </span>
                        ) : null}
                    </div>
                </>
            ) : null}
        </div>
    );
}
interface NoteFormProps {
    order: OrdersSchemaFromServer;
    kindInvoiceNote: string;
    kindInvoice: string;
}
function NoteForm({ order, kindInvoiceNote, kindInvoice }: NoteFormProps) {
    const kindCreditNotesIndexQuery = kindCreditNotesIndexApi();
    const kindDebitNotesIndexQuery = kindDebitNotesIndexApi();
    const kindCreditNotes = useMemo(
        () =>
            kindCreditNotesIndexQuery.isSuccess &&
            kindCreditNotesIndexQuery.data
                ? kindCreditNotesIndexQuery.data.data.map((document) => ({
                      key: document.code,
                      value: document.name,
                  }))
                : [],
        [kindCreditNotesIndexQuery]
    );
    const kindDebitNotes = useMemo(
        () =>
            kindDebitNotesIndexQuery.isSuccess && kindDebitNotesIndexQuery.data
                ? kindDebitNotesIndexQuery.data.data.map((document) => ({
                      key: document.code,
                      value: document.name,
                  }))
                : [],
        [kindDebitNotesIndexQuery]
    );

    return (
        <>
            {kindInvoice ? (
                <div class="my-6">
                    {/*  */}
                    {kindInvoice === "01" || kindInvoice === "03" ? (
                        <>
                            <span class="dark:text-white my-2 block text-sm">
                                Informacion del cliente
                            </span>
                            <div class="flex gap-1 w-full items-center">
                                <Form.control
                                    name={"note.identification_number"}
                                    title={
                                        kindInvoice === "01"
                                            ? "Registro Único de Contribuyentes (RUC)"
                                            : kindInvoice === "03"
                                            ? "Documento de identidad (DNI)"
                                            : ""
                                    }
                                    placeholder="Digite su documento"
                                    type="tel"
                                    disabled={!!order}
                                />
                            </div>
                            <Form.control
                                name={"note.razon_social"}
                                title="Razón Social"
                                placeholder="XXXXXX"
                                disabled={!!order}
                            />
                            {kindInvoiceNote === "07" ? (
                                <Form.control.select
                                    title="Tipo de nota de credito"
                                    name={
                                        "note.kind_credit_notes_code" as keyof OrdersUpdateDto
                                    }
                                    placeholder="Seleccione un tipo de nota de credito"
                                    array={kindCreditNotes}
                                    isLoading={
                                        kindCreditNotesIndexQuery.isLoading ||
                                        false
                                    }
                                    disabled={!!order.note}
                                />
                            ) : null}
                            {kindInvoiceNote === "08" ? (
                                <Form.control.select
                                    title="Tipo de nota de debito"
                                    name={"note.kind_debit_notes_code"}
                                    placeholder="Seleccione un tipo de nota de debito"
                                    isLoading={
                                        kindDebitNotesIndexQuery.isLoading ||
                                        false
                                    }
                                    array={kindDebitNotes}
                                    disabled={!!order.note}
                                />
                            ) : null}
                            <Form.control.toggle
                                name={
                                    "note.send_sunat" as keyof OrdersUpdateDto
                                }
                                title="Enviar Sunat"
                                disabled={order.note?.send_sunat || false}
                            />
                        </>
                    ) : null}
                </div>
            ) : null}
        </>
    );
}

interface empresaFormProps {
    kindInvoice: string;
    invoiceSerie: string;
    invoiceCorrelativo: string;
    arrayKindInvoices: {
        key: string;
        value: string;
    }[];
    statusOrder: number;
    order: OrdersSchemaFromServer;
    noteSerie: string;
    noteCorrelativo: string;
    kindInvoiceNote: string;
    payMethod: number;
}
function EmpresaForm({
    kindInvoice,
    invoiceSerie,
    invoiceCorrelativo,
    arrayKindInvoices,
    order,
    statusOrder,
    noteCorrelativo,
    noteSerie,
    kindInvoiceNote,
    payMethod,
}: empresaFormProps) {
    const empresa = useEmpresastore();
    return (
        <>
            {order.igv &&
            empresa.state?.dial_code === "51" &&
            empresa.state?.enabled_igv ? (
                <>
                    {!order.invoice ? (
                        <>
                            {!empresa.state?.certificado ||
                            !subFacturacion() ? (
                                <AlertDanger>
                                    <span>
                                        - No podras emitir tus
                                        comprobantes(factura,boleta,nota)
                                        correctamente si no tienes tu
                                        certificado digital o cuenta de sunat
                                        correcto.{" "}
                                        <a
                                            href="/admin/facturacion"
                                            class="text-primary hover:underline"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Ver cuenta sunat.
                                        </a>
                                        <br />- Solo recibos disponible si no se
                                        activa IGV .{" "}
                                        <a
                                            href="/admin/plus"
                                            class="text-primary hover:underline"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Ver suscripción.
                                        </a>
                                    </span>
                                </AlertDanger>
                            ) : null}
                            {!empresa.state?.company.production ? (
                                <AlertDanger>
                                    <div class="flex flex-col">
                                        <span>
                                            Estás en "modo de prueba" en el
                                            sistema de facturación{" "}
                                            <a
                                                href="/admin/facturacion"
                                                class="font-semibold text-primary underline ml-2"
                                            >
                                                Mas información
                                            </a>
                                        </span>
                                        - Activar para emitir a los servidores
                                        de sunat
                                    </div>
                                </AlertDanger>
                            ) : null}
                        </>
                    ) : null}
                </>
            ) : null}

            {payMethod ? (
                <>
                    {" "}
                    {statusOrder === STATUSORDER.pagado ? (
                        <Form.control.select
                            name={
                                "invoice.kind_invoice_code" as keyof OrdersUpdateDto
                            }
                            title="Tipo de comprobante"
                            array={arrayKindInvoices.filter((invoice) =>
                                empresa.state?.certificado &&
                                empresa.state?.enabled_igv
                                    ? invoice.key === "00" ||
                                      invoice.key === "01" ||
                                      invoice.key === "03"
                                    : invoice.key === "00"
                            )}
                            disabled={!!order.invoice}
                            placeholder="Escoger comprobante de pago"
                        />
                    ) : null}
                    {statusOrder === STATUSORDER.problema &&
                    order.invoice &&
                    order.invoice.send_sunat &&
                    empresa.state?.certificado ? (
                        <Form.control.select
                            name={
                                "note.kind_invoice_code" as keyof OrdersUpdateDto
                            }
                            title="Tipo de comprobante"
                            array={arrayKindInvoices.filter(
                                (invoice) =>
                                    invoice.key === "07" || invoice.key === "08"
                            )}
                            disabled={!!order.note}
                            placeholder="Escoger comprobante de pago"
                        />
                    ) : null}
                </>
            ) : null}
            {(!order.invoice &&
                kindInvoice &&
                statusOrder === STATUSORDER.pagado) ||
            (order.invoice &&
                kindInvoice &&
                statusOrder === STATUSORDER.pagado) ||
            (order.invoice && kindInvoiceNote) ? (
                <div class="flex gap-2  static">
                    <div class="flex justify-between w-full gap-2">
                        <div class="flex gap-2 items-center">
                            <div class=" absolute opacity-35 md:relative md:flex min-w-[100px] [&>span]:text-3xl  justify-center items-center">
                                <LogoImage width="80" height="80" />
                            </div>
                            <div class=" flex-col hidden md:flex">
                                <span class="dark:text-white uppercase">
                                    {empresa.state!.name_empresa}
                                </span>
                                <span class="dark:text-white text-sm font-normal">
                                    {empresa.state!.address.direccion}
                                </span>
                            </div>
                        </div>
                        <div class="flex flex-col justify-center items-center border border-dashed p-2 w-full md:w-auto min-w-[200px] bg-paper-light dark:bg-admin-terciary">
                            {empresa.state?.company &&
                            storageEmpresa?.dial_code === "51" ? (
                                <span class="text-sm font-normal dark:text-white">
                                    R.U.C {empresa.state!.company.ruc}
                                </span>
                            ) : null}

                            <p class="text-black dark:text-white text-center">
                                <>
                                    {statusOrder === STATUSORDER.pagado ? (
                                        <>
                                            {" "}
                                            {kindInvoice === "00"
                                                ? "RECIBO"
                                                : kindInvoice === "03"
                                                ? "BOLETA"
                                                : kindInvoice === "01"
                                                ? "FACTURA ELECTRÓNICA"
                                                : null}
                                        </>
                                    ) : (
                                        <>
                                            {kindInvoiceNote === "07"
                                                ? "NOTA DE CREDITO"
                                                : "NOTA DE DEBITO"}
                                        </>
                                    )}
                                </>
                            </p>
                            <span class="font-normal dark:text-white">
                                {statusOrder === STATUSORDER.pagado ? (
                                    <>
                                        {invoiceSerie}-{invoiceCorrelativo}
                                    </>
                                ) : null}
                                {statusOrder === STATUSORDER.problema ? (
                                    <>
                                        {noteSerie}-{noteCorrelativo}
                                    </>
                                ) : null}
                            </span>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}

interface empresaGuideFormProps {
    guideSerie: string;
    guideCorrelativo: string;
    order: OrdersSchemaFromServer;
    Form: typeof Form<OrdersUpdateDto>;
    dniMutation: DniApiMutation;
    rucMutation: RucMutation;
}
function GuideForm({
    guideCorrelativo,
    guideSerie,
    order,
    Form,
    dniMutation,
    rucMutation,
}: empresaGuideFormProps) {
    const documentsIndexQuery = documentsIndexApi();
    const empresa = useEmpresastore();
    const districtsIndexQuery = citiesIndexApi();

    const districtsSelect = useMemo(() => {
        if (districtsIndexQuery.isSuccess && districtsIndexQuery.data) {
            return districtsIndexQuery.data.data.map((value) => ({
                key: value.code,
                value: `${value.region.name} -  ${value.name}`,
            }));
        }
        return [];
    }, [districtsIndexQuery.data, districtsIndexQuery.isSuccess]);
    const arrayDocumentsIndex = useMemo(
        () =>
            documentsIndexQuery.isSuccess && documentsIndexQuery.data
                ? documentsIndexQuery.data.data.map((kind) => ({
                      key: kind.code,
                      value: kind.name,
                  }))
                : [],
        [documentsIndexQuery]
    );

    return (
        <div class="flex flex-col gap-4">
            <div class="flex my-6  justify-between w-full gap-2">
                <div class="flex gap-2 items-center">
                    <div class=" absolute opacity-35 md:relative md:flex  [&>span]:text-3xl  justify-center items-center">
                        <LogoImage width="80" height="80" />
                    </div>
                    <div class=" flex-col hidden md:flex">
                        <span class="dark:text-white uppercase">
                            {empresa.state!.name_empresa}
                        </span>
                        <span class="dark:text-white text-sm font-normal">
                            {empresa.state!.address.direccion}
                        </span>
                    </div>
                </div>
                <div class="flex flex-col justify-center items-center border border-dashed p-2 w-full md:w-auto min-w-[200px] bg-paper-light dark:bg-admin-terciary">
                    <span class="text-sm font-normal dark:text-white">
                        R.U.C {empresa.state!.company?.ruc}
                    </span>
                    <p class="text-black dark:text-white text-center">
                        Guía de Remisión
                    </p>
                    <span class="font-normal dark:text-white">
                        {guideSerie}-{guideCorrelativo}
                    </span>
                </div>
            </div>
            <div>
                <span class="text-xs dark:text-white mb-2">
                    <b class="bg-primary text-white mr-1 px-2.5 py-1 rounded-full">
                        1
                    </b>{" "}
                    Destinario
                </span>
                <div class="flex flex-col md:flex-row gap-2 items-center w-full">
                    <Form.control.select
                        name={
                            "guide.destinatario.document_code" as keyof OrdersUpdateDto
                        }
                        placeholder="Tipo de documento de identidad"
                        title="documento de identidad"
                        array={arrayDocumentsIndex}
                    />
                    <Form.control
                        name={
                            "guide.destinatario.identification_number" as keyof OrdersUpdateDto
                        }
                        placeholder="XXXXXXXX"
                        title="Documento de identidad"
                    />
                    <div class="w-full flex   items-center gap-2">
                        <Form.control
                            name={
                                "guide.destinatario.razon_social" as keyof OrdersUpdateDto
                            }
                            placeholder="Razon Social XXXX"
                            title="Razon Social"
                        />
                        {dniMutation.isLoading || rucMutation.isLoading ? (
                            <div class="mt-2">
                                <LoaderSubmit />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            <div>
                <span class="text-xs dark:text-white mb-2">
                    <b class="bg-primary text-white mr-1 px-2.5 py-1 rounded-full">
                        2
                    </b>{" "}
                    Datos de envio
                </span>
                <div class="flex flex-col md:flex-row gap-2 items-center w-full">
                    <Form.control.select
                        name={
                            "guide.datos_envio.motivo_traslado" as keyof OrdersUpdateDto
                        }
                        placeholder="Escoger el motivo de traslado"
                        title="Motivo del traslado"
                        array={MOTIVOTRASLADO}
                    />
                    <Form.control.select
                        name="guide.datos_envio.modalidad_traslado"
                        placeholder="Escoger la modalidad de traslado"
                        title="Modalidad de traslado"
                        array={MODALIDADTRASLADO}
                    />
                    <Form.control
                        type="date"
                        name="guide.datos_envio.fecha_initial_traslado"
                        placeholder="Fecha"
                        title="Fecha de envio"
                    />
                </div>
                <div class="flex flex-col md:flex-row gap-2 items-center w-full">
                    <Form.control.select
                        name="guide.datos_envio.unidad"
                        array={UNIDADMEDIDAD}
                        placeholder="Escoger unidad de medida"
                        title="Unidad"
                    />
                    <Form.control
                        type="number"
                        name="guide.datos_envio.peso_total"
                        placeholder="0"
                        title="Peso total"
                        options={{ valueAsNumber: true }}
                    />
                </div>
            </div>
            <div>
                <span class="text-xs dark:text-white mb-2">
                    <b class="bg-primary text-white mr-1 px-2.5 py-1 rounded-full">
                        3
                    </b>{" "}
                    Datos de transportista
                </span>
                <div class="flex flex-col md:flex-row gap-2 items-center w-full">
                    <Form.control.select
                        name="guide.datos_envio.dato_transportista.document_code"
                        placeholder="Tipo de documento de identidad"
                        title="documento de identidad"
                        array={[{ key: "6", value: "RUC" }]}
                        isLoading={documentsIndexQuery.isLoading || false}
                    />
                    <Form.control
                        name="guide.datos_envio.dato_transportista.identification_number"
                        placeholder="XXXXXXXX"
                        title="Documento de identidad"
                    />
                    <div class="w-full flex items-center gap-2">
                        <Form.control
                            name="guide.datos_envio.dato_transportista.razon_social"
                            placeholder="Razon Social XXXX"
                            title="Razon Social"
                        />
                        {dniMutation.isLoading || rucMutation.isLoading ? (
                            <div class="mt-2">
                                <LoaderSubmit />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            <div>
                <span class="text-xs dark:text-white mb-2">
                    <b class="bg-primary text-white mr-1 px-2.5 py-1 rounded-full">
                        4
                    </b>{" "}
                    Punto de partida
                </span>
                <div class="flex flex-col md:flex-row gap-2 items-center w-full">
                    <Form.control.selectInput
                        name="guide.datos_envio.punta_partida.ubigeo"
                        placeholder="Digite su distrito"
                        title="Ubigeo"
                        array={districtsSelect}
                        isLoading={districtsIndexQuery.isLoading || false}
                    />
                    <Form.control
                        name="guide.datos_envio.punta_partida.address"
                        placeholder="XXXXXXXXXXX"
                        title="Dirección"
                    />
                </div>
            </div>
            <Form.control.toggle
                name={"guide.send_sunat"}
                title="Enviar Sunat"
                disabled={order.guide?.send_sunat || false}
            />
            <div>
                <span class="text-xs dark:text-white mb-2">
                    <b class="bg-primary text-white mr-1 px-2.5 py-1 rounded-full">
                        5
                    </b>{" "}
                    Punto de Llegada
                </span>
                <div class="flex flex-col md:flex-row gap-2 items-center w-full">
                    <Form.control.selectInput
                        name="guide.datos_envio.punta_llegada.ubigeo"
                        placeholder="Digite su distrito"
                        title="Ubigeo"
                        isLoading={districtsIndexQuery.isLoading || false}
                        array={districtsSelect}
                    />
                    <Form.control
                        name="guide.datos_envio.punta_llegada.address"
                        placeholder="XXXXXXXXX"
                        title="Dirección"
                    />
                </div>
            </div>
        </div>
    );
}
export default OrderFormUpdate;
