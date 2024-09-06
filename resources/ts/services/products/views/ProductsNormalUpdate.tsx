import { useFieldArray, useForm } from "react-hook-form";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { useEffect, useMemo } from "preact/hooks";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import Form from "~/components/form";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import AdminHr from "~/components/AdminHr";
import { subtotal as subtotalCart, formatMoney } from "@/cart/libs/helpers";
import { Fragment, type JSX } from "preact/jsx-runtime";
import { valibotVigilio } from "~/libs/valibot";
import { getFilesEdit } from "~/libs/upload";
import { handlerError } from "~/libs/helpers";
import { aiDescriptionApi } from "@/bot/apis/ai.description.api";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import LoaderSubmit from "~/components/LoaderSubmit";
import useAuthstore from "@/auth/stores/auth.store";
import { subWhatsappIA } from "~/config/guards";
import {
    productsShowApi,
    type ProductsShowAPI,
} from "../apis/products/products.show.api";
import { formSelectNumber } from "~/components/form/WebFormSelect";
import useCopyToClipboard from "~/hooks/useCopyToClipboard";
import { brandsIndexApi } from "../apis/brands/brands.index.api";
import { reactComponent } from "~/libs/preact";
import { optionsFeaturesApi } from "../apis/options/options.features.api";
import { ProductOptions } from "./ProductsNormalStore";
import VariantsShow from "./options/VariantsShow";
import { printImagesProduct } from "../libs/helpers";
import { variantsDeleteApi } from "../apis/options/variants.delete.api";
import {
    productsNormalUpdateDto,
    ProductsNormalUpdateDto,
    productsUpdateImagesDto,
    ProductsUpdateImagesDto,
} from "../dtos/products_normal.dto";
import {
    productsNormalUpdateApi,
    productsUpdateImagesApi,
} from "../apis/products/products_normal.update.api";
import { ProductsNormalSchemaFromServer } from "../schemas/products_normal.schema";
import { categoriesIndexApi } from "../apis/categories/categories.index.api";

