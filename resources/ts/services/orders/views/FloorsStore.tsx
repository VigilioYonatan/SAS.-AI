import { useForm } from "react-hook-form";
import Form from "~/components/form";
import { valibotVigilio } from "~/libs/valibot";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import useSocketStore from "~/stores/socket.store";
import { floorsStoreApi } from "../apis/mesas/floors.store.api";
import { floorsStoreDto, FloorsStoreDto } from "../dtos/floors.store.dto";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

interface FloorsStoreProps {
    onClose: () => void;
}
function FloorsStore({ onClose }: FloorsStoreProps) {
    const floorsStoreForm = useForm<FloorsStoreDto>({
        resolver: valibotVigilio(floorsStoreDto),
        defaultValues: { empresa_id: storageEmpresa!.id },
    });
    const { io } = useSocketStore();
    const floorsStoreMutation = floorsStoreApi();

    function onFloorsStore(body: FloorsStoreDto) {
        sweetModal({
            title: "¿Estas seguro de agregar una nuevo piso?",
            text: "Se agregará una nuevo piso",
            isCloseInBackground: false,
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                floorsStoreMutation.mutate(body, {
                    onSuccess(data) {
                        sweetAlert({
                            icon: "success",
                            title: `Se agregó nueva mesa ${data.floor.name}`,
                        });
                        io?.emit("floors_mesas:index");
                        onClose();
                    },
                    onError(error) {
                        if (error.body) {
                            floorsStoreForm.setError("name", {
                                message: error.message,
                            });
                            return;
                        }
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
                <i class="fa-regular fa-building text-5xl dark:text-white text-secondary-dark mb-2" />
            </div>
            <span class="vigilio-title">Agregar un piso</span>
            <Form {...floorsStoreForm} onSubmit={onFloorsStore}>
                <Form.control
                    placeholder="ejm. balcón, primer piso, segundo piso"
                    title="Nombre"
                    name={"name" as keyof FloorsStoreDto}
                />
                <Form.button.submit
                    className="mx-auto"
                    disabled={floorsStoreMutation.isLoading || false}
                    isLoading={floorsStoreMutation.isLoading || false}
                    title="Guardar"
                />
            </Form>
        </div>
    );
}

export default FloorsStore;
