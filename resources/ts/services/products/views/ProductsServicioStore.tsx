import Form from "~/components/form";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useMemo } from "preact/hooks";
import { formatMoney, subtotal as subtotalCart } from "@/cart/libs/helpers";
import { valibotVigilio } from "~/libs/valibot";
import { getPeriodDescription, handlerError } from "~/libs/helpers";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { imageBackgroundIA } from "~/config/settings";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import useAuthstore from "@/auth/stores/auth.store";
import { formSelectNumber } from "~/components/form/WebFormSelect";
import AdminHr from "~/components/AdminHr";
import {
    productsServicioStoreDto,
    ProductsServicioStoreDto,
} from "../dtos/products_servicio.dto";
import { productsServicioStoreApi } from "../apis/products/products_servicio.store.api";
import { reactComponent } from "~/libs/preact";
import { categoriesIndexApi } from "../apis/categories/categories.index.api";
import CategoriesStore from "./CategoriesStore";
import { aiProductApi } from "@/bot/apis/ai.product.api";
import { useSignal } from "@preact/signals";
import { getFilesEdit } from "~/libs/upload";
import Helper from "~/components/Helper";
import LoaderSubmit from "~/components/LoaderSubmit";
import SettingsProduct from "@/admin/components/SettingsProduct";

