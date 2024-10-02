import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import Form from "~/components/form";
import AdminHr from "~/components/AdminHr";
import { getFilesEdit } from "~/libs/upload";
import { useEffect } from "preact/hooks";
import { handlerError } from "~/libs/helpers";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import View404 from "@/admin/views/404";
import { empresaPrivateApi } from "@/empresas/apis/empresas.private.api";
import Loading from "@/admin/components/Loading";
import AlertInfo from "~/components/Alerts/AlertInfo";
import {
    empresaFacturacionCertificadoUpdateApi,
    empresaFacturacionUpdateApi,
} from "@/empresas/apis/empresas.facturacion.update.api";
import useEmpresastore from "@/empresas/stores/empresa.store";
import {
    empresasFacturacionCertificadoUpdateDto,
    EmpresasFacturacionCertificadoUpdateDto,
    empresasFacturacionUpdateDto,
    EmpresasFacturacionUpdateDto,
} from "@/empresas/dtos/empresas.facturacion.update.dto";

interface CompaniesStoreProps {
    onClose?: () => void;
}
function CompaniesStore({ onClose }: CompaniesStoreProps) {
    const empresaQuery = empresaPrivateApi();
    let component: JSX.Element | JSX.Element[] | null = null;
    if (empresaQuery.isLoading) {
        component = <Loading />;
    }
    if (empresaQuery.isError) {
        component = <View404 message={empresaQuery.error?.message} />;
    }
    if (empresaQuery.isSuccess) {
        const empresa = empresaQuery.data!.empresa!;

        const empresaFacturacionUpdateMutation = empresaFacturacionUpdateApi();
        const empresaFacturacionCertificadoUpdateMutation =
            empresaFacturacionCertificadoUpdateApi();
        const empresaStore = useEmpresastore();
        const empresaFacturacionUpdateForm =
            useForm<EmpresasFacturacionUpdateDto>({
                resolver: valibotVigilio(empresasFacturacionUpdateDto),
                defaultValues: empresa.company,
            });
        const empresaFacturacionCertificadoUpdateForm =
            useForm<EmpresasFacturacionCertificadoUpdateDto>({
                resolver: valibotVigilio(
                    empresasFacturacionCertificadoUpdateDto
                ),
            });

        function onEmpresaFacturacionUpdate(
            data: EmpresasFacturacionUpdateDto
        ) {
            sweetModal({
                title: "¿Estas seguro de realizar estos cambios?",
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    empresaFacturacionUpdateMutation.mutate(data, {
                        onSuccess() {
                            if (onClose) {
                                sweetAlert({
                                    icon: "success",
                                    title: "Se realizaron los cambios correctamente",
                                });
                                onClose();
                            } else {
                                sweetAlert({
                                    icon: "success",
                                    title: "Se realizaron los cambios correctamente",
                                }).then(() => {
                                    window.location.reload();
                                });
                            }
                        },
                        onError(error) {
                            sweetAlert({
                                icon: "success",
                                title: "Se realizaron los cambios correctamente",
                            }).then(() => {
                                handlerError(
                                    empresaFacturacionUpdateForm,
                                    error
                                );
                            });
                        },
                    });
                }
            });
        }
        function onEmpresaFacturacionCertificadoUpdate(
            body: EmpresasFacturacionCertificadoUpdateDto
        ) {
            sweetModal({
                title: "¿Estas seguro de realizar estos cambios?",
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    empresaFacturacionCertificadoUpdateMutation.mutate(body, {
                        onSuccess(data) {
                            if (onClose) {
                                sweetAlert({
                                    icon: "success",
                                    title: "Se realizaron los cambios correctamente",
                                });
                                onClose();
                            } else {
                                sweetAlert({
                                    icon: "success",
                                    title: "Se realizaron los cambios correctamente",
                                });
                            }
                            empresaStore.methods.updateempresa({
                                certificado: data.files,
                            });
                        },
                        onError(error) {
                            handlerError(empresaFacturacionUpdateForm, error);
                        },
                    });
                }
            });
        }
        async function onInitial() {
            if (empresa.certificado) {
                const file = await getFilesEdit(
                    empresa.certificado,
                    null,
                    "text/html"
                );
                empresaFacturacionCertificadoUpdateForm.setValue(
                    "certificado",
                    file
                );
            }
        }
        useEffect(() => {
            onInitial();
        }, []);
        component = (
            <div class="p-4 ">
                <div class="flex justify-between items-center">
                    <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
                        <i class="fa-solid fa-file-certificate" />
                        Informacion
                    </h3>
                </div>
                <Form
                    {...empresaFacturacionUpdateForm}
                    onSubmit={onEmpresaFacturacionUpdate}
                >
                    <AlertInfo>
                        <div class="font-semibold">
                            Obtener <b> certificado digital</b> como contraseña
                            de certificado totalmente gratis.{" "}
                            <a
                                href="https://www.youtube.com/watch?v=8Ouj8edT0Hc"
                                target="blank"
                                class="dark:text-white font-bold hover:underline"
                            >
                                Ver video
                            </a>
                            <br />
                            Si no funciona esta opción recomendable obtenerlo en
                            SUNAT o buscar un proveedor{" "}
                            <a
                                href="https://llama.pe"
                                target="_blank"
                                class="font-semibold underline"
                                rel="noreferrer"
                            >
                                Recomendable
                            </a>
                            .
                            <br />
                            <b>Importante:</b> Recuerda actualizar su
                            certificado Digital cierto tiempo.
                        </div>
                    </AlertInfo>
                    <div class="flex gap-2 items-center">
                        <Form.control
                            title="Nombre Comercial"
                            name={
                                "nombreComercial" as keyof EmpresasFacturacionUpdateDto
                            }
                            question="Nombre de tu empresa"
                            placeholder="XXXXXXXXX"
                        />
                        <Form.control
                            title="RazonSocial"
                            name={
                                "razonSocial" as keyof EmpresasFacturacionUpdateDto
                            }
                            placeholder="EMPRESA S.A.C"
                        />
                    </div>
                    <div class="flex gap-2 items-center">
                        <Form.control
                            title="Ruc"
                            name={"ruc" as keyof EmpresasFacturacionUpdateDto}
                            placeholder="XXXXXXXXX"
                        />
                        <Form.control
                            title="Contraseña de certificado digital"
                            type="password"
                            name={
                                "certificado_password" as keyof EmpresasFacturacionUpdateDto
                            }
                            placeholder="XXXXXXXXX"
                        />
                    </div>
                    <AlertInfo>
                        <div class="font-semibold">
                            Para obtener cuenta sol para emitir boletas ,
                            facturas, notas, etc.{" "}
                            <a
                                href="https://youtu.be/_bBRw7-IgO0"
                                target="blank"
                                class="dark:text-white font-bold hover:underline"
                            >
                                Ver video
                            </a>
                        </div>
                    </AlertInfo>
                    <div class="flex gap-2 items-center">
                        <Form.control
                            title="Sol Usuario"
                            name={
                                "sol_user" as keyof EmpresasFacturacionUpdateDto
                            }
                            placeholder="XXXXXXXXX"
                        />
                        <Form.control
                            title="Sol Password"
                            name={
                                "sol_pass" as keyof EmpresasFacturacionUpdateDto
                            }
                            placeholder="XXXXXXXXX"
                            type="password"
                        />
                    </div>
                    <br />
                    <AlertInfo>
                        <div class="font-semibold">
                            Para obtener credenciales para guias de remisión, Si
                            tu negocio o empresa lo requiere.{" "}
                            <a
                                href="https://www.youtube.com/watch?v=vDdtqwJITT4"
                                target="blank"
                                class="dark:text-white font-bold hover:underline"
                            >
                                Ver video
                            </a>
                        </div>
                    </AlertInfo>
                    <div class="flex gap-2 items-center">
                        <Form.control
                            title="Cliente id"
                            name={
                                "client_id" as keyof EmpresasFacturacionUpdateDto
                            }
                            placeholder="XXXXXXXXX"
                        />
                        <Form.control
                            title="Cliente secreto"
                            name={
                                "client_secret" as keyof EmpresasFacturacionUpdateDto
                            }
                            type="password"
                            placeholder="XXXXXXXXX"
                        />
                    </div>
                    <Form.control.toggle
                        title="Habilitar"
                        name={
                            "production" as keyof EmpresasFacturacionUpdateDto
                        }
                        question={
                            <div class="w-[120px]">
                                Si está habilitado se emitirá en los servidores
                                de sunat. Si está desabilitado no se enviará en
                                los servidores de sunat, será modo de prueba
                            </div>
                        }
                    />
                    <Form.button.submit
                        disabled={
                            empresaFacturacionUpdateMutation.isLoading || false
                        }
                        isLoading={
                            empresaFacturacionUpdateMutation.isLoading || false
                        }
                        title="Guardar"
                        ico={null}
                    />
                </Form>
                <AdminHr />
                <div class="flex justify-between items-center">
                    <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
                        <i class="fa-solid fa-file-certificate" />
                        Certificado digital
                    </h3>
                </div>
                <Form
                    {...empresaFacturacionCertificadoUpdateForm}
                    onSubmit={onEmpresaFacturacionCertificadoUpdate}
                >
                    <Form.control.file
                        title="Certificado Digital (.pfx, .p12, .pem)"
                        name={
                            "certificado" as keyof EmpresasFacturacionCertificadoUpdateDto
                        }
                        typeFile="file"
                        accept=".pem,.pfx,.p12"
                    />
                    <Form.button.submit
                        disabled={
                            empresaFacturacionCertificadoUpdateMutation.isLoading ||
                            false
                        }
                        isLoading={
                            empresaFacturacionCertificadoUpdateMutation.isLoading ||
                            false
                        }
                        title="Guardar"
                        ico={null}
                    />
                </Form>
            </div>
        );
    }
    return component;
}

export default CompaniesStore;
