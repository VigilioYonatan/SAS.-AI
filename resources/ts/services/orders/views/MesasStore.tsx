import Form from "~/components/form";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { useMemo } from "preact/hooks";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import useSocketStore from "~/stores/socket.store";
import { MesasStoreDto, mesasStoreDto } from "../dtos/mesas.store.dto";
import { floorsIndexApi } from "../apis/mesas/floors.index.api";
import { mesasStoreApi } from "../apis/mesas/mesas.store.api";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

interface MesasStoreProps {
    onClose: () => void;
}
function MesasStore({ onClose }: MesasStoreProps) {
    const mesasStoreForm = useForm<MesasStoreDto>({
        resolver: valibotVigilio(mesasStoreDto),
        defaultValues: { empresa_id: storageEmpresa!.id },
    });
    const { io } = useSocketStore();

    const mesasStoreMutation = mesasStoreApi();
    const floorsIndexQuery = floorsIndexApi();

    const arrayFloors = useMemo(
        () =>
            floorsIndexQuery.isSuccess && floorsIndexQuery.data
                ? floorsIndexQuery.data.data.map((rol) => ({
                      key: rol.id,
                      value: rol.name,
                  }))
                : [],
        [floorsIndexQuery]
    );

    function onMesasStore(body: MesasStoreDto) {
        sweetModal({
            title: "¿Estas seguro de agregar una nueva mesa?",
            text: "Se agregará una nueva mesa",
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                mesasStoreMutation.mutate(body, {
                    onSuccess(data) {
                        onClose();
                        sweetAlert({
                            icon: "success",
                            title: `Se agregó nueva mesa ${data.mesa.mesa_code}`,
                        });
                        io?.emit("floors_mesas:index");
                    },
                    onError(error) {
                        sweetModal({
                            icon: "danger",
                            title: `Error en el servidor ${JSON.stringify(
                                error.message
                            )}`,
                            text: `Comunicarse con el desarrollador ${error}`,
                        });
                    },
                });
            }
        });
    }
    return (
        <div class="flex flex-col justify-center items-center">
            <div>
                <i class="far fa-tablet-rugged text-5xl dark:text-white text-secondary-dark mb-2" />
            </div>
            <span class="vigilio-title">Agregar una mesa</span>
            <Form {...mesasStoreForm} onSubmit={onMesasStore}>
                <Form.control.select
                    placeholder="Escoga el piso"
                    title="Piso"
                    name={"floor_id" as keyof MesasStoreDto}
                    array={arrayFloors}
                    options={{ valueAsNumber: true }}
                />
                <Form.button.submit
                    className="mx-auto"
                    disabled={mesasStoreMutation.isLoading || false}
                    isLoading={mesasStoreMutation.isLoading || false}
                    title="Guardar"
                />
            </Form>
        </div>
    );
}

export default MesasStore;