interface ProductsServicioStoreProps {
    refetch: (clean?: boolean | undefined) => Promise<void>;
    onClose: () => void;
}
function ProductsServicioStore({
    refetch,
    onClose,
}: ProductsServicioStoreProps) {
    const { guards } = useAuthstore();
    if (!guards.permissionAdminGuard()) {
        window.history.back();
        return null;
    }
    const empresa = useEmpresastore();
    const productsServicioStoreDtoForm = useForm<ProductsServicioStoreDto>({
        resolver: valibotVigilio(productsServicioStoreDto),
        mode: "all",
        defaultValues: {
            characteristics: [],
            description: null,
            enabled: true,
            empresa_id: empresa.state!.id,
            url: null,
            days: [],
        },
    });
    const isImageLoading = useSignal(false);

    const productsServicioStoreMutation = productsServicioStoreApi();
    const categoriesIndexQuery = categoriesIndexApi(true);

    const categoriesSelect = useMemo(() => {
        if (categoriesIndexQuery.isSuccess && categoriesIndexQuery.data) {
            return categoriesIndexQuery.data.data.map((value) => ({
                key: value.id,
                value: value.name,
            }));
        }
        return [];
    }, [categoriesIndexQuery.data, categoriesIndexQuery.isSuccess]);

    const name = productsServicioStoreDtoForm.watch("name");
    const discount = productsServicioStoreDtoForm.watch("discount");
    const price = productsServicioStoreDtoForm.watch("price");

    useEffect(() => {
        if (name) {
            productsServicioStoreDtoForm.setValue(
                "slug",
                transformSlug(name || ""),
                {
                    shouldValidate: true,
                }
            );
        }
    }, [name]);

    const subtotal = useMemo(
        () => subtotalCart(price, discount),
        [discount, price]
    );
    const aiProductQuery = aiProductApi();
    function onSearchProduct() {
        aiProductQuery.mutate(name, {
            async onSuccess(data) {
                isImageLoading.value = true;
                const images = await getFilesEdit(
                    data.data.images.map((img) => ({
                        dimension: 500,
                        file: img.image,
                    })),
                    null
                );
                productsServicioStoreDtoForm.setValue(
                    "characteristics",
                    data.data.caracterisiticas.map((val) => ({
                        name: val.key,
                        value: val.value,
                    }))
                );
                productsServicioStoreDtoForm.setValue(
                    "description",
                    data.data.description
                );

                if (images.length) {
                    productsServicioStoreDtoForm.setValue("images", images);
                }
                isImageLoading.value = false;
                sweetAlert({
                    icon: "success",
                    title: "Se agregó información de producto",
                });
            },
            onError() {
                sweetAlert({
                    icon: "danger",
                    title: "Error al obtener información de producto",
                });
            },
        });
    }
    const { fields, append, remove } = useFieldArray({
        control: productsServicioStoreDtoForm.control,
        name: "characteristics",
    });
    const error = useSignal<string | null>(null);
    const dayjsArry = useFieldArray({
        control: productsServicioStoreDtoForm.control,
        name: "days",
    });
    function onProductStore(body: ProductsServicioStoreDto) {
        if (!body.showHorario && !body.days.length) {
            error.value =
                "Debes agregar un suscripción o habilitar 'mostrar horario' depende del servicio.";
            return;
        }
        const existHorario = body.days.some(
            (item, index) =>
                body.days.findIndex((i) => i.days === item.days) !== index
        );
        const existHorario2 = body.days.some(
            (item, index) =>
                body.days.findIndex((i) => i.name === item.name) !== index
        );
        if (existHorario) {
            error.value = "Se repitieron los dias en el campo suscripción";
            return;
        }
        if (existHorario2) {
            error.value = "Se repitieron los nombres en el campo suscripción";
            return;
        }

        error.value = null;

        sweetModal({
            icon: "info",
            title: "¿Estas seguro de agregar este servicio?",
            customIcon:
                "<i class='fas fa-phone-laptop text-3xl dark:text-white' /> </i>",
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                productsServicioStoreMutation.mutate(body, {
                    onSuccess(data) {
                        productsServicioStoreDtoForm.reset();
                        sweetAlert({
                            icon: "success",
                            title: `<p class="text-center">Nuevo servicio insertado correctamente <b>${data.product.name}</b></p>`,
                        });
                        refetch(false);
                        onClose();
                    },
                    onError(error) {
                        handlerError(productsServicioStoreDtoForm, error);
                    },
                });
            }
        });
    }
    function onCategoriesStore() {
        sweetModal((onClose) => ({
            html: reactComponent(
                <CategoriesStore
                    onClose={onClose}
                    refetch={categoriesIndexQuery.refetch}
                    isService={true}
                />
            ),
            sweetWidth: "700px",
            showCloseButton: true,
            isCloseInBackground: false,
        }));
    }
    return (
        <div class="text-start  mt-6">
            <Form {...productsServicioStoreDtoForm} onSubmit={onProductStore}>
                <div class="flex justify-between items-center mb-4">
                    <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
                        <i class="fa-regular fa-handshake" />
                        Agregar Servicio
                    </h3>
                    <div class="flex gap-2 items-center">
                        <SettingsProduct />
                        <Form.button.reset />
                    </div>
                </div>

                <div class="">
                    <div class="w-full flex flex-row gap-2">
                        <div class="w-full flex gap-1 items-center">
                            <Form.control
                                name={"name" as keyof ProductsServicioStoreDto}
                                title="Nombre"
                                placeholder="Nombre de servicio"
                            />
                            <button
                                type="button"
                                aria-label="add"
                                class="bg-primary px-3 py-2 rounded-md shadow text-white mt-2 relative"
                                disabled={
                                    aiProductQuery.isLoading ||
                                    isImageLoading.value ||
                                    false
                                }
                                onClick={onSearchProduct}
                            >
                                {aiProductQuery.isLoading ? (
                                    <LoaderSubmit />
                                ) : (
                                    <i class="fas fa-search" />
                                )}{" "}
                                <Helper top={0} right={0}>
                                    <span class="text-black dark:text-white text-xs  block">
                                        Te sugerimos que revises el contenido
                                        generado por la inteligencia artificial.
                                    </span>
                                </Helper>
                            </button>
                        </div>
                        <Form.control
                            name={"slug" as keyof ProductsServicioStoreDto}
                            title="Slug"
                            placeholder="nombre-de-servicio"
                            options={{ setValueAs: transformSlug }}
                            disabled
                        />
                    </div>
                    <div class="w-full flex flex-col md:flex-row gap-2">
                        <Form.control
                            name={"price" as keyof ProductsServicioStoreDto}
                            step={0.1}
                            type="number"
                            title="Precio Normal"
                            placeholder={`${formatMoney(10, true)}`}
                            options={{
                                setValueAs(value) {
                                    return Number(value) > 0
                                        ? Number(value)
                                        : null;
                                },
                            }}
                        />
                        <div class="w-full flex items-center gap-2">
                            <Form.control
                                name={
                                    "discount" as keyof ProductsServicioStoreDto
                                }
                                type="number"
                                title="Descuento"
                                placeholder="0%"
                                step={0.1}
                                options={{
                                    value: 0 as unknown as undefined,
                                    setValueAs(value) {
                                        return Number(value) >= 0
                                            ? Number(value)
                                            : null;
                                    },
                                }}
                            />
                            <div class="flex flex-col gap-1">
                                <span class="text-lg whitespace-nowrap  text-primary">
                                    <span class="text-gray-400">
                                        {formatMoney(subtotal, true)}
                                    </span>{" "}
                                    -{" "}
                                    {empresa.state!.enabled_igv
                                        ? formatMoney(
                                              subtotalCart(
                                                  subtotal,
                                                  empresa.state!.igv,
                                                  true
                                              ),
                                              true
                                          )
                                        : null}{" "}
                                </span>
                                <span class="text-xs whitespace-nowrap dark:text-white flex gap-2 items-center">
                                    {discount ? (
                                        <span class="text-xs dark:text-white text-black">
                                            - incl. {discount}%
                                        </span>
                                    ) : null}
                                    {empresa.state!.enabled_igv
                                        ? `+ inc. ${empresa.state!.igv}% ${
                                              empresa.state!.tipo_impuesto
                                          }`
                                        : null}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="w-full flex flex-row gap-2">
                        <Form.control.toggle
                            name={"enabled" as keyof ProductsServicioStoreDto}
                            title="Disponibilidad"
                            question="Cuando está habilitado los clientes podrán comprar el producto."
                        />

                        <div class="flex gap-2 items-center w-full">
                            <Form.control.select
                                name={
                                    "category_id" as keyof ProductsServicioStoreDto
                                }
                                title="Categoría"
                                placeholder="Escoger categoría"
                                array={categoriesSelect}
                                options={{
                                    setValueAs: formSelectNumber,
                                }}
                                isLoading={
                                    categoriesIndexQuery.isLoading || false
                                }
                            />
                            <button
                                type="button"
                                aria-label="add"
                                class="bg-primary px-4 py-2 rounded-md shadow text-white mt-2"
                                onClick={onCategoriesStore}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <span class="text-xs dark:text-white font-semibold">
                            Suscripciones <br /> (Este campo es necesario si
                            ofreces servicios de SUSCRIPCIONES y MENSUALIDADES)
                            <br />
                            Cuando tu cliente realize el pago verá las
                            suscripciones de dias disponibles de este servicio.
                            <br />
                            Por ejemplo: Mensual, Semestral, Anual
                        </span>
                        <div>
                            {dayjsArry.fields.map((field, i) => (
                                <div
                                    key={field}
                                    class="flex gap-2 items-center"
                                >
                                    <Form.control
                                        title="Días"
                                        type="number"
                                        placeholder={"7"}
                                        name={`days.${i}.days`}
                                        options={{ setValueAs: Number }}
                                        question={
                                            <span class="block w-[100px]">
                                                <br />7 días: 1 semana
                                                <br />
                                                30 días: 30 dias
                                                <br />
                                                365 días: 1 año
                                                <br />
                                                etc
                                            </span>
                                        }
                                    />
                                    <Form.control
                                        title="Cantidad"
                                        type="number"
                                        placeholder={"1"}
                                        name={`days.${i}.cantidad`}
                                        options={{ setValueAs: Number }}
                                    />
                                    <Form.control
                                        title="Nombre"
                                        placeholder={"Mensual"}
                                        name={`days.${i}.name`}
                                    />

                                    <span class="text-xs dark:text-white text-center flex flex-col">
                                        <span>
                                            {getPeriodDescription(
                                                productsServicioStoreDtoForm.watch(
                                                    `days.${i}.days`
                                                )
                                            )}
                                        </span>
                                        <span>
                                            {empresa.state!.enabled_igv
                                                ? formatMoney(
                                                      subtotalCart(
                                                          subtotal,
                                                          empresa.state!.igv,
                                                          true
                                                      ) *
                                                          productsServicioStoreDtoForm.watch(
                                                              `days.${i}.cantidad`
                                                          ),
                                                      true
                                                  )
                                                : formatMoney(
                                                      subtotal *
                                                          productsServicioStoreDtoForm.watch(
                                                              `days.${i}.cantidad`
                                                          ),
                                                      true
                                                  )}
                                        </span>
                                    </span>
                                    <button
                                        type="button"
                                        class="bg-danger mt-3 px-4 py-2  text-white rounded-md "
                                        onClick={() => {
                                            dayjsArry.remove(i);
                                        }}
                                    >
                                        <i class="fas fa-trash" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                class="bg-primary px-4 py-2  text-white rounded-md"
                                onClick={() => {
                                    dayjsArry.append({
                                        days: 30,
                                        cantidad: 1,
                                        name: "Mensual",
                                    });
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <br />
                    <div class="flex flex-col">
                        <span class="text-xs font-semibold dark:text-white">
                            ¿Mostrar horario? <br /> (Este campo es necesario si
                            ofreces servicios con horarios. <br /> Por ejemplo:
                            barberías, peluquerias, Spas, consultas medicas,
                            etc)
                            <br />
                        </span>
                        <Form.control.toggle
                            name={
                                "showHorario" as keyof ProductsServicioStoreDto
                            }
                            title=""
                            question={
                                <div class="md:w-[100px]">
                                    Cuando está habilitado, tus clientes podrán
                                    escoger la fecha y hora en que requerirán tu
                                    servicio al momento de realizar el pago.
                                    <br />
                                    Lo podrás ver en CITAS{" "}
                                    <i class="fas fa-handshake-alt" />
                                </div>
                            }
                        />
                    </div>
                    {error.value ? (
                        <p class="text-sm text-danger font-bold">
                            {error.value}
                        </p>
                    ) : (
                        <></>
                    )}

                    <Form.control.area
                        name={"description" as keyof ProductsServicioStoreDto}
                        title="Descripción"
                        placeholder="Descripción del servicio"
                    />
                    {storageEmpresa!.web ? (
                        <Form.control
                            name={"url" as keyof ProductsServicioStoreDto}
                            title="Url"
                            question={
                                <div class="w-[150px]">
                                    Cuando tu cliente le pregunte a la
                                    inteligencia Artificial. 'Más información
                                    del producto', la inteligencia Artificial le
                                    mandará este url <br />
                                </div>
                            }
                            placeholder={`${storageEmpresa?.web}/url-de-producto`}
                        />
                    ) : (
                        <></>
                    )}
                    <div>
                        <div class="mb-2">
                            <span class="dark:text-white text-xs font-bold">
                                Caracterísiticas del servicio
                            </span>
                            <div class="max-h-[300px] overflow-auto">
                                {fields.map((field, i) => (
                                    <div
                                        class="flex gap-2 items-center"
                                        key={field.id}
                                    >
                                        <Form.control
                                            name={`characteristics.${i}.name`}
                                            title="Nombre"
                                            placeholder="Velocidad de Descarga"
                                        />
                                        <Form.control
                                            name={`characteristics.${i}.value`}
                                            title="Valor"
                                            placeholder="24gb"
                                        />
                                        <button
                                            class="mx-auto block bg-danger px-2 py-1 mt-2 rounded-md shadow text-white"
                                            type="button"
                                            aria-label="to add"
                                            onClick={() => {
                                                remove(i);
                                            }}
                                        >
                                            <i class="fa-solid fa-trash" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            class="bg-primary px-4 py-2 rounded-md shadow text-white"
                            type="button"
                            aria-label="to add"
                            onClick={() => {
                                append({ name: "", value: "" });
                            }}
                        >
                            +
                        </button>
                    </div>
                </div>
                <AdminHr />
                <AlertInfo>
                    <span>
                        Te recomendamos esta inteligencia artificial si deseas
                        eliminar fondos de tus imagenes.{" "}
                        <a
                            class="hover:underline text-primary"
                            target="_blank"
                            rel="noreferrer"
                            href={imageBackgroundIA()}
                        >
                            Ir a sitio web
                        </a>
                    </span>
                </AlertInfo>
                <Form.control.file
                    name={"images" as keyof ProductsServicioStoreDto}
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                    title="Imagenes"
                    typeFile="image"
                    multiple
                    showButonCopy
                    showButtonClean
                />
                <div class="flex justify-center">
                    <Form.button.submit
                        disabled={
                            productsServicioStoreMutation.isLoading || false
                        }
                        isLoading={
                            productsServicioStoreMutation.isLoading || false
                        }
                        title="Guardar"
                    />
                </div>
            </Form>
        </div>
    );
}

export default ProductsServicioStore;
