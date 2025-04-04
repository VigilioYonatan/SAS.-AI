import { formatDate } from "@vigilio/express-core/helpers";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { printImagesProduct, productOBJ } from "../libs/helpers";
import useAuthstore from "@/auth/stores/auth.store";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import { formatMoney, subtotal, subtotalIgv } from "@/cart/libs/helpers";
import View404 from "@/admin/views/404";
import Loading from "@/admin/components/Loading";
import ProductsUpdate from "./ProductsNormalUpdate";
import { reactComponent } from "~/libs/preact";
import { productsDestroyApi } from "../apis/products/products.destroy.api";
import { productsShowApi } from "../apis/products/products.show.api";
import { Fragment } from "preact/jsx-runtime";
import useCartStore from "@/cart/stores/cart.store";
import { cartStoreApi } from "@/cart/apis/cart.store.api";
import LoaderSubmit from "~/components/LoaderSubmit";
import VariantsShow from "./options/VariantsShow";
import ProductNotification from "../components/ProductNotification";
import { ProductsNormalSchemaFromServer } from "../schemas/products_normal.schema";
import ProductsRestaurantUpdate from "./ProductsRestaurantUpdate";
import { ProductsRestaurantSchema } from "../schemas/products_restaurant.schema";
import { ProductsServicioSchemaFromServer } from "../schemas/products_servicio.schema";
import { getPeriodDescription } from "~/libs/helpers";
import ProductsServicioUpdate from "./ProductsServicioUpdate";
import { bgPrimaryHover } from "~/config/settings";

