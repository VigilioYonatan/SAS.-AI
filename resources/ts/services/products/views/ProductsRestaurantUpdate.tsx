import { useFieldArray, useForm } from "react-hook-form";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { useEffect, useMemo } from "preact/hooks";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import Form from "~/components/form";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import AdminHr from "~/components/AdminHr";
import { subtotal as subtotalCart, formatMoney } from "@/cart/libs/helpers";
import { type JSX } from "preact/jsx-runtime";
import { valibotVigilio } from "~/libs/valibot";
import { getFilesEdit } from "~/libs/upload";
import { handlerError } from "~/libs/helpers";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import useAuthstore from "@/auth/stores/auth.store";
import {
    productsShowApi,
    type ProductsShowAPI,
} from "../apis/products/products.show.api";
import { formSelectNumber } from "~/components/form/WebFormSelect";
import {
    productsUpdateImagesDto,
    ProductsUpdateImagesDto,
} from "../dtos/products_normal.dto";
import { productsUpdateImagesApi } from "../apis/products/products_normal.update.api";
import { ProductsNormalSchemaFromServer } from "../schemas/products_normal.schema";
import { categoriesIndexApi } from "../apis/categories/categories.index.api";
import {
    productsRestaurantUpdateDto,
    ProductsRestaurantUpdateDto,
} from "../dtos/products_restaurant.dto";
import { productsRestaurantUpdateApi } from "../apis/products/products_restaurant.update.api";

