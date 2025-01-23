import Form from "~/components/form";
import { EmpresaAddressUpdateApi } from "../apis/empresas.address.update.api";
import { useForm } from "react-hook-form";
import { useMemo, useEffect } from "preact/hooks";
import {
    empresaAddressUpdateDto,
    EmpresaAddressUpdateDto,
} from "../dtos/empresas.address.update.dto";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import { valibotVigilio } from "~/libs/valibot";
import useAuthStore from "@/auth/stores/auth.store";
import { AddressSchemaFromServer } from "../schemas/address.schema";
import { citiesIndexApi } from "@/ubigeo/apis/citites.api.index";
import { storageEmpresa } from "../stores/empresa.store";
import { reactComponent } from "~/libs/preact";
import { EmpresaAddressStoreApi } from "../apis/empresas.address.store.api";
import Hr from "@/web/components/Hr";
import { Fragment } from "preact/jsx-runtime";

function EmpresaAddressUpdate() {
    const authStore = useAuthStore();
    if (!authStore.guards.permissionAdminGuard()) {
        window.history.back();
        return null;
    }

    return (
        <Container className="p-2">
            <div className="flex flex-col gap-4 mx-1 ">
                <AdminBreadCrumb current="dirección" />
            </div>
            <div class="p-2">
                <h3 class="dark:text-white lg:text-2xl  font-bold uppercase text-center flex gap-2  w-full mb-4">
                    <i class="fas fa-map" />
                    Dirección de la empresa
                </h3>
                <div class="flex justify-between gap-2">
                    <div />
                    <button
                        class="bg-primary font-bold px-3 py-1 rounded-md"
                        type="button"
                        onClick={() => {
                            sweetModal({
                                html: reactComponent(<EmpresasAddressStore />),
                                isCloseInBackground: false,
                                sweetWidth: "700px",
                                showCloseButton: true,
                            });
                        }}
                    >
                        +
                    </button>
                </div>
                <br />
                {storageEmpresa?.addresses.map((address, i) => (
                    <Fragment key={address.id}>
                        <br />
                        <Hr />
                        <EmpresaUpdateForm address={address} index={i + 1} />
                    </Fragment>
                ))}
            </div>
        </Container>
    );
}

