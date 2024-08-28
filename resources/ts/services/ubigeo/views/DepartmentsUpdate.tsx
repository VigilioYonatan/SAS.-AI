import useAuthStore from "@/auth/stores/auth.store";
import { departmentsUpdateApi } from "../apis/departments.update.api";
import { departmentsShowApi } from "../apis/departments.show.api";
import { valibotVigilio } from "~/libs/valibot";
import {
    departmentsUpdateDto,
    type DepartmentsUpdateDto,
} from "../dtos/departments.update.dto";
import { useForm } from "react-hook-form";
import Form from "~/components/form";
import View404 from "@/admin/views/404";
import Loading from "@/admin/components/Loading";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import { formatMoney, subtotal } from "@/cart/libs/helpers";
import enviroments from "~/config";
import useInformationStore from "@/information/stores/information.store";

interface DepartmentsUpdateProps {
    refetch: (clean?: boolean) => void;
    ubigeo: string;
    onClose: () => void;
}

function DepartmentsUpdate({
    ubigeo,
    refetch,
    onClose,
}: DepartmentsUpdateProps) {
    const { guards } = useAuthStore();
    if (!guards.permissionAdminGuard()) {
        window.history.back();
        return null;
    }
    const departmentsQuery = departmentsShowApi(ubigeo);

    let component: JSX.Element | JSX.Element[] | null = null;

    if (departmentsQuery.isLoading) {
        component = <Loading />;
    }
    if (departmentsQuery.isError) {
        component = (
            <View404 message={`No se encontró un departamento: ${ubigeo}`} />
        );
    }
    if (departmentsQuery.isSuccess) {
        const department = departmentsQuery.data!.department;
        const departmentsUpdateDtoForm = useForm<DepartmentsUpdateDto>({
            resolver: valibotVigilio(departmentsUpdateDto),
            mode: "all",
            defaultValues: department,
        });

        const departmentsUpdateMutation = departmentsUpdateApi(ubigeo);
        const price = departmentsUpdateDtoForm.watch("priceShipping");
        const information = useInformationStore();
        function onUpdateSupplier(body: DepartmentsUpdateDto) {
            sweetModal({
                title: `¿Estás seguro de editar el departamento ${department.name}?`,
                customIcon:
                    "<i class='far fa-person-dolly dark:text-white text-3xl' ></i>",
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    departmentsUpdateMutation.mutate(body, {
                        onSuccess() {
                            sweetAlert({
                                icon: "success",
                                title: `Se realizó los cambios correctamente ${department.name}`,
                            });
                            refetch(false);
                            onClose();
                        },
                        onError(error) {
                            handlerError(departmentsUpdateDtoForm, error);
                        },
                    });
                }
            });
        }

        component = (
            <div class="text-start  mt-6">
                <Form {...departmentsUpdateDtoForm} onSubmit={onUpdateSupplier}>
                    <div class="flex justify-between items-center flex-wrap">
                        <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2 items-center">
                            <i class="far fa-person-dolly" />
                            Editar Departamento Envio {department.name}
                        </h3>
                        <Form.button.reset />
                    </div>

                    <div class="flex flex-col md:flex-row gap-2 items-center">
                        <Form.control
                            title="Departamento"
                            name={"name" as keyof DepartmentsUpdateDto}
                            disabled
                        />
                        <div class="flex gap-2 items-center w-full">
                            <Form.control
                                type="number"
                                title="Precio de envio"
                                name={
                                    "priceShipping" as keyof DepartmentsUpdateDto
                                }
                                placeholder="S/. 0"
                                options={{ setValueAs: Number }}
                            />
                            {information.state!.igv ? (
                                <span class="dark:text-white text-xs">
                                    inc. +{enviroments.VITE_IGV}%{" "}
                                    {formatMoney(
                                        subtotal(
                                            price,
                                            enviroments.VITE_IGV,
                                            true
                                        )
                                    )}{" "}
                                    igv
                                </span>
                            ) : null}
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-2 items-center">
                        <Form.control
                            title="Ubigeo"
                            name={"ubigeo" as keyof DepartmentsUpdateDto}
                            disabled
                        />
                        <Form.control
                            title="Dias de envio"
                            name={"dayjs" as keyof DepartmentsUpdateDto}
                            type="number"
                            options={{ setValueAs: Number }}
                            question="Dias de envio que enviarás el producto a tu cliente"
                        />
                        <Form.control.toggle
                            title="Disponible"
                            name={"enabled" as keyof DepartmentsUpdateDto}
                            question="Disponible enviar ordenes para este departamento?"
                        />
                    </div>
                    <div class="flex justify-center">
                        <Form.button.submit
                            ico={null}
                            disabled={
                                departmentsUpdateMutation.isLoading || false
                            }
                            isLoading={
                                departmentsUpdateMutation.isLoading || false
                            }
                            title="Actualizar"
                        />
                    </div>
                </Form>
            </div>
        );
    }
    return component;
}

export default DepartmentsUpdate;