interface ProductsNormalUpdateProps {
    id?: string | number;
    refetch?: (clean?: boolean) => void;
    refetchProduct?: (clean?: boolean) => void;
}
function ProductsNormalUpdate({
    id,
    refetch,
    refetchProduct,
}: ProductsNormalUpdateProps) {
    const { guards } = useAuthstore();
    if (!guards.permissionAdminGuard()) {
        window.history.back();
        return null;
    }
    const productQuery = productsShowApi(id as string);
    const optionsFeaturesQuery = optionsFeaturesApi();
    const optionsFeaturesData = useMemo(() => {
        if (optionsFeaturesQuery.isSuccess && optionsFeaturesQuery.data) {
            return optionsFeaturesQuery.data.data.map((option) => option);
        }
        return [];
    }, [optionsFeaturesQuery.data, optionsFeaturesQuery.isSuccess]);
    let component: JSX.Element | JSX.Element[] | null = null;

    if (productQuery.isLoading) {
        component = <Loading />;
    }
    if (productQuery.isError) {
        component = <View404 message={`No se encontró un producto: ${id}`} />;
    }
    if (productQuery.isSuccess && productQuery.data) {
        const empresa = useEmpresastore();
        const product = productQuery.data
            .product as ProductsShowAPI["product"] as ProductsNormalSchemaFromServer;

        const {
            createdAt,
            updatedAt,
            images,
            id,
            options,
            brand,
            category,
            empresa_id,
            ...rest
        } = product;
        const variantsDeleteMutation = variantsDeleteApi(id);
        const formProductsNormalUpdate = useForm<ProductsNormalUpdateDto>({
            resolver: valibotVigilio(productsNormalUpdateDto),
            mode: "all",
            defaultValues: {
                ...rest,
                price: Number(rest.price),
                discount: Number(rest.discount),
                options: options.map((opt) => ({
                    option_id: opt.id,
                    features: opt.features.map((feat) => feat.id),
                })),
            },
        });
        const name = formProductsNormalUpdate.watch("name");
        const discount = formProductsNormalUpdate.watch("discount");
        const price = formProductsNormalUpdate.watch("price");
        const [copy] = useCopyToClipboard();
        const brandsIndexQuery = brandsIndexApi();
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
        const formProductsNormalUpdateImages = useForm<ProductsUpdateImagesDto>(
            {
                mode: "all",
                resolver: valibotVigilio(productsUpdateImagesDto),
            }
        );

        const mutateProductsNormalUpdateApi = productsNormalUpdateApi(
            product.id
        );
        const mutateProductsNormalUpdateImagesApi = productsUpdateImagesApi(
            product.id
        );
        const aiDescriptionQuery = aiDescriptionApi();

        function onUpdateProduct(data: ProductsNormalUpdateDto) {
            sweetModal({
                title: "¿Estás seguro de editar este producto?",
                customIcon:
                    "<i class='fas fa-phone-laptop text-3xl dark:text-white' /> </i>",
                showCloseButton: true,
                showCancelButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    mutateProductsNormalUpdateApi.mutate(data, {
                        onSuccess(data) {
                            sweetAlert({
                                icon: "success",
                                title: `<p class="text-center">Producto actualizado correctamente <b>${data.product.name}</b></p>`,
                            });
                            productQuery.refetch(false);
                            if (refetchProduct) {
                                refetchProduct(false);
                            }
                            if (refetch) {
                                refetch(false);
                            }
                        },
                        onError(error) {
                            handlerError(formProductsNormalUpdate, error);
                        },
                    });
                }
            });
        }
        const onUpdateImagesProduct = (data: ProductsUpdateImagesDto) => {
            sweetModal({
                title: "¿Estás seguro de editar las imagenes de este producto?",
                customIcon:
                    "<i class='fas fa-phone-laptop text-3xl dark:text-white' /> </i>",
                showCloseButton: true,
                showCancelButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    mutateProductsNormalUpdateImagesApi.mutate(
                        { ...data, name: product.name },
                        {
                            onSuccess() {
                                sweetAlert({
                                    icon: "success",
                                    title: "Se actualizó imagenes correctamente",
                                });
                                if (refetchProduct) {
                                    refetchProduct(false);
                                }
                                if (refetch) {
                                    refetch(false);
                                }
                                productQuery.refetch(false);
                            },
                            onError(error) {
                                handlerError(formProductsNormalUpdate, error);
                            },
                        }
                    );
                }
            });
        };

        const brandsSelect = useMemo(() => {
            if (brandsIndexQuery.isSuccess && brandsIndexQuery.data) {
                return brandsIndexQuery.data.data.map((value) => ({
                    key: value.id,
                    value: value.name,
                }));
            }
            return [];
        }, [brandsIndexQuery.data, brandsIndexQuery.isSuccess]);

        useEffect(() => {
            if (name) {
                formProductsNormalUpdate.setValue(
                    "slug",
                    transformSlug(name || ""),
                    {
                        shouldValidate: true,
                    }
                );
            }
        }, [name]);

        useEffect(() => {
            formProductsNormalUpdate.setValue(
                "slug",
                transformSlug(name || ""),
                {
                    shouldValidate: true,
                }
            );
        }, [name]);

        async function initialUpdateImages() {
            if (product.images) {
                const images = await getFilesEdit(product.images, 500);
                formProductsNormalUpdateImages.setValue("images", images);
            }
        }

        const subtotal = useMemo(
            () => subtotalCart(price, discount),
            [discount, price]
        );

        useEffect(() => {
            initialUpdateImages();
        }, []);
        const { fields, append, remove } = useFieldArray({
            control: formProductsNormalUpdate.control,
            name: "characteristics",
        });

        component = (
            <div class="text-start  mt-6">
                <div class="flex justify-between items-center mb-4 ">
                    <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2 ">
                        <i class="fas fa-phone-laptop" />
                        <span class="break-words text-wrap ">
                            Editar Producto - {product.name}
                        </span>
                    </h3>
                </div>
                <Form {...formProductsNormalUpdate} onSubmit={onUpdateProduct}>
                    <div class="flex justify-end items-center mb-4">
                        <Form.button.reset />
                    </div>
                    <div class="w-full">
                        <div class="w-full flex flex-row gap-2">
                            <Form.control
                                name={"name" as keyof ProductsNormalUpdateDto}
                                title="Nombre"
                                placeholder="Nombre de categoria"
                            />
                            <Form.control
                                name={"slug" as keyof ProductsNormalUpdateDto}
                                title="Slug"
                                placeholder="nombre-de-producto"
                                options={{ setValueAs: transformSlug }}
                                disabled
                            />
                        </div>
                        <div class="w-full flex flex-col md:flex-row gap-2">
                            <Form.control
                                name={"price" as keyof ProductsNormalUpdateDto}
                                type="number"
                                step={0.01}
                                title="Precio"
                                placeholder="S/. 10.00"
                                options={{ setValueAs: Number }}
                            />

                            <div class="w-full flex items-center gap-2">
                                <Form.control
                                    name={
                                        "discount" as keyof ProductsNormalUpdateDto
                                    }
                                    type="number"
                                    title="Descuento"
                                    placeholder="0%"
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
                        </div>{" "}
                        <div class="w-full flex flex-row gap-2">
                            <Form.control.select
                                name={
                                    "brand_id" as keyof ProductsNormalUpdateDto
                                }
                                title="Marca"
                                placeholder="Escoger marca"
                                array={brandsSelect}
                                options={{
                                    setValueAs: formSelectNumber,
                                }}
                                isLoading={brandsIndexQuery.isLoading || false}
                            />
                        </div>
                        <div class="w-full flex flex-row gap-2">
                            <Form.control.select
                                name={
                                    "category_id" as keyof ProductsNormalUpdateDto
                                }
                                title="Categoría"
                                placeholder="Escoger categoría"
                                array={categoriesSelect}
                                isLoading={
                                    categoriesIndexQuery.isLoading || false
                                }
                                options={{
                                    setValueAs: formSelectNumber,
                                }}
                            />
                        </div>
                        <div class="w-full flex flex-row gap-2">
                            <Form.control.toggle
                                name={
                                    "enabled" as keyof ProductsNormalUpdateDto
                                }
                                title="Disponibilidad"
                                question="Cuando no está habilitado los clientes NO podrán comprar NI VER el producto, ."
                            />
                        </div>
                    </div>
                    <>
                        <Form.control.area
                            name={
                                "description" as keyof ProductsNormalUpdateDto
                            }
                            title="Descripción"
                            placeholder="descripción de producto"
                        />
                        {name &&
                        !formProductsNormalUpdate.formState.errors.name
                            ?.message ? (
                            <div class="text-primary text-xs flex flex-col self-start ">
                                <span class="dark:text-white text-black">
                                    Usar Inteligencia Artificial para buscar
                                    descripción
                                </span>
                                <div class="flex relative gap-2 items-center">
                                    <button
                                        type="button"
                                        aria-label="use ai decripcion"
                                        class=" p-2   text-sm bg-primary px-2 py-1 rounded-md self-start mt-1 flex items-center gap-2 text-white"
                                        onClick={() => {
                                            if (!subWhatsappIA()) {
                                                sweetAlert({
                                                    icon: "danger",
                                                    title: `<span class="text-xs">No tienes la subscripción de Whatsapp y IA <a href='/admin/plus' target="_blank" class="text-primary hover:underline">Ir a PLUS</a></span>`,
                                                });
                                                return;
                                            }
                                            aiDescriptionQuery.mutate(name, {
                                                onSuccess(data) {
                                                    sweetModal((onClose) => ({
                                                        position: "start",
                                                        html: reactComponent(
                                                            <div class="flex flex-col gap-2 dark:text-white">
                                                                <p>
                                                                    {
                                                                        data.description
                                                                    }
                                                                </p>
                                                                <button
                                                                    type="button"
                                                                    aria-label="copy"
                                                                    class="flex gap-2 items-center justify-center active:text-primary bg-primary px-4 py-1 rounded-md"
                                                                    onClick={() => {
                                                                        copy(
                                                                            data.description
                                                                        ).then(
                                                                            () => {
                                                                                sweetAlert(
                                                                                    {
                                                                                        icon: "success",
                                                                                        title: "Copiado correctamente",
                                                                                    }
                                                                                );
                                                                                onClose();
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    <i class="far fa-copy text-base" />{" "}
                                                                    Copiar
                                                                </button>
                                                            </div>
                                                        ),
                                                        showCloseButton: true,
                                                    }));
                                                },
                                                onError(data) {
                                                    sweetAlert({
                                                        icon: "danger",
                                                        title: data.message,
                                                    });
                                                },
                                            });
                                        }}
                                    >
                                        <i class="fa-sharp fa-solid fa-message-bot " />
                                        {aiDescriptionQuery.isLoading ? (
                                            <LoaderSubmit />
                                        ) : (
                                            name
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </>
                    <div class="mt-4">
                        <span class="dark:text-white text-xs font-bold">
                            Caracterísiticas
                        </span>
                        {fields.map((field, i) => (
                            <div class="flex gap-2 items-center" key={field.id}>
                                <Form.control
                                    name={`characteristics.${i}.name`}
                                    title="Nombre"
                                    placeholder="Modelo"
                                />
                                <Form.control
                                    name={`characteristics.${i}.value`}
                                    title="Valor"
                                    placeholder="A32"
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
                        class=" bg-primary px-4 py-2 rounded-md shadow text-white mb-4"
                        type="button"
                        aria-label="to add"
                        onClick={() => {
                            append({ name: "", value: "" });
                        }}
                    >
                        +
                    </button>
                    <div class="flex flex-col gap-2 ">
                        <span class="text-xs dark:text-white relative self-start">
                            Opciones{" "}
                            <button
                                type="button"
                                class="absolute -right-7 w-[20px] h-[20px] top-1 rounded-full bg-black bg-opacity-80 flex justify-center items-center text-white group"
                            >
                                ?
                                <span class="absolute bg-black bg-opacity-70 p-1 rounded-md font-semibold left-0 text-white hidden group-hover:block w-[160px] text-xs">
                                    Por tema de seguridad y rendimiento. Si se
                                    cambia la opción o feature, se volverá a
                                    generar nuevas variantes.
                                </span>
                            </button>
                        </span>
                        <button
                            class="bg-primary px-4 py-2 rounded-md shadow text-white self-start"
                            type="button"
                            aria-label="to add"
                            onClick={() => {
                                sweetModal((onClose) => ({
                                    html: reactComponent(
                                        <ProductOptions
                                            optionsFeaturesData={
                                                optionsFeaturesData
                                            }
                                            productsNormalStoreDtoForm={
                                                formProductsNormalUpdate
                                            }
                                            onClose={onClose}
                                        />
                                    ),
                                    showCloseButton: true,
                                    position: "start",
                                }));
                            }}
                        >
                            +
                        </button>

                        {optionsFeaturesData ? (
                            <div class="flex flex-col flex-wrap  gap-2 my-4">
                                {formProductsNormalUpdate
                                    .watch("options")
                                    .map((option) => {
                                        const opt = optionsFeaturesData.find(
                                            (opt) => opt.id === option.option_id
                                        );

                                        if (opt) {
                                            const detailedFeatures =
                                                option.features.map(
                                                    (featureId) =>
                                                        opt.features.find(
                                                            (feature) =>
                                                                feature.id ===
                                                                featureId
                                                        )
                                                );
                                            return (
                                                <div
                                                    key={opt.id}
                                                    class="flex flex-col gap-2"
                                                >
                                                    <span class="dark:text-white text-xs">
                                                        {opt.name}
                                                    </span>
                                                    <div class="flex flex-wrap gap-2 ">
                                                        {detailedFeatures?.map(
                                                            (feature) => (
                                                                <Fragment
                                                                    key={
                                                                        feature?.id
                                                                    }
                                                                >
                                                                    {opt.type ===
                                                                    1 ? (
                                                                        <div class=" px-6 py-1 rounded-md  bg-white dark:bg-admin-terciary dark:text-white text-xs font-bold flex items-center gap-2 shadow">
                                                                            {
                                                                                feature?.value
                                                                            }{" "}
                                                                            |{" "}
                                                                            {
                                                                                feature?.description
                                                                            }
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            class="relative w-[30px] h-[30px] rounded-full shadow  flex justify-center items-center group"
                                                                            style={{
                                                                                backgroundColor:
                                                                                    feature?.value,
                                                                            }}
                                                                        >
                                                                            <span class="absolute -bottom-2 left-2 z-10 dark:bg-admin-background-dark shadow dark:text-white bg-white text-[10px] px-2 rounded-md py-1 hidden group-hover:block">
                                                                                {
                                                                                    feature?.value
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </Fragment>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return option;
                                    })}
                            </div>
                        ) : null}
                    </div>
                    <div class="flex flex-col gap-2 overflow-auto">
                        <span class="text-xs dark:text-white">Variantes</span>
                        <div class="w-full  ">
                            {product.variants.length ? (
                                <>
                                    <table class="text-sm text-left  h-full shadow w-full">
                                        <thead class="text-[10px] lg:text-xs bg-paper-light dark:bg-admin-terciary dark:text-secondary-light dark:text-terciary-dark uppercase  shadow-sm  border-b dark:border-admin-terciary">
                                            <tr>
                                                <td class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer">
                                                    ID
                                                </td>
                                                <td class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer">
                                                    Features
                                                </td>
                                                <td class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer">
                                                    SKU
                                                </td>
                                                <td class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer">
                                                    Cantidad
                                                </td>
                                                <td class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer">
                                                    imagenes
                                                </td>
                                                <td class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer">
                                                    Acciones
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {product.variants.map(
                                                (variant, i) => (
                                                    <tr
                                                        class="border-b  dark:border-admin-terciary border-paper-light hover:bg-paper-light text-black dark:hover:bg-admin-terciary dark:text-secondary-light dark:hover:text-secondary-light "
                                                        key={variant.id}
                                                    >
                                                        <td>
                                                            <span class="flex justify-center items-center">
                                                                {i + 1}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div class="flex gap-2 items-center justify-center flex-wrap my-1">
                                                                {variant.features
                                                                    .map(
                                                                        ({
                                                                            option_id,
                                                                            feature_id,
                                                                        }) => {
                                                                            return (
                                                                                // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
                                                                                <>
                                                                                    {product.options.map(
                                                                                        (
                                                                                            opt
                                                                                        ) => {
                                                                                            const feature =
                                                                                                opt.features.find(
                                                                                                    (
                                                                                                        feat
                                                                                                    ) =>
                                                                                                        feat.id ===
                                                                                                            feature_id &&
                                                                                                        feat.option_id ===
                                                                                                            option_id
                                                                                                );
                                                                                            if (
                                                                                                feature
                                                                                            ) {
                                                                                                return (
                                                                                                    <>
                                                                                                        {opt.type ===
                                                                                                        1 ? (
                                                                                                            <div class=" px-3 py-1 text-center rounded-md  bg-white dark:bg-admin-terciary dark:text-white text-xs font-bold flex items-center gap-2 shadow">
                                                                                                                {
                                                                                                                    feature?.value
                                                                                                                }{" "}
                                                                                                                |{" "}
                                                                                                                {
                                                                                                                    feature?.description
                                                                                                                }
                                                                                                            </div>
                                                                                                        ) : (
                                                                                                            <div
                                                                                                                class="relative w-[20px] h-[20px] rounded-full shadow  flex justify-center items-center group"
                                                                                                                style={{
                                                                                                                    backgroundColor:
                                                                                                                        feature?.value,
                                                                                                                }}
                                                                                                            >
                                                                                                                <span class="absolute -bottom-2 left-2 z-10 dark:bg-admin-background-dark shadow dark:text-white bg-white text-[10px] px-2 rounded-md py-1 hidden group-hover:block">
                                                                                                                    {
                                                                                                                        feature?.value
                                                                                                                    }
                                                                                                                </span>
                                                                                                            </div>
                                                                                                        )}
                                                                                                    </>
                                                                                                );
                                                                                            }
                                                                                            return null;
                                                                                        }
                                                                                    )}
                                                                                </>
                                                                            );
                                                                        }
                                                                    )
                                                                    .filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item !==
                                                                            null
                                                                    )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span class="flex justify-center items-center text-center text-xs">
                                                                {variant.sku
                                                                    ? variant.sku
                                                                    : "no se insertó sku"}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <span class="flex justify-center items-center">
                                                                {variant.ilimit
                                                                    ? "Stock"
                                                                    : variant.stock}
                                                            </span>
                                                        </td>
                                                        <td class="flex justify-center items-center ">
                                                            <div class="relative text-xs text-center ">
                                                                {variant.images
                                                                    .length ? (
                                                                    <img
                                                                        class="w-[60px] h-[40px] object-contain"
                                                                        width={
                                                                            100
                                                                        }
                                                                        height={
                                                                            60
                                                                        }
                                                                        src={printImagesProduct(
                                                                            images,
                                                                            500
                                                                        ).find(
                                                                            (
                                                                                _,
                                                                                i
                                                                            ) =>
                                                                                i +
                                                                                    1 ===
                                                                                variant
                                                                                    .images[0]
                                                                        )}
                                                                        alt={
                                                                            variant.sku ??
                                                                            "sku"
                                                                        }
                                                                    />
                                                                ) : (
                                                                    "Sin imagenes"
                                                                )}

                                                                {variant.images
                                                                    .length >
                                                                1 ? (
                                                                    <button
                                                                        class="absolute top-[-10px] right-0  bg-success w-[25px] h-[25px] font-bold flex justify-center items-center rounded-full text-white"
                                                                        aria-label="button to open images"
                                                                        type="button"
                                                                        onClick={() => {
                                                                            sweetModal(
                                                                                {
                                                                                    html: reactComponent(
                                                                                        <div class="flex flex-col gap-4">
                                                                                            <span class="dark:text-white">
                                                                                                Hay{" "}
                                                                                                {
                                                                                                    variant
                                                                                                        .images
                                                                                                        .length
                                                                                                }{" "}
                                                                                                imágenes
                                                                                                Seleccionados
                                                                                            </span>
                                                                                            <div class="flex flex-wrap justify-center gap-5 max-w-[500px]">
                                                                                                {printImagesProduct(
                                                                                                    images,
                                                                                                    500
                                                                                                )
                                                                                                    .filter(
                                                                                                        (
                                                                                                            _,
                                                                                                            i
                                                                                                        ) =>
                                                                                                            variant.images.some(
                                                                                                                (
                                                                                                                    img
                                                                                                                ) =>
                                                                                                                    img ===
                                                                                                                    i +
                                                                                                                        1
                                                                                                            )
                                                                                                    )
                                                                                                    .map(
                                                                                                        (
                                                                                                            img
                                                                                                        ) => (
                                                                                                            <img
                                                                                                                key={
                                                                                                                    img
                                                                                                                }
                                                                                                                src={
                                                                                                                    img
                                                                                                                }
                                                                                                                width={
                                                                                                                    300
                                                                                                                }
                                                                                                                height={
                                                                                                                    300
                                                                                                                }
                                                                                                                alt={
                                                                                                                    variant.sku ??
                                                                                                                    "sku"
                                                                                                                }
                                                                                                                class="object-cover w-[150px] h-[150px] rounded-md"
                                                                                                            />
                                                                                                        )
                                                                                                    )}
                                                                                            </div>
                                                                                        </div>
                                                                                    ),
                                                                                }
                                                                            );
                                                                        }}
                                                                    >{`+ ${
                                                                        variant.images.slice(
                                                                            1
                                                                        ).length
                                                                    }`}</button>
                                                                ) : null}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="flex justify-center items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    aria-label="edit variant"
                                                                    onClick={() => {
                                                                        sweetModal(
                                                                            {
                                                                                html: reactComponent(
                                                                                    <VariantsShow
                                                                                        refetch={
                                                                                            productQuery.refetch
                                                                                        }
                                                                                        product_id={
                                                                                            product.id
                                                                                        }
                                                                                        variant_id={
                                                                                            variant.id
                                                                                        }
                                                                                        product={
                                                                                            product
                                                                                        }
                                                                                    />
                                                                                ),
                                                                                showCloseButton:
                                                                                    true,
                                                                                isCloseInBackground:
                                                                                    false,
                                                                            }
                                                                        );
                                                                    }}
                                                                    class="text-white bg-orange-600 px-2 py-1 rounded-md text-xs"
                                                                >
                                                                    <i class="fas fa-pen" />
                                                                </button>
                                                                <button
                                                                    class="text-white bg-danger px-2 py-1 rounded-md text-xs"
                                                                    type="button"
                                                                    aria-label="delete variant"
                                                                    onClick={() => {
                                                                        variantsDeleteMutation.mutate(
                                                                            variant.id,
                                                                            {
                                                                                onSuccess() {
                                                                                    if (
                                                                                        refetchProduct
                                                                                    ) {
                                                                                        refetchProduct(
                                                                                            false
                                                                                        );
                                                                                    }
                                                                                    if (
                                                                                        refetch
                                                                                    ) {
                                                                                        refetch(
                                                                                            false
                                                                                        );
                                                                                    }
                                                                                    productQuery.refetch(
                                                                                        false
                                                                                    );
                                                                                    sweetAlert(
                                                                                        {
                                                                                            title: "Eliminado correctamente.",
                                                                                            icon: "success",
                                                                                        }
                                                                                    );
                                                                                },
                                                                                onError() {
                                                                                    sweetAlert(
                                                                                        {
                                                                                            title: "No se eliminó.",
                                                                                            icon: "danger",
                                                                                        }
                                                                                    );
                                                                                },
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    <i class="fas fa-trash text-white" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <span class="text-xs dark:text-white">
                                    No hay variantes
                                </span>
                            )}
                        </div>
                    </div>
                    <AdminHr />
                    {storageEmpresa!.web ? (
                        <Form.control
                            name={"url" as keyof ProductsNormalUpdateDto}
                            title="Url"
                            question={
                                <div class="w-[150px]">
                                    Cuando tu cliente le pregunte a la
                                    inteligencia Artificial. 'Más información
                                    del producto', la inteligencia Artificial le
                                    mandará esta url <br />
                                    Solo escribir la url del producto - sin la
                                    web {storageEmpresa!.web}
                                    <br />
                                    Ejemplo: /producto/12
                                </div>
                            }
                            placeholder="../producto/12"
                        />
                    ) : (
                        <></>
                    )}
                    <div class="flex justify-center">
                        <Form.button.submit
                            disabled={
                                mutateProductsNormalUpdateApi.isLoading || false
                            }
                            isLoading={
                                mutateProductsNormalUpdateApi.isLoading || false
                            }
                            title="Guardar"
                        />
                    </div>
                </Form>
                <AdminHr />
                <div class="flex justify-between items-center">
                    <h3 class="dark:text-white  font-bold uppercase text-center flex gap-2 break-words text-wrap ">
                        <i class="fa-solid fa-image" />
                        Editar imagenes - {product.name}
                    </h3>
                </div>
                <Form
                    {...formProductsNormalUpdateImages}
                    onSubmit={onUpdateImagesProduct}
                >
                    <Form.control.file
                        name={"images" as keyof ProductsUpdateImagesDto}
                        title="Images de perfil"
                        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                        typeFile="image"
                        multiple
                    />
                    <div class="flex justify-center">
                        <Form.button.submit
                            disabled={
                                mutateProductsNormalUpdateImagesApi.isLoading ||
                                false
                            }
                            isLoading={
                                mutateProductsNormalUpdateImagesApi.isLoading ||
                                false
                            }
                            ico={<i class="fas fa-pen" />}
                            title="Editar"
                        />
                    </div>
                </Form>
            </div>
        );
    }

    return component;
}

export default ProductsNormalUpdate;