interface EmpresaUpdateFormProps {
    address: AddressSchemaFromServer;
    index: number;
}
function EmpresaUpdateForm({ address, index }: EmpresaUpdateFormProps) {
    const EmpresaAddressUpdateMutation = EmpresaAddressUpdateApi(address.id);
    const citysIndexQuery = citiesIndexApi();
    const EmpresaAddressUpdateForm = useForm<
        EmpresaAddressUpdateDto & {
            region: string;
            ubigeo: string;
        }
    >({
        defaultValues: {
            ...address,
            region: address.city.region.name,
            ubigeo: address.city.code,
        },
        resolver: valibotVigilio(empresaAddressUpdateDto),
    });
    const city_id = EmpresaAddressUpdateForm.watch("city_id");

    const citysSelect = useMemo(() => {
        if (citysIndexQuery.isSuccess && citysIndexQuery.data) {
            return citysIndexQuery.data.data.map((value) => ({
                key: value.id,
                value: `${value.region.name} - ${value.name}`,
            }));
        }
        return [];
    }, [citysIndexQuery.data, citysIndexQuery.isSuccess]);
    function onEmpresaAddressUpdate(
        data: EmpresaAddressUpdateDto & {
            region: string;
            ubigeo: string;
        }
    ) {
        const { ubigeo, region, ...rest } = data;
        sweetModal({
            title: "¿Estás seguro de editar la dirección?",
            isCloseInBackground: false,
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                EmpresaAddressUpdateMutation.mutate(rest, {
                    onSuccess(data) {
                        sweetAlert({ icon: "success", title: data.message });
                        // window.location.reload();
                    },
                    onError(error) {
                        handlerError(EmpresaAddressUpdateForm, error);
                    },
                });
            }
        });
    }

    useEffect(() => {
        if (city_id) {
            const distrito = citysIndexQuery.data?.data.find(
                (dis) => dis.id === city_id
            );
            if (distrito) {
                EmpresaAddressUpdateForm.setValue(
                    "region",
                    distrito.region.name
                );

                EmpresaAddressUpdateForm.setValue("ubigeo", distrito.code);
            }
        }
    }, [city_id]);
    return (
        <Form {...EmpresaAddressUpdateForm} onSubmit={onEmpresaAddressUpdate}>
            <br />
            <h3 class="dark:text-white font-semibold">Dirección {index}</h3>
            <div class="w-full relative">
                <Form.control.selectInput
                    title="Ciudad"
                    array={citysSelect}
                    placeholder="Escriba su ciudad"
                    name={"city_id" as keyof EmpresaAddressUpdateDto}
                    isLoading={citysIndexQuery.isLoading || false}
                />{" "}
                <Form.control
                    title="Region"
                    placeholder=""
                    name={"region" as keyof EmpresaAddressUpdateDto}
                    disabled
                />
            </div>
            <div class="flex gap-2 w-full">
                <Form.control
                    title="Urbanización"
                    placeholder=""
                    name={"urbanizacion" as keyof EmpresaAddressUpdateDto}
                />
                <Form.control
                    title="Ubigeo"
                    placeholder=""
                    name={"ubigeo" as keyof EmpresaAddressUpdateDto}
                    disabled
                />
            </div>

            <Form.control
                title="Direccion"
                placeholder=""
                name={"direccion" as keyof EmpresaAddressUpdateDto}
            />
            <div class="grid grid-cols-2 gap-2">
                <Form.control
                    title="Codigo de Local"
                    placeholder=""
                    name={"codLocal" as keyof EmpresaAddressUpdateDto}
                    question="ejm: 0000"
                />
                <Form.control.toggle
                    title="Habilitar"
                    name={"enabled" as keyof EmpresaAddressUpdateDto}
                    question="Si está deshabilitado, no se mostrará."
                />
            </div>

            <Form.button.submit
                title="Actualizar"
                ico={null}
                disabled={EmpresaAddressUpdateMutation.isLoading || false}
                isLoading={EmpresaAddressUpdateMutation.isLoading || false}
            />
        </Form>
    );
}
function EmpresasAddressStore() {
    const EmpresaAddressUpdateMutation = EmpresaAddressStoreApi();
    const citysIndexQuery = citiesIndexApi();
    const EmpresaAddressStoreForm = useForm<
        EmpresaAddressUpdateDto & {
            region: string;
            ubigeo: string;
        }
    >({
        resolver: valibotVigilio(empresaAddressUpdateDto),
    });
    const city_id = EmpresaAddressStoreForm.watch("city_id");

    const citysSelect = useMemo(() => {
        if (citysIndexQuery.isSuccess && citysIndexQuery.data) {
            return citysIndexQuery.data.data.map((value) => ({
                key: value.id,
                value: `${value.region.name} - ${value.name}`,
            }));
        }
        return [];
    }, [citysIndexQuery.data, citysIndexQuery.isSuccess]);
    function onEmpresaAddressStore(
        data: EmpresaAddressUpdateDto & {
            region: string;
            ubigeo: string;
        }
    ) {
        const { ubigeo, region, ...rest } = data;
        sweetModal({
            title: "¿Estás seguro de editar la dirección?",
            isCloseInBackground: false,
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                EmpresaAddressUpdateMutation.mutate(rest, {
                    onSuccess(data) {
                        sweetAlert({ icon: "success", title: data.message });
                        window.location.reload();
                    },
                    onError(error) {
                        handlerError(EmpresaAddressStoreForm, error);
                    },
                });
            }
        });
    }

    useEffect(() => {
        if (city_id) {
            const distrito = citysIndexQuery.data?.data.find(
                (dis) => dis.id === city_id
            );
            if (distrito) {
                EmpresaAddressStoreForm.setValue(
                    "region",
                    distrito.region.name
                );

                EmpresaAddressStoreForm.setValue("ubigeo", distrito.code);
            }
        }
    }, [city_id]);
    return (
        <Form onSubmit={onEmpresaAddressStore} {...EmpresaAddressStoreForm}>
            <br />
            <h3 class="dark:text-white font-semibold">Dirección Nueva</h3>
            <div class="w-full relative">
                <Form.control.selectInput
                    title="Ciudad"
                    array={citysSelect}
                    placeholder="Escriba su ciudad"
                    name={"city_id" as keyof EmpresaAddressUpdateDto}
                    isLoading={citysIndexQuery.isLoading || false}
                />{" "}
                <Form.control
                    title="Region"
                    placeholder=""
                    name={"region" as keyof EmpresaAddressUpdateDto}
                    disabled
                />
            </div>
            <div class="flex gap-2 w-full">
                <Form.control
                    title="Urbanización"
                    placeholder=""
                    name={"urbanizacion" as keyof EmpresaAddressUpdateDto}
                />
                <Form.control
                    title="Ubigeo"
                    placeholder=""
                    name={"ubigeo" as keyof EmpresaAddressUpdateDto}
                    disabled
                />
            </div>
            <Form.control
                title="Direccion"
                placeholder=""
                name={"direccion" as keyof EmpresaAddressUpdateDto}
            />
            <div class="grid grid-cols-2 gap-2">
                <Form.control
                    title="Codigo de Local"
                    placeholder=""
                    name={"codLocal" as keyof EmpresaAddressUpdateDto}
                    question="ejm: 0000"
                />
                <Form.control.toggle
                    title="Habilitar"
                    name={"enabled" as keyof EmpresaAddressUpdateDto}
                    question="Si está deshabilitado, no se mostrará."
                />
            </div>
            <Form.button.submit
                title="Actualizar"
                ico={null}
                disabled={EmpresaAddressUpdateMutation.isLoading || false}
                isLoading={EmpresaAddressUpdateMutation.isLoading || false}
            />
        </Form>
    );
}

export default EmpresaAddressUpdate;
