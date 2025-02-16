import Form from "~/components/form";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useMemo } from "preact/hooks";
import { formatMoney, subtotal as subtotalCart } from "@/cart/libs/helpers";
import { valibotVigilio } from "~/libs/valibot";
import { handlerError, limpiarParametro } from "~/libs/helpers";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { imageBackgroundIA } from "~/config/settings";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import { reactComponent } from "~/libs/preact";
import useAuthstore from "@/auth/stores/auth.store";
import { formSelectNumber } from "~/components/form/WebFormSelect";
import AdminHr from "~/components/AdminHr";
import { categoriesIndexApi } from "../apis/categories/categories.index.api";
import CategoriesStore from "./CategoriesStore";
import {
    ProductsRestaurantStoreDto,
    productsRestaurantStoreDto,
} from "../dtos/products_restaurant.dto";
import { productsRestaurantStoreApi } from "../apis/products/products_restaurant.store.api";
import { aiProductApi } from "@/bot/apis/ai.product.api";
import { useSignal } from "@preact/signals";
import { getFilesEdit } from "~/libs/upload";
import LoaderSubmit from "~/components/LoaderSubmit";
import Helper from "~/components/Helper";
import SettingsProduct from "@/admin/components/SettingsProduct";
import { categoriesSubcategoriesApi } from "../apis/categories/categories.subcategories.api";
import SubcategoriesStore from "./SubcategoriesStore";

