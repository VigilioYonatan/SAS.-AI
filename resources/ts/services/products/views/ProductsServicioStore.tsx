import Form from "~/components/form";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useMemo } from "preact/hooks";
import { formatMoney, subtotal as subtotalCart } from "@/cart/libs/helpers";
import { valibotVigilio } from "~/libs/valibot";
import { handlerError } from "~/libs/helpers";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { imageBackgroundIA } from "~/config/settings";
import useEmpresastore from "@/empresas/stores/empresa.store";
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
        },
    });

    const productsServicioStoreMutation = productsServicioStoreApi();
    const categoriesIndexQuery = categoriesIndexApi();

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

    const { fields, append, remove } = useFieldArray({
        control: productsServicioStoreDtoForm.control,
        name: "characteristics",
    });
    function onProductStore(body: ProductsServicioStoreDto) {
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
                />
            ),
            sweetWidth: "700px",
            showCloseButton: true,
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
                    <Form.button.reset />
                </div>

                <div class="">
                    <div class="w-full flex flex-row gap-2">
                        <Form.control
                            name={"name" as keyof ProductsServicioStoreDto}
                            title="Nombre"
                            placeholder="Nombre de producto"
                        />
                        <Form.control
                            name={"slug" as keyof ProductsServicioStoreDto}
                            title="Slug"
                            placeholder="nombre-de-producto"
                            options={{ setValueAs: transformSlug }}
                            disabled
                        />
                    </div>
                    <div class="w-full flex flex-col md:flex-row gap-2">
                        <Form.control
                            name={"price" as keyof ProductsServicioStoreDto}
                            step={0.01}
                            type="number"
                            title="Precio Normal"
                            placeholder="S/. 10.00"
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
                                step={0.01}
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
                                        {formatMoney(subtotal)}
                                    </span>{" "}
                                    -{" "}
                                    {empresa.state!.enabled_igv
                                        ? formatMoney(
                                              subtotalCart(
                                                  subtotal,
                                                  empresa.state!.igv,
                                                  true
                                              )
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
                        <Form.control
                            name={"days" as keyof ProductsServicioStoreDto}
                            type="number"
                            title="Dias"
                            placeholder="30"
                            options={{ setValueAs: Number }}
                            question={
                                <div class="w-[120px]">
                                    Días de este servicio <br />
                                    30 dias = 1 mes <br /> 7 dias = 1 semana
                                    <br />
                                    60 dias = 2 mes
                                </div>
                            }
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
                    <Form.control.area
                        name={"description" as keyof ProductsServicioStoreDto}
                        title="Descripción"
                        placeholder="Descripción del servicio"
                    />

                    <div>
                        <div class="mb-2">
                            <span class="dark:text-white text-xs font-bold">
                                Caracterísiticas del servicio
                            </span>
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
