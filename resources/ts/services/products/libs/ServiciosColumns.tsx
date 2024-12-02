import type { Columns } from "@vigilio/preact-table";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { printImagesProduct } from "./helpers";
import { formatMoney, subtotalIgv } from "@/cart/libs/helpers";
import useAuthstore from "@/auth/stores/auth.store";
import useEmpresastore from "@/empresas/stores/empresa.store";
import { ProductsServicioSchemaFromServer } from "../schemas/products_servicio.schema";
import { getPeriodDescription } from "~/libs/helpers";
import ProductsServicioUpdate from "../views/ProductsServicioUpdate";

export type ProductsIndexSecondaryPaginator =
    | "acciones"
    | "index"
    | "cart"
    | "rating"
    | "servicio";

const serviciosColumns: Columns<
    ProductsServicioSchemaFromServer,
    ProductsIndexSecondaryPaginator
> = [
    { key: "id", cell: (_, i) => i + 1, isSort: true },
    {
        key: "product_code",
        header: "código",
        isSort: "id",
    },
    {
        key: "servicio",
        header: "Servicio",
        cell: (props) => (
            <div>
                {props.days.length ? (
                    <div class="grid grid-cols-2 gap-1 justify-center">
                        {props.days.map((day) => {
                            return (
                                <span
                                    key={day}
                                    class="text-xs bg-primary rounded-md text-white font-semibold"
                                >
                                    {getPeriodDescription(day.days)}
                                </span>
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
        ),
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
                                                    500
                                                ).map((img) => (
                                                    <img
                                                        key={img}
                                                        src={img}
                                                        width={300}
                                                        height={300}
                                                        alt={props.name}
                                                        class="object-cover w-[150px] h-[150px] rounded-md"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ),
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
                {formatMoney(subtotalIgv(props))}
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
        key: "acciones",
        cell: (props, _index, methods) => {
            const { guards } = useAuthstore();
            function onProductsUpdate() {
                sweetModal({
                    html: reactComponent(
                        <ProductsServicioUpdate id={props.id} />
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
                        onClick={() => methods.onOpenProduct(props)}
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
export default serviciosColumns;
