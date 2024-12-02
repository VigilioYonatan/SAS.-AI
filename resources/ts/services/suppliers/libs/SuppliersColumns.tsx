import type { Columns } from "@vigilio/preact-table";
import type { SuppliersSchemaFromServer } from "../schemas/suppliers.schema";
import { printFileWithDimension } from "~/libs/upload";
import useCopyToClipboard from "~/hooks/useCopyToClipboard";
import { reactComponent } from "~/libs/preact";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import SuppliersUpdate from "../views/SuppliersUpdate";
import { useMediaQueryNoReactive } from "~/hooks/useMediaQuery";

export type SuppliersIndexSecondaryPaginator = "acciones" | "index";

const suppliersColumns: Columns<
    SuppliersSchemaFromServer,
    SuppliersIndexSecondaryPaginator,
    { refetch: (clean?: boolean) => void }
> = [
    {
        key: "id",
        cell: (_, i) => i + 1,
        isSort: true,
    },
    { key: "supplier_code", header: "Código" },
    {
        key: "ruc",
        header: "RUC",
        cell: (props) => {
            const [copy] = useCopyToClipboard();
            return (
                <button
                    type="button"
                    aria-label="copy"
                    class="flex gap-2 items-center justify-center active:text-primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        copy(props.ruc);
                        sweetAlert({
                            icon: "success",
                            title: "Copiado correctamente",
                        });
                    }}
                >
                    <span>{props.ruc}</span>
                    <span class="">
                        <i class="far fa-copy text-base" />
                    </span>
                </button>
            );
        },
    },
    { key: "razon_social", header: "Razon Social" },
    {
        key: "logo",
        cell: (props) => {
            if (!props.logo) return null;
            const image = printFileWithDimension(props.logo, 100);
            return (
                <img
                    class="mx-auto min-w-[50px]"
                    width={50}
                    height={50}
                    src={image[0]}
                    alt={props.razon_social}
                />
            );
        },
    },
    {
        key: "web",
        cell: (props) =>
            props.web ? (
                <a
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    href={props.web!}
                    class="text-white bg-blue-600 px-4 py-1 rounded-md"
                    target="_blank"
                    rel="noreferrer"
                >
                    <i class="fa-solid fa-globe mr-1" /> {props.web}
                </a>
            ) : null,
    },
    { key: "contact", header: "Telefono" },
    { key: "phone_one", header: "Celular" },
    {
        key: "acciones",
        cell: (props, _, methods) => {
            function onEditCoupon(e: Event) {
                e.stopPropagation();
                sweetModal((onClose) => ({
                    html: reactComponent(
                        <SuppliersUpdate
                            onClose={onClose}
                            refetch={methods.refetch}
                            id={props.id}
                        />
                    ),
                    isCloseInBackground: false,
                    sweetWidth: "800px",
                    showCloseButton: true,
                    position: useMediaQueryNoReactive("(min-width:500px)")
                        ? "center"
                        : "start",
                }));
            }
            return (
                <div>
                    <button
                        class="px-1 py-1 lg:px-4 lg:py-2 rounded-md bg-orange-600 text-white"
                        type="button"
                        aria-label="edit supplier"
                        onClick={onEditCoupon}
                    >
                        <i class="fa-solid text-sm fa-pen lg:mr-1" />
                    </button>
                </div>
            );
        },
    },
];
export default suppliersColumns;
