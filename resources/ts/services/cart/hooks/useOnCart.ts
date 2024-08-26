import useAuthStore from "@/auth/stores/auth.store";
import { kindInvoiceIndexApi } from "@/orders/apis/kind_invoice.index.api";
import { dniApi } from "@/orders/apis/others/dni.api";
import { rucApi } from "@/orders/apis/others/ruc.api";
import {
    ordersCartStoreDto,
    type OrdersCartStoreDto,
} from "@/orders/dtos/orders-cart.dto";
import { useEffect, useMemo } from "preact/hooks";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import useCartStore from "../stores/cart.store";
import { PAYMETHOD, STATUSORDER, isValidDni, isValidRUC } from "@/orders/libs";
import useInformationstore from "@/information/stores/information.store";
import { printProductVariant } from "@/products/libs/helpers";
import { districtsIndexApi } from "@/ubigeo/apis/districts.api.index";
import { igv } from "../libs/helpers";

function useOnCart() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const information = useInformationstore();
    const kindInvoiceIndexQuery = kindInvoiceIndexApi();
    const dniMutation = dniApi();
    const rucMUtation = rucApi();

    const ordersCartStoreDtoForm = useForm<OrdersCartStoreDto>({
        resolver: valibotVigilio(ordersCartStoreDto),
        defaultValues: {
            pay_method_id: PAYMETHOD.efectivo, // efectivo
            status_order_id: STATUSORDER.pendiente, //pedido confirmado
            address: authStore.state?.address as string,
            telephone: authStore.state?.telephone as string,
            description: null,
            invoice: { send_sunat: false },
            seller_id: null,
            user_id: authStore.state ? authStore.state.id : null,
            isDelivery: true,
            transferencia_image: null,
            total: cartStore.methods.getTotal(),
            map_marker: information.state!.enable_map_marker
                ? information.state!.map_marker
                : null,
            district_id: null,
        },
        mode: "all",
    });

    const kindInvoice = ordersCartStoreDtoForm.watch(
        "invoice.kind_invoice_code"
    );
    const district_id = ordersCartStoreDtoForm.watch("district_id");
    const documentCode = ordersCartStoreDtoForm.watch("invoice.document_code");
    const identificationNumber = ordersCartStoreDtoForm.watch(
        "invoice.identification_number"
    );
    const districtsIndexQuery = districtsIndexApi();

    const districtsSelect = useMemo(() => {
        if (districtsIndexQuery.isSuccess && districtsIndexQuery.data) {
            return districtsIndexQuery.data.data.map((value) => ({
                key: value.ubigeo,
                value: `${value.name} - ${value.province.name} - ${value.province.department.name}`,
            }));
        }
        return [];
    }, [districtsIndexQuery.data, districtsIndexQuery.isSuccess]);
    const arrayKindInvoices = useMemo(
        () =>
            kindInvoiceIndexQuery.isSuccess && kindInvoiceIndexQuery.data
                ? kindInvoiceIndexQuery.data.data
                      .filter(
                          (kind) =>
                              information.state?.enabled_igv
                                  ? kind.code === "01" || kind.code === "03"
                                  : kind.code === "00" // solo 00- ticket  01- factura , 03 - boleta
                      )
                      .map((kind) => ({
                          key: kind.code,
                          value: kind.name,
                      }))
                : [],
        [kindInvoiceIndexQuery]
    );

    useEffect(() => {
        if (kindInvoice) {
            ordersCartStoreDtoForm.setValue(
                "invoice.identification_number",
                null
            );
            ordersCartStoreDtoForm.setValue("invoice.document_code", null);
            ordersCartStoreDtoForm.setValue("invoice.razon_social", null);
            if (kindInvoice === "00") {
                /* @ts-ignore */
                ordersCartStoreDtoForm.setValue("invoice", {
                    razon_social: null,
                    document_code: null,
                    send_sunat: false,
                    identification_number: null,
                    kind_invoice_code: "00",
                });
            }
            if (kindInvoice === "01") {
                ordersCartStoreDtoForm.setValue("invoice.document_code", "6"); //6 ruc
            }
            if (kindInvoice === "03") {
                ordersCartStoreDtoForm.setValue("invoice.document_code", "1"); //1 dni
            }
        }
    }, [kindInvoice]);

    useEffect(() => {
        if (identificationNumber) {
            ordersCartStoreDtoForm.clearErrors("invoice.razon_social");

            if (documentCode === "1") {
                if (isValidDni.test(identificationNumber)) {
                    dniMutation.mutate(identificationNumber, {
                        onSuccess(data) {
                            ordersCartStoreDtoForm.setValue(
                                "invoice.razon_social",
                                data.data.nombre_completo
                            );
                        },
                        onError() {
                            ordersCartStoreDtoForm.setValue(
                                "invoice.razon_social",
                                ""
                            );
                            ordersCartStoreDtoForm.setError(
                                "invoice.identification_number",
                                {
                                    message: "DNI no valido",
                                }
                            );
                        },
                    });
                } else {
                    ordersCartStoreDtoForm.setValue("invoice.razon_social", "");
                    ordersCartStoreDtoForm.setError(
                        "invoice.identification_number",
                        {
                            message: "DNI no valido",
                        }
                    );
                }
            }
            if (documentCode === "6") {
                if (isValidRUC.test(identificationNumber)) {
                    rucMUtation.mutate(identificationNumber, {
                        onSuccess(data) {
                            ordersCartStoreDtoForm.setValue(
                                "invoice.razon_social",
                                data.result.razon_social
                            );
                        },
                        onError() {
                            ordersCartStoreDtoForm.setValue(
                                "invoice.razon_social",
                                ""
                            );
                            ordersCartStoreDtoForm.setError(
                                "invoice.identification_number",
                                {
                                    message: "RUC no valido",
                                }
                            );
                        },
                    });
                } else {
                    ordersCartStoreDtoForm.setValue("invoice.razon_social", "");
                    ordersCartStoreDtoForm.setError(
                        "invoice.identification_number",
                        {
                            message: "RUC no valido",
                        }
                    );
                }
            }
        }
    }, [documentCode, identificationNumber]);

    useEffect(() => {
        if (cartStore.state.cart) {
            ordersCartStoreDtoForm.setValue(
                "details_orders",
                cartStore.state.cart!.map((cart) => ({
                    price: cart.subtotal,
                    product_id: cart.id,
                    quantity: cart.quantity,
                    coupon: cart.coupon,
                    variante: printProductVariant(cart, cart.variant)
                        .map((variant) => {
                            return variant?.features.map(
                                (feature) => feature?.description
                            );
                        })
                        .join(" - "),
                    variant_id: cart.variant.id,
                }))
            );
        }
    }, [cartStore.state.cart, district_id]);
    useEffect(() => {
        if (district_id) {
            ordersCartStoreDtoForm.setValue(
                "total",
                cartStore.methods.getTotal() +
                    igv(distrito!.province.department.priceShipping)
            );
        } else {
            ordersCartStoreDtoForm.setValue(
                "total",
                cartStore.methods.getTotal()
            );
        }
    }, [district_id, cartStore.methods.getTotal()]);

    // GET RESULT district when user choose district
    const distrito = useMemo(
        () =>
            districtsIndexQuery.data?.data.find(
                (district) => district.ubigeo === district_id
            ),
        [district_id, districtsIndexQuery]
    );

    return {
        ordersCartStoreDtoForm,
        arrayKindInvoices,
        documentCode,
        dniMutation,
        rucMUtation,
        districtsSelect,
        districtsIndexQuery,
        distrito,
    };
}

export default useOnCart;
