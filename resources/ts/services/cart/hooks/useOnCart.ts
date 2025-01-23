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
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import { printProductVariant, productOBJ } from "@/products/libs/helpers";
import { igv } from "../libs/helpers";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import {
    RegionsShowAPI,
    regionsShowMutationApi,
} from "@/ubigeo/apis/regions.show.api";
import { useSignal } from "@preact/signals";
import { citiesIndexApi } from "@/ubigeo/apis/citites.api.index";
import { DIALCODE } from "@/empresas/libs/helpers";

function useOnCart() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const empresa = useEmpresastore();
    const kindInvoiceIndexQuery = kindInvoiceIndexApi();
    const dniMutation = dniApi();
    const rucMUtation = rucApi();
    const regionsShowQuery = regionsShowMutationApi();

    const city = useSignal<RegionsShowAPI["data"] | null>(null);
    const ordersCartStoreDtoForm = useForm<OrdersCartStoreDto>({
        resolver: valibotVigilio(ordersCartStoreDto),
        defaultValues: {
            pay_method_id: PAYMETHOD.efectivo, // efectivo
            status_order_id: STATUSORDER.pendiente, //pedido confirmado
            address: authStore.state?.address as string,
            telephone: authStore.state?.telephone as string,
            description: null,
            invoice: {
                send_sunat: false,
                kind_invoice_code:
                    storageEmpresa?.dial_code === DIALCODE.peru
                        ? undefined
                        : "00",
                identification_number: authStore.state?.identification_number
                    ? authStore.state?.identification_number
                    : null,
            },
            user_id: authStore.state ? authStore.state.id : null,
            isDelivery: true,
            transferencia_image: null,
            total: cartStore.methods.getTotal(),
            map_marker: empresa.state!.enable_map_marker
                ? empresa.state!.map_marker
                : null,
            city_id: authStore.state?.city_id ? authStore.state!.city_id : null,
            mesa_id: null,
            floor_id: null,
            fullName: authStore.state?.name ? authStore.state!.name : undefined,
            email: authStore.state?.email ? authStore.state!.email : undefined,
            reference: authStore.state?.reference
                ? authStore.state!.reference
                : undefined,
            isService: false,
            seller_id: null,
            password: null,
            repeat_password: null,
            address_id: storageEmpresa!.addresses[0].id as number,
        },
        mode: "all",
    });
    const arrayAdress = storageEmpresa?.addresses
        .filter((address) => address.enabled)
        .map((address) => ({
            key: String(address.id),
            value: `${address.direccion} - ${address.city.name}`,
        }));
    const kindInvoice = ordersCartStoreDtoForm.watch(
        "invoice.kind_invoice_code"
    );
    const city_id = ordersCartStoreDtoForm.watch("city_id");
    const documentCode = ordersCartStoreDtoForm.watch("invoice.document_code");
    const identificationNumber = ordersCartStoreDtoForm.watch(
        "invoice.identification_number"
    );
    const citiesIndexQuery = citiesIndexApi();

    const citiesSelect = useMemo(() => {
        if (citiesIndexQuery.isSuccess && citiesIndexQuery.data) {
            return citiesIndexQuery.data.data.map((value) => ({
                key: value.id,
                value: `${value.region.name} - ${value.name}`,
            }));
        }
        return [];
    }, [citiesIndexQuery.data, citiesIndexQuery.isSuccess]);

    const arrayKindInvoices = useMemo(
        () =>
            kindInvoiceIndexQuery.isSuccess && kindInvoiceIndexQuery.data
                ? kindInvoiceIndexQuery.data.data
                      .filter((kind) =>
                          empresa.state?.certificado &&
                          empresa.state?.enabled_igv
                              ? kind.code === "01" || kind.code === "03"
                              : kind.code === "00"
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
        if (
            identificationNumber &&
            storageEmpresa?.dial_code === DIALCODE.peru
        ) {
            ordersCartStoreDtoForm.clearErrors("invoice.razon_social");

            if (documentCode === "1") {
                if (isValidDni.test(identificationNumber)) {
                    dniMutation.mutate(identificationNumber, {
                        onSuccess(data) {
                            ordersCartStoreDtoForm.setValue(
                                "invoice.razon_social",
                                data.data.nombre_completo
                            );
                            ordersCartStoreDtoForm.setValue(
                                "fullName",
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
                    variante: cart.variant
                        ? printProductVariant(
                              cart as ProductsNormalSchemaFromServer,
                              cart.variant
                          )
                              .map((variant) => {
                                  // si es color que muestre el color, sino solo el valor
                                  return variant?.features.map(
                                      (feature) => feature?.description
                                  );
                              })
                              .join(" - ")
                        : null,
                    ...productOBJ(cart.id),
                    variant_id: cart.variant ? cart.variant.id : null,
                    product_servicio_id: null,
                }))
            );
        }
    }, [cartStore.state.cart, city_id]);
    useEffect(() => {
        if (city.value) {
            ordersCartStoreDtoForm.setValue(
                "total",
                cartStore.methods.getTotal() + igv(city.value?.priceShipping)
            );
        } else {
            ordersCartStoreDtoForm.setValue(
                "total",
                cartStore.methods.getTotal()
            );
        }
    }, [city.value, cartStore.methods.getTotal()]);

    // GET RESULT district when user choose district
    async function citySelect(city_id: number) {
        const region = citiesIndexQuery.data?.data.find(
            (ct) => ct.id === city_id
        );
        if (region) {
            const result = await regionsShowQuery.mutateAsync(region.region_id);
            city.value = result?.data as RegionsShowAPI["data"];
        }
    }

    useEffect(() => {
        if (city_id) {
            citySelect(city_id);
        }
    }, [city_id]);

    return {
        ordersCartStoreDtoForm,
        arrayKindInvoices,
        documentCode,
        dniMutation,
        rucMUtation,
        citiesSelect,
        citiesIndexQuery,
        city,
        arrayAdress,
    };
}

export default useOnCart;
