import { complaintsStoreApi } from "@/empresas/apis/complaints.store.api";
import {
    complaintsStoreDto,
    type ComplaintsStoreDto,
} from "@/empresas/dtos/complaints.store.dto";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import TitleSection from "@/web/components/TitleSection";
import WebBreadCrumb from "@/web/components/WebBreadCrumb";
import type { HeaderType } from "@/web/components/WebLayout";
import WebLayout from "@/web/components/WebLayout";
import { sweetAlert } from "@vigilio/sweet";
import { useForm } from "react-hook-form";
import Form from "~/components/form";
import { handlerError } from "~/libs/helpers";
import { printFileWithDimension } from "~/libs/upload";
import { valibotVigilio } from "~/libs/valibot";
import IsTemplate from "../home/components/IsTemplate";

interface ReclamacionesProps {
    header: HeaderType;
}
function ReclamacionesPage({ header }: ReclamacionesProps) {
    const complaintsStoreDtoForm = useForm<ComplaintsStoreDto>({
        resolver: valibotVigilio(complaintsStoreDto),
        defaultValues: {
            guardianName: null,
        },
    });

    const complaintsStoreApiMutation = complaintsStoreApi();

    function onSubmitComplaint(body: ComplaintsStoreDto) {
        if (!body.declareempresaCorrect) {
            return complaintsStoreDtoForm.setError(
                "declareempresaCorrect",
                {
                    type: "manual",
                    message:
                        "Debes aceptar la declaración de veracidad de datos",
                },
                { shouldFocus: true }
            );
        }

        if (!body.declareReadedPrivacyPolicy) {
            return complaintsStoreDtoForm.setError(
                "declareReadedPrivacyPolicy",
                {
                    type: "manual",
                    message: "Debes aceptar la política de privacidad",
                },
                { shouldFocus: true }
            );
        }

        complaintsStoreApiMutation.mutate(body, {
            onSuccess(_data) {
                complaintsStoreDtoForm.reset();
                sweetAlert({
                    icon: "success",
                    title: `<p class="text-center">Su reclamo ha sido registrado correctamente.</p>`,
                });
            },
            onError(error) {
                handlerError(complaintsStoreDtoForm, error);
            },
        });
    }

    return (
        <WebLayout header={header}>
            {!storageEmpresa?.isTemplate ? (
                <IsTemplate />
            ) : (
                <>
                    <div class="mt-6 max-w-6xl mx-auto">
                        <WebBreadCrumb current="Libro de reclamaciones" />
                    </div>
                    <div className="max-w-4xl p-4 mx-auto  my-12 lg:my-4 bg-background-light rounded-md dark:bg-background-dark  relative overflow-hidden">
                        <TitleSection>Libro de Reclamaciones</TitleSection>
                        {storageEmpresa?.logo ? (
                            <img
                                class="absolute -bottom-20 -right-20 opacity-30"
                                src={
                                    printFileWithDimension(
                                        storageEmpresa?.logo,
                                        300
                                    )[0]
                                }
                                width={300}
                                height={300}
                                alt={storageEmpresa.name_empresa}
                            />
                        ) : null}
                        <br />
                        <div className="mb-6 dark:text-white">
                            <h2 className="mb-4 text-xl font-semibold underline  dark:text-white">
                                Datos Generales
                            </h2>
                            <p>
                                <strong class="  dark:text-white">
                                    Fecha del reclamo:
                                </strong>{" "}
                                {new Date().toLocaleDateString()}{" "}
                                <input
                                    type="date"
                                    hidden
                                    defaultValue={
                                        new Date().toISOString().split("T")[0]
                                    }
                                    {...complaintsStoreDtoForm.register(
                                        "dateOfComplaint"
                                    )}
                                />
                            </p>
                            <p>
                                <strong class="  dark:text-white">
                                    Empresa:
                                </strong>{" "}
                                {storageEmpresa?.name_empresa}
                            </p>

                            <p>
                                <strong class="  dark:text-white">
                                    Dirección:
                                </strong>{" "}
                                <ul>
                                    {storageEmpresa?.addresses
                                        .filter((address) => address.enabled)
                                        .map((address) => (
                                            <li
                                                class="list-item list-disc text-xs"
                                                key={address.id}
                                            >
                                                {address.direccion} -{" "}
                                                {address.city.name}
                                            </li>
                                        ))}
                                </ul>
                            </p>
                        </div>
                        <Form
                            onSubmit={onSubmitComplaint}
                            {...complaintsStoreDtoForm}
                        >
                            <div className="mb-6">
                                <h2 className="mb-4 text-xl font-semibold underline  dark:text-white">
                                    Identificación del Consumidor
                                </h2>
                                <div className="grid grid-cols-1 gap-x-2 md:grid-cols-2">
                                    <Form.control.web
                                        ico={<i class="fa-solid fa-user" />}
                                        name={
                                            "fullName" as keyof ComplaintsStoreDto
                                        }
                                        title="Nombres y Apellidos"
                                        placeholder="Juan Perez"
                                        autoComplete="fullName"
                                    />
                                    <Form.control.web
                                        ico={<i class="fa-solid fa-phone" />}
                                        type="tel"
                                        name={
                                            "phone" as keyof ComplaintsStoreDto
                                        }
                                        title="Número de Teléfono"
                                        placeholder="912345678"
                                        autoComplete="phone"
                                    />
                                    <Form.control.web
                                        ico={<i class="fa-solid fa-id-card" />}
                                        name={
                                            "numberDocument" as keyof ComplaintsStoreDto
                                        }
                                        title="Número de Documento"
                                        placeholder="xxxxxx"
                                        autoComplete="numberDocument"
                                    />
                                    <Form.control.web
                                        ico={
                                            <i class="fa-solid fa-location-dot" />
                                        }
                                        name={
                                            "address" as keyof ComplaintsStoreDto
                                        }
                                        title="Dirección"
                                        placeholder="xxxx"
                                        autoComplete="address"
                                    />

                                    <Form.control.web
                                        ico={
                                            <i className="text-sm fas fa-at" />
                                        }
                                        name={
                                            "email" as keyof ComplaintsStoreDto
                                        }
                                        title="Correo electrónico"
                                        placeholder="correo@ejemplo.com"
                                        autoComplete="email"
                                    />

                                    <div className="md:col-span-2">
                                        <Form.control.web
                                            ico={
                                                <i className="fa-solid fa-person-breastfeeding" />
                                            }
                                            name={
                                                "guardianName" as keyof ComplaintsStoreDto
                                            }
                                            title="Nombre del apoderado (Solo si es menor de edad)"
                                            placeholder="Apoderado"
                                            autoComplete="guardianName"
                                        />
                                    </div>
                                </div>

                                <h1 className="mt-6 mb-4 text-xl font-semibold underline  dark:text-white">
                                    Identificación del bien contratado
                                </h1>
                                <div className="mb-6">
                                    <Form.control.web.select
                                        ico={
                                            <i className="fa-solid fa-file-invoice" />
                                        }
                                        name={
                                            "typeOfConsumption" as keyof ComplaintsStoreDto
                                        }
                                        title="Tipo de bien recibido"
                                        placeholder="Seleccionar tipo de bien recibido"
                                        array={[
                                            {
                                                value: "Producto",
                                                key: "Producto",
                                            },
                                            {
                                                value: "Servicio",
                                                key: "Servicio",
                                            },
                                        ]}
                                        autoComplete="typeOfConsumption"
                                    />
                                </div>
                                <div className="mb-6">
                                    <Form.control.web.area
                                        name={
                                            "detailsOfConsumption" as keyof ComplaintsStoreDto
                                        }
                                        title="Descripción del bien (Producto o servicio)"
                                        placeholder="Descripción del bien contratado"
                                        autoComplete="detailsOfConsumption"
                                    />
                                </div>

                                <h1 className="mb-4 text-xl font-semibold underline  dark:text-white">
                                    Detalle de la reclamación
                                </h1>
                                <p className="mb-2  dark:text-white  text-sm">
                                    <span className="text-red-500">*</span>{" "}
                                    Queja: Disconformidad no relacionada a los
                                    productos o servicios o malestar o
                                    descontento respecto a la atención al
                                    público.
                                </p>
                                <p className="mb-4  dark:text-white  text-sm">
                                    <span className="text-red-500">*</span>{" "}
                                    Reclamo: Disconformidad relacionada a los
                                    productos o servicios.
                                </p>
                                <div className="mb-6">
                                    <Form.control.web.select
                                        ico={
                                            <i class="fa-solid fa-message-exclamation" />
                                        }
                                        name={
                                            "typeComplaint" as keyof ComplaintsStoreDto
                                        }
                                        title="Tipo de reclamación"
                                        placeholder="Seleccionar tipo de reclamación"
                                        array={[
                                            {
                                                value: "Queja",
                                                key: "Queja",
                                            },
                                            {
                                                value: "Reclamo",
                                                key: "Reclamo",
                                            },
                                        ]}
                                        autoComplete="typeComplaint"
                                    />
                                </div>
                                <div className="mb-6">
                                    <Form.control.web.area
                                        name={
                                            "detailsOfComplaint" as keyof ComplaintsStoreDto
                                        }
                                        title="Detalle del replamo o queja"
                                        placeholder="Brinda detalles del reclamos o queja"
                                        autoComplete="detailsOfComplaint"
                                    />
                                </div>

                                <div className="mb-6">
                                    <input
                                        type="checkbox"
                                        id="declareempresaCorrect"
                                        className="mr-2"
                                        {...complaintsStoreDtoForm.register(
                                            "declareempresaCorrect"
                                        )}
                                    />
                                    <label
                                        for="declareempresaCorrect"
                                        class=" dark:text-white text-xs"
                                    >
                                        Declaro que los datos consignados son
                                        correctos y fiel expresión de la verdad.
                                    </label>
                                    <p className="text-xs text-red-600">
                                        {complaintsStoreDtoForm.formState.errors
                                            .declareempresaCorrect
                                            ? complaintsStoreDtoForm.formState
                                                  .errors.declareempresaCorrect
                                                  .message
                                            : ""}
                                    </p>
                                </div>
                                <div className="mb-6">
                                    <input
                                        type="checkbox"
                                        id="declareReadedPrivacyPolicy"
                                        className="mr-2"
                                        {...complaintsStoreDtoForm.register(
                                            "declareReadedPrivacyPolicy"
                                        )}
                                    />
                                    <label
                                        for="declareReadedPrivacyPolicy"
                                        class=" dark:text-white text-xs"
                                    >
                                        Declaro haber leído y acepto la{" "}
                                        <a
                                            href={"/politica-de-privacidad"}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Política de Privacidad de Datos
                                            personales.
                                        </a>
                                    </label>
                                    <p className="text-xs text-red-600">
                                        {complaintsStoreDtoForm.formState.errors
                                            .declareReadedPrivacyPolicy
                                            ? complaintsStoreDtoForm.formState
                                                  .errors
                                                  .declareReadedPrivacyPolicy
                                                  .message
                                            : ""}
                                    </p>
                                </div>

                                <Form.button.submit
                                    title="Enviar"
                                    isLoading={
                                        complaintsStoreApiMutation.isLoading ||
                                        false
                                    }
                                />
                            </div>
                        </Form>
                    </div>
                </>
            )}
        </WebLayout>
    );
}

export default ReclamacionesPage;