interface ProductsShowProps {
    id?: string | number;
    refetch?: (clean?: boolean) => void;
    onClose?: () => void;
    isService: boolean;
}
function ProductsShow({ id, refetch, onClose, isService }: ProductsShowProps) {
    const productsDestroyMutation = productsDestroyApi(isService);
    const { guards } = useAuthstore();
    const productsShowApiQuery = productsShowApi(id as string, isService);
    const empresaStore = useEmpresastore();

    let component = null;

    if (productsShowApiQuery.isLoading) {
        component = <Loading />;
    }
    if (productsShowApiQuery.isError) {
        component = <View404 message={`No se encontró un producto ${id}`} />;
    }
    if (productsShowApiQuery.isSuccess && productsShowApiQuery.data) {
        const { product } = productsShowApiQuery.data;

        const images = printImagesProduct(product.images, 500);
        // const variantsDeleteMutation = variantsDeleteApi(product.id);
        function onProductsUpdate() {
            sweetModal({
                html: reactComponent(
                    [1, 3].includes(
                        storageEmpresa!.tipo_empresa.tipo_servicio_id
                    ) ? (
                        isService ? (
                            <ProductsServicioUpdate
                                refetchProduct={productsShowApiQuery.refetch}
                                id={product.id}
                                refetch={refetch}
                            />
                        ) : (
                            <ProductsUpdate
                                refetchProduct={productsShowApiQuery.refetch}
                                id={product.id}
                                refetch={refetch}
                            />
                        )
                    ) : (
                        <ProductsRestaurantUpdate
                            refetchProduct={productsShowApiQuery.refetch}
                            id={product.id}
                            refetch={refetch}
                        />
                    )
                ),
                sweetWidth: "1000px",
                showCloseButton: true,
                position: "start",
                isCloseInBackground: false,
            });
        }
        component = (
            <div class="p-4">
                <div class="flex gap-4 flex-col text-start">
                    <div class="relative w-[150px] h-[150px] mb-5 mx-auto">
                        <img
                            src={images[0]}
                            class="rounded-md   object-contain  w-full h-full"
                            width="150"
                            height="150"
                            alt={product.name}
                        />
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={`/${isService ? "servicio/" : ""}${
                                product.slug
                            }`}
                            class="absolute bottom-0 right-0 m-2 bg-primary text-white px-2 py-1 rounded-md"
                        >
                            <i class="fas fa-globe-europe" />
                        </a>
                    </div>

                    <p class="mx-auto text-xl relative font-bold dark:text-white">
                        {formatMoney(
                            subtotal(product.price, product.discount ?? 0),
                            true
                        )}{" "}
                        - {formatMoney(subtotalIgv(product), true)}
                        <span class="flex gap-2 items-center">
                            {product.discount > 0 ? (
                                <span class="absolute -top-3 right-6 text-xs bg-success  rounded-md text-white">
                                    - {product.discount}% desc.
                                </span>
                            ) : null}
                            {empresaStore.state?.enabled_igv ? (
                                <span class="absolute -top-3 -right-8 text-xs bg-primary  rounded-md text-white">
                                    + {empresaStore.state?.igv}%{" "}
                                    {empresaStore.state?.tipo_impuesto}
                                </span>
                            ) : null}
                        </span>
                    </p>
                    <div class="flex gap-4 flex-wrap justify-center  font-semibold">
                        <div class="flex-1 min-w-[250px]">
                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    ID:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {product.id}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3 p-2 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Código:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {product.product_code}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3 p-2 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Nombre:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide break-words">
                                    {product.name}
                                </span>
                            </div>
                            {isService ? (
                                <div class="flex gap-1 flex-col mb-3 p-2 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md  dark:text-white">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Servicio:
                                    </span>
                                    <div>
                                        {(
                                            product as ProductsServicioSchemaFromServer
                                        ).days?.length ? (
                                            <div class="flex flex-col gap-1">
                                                {(
                                                    product as ProductsServicioSchemaFromServer
                                                ).days.map((day) => {
                                                    return (
                                                        <div
                                                            key={day.days}
                                                            class="flex gap-2 items-center"
                                                        >
                                                            <span class="text-xs">
                                                                {getPeriodDescription(
                                                                    day.days
                                                                )}
                                                            </span>
                                                            *
                                                            <span class="text-xs">
                                                                {day.cantidad}
                                                            </span>
                                                            =
                                                            <span class="text-xs">
                                                                {formatMoney(
                                                                    subtotalIgv(
                                                                        product,
                                                                        true
                                                                    ) *
                                                                        day.cantidad
                                                                )}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <>
                                                <span>
                                                    <i class="fas fa-handshake-alt" />
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Descripción:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark  overflow-auto h-[180px] ">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                product.description ||
                                                "no hay descripción",
                                        }}
                                    />
                                </span>
                            </div>
                            {(product as ProductsNormalSchemaFromServer)
                                .brand_id ? (
                                <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Marca:
                                    </span>
                                    <div class="dark:text-secondary-light text-secondary-dark tracking-wide flex gap-2 items-center">
                                        <span>
                                            {
                                                (
                                                    product as ProductsNormalSchemaFromServer
                                                ).brand.name
                                            }
                                        </span>
                                    </div>
                                </div>
                            ) : null}
                            <div class="flex gap-1 flex-col mb-3 p-2 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md">
                                <span class="text-primary dark:text-terciary font-bold break-words text-wrap">
                                    Slug:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide break-words">
                                    {product.slug}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Descuento:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide line-clamp-2">
                                    {product.discount}%
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3 p-2 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Disponibilidad:
                                </span>
                                <span
                                    class={`${
                                        product.enabled
                                            ? "bg-success"
                                            : "bg-danger"
                                    } px-4 py-1 rounded-md text-white self-start`}
                                >
                                    {product.enabled
                                        ? "Habilitado"
                                        : "Desabilitado"}
                                </span>
                            </div>
                            {[1, 3].includes(
                                storageEmpresa!.tipo_empresa.tipo_servicio_id
                            ) &&
                            (product as ProductsNormalSchemaFromServer)
                                .enabled_local ? (
                                <div class="flex gap-1 flex-col mb-3 p-2 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Disponible en local:
                                    </span>
                                    <span
                                        class={`${
                                            (
                                                product as ProductsNormalSchemaFromServer
                                            ).enabled_local
                                                ? "bg-success"
                                                : "bg-danger"
                                        } px-4 py-1 rounded-md text-white self-start`}
                                    >
                                        {(
                                            product as ProductsNormalSchemaFromServer
                                        ).enabled_local
                                            ? "Habilitado"
                                            : "Desabilitado"}
                                    </span>
                                </div>
                            ) : null}{" "}
                            {[1, 3].includes(
                                storageEmpresa!.tipo_empresa.tipo_servicio_id
                            ) &&
                            (product as ProductsNormalSchemaFromServer)
                                .enabled_web ? (
                                <div class="flex gap-1 flex-col mb-3 p-2 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Disponible en Tienda WEB:
                                    </span>
                                    <span
                                        class={`${
                                            (
                                                product as ProductsNormalSchemaFromServer
                                            ).enabled_web
                                                ? "bg-success"
                                                : "bg-danger"
                                        } px-4 py-1 rounded-md text-white self-start`}
                                    >
                                        {(
                                            product as ProductsNormalSchemaFromServer
                                        ).enabled_web
                                            ? "Habilitado"
                                            : "Desabilitado"}
                                    </span>
                                </div>
                            ) : null}
                        </div>
                        <div class="flex-1 min-w-[250px]">
                            <div class="flex gap-1 flex-col mb-3  p-2 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Precio Normal:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {formatMoney(product.price, true)}
                                </span>
                            </div>

                            {storageEmpresa?.tipo_empresa.tipo_servicio_id ===
                            2 ? (
                                <div class="flex gap-1 flex-col mb-3  p-2 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Cantidad:
                                    </span>
                                    <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                        {(product as ProductsRestaurantSchema)
                                            .ilimit
                                            ? "En Stock"
                                            : `${
                                                  (
                                                      product as ProductsRestaurantSchema
                                                  ).stock
                                              } Unidades`}
                                    </span>
                                </div>
                            ) : null}

                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    categoría:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {product.category.name}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Características:
                                </span>
                                <div class="w-full overflow-auto max-h-[300px]">
                                    {product.characteristics.length ? (
                                        <>
                                            <table class="text-sm text-left  h-full shadow w-full">
                                                <thead class="text-[10px] lg:text-xs bg-paper-light  dark:text-secondary-light dark:text-terciary-dark uppercase  shadow-sm  border-b dark:border-admin-terciary">
                                                    <tr>
                                                        <td class="px-1 py-1  dark:bg-admin-paper-dark  text-center cursor-pointer">
                                                            Nombre
                                                        </td>
                                                        <td class="px-1 py-1  dark:bg-admin-paper-dark text-center cursor-pointer">
                                                            Valor
                                                        </td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {product.characteristics.map(
                                                        (characterisitc) => {
                                                            return (
                                                                <tr
                                                                    class={`border-b bg-white dark:bg-transparent dark:border-admin-terciary border-paper-light  text-black dark:text-white hover:bg-primary ${bgPrimaryHover()}`}
                                                                    key={
                                                                        characterisitc.name
                                                                    }
                                                                >
                                                                    <td>
                                                                        {characterisitc.name.slice(
                                                                            0,
                                                                            20
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {characterisitc.value.slice(
                                                                            0,
                                                                            20
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                </tbody>
                                            </table>
                                        </>
                                    ) : (
                                        <span class="text-xs dark:text-white">
                                            No hay caracteristicas
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div class="flex gap-1 flex-col mb-3 p-2 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Creado:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {formatDate(product.createdAt!)}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2 ">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Actualizado:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {formatDate(product.updatedAt!)}
                                </span>
                            </div>
                            {guards.permissionAdminGuard() ? (
                                <div class="flex gap-1 flex-col mb-3 p-2 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Acciones:
                                    </span>
                                    <div class="flex items-center gap-1 text-white">
                                        <button
                                            type="button"
                                            aria-label="update producto"
                                            class="px-4 py-2 gap-2 flex items-center rounded-md bg-blue-600"
                                            onClick={onProductsUpdate}
                                        >
                                            <i class="fa-solid text-sm fa-pen lg:mr-1" />
                                            <span class="text-xs">Editar</span>
                                        </button>
                                        <button
                                            class="px-4 py-2 rounded-md bg-red-600 flex items-center  text-white relative"
                                            type="button"
                                            aria-label="button to delete product"
                                            onClick={() => {
                                                sweetModal({
                                                    title: "Estas seguro?",
                                                    text: `Quieres eliminar este producto <b>${product.name}</b>`,
                                                    icon: "danger",
                                                    showCancelButton: true,
                                                    confirmButtonText:
                                                        "Si, Eliminar!",
                                                    showCloseButton: true,
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        productsDestroyMutation.mutate(
                                                            product.id,
                                                            {
                                                                onSuccess:
                                                                    () => {
                                                                        sweetAlert(
                                                                            {
                                                                                icon: "success",
                                                                                title: `El producto ${product.name} fue eliminado correctamente`,
                                                                            }
                                                                        );
                                                                        if (
                                                                            refetch
                                                                        ) {
                                                                            refetch();
                                                                        }
                                                                        if (
                                                                            onClose
                                                                        ) {
                                                                            onClose();
                                                                        }
                                                                    },
                                                                onError: (
                                                                    error
                                                                ) => {
                                                                    sweetModal({
                                                                        icon: "danger",
                                                                        text: `El producto ${
                                                                            product.name
                                                                        } no fue eliminado, :${JSON.stringify(
                                                                            error
                                                                        )}`,
                                                                        title: "Error!",
                                                                    });
                                                                },
                                                            }
                                                        );
                                                    }
                                                });
                                            }}
                                        >
                                            <i class="fa-solid text-sm fa-trash px-1" />
                                            <span class="text-xs">
                                                Eliminar
                                            </span>
                                            <span
                                                aria-label="on check delete"
                                                class="absolute bottom-8 w-[20px] h-[20px] bg-black rounded-full shadow group"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                ?
                                                <span class="absolute bottom-3 text-xs hidden group-hover:block w-[200px] bg-black text-white rounded-md">
                                                    No se recomienda eliminar
                                                    productos. Se recomienda
                                                    deshabilitar en
                                                    disponibilidad para no
                                                    volver a crear producto.
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ) : null}

                            {(product as ProductsNormalSchemaFromServer)
                                .options ? (
                                <div class="flex flex-col gap-2 ">
                                    <span class="text-primary dark:text-terciary font-bold relative">
                                        Opciones:
                                        <button
                                            type="button"
                                            aria-label="show"
                                            class="absolute group  top-0 right-3 shadow-md bg-white dark:bg-admin-terciary px-2 text-xs py-1 rounded-full"
                                        >
                                            <i class="fa-solid fa-question text-xs" />
                                            <span class="absolute w-[300px] shadow hidden group-hover:block right-4 p-2 rounded-md dark:bg-admin-background-dark bg-white text-black dark:text-white">
                                                Cuado se cambia las opciones se
                                                crearan nuevamente las variantes
                                            </span>
                                        </button>
                                    </span>
                                    <div class="">
                                        {(
                                            product as ProductsNormalSchemaFromServer
                                        ).options.map((opt) => (
                                            <div
                                                key={opt.id}
                                                class="flex flex-col gap-2 mb-2"
                                            >
                                                <span class="dark:text-white text-xs">
                                                    {opt.name}
                                                </span>
                                                <div class="flex flex-wrap gap-2 ">
                                                    {opt.features.map(
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
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    {(product as ProductsNormalSchemaFromServer).variants ? (
                        <div class="flex flex-col gap-2 overflow-auto">
                            <span class="text-primary dark:text-terciary font-bold">
                                Variantes:
                            </span>
                            <div class="w-full">
                                {(product as ProductsNormalSchemaFromServer)
                                    .variants.length ? (
                                    <>
                                        <table class="text-sm text-left  h-full shadow w-full">
                                            <thead class="text-[10px] lg:text-xs bg-paper-light dark:bg-admin-terciary dark:text-secondary-light dark:text-terciary-dark uppercase  shadow-sm  border-b dark:border-admin-terciary">
                                                <tr>
                                                    <td>
                                                        <i class="fas fa-shopping-cart px-2" />
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
                                                        Vendidos
                                                    </td>
                                                    <td class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer">
                                                        Acciones
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(
                                                    product as ProductsNormalSchemaFromServer
                                                ).variants.map((variant) => {
                                                    const { methods } =
                                                        useCartStore();
                                                    const cartStoreMutation =
                                                        cartStoreApi();
                                                    const existProductInCart =
                                                        methods.isAlreadyExistProductToCart(
                                                            product.id,
                                                            variant.id
                                                        );
                                                    return (
                                                        <tr
                                                            class={`border-b  dark:border-admin-terciary border-paper-light  text-black hover:bg-primary ${bgPrimaryHover()}`}
                                                            key={variant.id}
                                                        >
                                                            <td>
                                                                <>
                                                                    {/* if product is enabled , ilimit and stock +1 */}
                                                                    {!product.enabled ||
                                                                    (!variant.ilimit &&
                                                                        variant.stock! <
                                                                            1) ? (
                                                                        <div class="flex justify-center items-center">
                                                                            <i class="fas fa-empty-set mx-auto" />
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            disabled={
                                                                                cartStoreMutation.isLoading ||
                                                                                false
                                                                            }
                                                                            class={`${
                                                                                existProductInCart
                                                                                    ? "bg-danger"
                                                                                    : "bg-yellow-600"
                                                                            } px-1 py-1 lg:px-4 lg:py-2 rounded-md  text-white `}
                                                                            type="button"
                                                                            aria-label="to add Cart"
                                                                            onClick={async (
                                                                                e
                                                                            ) => {
                                                                                e.stopPropagation();
                                                                                if (
                                                                                    !existProductInCart
                                                                                ) {
                                                                                    await cartStoreMutation.mutateAsync(
                                                                                        {
                                                                                            quantity: 1,
                                                                                            ...productOBJ(
                                                                                                product.id
                                                                                            ),
                                                                                            coupon: null,
                                                                                            variant_id:
                                                                                                variant.id,
                                                                                        }
                                                                                    );
                                                                                    methods.onInsertProduct(
                                                                                        {
                                                                                            ...product,
                                                                                            quantity: 1,
                                                                                            subtotal:
                                                                                                subtotalIgv(
                                                                                                    product
                                                                                                ),
                                                                                            coupon: null,
                                                                                            variant:
                                                                                                variant,
                                                                                        }
                                                                                    );
                                                                                    sweetAlert(
                                                                                        {
                                                                                            showCloseButton:
                                                                                                true,
                                                                                            html: reactComponent(
                                                                                                <ProductNotification
                                                                                                    product={
                                                                                                        product
                                                                                                    }
                                                                                                />
                                                                                            ),
                                                                                            height: 100,
                                                                                            width: 300,
                                                                                            timer: 2,
                                                                                        }
                                                                                    );
                                                                                }
                                                                            }}
                                                                        >
                                                                            {cartStoreMutation.isLoading ? (
                                                                                <LoaderSubmit />
                                                                            ) : (
                                                                                <i class="fas fa-shopping-cart" />
                                                                            )}
                                                                        </button>
                                                                    )}
                                                                </>
                                                            </td>
                                                            <td>
                                                                <div class="flex gap-2 items-center justify-center flex-wrap my-1">
                                                                    {variant.features
                                                                        .map(
                                                                            ({
                                                                                option_id,
                                                                                id,
                                                                            }) => {
                                                                                return (
                                                                                    <Fragment
                                                                                        key={
                                                                                            id
                                                                                        }
                                                                                    >
                                                                                        {(
                                                                                            product as ProductsNormalSchemaFromServer
                                                                                        ).options.map(
                                                                                            (
                                                                                                opt
                                                                                            ) => {
                                                                                                const feature =
                                                                                                    opt.features.find(
                                                                                                        (
                                                                                                            feat
                                                                                                        ) =>
                                                                                                            feat.id ===
                                                                                                                id &&
                                                                                                            feat.option_id ===
                                                                                                                option_id
                                                                                                    );
                                                                                                if (
                                                                                                    feature
                                                                                                ) {
                                                                                                    return (
                                                                                                        <Fragment
                                                                                                            key={
                                                                                                                opt?.id
                                                                                                            }
                                                                                                        >
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
                                                                                                                            feature?.description
                                                                                                                        }
                                                                                                                    </span>
                                                                                                                </div>
                                                                                                            )}
                                                                                                        </Fragment>
                                                                                                    );
                                                                                                }
                                                                                                return null;
                                                                                            }
                                                                                        )}
                                                                                    </Fragment>
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
                                                                <span class="flex  justify-center items-center text-center text-xs dark:text-white">
                                                                    {variant.sku
                                                                        ? variant.sku
                                                                        : "no se insertó sku"}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <span class="flex justify-center items-center  dark:text-white">
                                                                    {variant.ilimit
                                                                        ? "Stock"
                                                                        : variant.stock}
                                                                </span>
                                                            </td>
                                                            <td class="flex justify-center items-center ">
                                                                <div class="relative text-xs text-center">
                                                                    {variant
                                                                        .images
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
                                                                                product.images,
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

                                                                    {variant
                                                                        .images
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
                                                                                                    seleccionados
                                                                                                </span>
                                                                                                <div class="flex flex-wrap justify-center gap-5 max-w-[500px]">
                                                                                                    {printImagesProduct(
                                                                                                        product.images,
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
                                                                                                                <Fragment
                                                                                                                    key={
                                                                                                                        img
                                                                                                                    }
                                                                                                                >
                                                                                                                    {img?.endsWith(
                                                                                                                        "mp4"
                                                                                                                    ) ? (
                                                                                                                        <video
                                                                                                                            src={
                                                                                                                                img
                                                                                                                            }
                                                                                                                            width={
                                                                                                                                200
                                                                                                                            }
                                                                                                                            height={
                                                                                                                                200
                                                                                                                            }
                                                                                                                            autoplay
                                                                                                                            muted
                                                                                                                            loop
                                                                                                                        />
                                                                                                                    ) : (
                                                                                                                        <img
                                                                                                                            key={
                                                                                                                                img
                                                                                                                            }
                                                                                                                            src={
                                                                                                                                img
                                                                                                                            }
                                                                                                                            width={
                                                                                                                                200
                                                                                                                            }
                                                                                                                            height={
                                                                                                                                200
                                                                                                                            }
                                                                                                                            alt={
                                                                                                                                variant.sku ??
                                                                                                                                "sku"
                                                                                                                            }
                                                                                                                            class="object-cover w-[150px] h-[150px] rounded-md"
                                                                                                                        />
                                                                                                                    )}
                                                                                                                </Fragment>
                                                                                                            )
                                                                                                        )}
                                                                                                </div>
                                                                                            </div>
                                                                                        ),
                                                                                        showCloseButton:
                                                                                            true,
                                                                                        isCloseInBackground:
                                                                                            false,
                                                                                    }
                                                                                );
                                                                            }}
                                                                        >{`+ ${
                                                                            variant.images.slice(
                                                                                1
                                                                            )
                                                                                .length
                                                                        }`}</button>
                                                                    ) : null}
                                                                </div>
                                                            </td>
                                                            <td class="">
                                                                <div class="flex justify-center items-center  dark:text-white">
                                                                    {
                                                                        variant.totalSold
                                                                    }
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
                                                                                                productsShowApiQuery.refetch
                                                                                            }
                                                                                            product_id={
                                                                                                product.id
                                                                                            }
                                                                                            variant_id={
                                                                                                variant.id
                                                                                            }
                                                                                            product={
                                                                                                product as ProductsNormalSchemaFromServer
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
                                                                        <i class="fas fa-pen text-white" />
                                                                    </button>
                                                                    {/* <button
																		class="text-white bg-danger px-2 py-1 rounded-md text-xs"
																		type="button"
																		aria-label="delete variant"
																		onClick={() => {
																			sweetModal({
																				title:
																					"¿Estas seguro de eliminar esta variante?",
																				icon: "info",
																			}).then(({ isConfirmed }) => {
																				if (isConfirmed) {
																					variantsDeleteMutation.mutate(
																						variant.id,
																						{
																							onSuccess() {
																								productsShowApiQuery.refetch(
																									false,
																								);
																								sweetAlert({
																									title:
																										"Eliminado correctamente.",
																									icon: "success",
																								});
																							},
																							onError() {
																								sweetAlert({
																									title: "No se eliminó.",
																									icon: "danger",
																								});
																							},
																						},
																					);
																				}
																			});
																		}}
																	>
																		<i class="fas fa-trash text-white" />
																	</button> */}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
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
                    ) : null}

                    {images.length > 1 ? (
                        <div class="flex flex-wrap gap-1 mt-2 flex-col ">
                            <span class="dark:text-white font-bold text-xs mb-2">
                                Imagenes{" "}
                                <b class="bg-primary px-2 py-1 rounded-md text-white">
                                    {images.length}
                                </b>
                            </span>
                            <div class="flex gap-2">
                                {images.map((img) => (
                                    <Fragment key={img}>
                                        {img?.endsWith("mp4") ? (
                                            <video
                                                src={img}
                                                loop
                                                muted
                                                autoPlay
                                                width="100"
                                                height="100"
                                                class="w-[50px] h-[50px] object-contain rounded-md"
                                            />
                                        ) : (
                                            <img
                                                key={img}
                                                src={img}
                                                width="80"
                                                height="80"
                                                class="w-[50px] h-[50px] object-contain rounded-md"
                                                alt={product.name}
                                            />
                                        )}
                                    </Fragment>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
    return component;
}

export default ProductsShow;
