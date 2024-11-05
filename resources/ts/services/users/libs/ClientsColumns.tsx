import type { Columns } from "@vigilio/preact-table";
import { ClientsSchemaFromServer } from "../schemas/client.schema";
import { formatTelephoneNumber, NOW, restarDays } from "~/libs/helpers";

import { storageEmpresa } from "@/empresas/stores/empresa.store";
import Form from "~/components/form";
import { clientsUpdateDto, ClientsUpdateDto } from "../dtos/clients.update.dto";
import { clientsUpdateApi } from "../apis/clients.update.api";
import { sweetAlert } from "@vigilio/sweet";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import useCopyToClipboard from "~/hooks/useCopyToClipboard";

export type ClientsIndexSecondaryPaginator = "acciones" | "index";

const clientsColumns: Columns<
    ClientsSchemaFromServer,
    ClientsIndexSecondaryPaginator
> = [
    { key: "id", isSort: true },
    { key: "fullname", header: "Nombre Completo" },
    {
        key: "telephone",
        header: "Teléfono",
        cell: (props) => {
            const [cp] = useCopyToClipboard();
            return (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    +{storageEmpresa!.dial_code}{" "}
                    {formatTelephoneNumber(props.telephone)}
                    <button
                        type="button"
                        onClick={() => {
                            cp(props.telephone).then(() => {
                                sweetAlert({
                                    icon: "success",
                                    title: "Copiado correctamente",
                                });
                            });
                        }}
                    >
                        <i class="far fa-copy ml-2" />
                    </button>
                </div>
            );
        },
    },
    { key: "address", cell: (props) => `${props.address}-${props.reference}` },
    { key: "email", isSort: true, cell: (props) => props.email || "-" },
    {
        key: "buys",
        header: "Compras Realizados",
        cell: (props) => (
            <div class="h-[60px] overflow-auto w-[200px]">
                {props.buys?.length ? (
                    <div class="flex flex-col gap-1">
                        {props.buys.slice(0, 10).map((buy, i) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            <div class="flex gap-1 items-center" key={i}>
                                <span class="flex">
                                    <b class="font-bold">Orden:</b>{" "}
                                    <a
                                        class="hover:text-primary"
                                        href={`/admin/orders/${buy.order}`}
                                    >
                                        {buy.order}
                                    </a>{" "}
                                </span>
                                <span class="flex">
                                    <b class="font-bold">Nombre:</b>{" "}
                                    <span>{buy.title}</span>
                                </span>
                                {buy.date ? (
                                    <span class="flex">
                                        <b class="font-bold">Vence:</b>{" "}
                                        <span>
                                            {restarDays(NOW(), buy.date, "day")}{" "}
                                            días
                                        </span>
                                    </span>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : (
                    <span class="text-xs">No hay compras</span>
                )}
            </div>
        ),
    },
    {
        key: "enabled",
        header: "Habilitado",
        cell: (props) => {
            return (
                <div>
                    <div
                        class={`${
                            props.enabled ? "bg-success" : "bg-danger"
                        } w-[15px] h-[15px] rounded-full mx-auto`}
                    />
                </div>
            );
        },
    },
    {
        key: "acciones",
        cell: (props, _index) => {
            const clientupdate = clientsUpdateApi(props.telephone);
            const clientUpdateForm = useForm<ClientsUpdateDto>({
                context: valibotVigilio(clientsUpdateDto),
                defaultValues: { enabled: props.enabled },
            });
            function onUpdateClient(body: boolean) {
                clientupdate.mutate(
                    { enabled: body },
                    {
                        onSuccess() {
                            sweetAlert({
                                icon: "success",
                                title: "Actualizado correctamente.",
                                timer: 3,
                            });
                        },
                        onError(data) {
                            sweetAlert({ icon: "danger", title: data.message });
                        },
                    }
                );
            }
            return (
                <div
                    class="flex gap-2 items-center justify-center "
                    onClick={(e) => e.stopPropagation()}
                >
                    <Form
                        className="flex justify-center items-center w-full [&>div>div>div]:w-full"
                        onSubmit={() => {}}
                        {...clientUpdateForm}
                    >
                        <Form.control.toggle
                            title="Habilitar Cliente"
                            name={"enabled" as keyof ClientsUpdateDto}
                            options={{
                                onChange(e) {
                                    onUpdateClient(e.target.checked);
                                },
                            }}
                        />
                    </Form>
                </div>
            );
        },
    },
];
export default clientsColumns;
