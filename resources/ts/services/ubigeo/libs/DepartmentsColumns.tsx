import type { Columns } from "@vigilio/preact-table";
import { reactComponent } from "~/libs/preact";
import { sweetModal } from "@vigilio/sweet";
import type { DepartmentsSchemaFromServer } from "../schemas/departments.schema";
import { formatMoney } from "@/cart/libs/helpers";
import DepartmentsUpdate from "../views/DepartmentsUpdate";
import useInformationStore from "@/information/stores/information.store";
import enviroments from "~/config";

export type DepartmentsIndexSecondaryPaginator =
    | "acciones"
    | "index"
    | "ubigeo";

const departmentsColumns: Columns<
    DepartmentsSchemaFromServer,
    DepartmentsIndexSecondaryPaginator,
    { refetch: (clean?: boolean) => void }
> = [
    { key: "ubigeo", cell: (props) => props.ubigeo, isSort: true },
    { key: "name", header: "Departamento", isSort: true },
    {
        key: "priceShipping",
        header: "Costo de envio",
        cell: (props) => {
            const information = useInformationStore();
            return (
                <div>
                    <span class="font-bold">
                        {props.priceShipping > 0
                            ? formatMoney(props.priceShipping)
                            : "GRATIS"}
                    </span>
                    {information.state!.igv && props.priceShipping > 0 ? (
                        <span class="ml-1">+{enviroments.VITE_IGV}% igv</span>
                    ) : null}
                </div>
            );
        },
        isSort: true,
    },
    {
        key: "days",
        header: "Dias de envio",
        cell: (props) => `${props.days} días`,
    },
    {
        key: "enabled",
        header: "Disponible Envio",
        cell: (props) => (
            <div
                class={`${
                    props.enabled ? "bg-success" : "bg-danger"
                } w-[15px] h-[15px] rounded-full mx-auto`}
            />
        ),
        isSort: true,
    },
    {
        key: "acciones",
        cell: (props, _, methods) => {
            function onEditCoupon(e: Event) {
                e.stopPropagation();
                sweetModal((onClose) => ({
                    html: reactComponent(
                        <DepartmentsUpdate
                            onClose={onClose}
                            refetch={methods.refetch}
                            ubigeo={props.ubigeo}
                        />
                    ),
                    isCloseInBackground: false,
                    sweetWidth: "600px",
                    showCloseButton: true,
                }));
            }
            return (
                <div>
                    <button
                        class="px-1 py-1 lg:px-4 lg:py-2 rounded-md bg-orange-600 text-white"
                        type="button"
                        aria-label="edit department"
                        onClick={onEditCoupon}
                    >
                        <i class="fa-solid text-sm fa-pen lg:mr-1" />
                    </button>
                </div>
            );
        },
    },
];
export default departmentsColumns;