interface ProductsRestaurantUpdateProps {
    id?: string | number;
    refetch?: (clean?: boolean) => void;
    refetchProduct?: (clean?: boolean) => void;
}
function ProductsRestaurantUpdate({
    id,
    refetch,
    refetchProduct,
}: ProductsRestaurantUpdateProps) {
    const { guards } = useAuthstore();
    if (!guards.permissionAdminGuard()) {
        window.history.back();
        return null;
    }
    const productQuery = productsShowApi(id as string);

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
        const formProductsRestaurantUpdate =
            useForm<ProductsRestaurantUpdateDto>({
                resolver: valibotVigilio(productsRestaurantUpdateDto),
                mode: "all",
                defaultValues: {
                    ...rest,
                    price: Number(rest.price),
                    discount: Number(rest.discount),
                },
            });
        const name = formProductsRestaurantUpdate.watch("name");
        const discount = formProductsRestaurantUpdate.watch("discount");
        const price = formProductsRestaurantUpdate.watch("price");
        const categoriesIndexQuery = categoriesIndexApi();
        const ilimit = formProductsRestaurantUpdate.watch("ilimit");

        const categoriesSelect = useMemo(() => {
            if (categoriesIndexQuery.isSuccess && categoriesIndexQuery.data) {
                return categoriesIndexQuery.data.data.map((value) => ({
                    key: value.id,
                    value: value.name,
                }));
            }
            return [];
        }, [categoriesIndexQuery.data, categoriesIndexQuery.isSuccess]);
        const formProductsRestaurantUpdateImages =
            useForm<ProductsUpdateImagesDto>({
                mode: "all",
                resolver: valibotVigilio(productsUpdateImagesDto),
            });

        const mutateProductsRestaurantUpdateApi = productsRestaurantUpdateApi(
            product.id
        );
        const mutateProductsRestaurantUpdateImagesApi = productsUpdateImagesApi(
            product.id
        );
        function onUpdateProduct(data: ProductsRestaurantUpdateDto) {
            sweetModal({
                title: "¿Estás seguro de editar este producto?",
                customIcon:
                    "<i class='fas fa-phone-laptop text-3xl dark:text-white' /> </i>",
                showCloseButton: true,
                showCancelButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    mutateProductsRestaurantUpdateApi.mutate(data, {
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
                            handlerError(formProductsRestaurantUpdate, error);
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
                    mutateProductsRestaurantUpdateImagesApi.mutate(
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
                                handlerError(
                                    formProductsRestaurantUpdate,
                                    error
                                );
                            },
                        }
                    );
                }
            });
        };

        useEffect(() => {
            if (name) {
                formProductsRestaurantUpdate.setValue(
                    "slug",
                    transformSlug(name || ""),
                    {
                        shouldValidate: true,
                    }
                );
            }
        }, [name]);

        useEffect(() => {
            formProductsRestaurantUpdate.setValue(
                "slug",
                transformSlug(name || ""),
                {
                    shouldValidate: true,
                }
            );
        }, [name]);

        async function initialUpdateImages() {
            if (product.images) {
                const images = await getFilesEdit(product.images, 800);
                formProductsRestaurantUpdateImages.setValue("images", images);
            }
        }

        const subtotal = useMemo(
            () => subtotalCart(price, discount),
            [discount, price]
        );

        useEffect(() => {
            initialUpdateImages();
        }, []);
        const { fields, remove, prepend } = useFieldArray({
            control: formProductsRestaurantUpdate.control,
            name: "characteristics",
        });

        component = (
            <div class="text-start  mt-6">
                <div class="flex justify-between items-center mb-4 ">
                    <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2 ">
                        {storageEmpresa!.tipo_empresa.tipo_servicio_id === 1 ? (
                            <i class="fas fa-phone-laptop" />
                        ) : (
                            <i class="fas fa-utensils" />
                        )}
                        <span class="break-words text-wrap ">
                            Editar Producto - {product.name}
                        </span>
                    </h3>
                </div>
                <Form
                    {...formProductsRestaurantUpdate}
                    onSubmit={onUpdateProduct}
                >
                    <div class="flex justify-end items-center mb-4">
                        <Form.button.reset />
                    </div>
                    <div class="w-full">
                        <div class="w-full flex flex-row gap-2">
                            <Form.control
                                name={
                                    "name" as keyof ProductsRestaurantUpdateDto
                                }
                                title="Nombre"
                                placeholder="Nombre de categoria"
                            />
                            <Form.control
                                name={
                                    "slug" as keyof ProductsRestaurantUpdateDto
                                }
                                title="Slug"
                                placeholder="nombre-de-producto"
                                options={{ setValueAs: transformSlug }}
                                disabled
                            />
                        </div>
                        <div class="w-full flex flex-col md:flex-row gap-2">
                            <Form.control
                                name={
                                    "price" as keyof ProductsRestaurantUpdateDto
                                }
                                type="number"
                                step={0.01}
                                title="Precio"
                                placeholder="S/. 10.00"
                                options={{ setValueAs: Number }}
                            />

                            <div class="w-full flex items-center gap-2">
                                <Form.control
                                    name={
                                        "discount" as keyof ProductsRestaurantUpdateDto
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
                                        {empresa.state!.enabled_igv
                                            ? `- ${formatMoney(
                                                  subtotalCart(
                                                      subtotal,
                                                      empresa.state!.igv,
                                                      true
                                                  )
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
                                name={
                                    "ilimit" as keyof ProductsRestaurantUpdateDto
                                }
                                title="Ilimitado"
                                question="Cuando la variante es ilimitado quiere decir que hay stock."
                            />
                            {!ilimit ? (
                                <Form.control
                                    name={
                                        "stock" as keyof ProductsRestaurantUpdateDto
                                    }
                                    type="number"
                                    title="Cantidad"
                                    placeholder="1"
                                    options={{ setValueAs: Number }}
                                />
                            ) : null}
                        </div>
                        <div class="w-full flex flex-row gap-2">
                            <Form.control.select
                                name={
                                    "category_id" as keyof ProductsRestaurantUpdateDto
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
                                    "enabled" as keyof ProductsRestaurantUpdateDto
                                }
                                title="Disponibilidad"
                                question="Cuando no está habilitado los clientes NO podrán comprar NI VER el producto, ."
                            />
                        </div>
                    </div>

                    <>
                        <Form.control.area
                            name={
                                "description" as keyof ProductsRestaurantUpdateDto
                            }
                            title="Descripción"
                            placeholder="descripción de producto"
                        />{" "}
                        {storageEmpresa!.web ? (
                            <Form.control
                                name={
                                    "url" as keyof ProductsRestaurantUpdateDto
                                }
                                title="Url"
                                question={
                                    <div class="w-[150px]">
                                        Cuando tu cliente le pregunte a la
                                        inteligencia Artificial. 'Más
                                        información del producto', la
                                        inteligencia Artificial le mandará este
                                        url <br />
                                    </div>
                                }
                                placeholder="http://tu-web/producto/..."
                            />
                        ) : (
                            <></>
                        )}
                    </>
                    <div class="mt-4 flex flex-col gap-2">
                        <span class="dark:text-white text-xs font-bold">
                            Caracterísiticas
                        </span>
                        <div class="h-[300px] overflow-auto">
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
                            ))}{" "}
                        </div>

                        <button
                            class="bg-primary px-4 py-2 rounded-md shadow text-white self-start"
                            type="button"
                            aria-label="to add"
                            onClick={() => {
                                prepend({ name: "", value: "" });
                            }}
                        >
                            +
                        </button>
                    </div>
                    <div class="flex justify-center">
                        <Form.button.submit
                            disabled={
                                mutateProductsRestaurantUpdateApi.isLoading ||
                                false
                            }
                            isLoading={
                                mutateProductsRestaurantUpdateApi.isLoading ||
                                false
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
                    {...formProductsRestaurantUpdateImages}
                    onSubmit={onUpdateImagesProduct}
                >
                    <Form.control.file
                        name={"images" as keyof ProductsUpdateImagesDto}
                        title="Images de perfil"
                        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                        typeFile="image"
                        multiple
                        showButonCopy
                    />
                    <div class="flex justify-center">
                        <Form.button.submit
                            disabled={
                                mutateProductsRestaurantUpdateImagesApi.isLoading ||
                                false
                            }
                            isLoading={
                                mutateProductsRestaurantUpdateImagesApi.isLoading ||
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

export default ProductsRestaurantUpdate;
