import type { Columns } from "@vigilio/preact-table";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { printImagesProduct } from "./helpers";
import { formatMoney, subtotalIgv } from "@/cart/libs/helpers";
import useAuthstore from "@/auth/stores/auth.store";
import useEmpresastore from "@/empresas/stores/empresa.store";
import ProductsUpdate from "../views/ProductsNormalUpdate";
import { ProductsNormalSchemaFromServer } from "../schemas/products_normal.schema";
import { Fragment } from "preact/jsx-runtime";
import ProductsShow from "../views/ProductsShow";

export type ProductsIndexSecondaryPaginator = "acciones" | "index" | "variants";

const productsColumns: Columns<
    ProductsNormalSchemaFromServer,
    ProductsIndexSecondaryPaginator
> = [
    { key: "id", cell: (_, i) => i + 1, isSort: true },
    {
        key: "product_code",
        header: "código",
        isSort: "id",
    },
    {
        key: "name",
        header: "nombre",
        isSort: true,
    },

    {
        key: "images",
        header: "imagenes",
        cell: (props) => {
            const images = printImagesProduct(props.images, 100);

            return (
                <div
                    class="relative  mx-auto flex justify-center items-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        class="w-[60px] h-[40px] object-cover"
                        width={100}
                        height={60}
                        src={images[0]}
                        alt={props.name}
                    />
                    {images.length > 1 ? (
                        <button
                            class="absolute top-[-10px] right-0  bg-success w-[25px] h-[25px] font-bold flex justify-center items-center rounded-full text-white"
                            aria-label="button to open images"
                            type="button"
                            onClick={() => {
                                sweetModal({
                                    html: reactComponent(
                                        <div class="flex flex-col gap-4">
                                            <span class="dark:text-white">
                                                Hay {images.length} imágenes
                                            </span>
                                            <div class="flex flex-wrap justify-center gap-5 max-w-[500px]">
                                                {printImagesProduct(
                                                    props.images,
                                                    null
                                                ).map((img) => (
                                                    <Fragment key={img}>
                                                        {img?.endsWith(
                                                            "mp4"
                                                        ) ? (
                                                            <video
                                                                src={img}
                                                                width={200}
                                                                height={200}
                                                                autoPlay
                                                                muted
                                                                loop
                                                                class="object-cover w-[150px] h-[150px] rounded-md"
                                                            />
                                                        ) : (
                                                            <img
                                                                key={img}
                                                                src={img}
                                                                width={200}
                                                                height={200}
                                                                alt={props.name}
                                                                class="object-cover w-[150px] h-[150px] rounded-md"
                                                            />
                                                        )}
                                                    </Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                    showCloseButton: true,
                                    isCloseInBackground: false,
                                });
                            }}
                        >{`+ ${images.slice(1).length}`}</button>
                    ) : null}
                </div>
            );
        },
    },
    {
        key: "price",
        header: "precio",
        cell: (props, _index) => (
            <span class="relative text-md font-bold">
                {formatMoney(subtotalIgv(props), true)}
                {props.discount > 0 ? (
                    <div class="absolute flex text-[0.7rem] font-bold justify-center text-white items-center bottom-[16px] right-[-10px] bg-red-600 w-[20px] h-[20px] rounded-full">
                        {props.discount} %
                    </div>
                ) : null}
                {useEmpresastore().state?.enabled_igv ? (
                    <div class="absolute flex text-[8px] font-bold justify-center text-white items-center bottom-[16px] right-[-25px] bg-primary rounded-full w-[20px] h-[20px]">
                        {useEmpresastore().state?.tipo_impuesto}
                    </div>
                ) : null}
            </span>
        ),
        isSort: true,
    },
    {
        key: "variants",
        header: "Opciones",
        cell: (props) => (
            <div class="flex gap-2 px-2 overflow-auto justify-center items-center">
                {(props as ProductsNormalSchemaFromServer)?.options.map(
                    (opt) => (
                        <div key={opt.id} class="flex gap-1 mb-2">
                            {opt.features.map((feature) => (
                                <Fragment key={feature?.id}>
                                    {opt.type === 1 ? (
                                        <div class=" px-2 py-1 rounded-md  bg-white dark:bg-admin-terciary dark:text-white text-xs font-bold flex items-center gap-2 shadow">
                                            {feature?.value}
                                        </div>
                                    ) : (
                                        <div
                                            class="relative w-[30px] h-[30px] rounded-full shadow  flex justify-center items-center group"
                                            style={{
                                                backgroundColor: feature?.value,
                                            }}
                                        >
                                            <span class="absolute -bottom-2 left-2 z-10 dark:bg-admin-background-dark shadow dark:text-white bg-white text-[10px] px-2 rounded-md py-1 hidden group-hover:block">
                                                {feature?.value}
                                            </span>
                                        </div>
                                    )}
                                </Fragment>
                            ))}
                        </div>
                    )
                )}
            </div>
        ),
    },
    {
        key: "acciones",
        cell: (props, _index, methods) => {
            const { guards } = useAuthstore();
            function onProductsUpdate() {
                sweetModal({
                    html: reactComponent(
                        <ProductsUpdate
                            id={props.id}
                            refetch={methods.refetch}
                        />
                    ),

                    sweetWidth: "800px",
                    showCloseButton: true,
                    position: "start",
                    isCloseInBackground: false,
                });
            }
            return (
                <div
                    class="flex items-center justify-center gap-1 text-white"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        class="px-1 py-1 lg:px-4 lg:py-2 rounded-md bg-success"
                        type="button"
                        aria-label="show product"
                        onClick={() => {
                            sweetModal((onClose) => ({
                                html: reactComponent(
                                    <ProductsShow
                                        id={props.id}
                                        onClose={onClose}
                                        refetch={methods.refetch}
                                        isService={false}
                                    />
                                ),
                                showCloseButton: true,
                                position: "start",
                                sweetWidth: "800px",
                                isCloseInBackground: false,
                            }));
                        }}
                    >
                        <i class="fa-solid text-sm fa-eye lg:mr-1" />
                    </button>
                    {guards.permissionAdminGuard() ? (
                        <>
                            <button
                                class="px-1 py-1 lg:px-4 lg:py-2 rounded-md bg-orange-600"
                                type="button"
                                aria-label="edit product"
                                onClick={onProductsUpdate}
                            >
                                <i class="fa-solid text-sm fa-pen lg:mr-1" />
                            </button>
                        </>
                    ) : null}
                </div>
            );
        },
    },
];
export default productsColumns;