interface ProductsRestaurantStoreProps {
    refetch: (clean?: boolean | undefined) => Promise<void>;
    onClose: () => void;
}
function ProductsRestaurantStore({
    refetch,
    onClose,
}: ProductsRestaurantStoreProps) {
    const { guards } = useAuthstore();
    if (!guards.permissionAdminGuard()) {
        window.history.back();
        return null;
    }
    const isImageLoading = useSignal(false);
    const empresa = useEmpresastore();
    const description = useSignal<string | null>(null);
    const productsRestaurantStoreDtoForm = useForm<ProductsRestaurantStoreDto>({
        resolver: valibotVigilio(productsRestaurantStoreDto),
        mode: "all",
        defaultValues: {
            characteristics: [],
            description: null,
            enabled: true,
            url: null,
            empresa_id: empresa.state!.id,
        },
    });
    const aiProductQuery = aiProductApi();
    const category_id = productsRestaurantStoreDtoForm.watch("category_id");
    const categoriesSubcategoriesQuery =
        categoriesSubcategoriesApi(category_id);
    const categoriesIndexQuery = categoriesIndexApi(false);

    const categoriesSelect = useMemo(() => {
        if (categoriesIndexQuery.isSuccess && categoriesIndexQuery.data) {
            return categoriesIndexQuery.data.data.map((value) => ({
                key: value.id,
                value: value.name,
            }));
        }
        return [];
    }, [categoriesIndexQuery.data, categoriesIndexQuery.isSuccess]);

    function onSearchProduct() {
        aiProductQuery.mutate(limpiarParametro(name), {
            async onSuccess(data) {
                isImageLoading.value = true;
                const images = await getFilesEdit(
                    data.data.images.map((img) => ({
                        dimension: 500,
                        file: img.image,
                    })),
                    null
                );
                productsRestaurantStoreDtoForm.setValue(
                    "characteristics",
                    data.data.caracterisiticas.map((val) => ({
                        name: val.key,
                        value: val.value,
                    }))
                );
                productsRestaurantStoreDtoForm.setValue(
                    "description",
                    data.data.description
                );

                if (images.length) {
                    productsRestaurantStoreDtoForm.setValue("images", images);
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
    const productsRestaurantStoreMutation = productsRestaurantStoreApi();

    const subcategoriesSelect = useMemo(() => {
        if (
            categoriesSubcategoriesQuery.isSuccess &&
            categoriesSubcategoriesQuery.data
        ) {
            return categoriesSubcategoriesQuery.data.data.map((value) => ({
                key: value.id,
                value: value.name,
            }));
        }
        return [];
    }, [
        categoriesSubcategoriesQuery.data,
        categoriesSubcategoriesQuery.isSuccess,
    ]);

    const name = productsRestaurantStoreDtoForm.watch("name");
    const discount = productsRestaurantStoreDtoForm.watch("discount");
    const price = productsRestaurantStoreDtoForm.watch("price");
    const ilimit = productsRestaurantStoreDtoForm.watch("ilimit");
    useEffect(() => {
        if (name) {
            productsRestaurantStoreDtoForm.setValue(
                "slug",
                transformSlug(name || ""),
                {
                    shouldValidate: true,
                }
            );
        }
    }, [name]);
    useEffect(() => {
        productsRestaurantStoreDtoForm.setValue("subcategory_id", null);
        if (category_id) {
            categoriesSubcategoriesQuery.refetch();
        } else {
            categoriesSubcategoriesQuery.transformData((data) => ({
                ...data,
                data: [],
            }));
        }
    }, [category_id]);
    const subtotal = useMemo(
        () => subtotalCart(price, discount),
        [discount, price]
    );

    const { fields, prepend, remove } = useFieldArray({
        control: productsRestaurantStoreDtoForm.control,
        name: "characteristics",
    });
    function onProductStore(body: ProductsRestaurantStoreDto) {
        sweetModal({
            icon: "info",
            title: "¿Estas seguro de agregar este producto?",
            customIcon:
                "<i class='fas fa-phone-laptop text-3xl dark:text-white' /> </i>",
            isCloseInBackground: false,
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                productsRestaurantStoreMutation.mutate(body, {
                    onSuccess(data) {
                        productsRestaurantStoreDtoForm.reset();
                        sweetAlert({
                            icon: "success",
                            title: `<p class="text-center">Nuevo producto insertado correctamente <b>${data.product.name}</b></p>`,
                        });
                        refetch(false);
                        onClose();
                    },
                    onError(error) {
                        handlerError(productsRestaurantStoreDtoForm, error);
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
                    onSetValueCategory={onSetValueCategory}
                    isService={false}
                />
            ),
            sweetWidth: "700px",
            showCloseButton: true,
            isCloseInBackground: false,
        }));
    }
    function onSubcategoriesStore() {
        sweetModal((onClose) => ({
            html: reactComponent(
                <SubcategoriesStore
                    onClose={onClose}
                    refetch={categoriesSubcategoriesQuery.refetch}
                    onSetValueSubcategory={onSetValueSubcategory}
                />
            ),
            sweetWidth: "700px",
            showCloseButton: true,
            isCloseInBackground: false,
        }));
    }
    function onSetValueCategory(value: number) {
        productsRestaurantStoreDtoForm.setValue("category_id", value);
    }
    function onSetValueSubcategory(value: number) {
        productsRestaurantStoreDtoForm.setValue("subcategory_id", value);
    }
    return (
        <div class="text-start  mt-6">
            <Form {...productsRestaurantStoreDtoForm} onSubmit={onProductStore}>
                <div class="flex justify-between items-center mb-4">
                    <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
                        {[1, 3].includes(
                            storageEmpresa!.tipo_empresa.tipo_servicio_id
                        ) ? (
                            <i class="fas fa-phone-laptop" />
                        ) : (
                            <i class="fas fa-utensils" />
                        )}
                        Agregar Producto
                    </h3>
                    <div class="flex gap-2 items-center">
                        <SettingsProduct />
                        <Form.button.reset />
                    </div>
                </div>

                <div class="">
                    <div class="w-full flex flex-col md:flex-row gap-2">
                        <div class="w-full flex gap-1 items-center">
                            <Form.control
                                name={
                                    "name" as keyof ProductsRestaurantStoreDto
                                }
                                title="Nombre"
                                placeholder="Nombre de producto"
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
                                        {" "}
                                        Esto puede tomar unos segundos para
                                        completar toda la información. <br />
                                        Te sugerimos que revises el contenido
                                        generado por la inteligencia artificial.
                                    </span>
                                </Helper>
                            </button>
                        </div>
                        <Form.control
                            name={"slug" as keyof ProductsRestaurantStoreDto}
                            title="Slug"
                            placeholder="nombre-de-producto"
                            options={{ setValueAs: transformSlug }}
                            disabled
                        />{" "}
                    </div>
                    <div class="w-full flex flex-row gap-2">
                        <Form.control
                            name={"price" as keyof ProductsRestaurantStoreDto}
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
                                    "discount" as keyof ProductsRestaurantStoreDto
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
                                        {formatMoney(subtotal, true)}
                                    </span>{" "}
                                    {empresa.state!.enabled_igv
                                        ? `- ${formatMoney(
                                              subtotalCart(
                                                  subtotal,
                                                  empresa.state!.igv,
                                                  true
                                              ),
                                              true
                                          )}`
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
                            name={"ilimit" as keyof ProductsRestaurantStoreDto}
                            title="Ilimitado"
                            question="Cuando la variante es ilimitado quiere decir que hay stock."
                        />
                        {!ilimit ? (
                            <Form.control
                                name={
                                    "stock" as keyof ProductsRestaurantStoreDto
                                }
                                type="number"
                                title="Cantidad"
                                placeholder="1"
                                options={{ setValueAs: Number }}
                            />
                        ) : null}
                    </div>
                    <div class="w-full flex flex-col  md:flex-row gap-2">
                        <Form.control.toggle
                            name={"enabled" as keyof ProductsRestaurantStoreDto}
                            title="Disponibilidad"
                            question="Cuando está habilitado los clientes podrán comprar el producto."
                        />
                        {/* <Form.control.toggle
                            name={
                                "shipping_free" as keyof ProductsRestaurantStoreDto
                            }
                            title="¿Envio gratis?"
                            question="No se le cobrará envio a este producto."
                        /> */}
                        <div class="flex gap-2 items-center w-full">
                            <Form.control.select
                                name={
                                    "category_id" as keyof ProductsRestaurantStoreDto
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
                        {storageEmpresa?.setting.is_subcategory ? (
                            <div class="flex gap-2 items-center w-full">
                                <Form.control.select
                                    name={
                                        "subcategory_id" as keyof ProductsRestaurantStoreDto
                                    }
                                    title="Subcategoría"
                                    placeholder="Escoger subcategoría"
                                    array={subcategoriesSelect}
                                    options={{
                                        setValueAs: formSelectNumber,
                                    }}
                                    isLoading={
                                        categoriesSubcategoriesQuery.isLoading ||
                                        false
                                    }
                                />
                                <button
                                    type="button"
                                    aria-label="add"
                                    class="bg-primary px-4 py-2 rounded-md shadow text-white mt-2"
                                    onClick={onSubcategoriesStore}
                                >
                                    +
                                </button>
                            </div>
                        ) : null}
                    </div>
                    <Form.control.editor
                        name={"description" as keyof ProductsRestaurantStoreDto}
                        title="Descripción"
                        isShow
                        change={description.value}
                    />
                    {storageEmpresa!.web ? (
                        <Form.control
                            name={"url" as keyof ProductsRestaurantStoreDto}
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
                        <div class="mb-2 ">
                            <span class="dark:text-white text-xs font-bold">
                                Caracterísiticas
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
                                            placeholder="Condimentos"
                                        />
                                        <Form.control
                                            name={`characteristics.${i}.value`}
                                            title="Valor"
                                            placeholder="Sal, ajo, ají limo, culantro"
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
                                prepend({ name: "", value: "" });
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
                    name={"images" as keyof ProductsRestaurantStoreDto}
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
                            productsRestaurantStoreMutation.isLoading || false
                        }
                        isLoading={
                            productsRestaurantStoreMutation.isLoading || false
                        }
                        title="Guardar"
                    />
                </div>
            </Form>
        </div>
    );
}

export default ProductsRestaurantStore;
