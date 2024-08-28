import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import useAuthstore from "@/auth/stores/auth.store";
import Form from "~/components/form";
import { useForm } from "react-hook-form";
import type { InformationSchema } from "../schemas/information.schema";
import { useEffect, useMemo } from "preact/hooks";
import {
    type InformationLogoUpdateDto,
    type InformationUpdateDto,
    informationUpdateDto,
    informationLogoUpdateDto,
    type InformationIconUpdateDto,
    informationIconUpdateDto,
    type InformationQrYapeUpdateDto,
    informationQrYapeUpdateDto,
    type InformationQrPlinUpdateDto,
    informationQrPlinUpdateDto,
} from "../dtos/information.update.dto";

import {
    informationUpdateApi,
    informationUpdateIconApi,
    informationUpdateLogoApi,
    informationUpdateQrPlinApi,
    informationUpdateQrYapeApi,
} from "../apis/information.update.api";
import Hr from "@/web/components/Hr";
import useInformationstore from "../stores/information.store";
import enviroments from "~/config";
import LoaderSubmit from "~/components/LoaderSubmit";
import { informationShowApi } from "../apis/information.show.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { getFilesEdit } from "~/libs/upload";
import { valibotVigilio } from "~/libs/valibot";
import { formatDateTwo, handlerError } from "~/libs/helpers";
import { reactComponent } from "~/libs/preact";
import AlertInfo from "~/components/Alerts/AlertInfo";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { informationPrivateApi } from "../apis/information.private.api";

function InformationUpdate() {
    const { guards } = useAuthstore();
    if (!guards.permissionAdminGuard()) {
        window.history.back();
        return null;
    }
    const informationQuery = informationPrivateApi();
    let component: JSX.Element | JSX.Element[] | null = null;
    if (informationQuery.isLoading) {
        component = <Loading />;
    }
    if (informationQuery.isError) {
        component = <View404 message={informationQuery.error?.message} />;
    }
    if (informationQuery.isSuccess) {
        const informationStore = useInformationstore();
        const information = informationQuery.data!.information;
        const informationUpdateMutation = informationUpdateApi();
        const informationUpdateFotoMutation = informationUpdateLogoApi();
        const informationUpdateIconMutation = informationUpdateIconApi();
        const informationUpdateQrYapeMutation = informationUpdateQrYapeApi();
        const informationUpdateQrPlinMutation = informationUpdateQrPlinApi();
        const informationShow = informationShowApi("1");

        const settingsUpdateform = useForm<InformationUpdateDto>({
            resolver: valibotVigilio(informationUpdateDto),
            mode: "all",
            defaultValues: useMemo(() => {
                const {
                    logo,
                    createdAt,
                    updatedAt,
                    id,
                    contacts,
                    address,
                    company,
                    certificado,
                    qrPlin,
                    qrYape,
                    inteligenceArtificial,
                    yearFounded,
                    icon,
                    ...rest
                } = information;

                return {
                    ...rest,
                    yearFounded: formatDateTwo(
                        yearFounded,
                        "YYYY-MM-DD"
                    ) as Date,
                };
            }, []),
        });

        const settingsLogoUpdateform = useForm<InformationLogoUpdateDto>({
            resolver: valibotVigilio(informationLogoUpdateDto),
            mode: "all",
        });
        const settingsIconUpdateform = useForm<InformationIconUpdateDto>({
            resolver: valibotVigilio(informationIconUpdateDto),
            mode: "all",
        });
        const settingsQrYapeUpdateform = useForm<InformationQrYapeUpdateDto>({
            resolver: valibotVigilio(informationQrYapeUpdateDto),
            mode: "all",
        });
        const settingsQrPlinUpdateform = useForm<InformationQrPlinUpdateDto>({
            resolver: valibotVigilio(informationQrPlinUpdateDto),
            mode: "all",
        });
        const earning = settingsUpdateform.watch("earning");
        async function initialUpdateLogo() {
            if (information.logo) {
                const logo = await getFilesEdit(information.logo, 300);
                settingsLogoUpdateform.setValue("logo", logo);
            }
        }
        async function initialUpdateIcon() {
            if (information.icon) {
                const icon = await getFilesEdit(information.icon, 300);
                settingsIconUpdateform.setValue("icon", icon);
            }
        }
        async function initialUpdateQrYape() {
            if (information.qrYape) {
                const icon = await getFilesEdit(information.qrYape, 500);
                settingsQrYapeUpdateform.setValue("qrYape", icon);
            }
        }
        async function initialUpdateQrPlin() {
            if (information.qrPlin) {
                const icon = await getFilesEdit(information.qrPlin, 500);
                settingsQrPlinUpdateform.setValue("qrPlin", icon);
            }
        }
        function onUpdateInformation(body: InformationUpdateDto) {
            sweetModal({
                title: "¿Estas seguro de realizar estos cambios en tu web?",
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    informationUpdateMutation.mutate(body, {
                        onSuccess(data) {
                            informationStore.methods.updateInformation(
                                data.information
                            );
                            sweetAlert({
                                icon: "success",
                                title: `Actualizado correctamente tu aplicación: ${data.information.name}`,
                            });
                        },
                        onError(error) {
                            handlerError(settingsUpdateform, error);
                        },
                    });
                }
            });
        }
        function onUpdateLogoInformation(body: InformationLogoUpdateDto) {
            sweetModal({
                title: "¿Estas seguro de cambiar el logo de tu web?",
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    informationUpdateFotoMutation.mutate(
                        { ...body, name: information.name },
                        {
                            onSuccess(data) {
                                informationStore.methods.updateInformation({
                                    logo: data.files,
                                });
                                sweetAlert({
                                    icon: "success",
                                    title: "Actualizado logo correctamente",
                                });
                            },
                            onError(error) {
                                handlerError(settingsLogoUpdateform, error);
                            },
                        }
                    );
                }
            });
        }
        function onUpdateIconInformation(body: InformationIconUpdateDto) {
            sweetModal({
                title: "¿Estas seguro de cambiar el icono de tu web?",
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    informationUpdateIconMutation.mutate(
                        { ...body, name: information.name },
                        {
                            onSuccess(data) {
                                informationStore.methods.updateInformation({
                                    icon: data.files,
                                });
                                sweetAlert({
                                    icon: "success",
                                    title: "Actualizado icono correctamente",
                                });
                            },
                            onError(error) {
                                handlerError(settingsLogoUpdateform, error);
                            },
                        }
                    );
                }
            });
        }
        function onUpdateQrYapeInformation(body: InformationQrYapeUpdateDto) {
            sweetModal({
                title: "¿Estas seguro de cambiar el qr Yape de tu web?",
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    informationUpdateQrYapeMutation.mutate(body, {
                        onSuccess(data) {
                            informationStore.methods.updateInformation({
                                icon: data.files,
                            });
                            sweetAlert({
                                icon: "success",
                                title: "Actualizado qr correctamente",
                            });
                        },
                        onError(error) {
                            handlerError(settingsLogoUpdateform, error);
                        },
                    });
                }
            });
        }
        function onUpdateQrPlinInformation(body: InformationQrPlinUpdateDto) {
            sweetModal({
                title: "¿Estas seguro de cambiar el qr Plin de tu web?",
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    informationUpdateQrPlinMutation.mutate(body, {
                        onSuccess(data) {
                            informationStore.methods.updateInformation({
                                icon: data.files,
                            });
                            sweetAlert({
                                icon: "success",
                                title: "Actualizado qr correctamente",
                            });
                        },
                        onError(error) {
                            handlerError(settingsLogoUpdateform, error);
                        },
                    });
                }
            });
        }
        useEffect(() => {
            initialUpdateLogo();
        }, []);

        useEffect(() => {
            initialUpdateIcon();
        }, []);
        useEffect(() => {
            initialUpdateQrYape();
        }, []);
        useEffect(() => {
            initialUpdateQrPlin();
        }, []);

        component = (
            <Container className="p-2">
                <div className="flex flex-col gap-4 mx-1 ">
                    <AdminBreadCrumb current="configuración" />
                </div>
                <div class="p-4">
                    <h3 class="dark:text-white lg:text-2xl  font-bold uppercase text-center flex gap-2  w-full mb-4">
                        <i class="fa-solid fa-tools" />
                        Empresa {information.name}
                    </h3>
                    <Form
                        {...settingsUpdateform}
                        onSubmit={onUpdateInformation}
                    >
                        <div class="flex justify-between items-center mb-4 gap-2">
                            <div class="flex items-center justify-between w-full gap-2 flex-wrap">
                                <button
                                    type="button"
                                    aria-label="size"
                                    class="text-xs font-bold bg-success text-white px-6 py-3 rounded-md"
                                    onClick={() => informationShow.refetch()}
                                >
                                    <>
                                        {informationShow.isFetching ||
                                        informationShow.isLoading ? (
                                            <LoaderSubmit />
                                        ) : (
                                            <>
                                                <i class="fal fa-folder-open mr-1" />{" "}
                                                {(
                                                    (informationShow.data
                                                        ?.information.size ||
                                                        information.size) /
                                                    1024 ** 3
                                                ).toFixed(4)}{" "}
                                                GB
                                            </>
                                        )}
                                    </>
                                </button>
                                <Form.button.reset />
                            </div>
                        </div>
                        <div class="flex flex-col gap-4 justify-center items-center">
                            <div class="w-full flex flex-col md:flex-row gap-2">
                                <Form.control
                                    name={"name" as keyof InformationSchema}
                                    title="Nombre de empresa"
                                    placeholder="Nombre de empresa"
                                />
                                <Form.control
                                    name={"email" as keyof InformationSchema}
                                    title="Correo electrónico de empresa"
                                    type="text"
                                    placeholder="tuempresa@gmail.com"
                                    ico={<i class="fas fa-at" />}
                                />
                            </div>
                            <div class="w-full flex flex-col md:flex-row gap-2">
                                <Form.control
                                    name={
                                        "emailPassword" as keyof InformationSchema
                                    }
                                    title="Contraseña de correo zoho"
                                    type="password"
                                    placeholder="***********"
                                    ico={<i class="fas fa-at" />}
                                />
                                <Form.control
                                    name={"earning" as keyof InformationSchema}
                                    type="number"
                                    title="Ganancia por producto"
                                    placeholder="30%"
                                    ico={<i class="fas fa-sack" />}
                                    options={{
                                        setValueAs(value) {
                                            return Number(value) > 0
                                                ? Number(value)
                                                : null;
                                        },
                                    }}
                                    question={
                                        <span>
                                            {earning}% de ganancia sobre el
                                            precio del producto.
                                        </span>
                                    }
                                />
                            </div>
                            <div class="w-full flex flex-col md:flex-row gap-2">
                                <Form.control
                                    name={
                                        "telephoneFirst" as keyof InformationSchema
                                    }
                                    type="tel"
                                    title="Primer Numero de Celular"
                                    ico={<i class="fas fa-mobile-alt" />}
                                />
                                <Form.control
                                    name={
                                        "telephoneReclamos" as keyof InformationSchema
                                    }
                                    type="tel"
                                    title="Numero de Celular  para reclamos"
                                    ico={<i class="fas fa-mobile-alt" />}
                                    question="Este campo no es obligatorio"
                                />
                            </div>
                            <div class="w-full flex flex-col md:flex-row gap-2">
                                <Form.control
                                    name={
                                        "telephoneThird" as keyof InformationSchema
                                    }
                                    type="tel"
                                    title="Tercer numero de celular"
                                    ico={<i class="fas fa-mobile-alt" />}
                                    question="Este campo no es obligatorio"
                                />
                                <Form.control
                                    name={"mapa" as keyof InformationSchema}
                                    title="Mapa"
                                    type="text"
                                    placeholder="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4643.604312068362!2d-77.06682864829563!3d-11.849952801726479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2spe!4v1700097685639!5m2!1ses-419!2spe"
                                    ico={<i class="fas fa-map" />}
                                    question={
                                        <span class="text-xs">
                                            <a
                                                href="https://www.google.com/maps"
                                                target="_blank"
                                                class="font-bold hover:underline"
                                                rel="noreferrer"
                                            >
                                                Google Maps
                                            </a>
                                            <br />
                                            click en tu localidad {">"}{" "}
                                            compartir{" "}
                                            <i class="fas fa-share-alt" /> {">"}{" "}
                                            incorporar un mapa {">"} copiar src
                                        </span>
                                    }
                                />
                                <Form.control
                                    name={
                                        "yearFounded" as keyof InformationSchema
                                    }
                                    type="date"
                                    title="Fundado"
                                />
                            </div>
                            <Form.control.area
                                name={"about" as keyof InformationSchema}
                                title="Acerca de la empresa"
                                placeholder="xxxxxxxxxx"
                            />

                            <span class="font-semibold dark:text-secondary-light">
                                Redes Sociales
                            </span>
                            <div class="w-full flex flex-col md:flex-row gap-2">
                                <Form.control
                                    name={"facebook" as keyof InformationSchema}
                                    title="Facebook"
                                    ico={<i class="fab fa-facebook" />}
                                    placeholder="facebook de empresa"
                                    question="Este campo no es obligatorio."
                                />
                                <Form.control
                                    name={"tiktok" as keyof InformationSchema}
                                    title="Tik Tok"
                                    ico={<i class="fab fa-tiktok" />}
                                    question="Este campo no es obligatorio."
                                    placeholder="Tik Tok de empresa"
                                />
                                <Form.control
                                    name={"twitter" as keyof InformationSchema}
                                    title="Twitter"
                                    ico={<i class="fab fa-twitter" />}
                                    placeholder="Twitter de empresa"
                                    question="Este campo no es obligatorio."
                                />
                            </div>
                            <div class="w-full flex flex-col md:flex-row gap-2">
                                <Form.control
                                    name={
                                        "instagram" as keyof InformationSchema
                                    }
                                    title="Instagram"
                                    ico={<i class="fab fa-instagram" />}
                                    placeholder="Instagram de empresa"
                                    question="Este campo no es obligatorio."
                                />
                                <Form.control
                                    name={"youtube" as keyof InformationSchema}
                                    title="Youtube"
                                    ico={<i class="fab fa-youtube" />}
                                    placeholder="Youtube de empresa"
                                    question="Este campo no es obligatorio."
                                />
                            </div>
                            <span class="font-semibold dark:text-secondary-light">
                                Configuración
                            </span>
                            <div class="w-full flex  gap-2 flex-col ">
                                <div class="grid grid-cols-2 gap-2 items-center w-full">
                                    <Form.control.toggle
                                        name={
                                            "isOpen" as keyof InformationSchema
                                        }
                                        title="Tienda Abierta"
                                        question={
                                            <div class="flex flex-col">
                                                Está disponible tu tienda? Tus
                                                clientes no podrán comprar
                                            </div>
                                        }
                                    />
                                    <Form.control.toggle
                                        name={
                                            "enable_booster" as keyof InformationSchema
                                        }
                                        title="Habilitar Velocidad 500% mas rápido a la web"
                                        question={
                                            <div class="w-[200px]">
                                                <i class="fa-sharp fa-solid fa-rocket-launch" />
                                                <br />
                                                <b>Vigilio Services</b> tiene
                                                las webs más rapidas del mercado
                                                pero puede ir más rápido.
                                                <br />
                                                Si está habilitado, tu web
                                                cargará 500% mas rápido.
                                                <br />
                                                Se verá la velocidad en los
                                                productos que se muestran en tu
                                                web.
                                            </div>
                                        }
                                    />
                                    <Form.control.toggle
                                        name={
                                            "enabled" as keyof InformationSchema
                                        }
                                        title="Habilitar Web"
                                        question="Su web no se mostrará a los clientes."
                                    />
                                    <Form.control.toggle
                                        name={
                                            "enabledBot" as keyof InformationSchema
                                        }
                                        title="Habilitar Vendedor IA de de whatsapp"
                                        question="Ya no estará habilitado el bot de whatsapp IA si no está habilitado"
                                    />{" "}
                                    <Form.control.toggle
                                        name={
                                            "enabledBotWeb" as keyof InformationSchema
                                        }
                                        title="Habilitar Vendedor IA de web"
                                        question="Ya no estará habilitado el bot de web si no está habilitado"
                                    />
                                    <Form.control.toggle
                                        name={
                                            "enabledSendSunat" as keyof InformationSchema
                                        }
                                        title="Habilitar Enviar sunat automaticamente"
                                        question={
                                            <div class="min-w-[200px]">
                                                Cuanto está habilitado esta
                                                opción, cuando tu cliente pague
                                                por pasarela o paypal, se creará
                                                la boleta o factura y se emitirá
                                                a sunat automaticamente. Si no
                                                esta habilitado, usted mismo
                                                tendrá que emitir.
                                            </div>
                                        }
                                    />
                                </div>
                                <div class="grid grid-cols-2 items-center  w-full  gap-2">
                                    <Form.control.toggle
                                        name={
                                            "enabledEmailMessage" as keyof InformationSchema
                                        }
                                        title="Habilitar Enviar comprobantes de pago en correos"
                                        question="Ya no se enviará comprobantes de pago en email de tus clientes"
                                    />
                                    <Form.control.toggle
                                        name={
                                            "enabledSendMessage" as keyof InformationSchema
                                        }
                                        title="Habilitar Enviar mensajes de whatsapp"
                                        question="Ya no se podrá enviar mensajes de whatsapp de las ordenes de los clientes"
                                    />

                                    <Form.control.toggle
                                        name={
                                            "enabledClientPayComision" as keyof InformationSchema
                                        }
                                        title="El cliente pagará la comisión de las pasarelas"
                                        question={
                                            <div class="flex flex-col w-[250px]">
                                                Si está habilitado esta opción
                                                tu cliente pagará las comisiones
                                                de las pasarelas de pago, eso
                                                quiere decir que aumentará el
                                                precio a tus productos en las
                                                pasarelas de pago a la hora de
                                                pagar. <br />
                                                <b>
                                                    Si tu producto cuesta S/.
                                                    100 totalmente + ganacias y
                                                    la pasarela de pago te
                                                    cobrabá comision % el
                                                    cliente pagará esa comisión.
                                                </b>
                                                <br />
                                                <b>
                                                    Si tu cliente paga la
                                                    comision, no se te
                                                    descontará de tus ganancias.
                                                </b>
                                            </div>
                                        }
                                    />
                                    <Form.control.toggle
                                        name={
                                            "only_register_pay" as keyof InformationSchema
                                        }
                                        title="Solo clientes registrados deben comprar"
                                        question={
                                            <div class="flex flex-col w-[250px]">
                                                Solo los clientes que se
                                                registraron a tu web pueden
                                                comprar si está habilitado.
                                            </div>
                                        }
                                    />
                                    <Form.control.toggle
                                        name={
                                            "enable_efectivo" as keyof InformationSchema
                                        }
                                        title="Pago en efectivo"
                                        question={
                                            <div class="flex flex-col w-[250px]">
                                                Tus clientes pagarán en
                                                efectivo?. Los clientes pagarán
                                                cuando reciben el producto. Se
                                                mostrará un metodo de pago.
                                            </div>
                                        }
                                    />
                                    <Form.control.toggle
                                        name={"igv" as keyof InformationSchema}
                                        title="Habilitar IGV"
                                        question={
                                            <div class="flex flex-col">
                                                <span>
                                                    incluir igv{" "}
                                                    <b>
                                                        {enviroments.VITE_IGV}%
                                                    </b>{" "}
                                                    en tus productos.
                                                </span>
                                                <span>
                                                    No podras emitir facturas ni
                                                    boletas si no está activado.
                                                </span>
                                            </div>
                                        }
                                    />

                                    <Form.control.toggle
                                        name={
                                            "enable_ruleta" as keyof InformationSchema
                                        }
                                        title="Activar Ruleta"
                                        question={
                                            <div class="flex flex-col">
                                                Si está desactivado se ocultará
                                                la ruleta.
                                            </div>
                                        }
                                    />
                                    <div class="w-[100px]">
                                        <Form.control
                                            name={
                                                "max_days_premios" as keyof InformationSchema
                                            }
                                            type="number"
                                            title="Máximo días de premios"
                                            options={{ setValueAs: Number }}
                                            question={
                                                <div class="flex flex-col">
                                                    Días para que tus clientes
                                                    puedan usar sus premios.
                                                </div>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="w-full flex flex-col">
                            <div class="w-full flex justify-between">
                                <span class="font-semibold dark:text-secondary-light">
                                    Transferencias Bancarias
                                </span>
                                <button
                                    class="text-white w-[20px] h-[20px] text-xs dark:text-black bg-black flex justify-center items-center font-bold rounded-full dark:bg-white"
                                    type="button"
                                    aria-label="on show transferencias"
                                    onClick={() => {
                                        sweetModal({
                                            html: reactComponent(
                                                <div class="dark:text-white flex flex-col gap-2">
                                                    <h1 class="text-xl">
                                                        Cuentas Bancarias
                                                    </h1>
                                                    <p class="text-sm">
                                                        Tus clientes podrán
                                                        pagar por transferencia
                                                        bancaría, te enviaran
                                                        una imagen del
                                                        comprobante de pago. y
                                                        tú confirmarás la orden
                                                        si el pago fue realizado
                                                        correctamente.
                                                    </p>
                                                    <AlertInfo>
                                                        <span>
                                                            Recomendable.
                                                            Disponible cuentas
                                                            bancarias sin
                                                            comisiones*
                                                        </span>
                                                    </AlertInfo>
                                                    <AlertInfo>
                                                        <span>
                                                            Si no tienes ninguna
                                                            cuenta bancaria, no
                                                            estará habilitado el
                                                            boton de pagar por
                                                            transferencia.
                                                        </span>
                                                    </AlertInfo>
                                                </div>
                                            ),
                                            showCloseButton: true,
                                        });
                                    }}
                                >
                                    ?
                                </button>
                            </div>
                            <div>
                                <span class="text-xs font-bold dark:text-white">
                                    BCP
                                </span>
                                <div class="flex gap-2 items-center flex-col md:flex-row">
                                    <Form.control
                                        name={
                                            "transferencias.bcp.titular" as keyof InformationSchema
                                        }
                                        title="Nombre de Titular"
                                        placeholder="XXXXXXX"
                                    />
                                    <Form.control
                                        name={
                                            "transferencias.bcp.soles" as keyof InformationSchema
                                        }
                                        title="Cuenta a soles"
                                        ico={<span>S/.</span>}
                                        placeholder="XXXXXXX-XXXXXX"
                                    />
                                    <Form.control
                                        name={
                                            "transferencias.bcp.dolares" as keyof InformationSchema
                                        }
                                        title="Cuenta a dolares"
                                        ico={<span>$</span>}
                                        placeholder="XXXXXXX-XXXXXX"
                                    />
                                </div>
                            </div>
                            <div>
                                <span class="text-xs font-bold dark:text-white">
                                    BBVA
                                </span>
                                <div class="flex gap-2 items-center flex-col md:flex-row">
                                    <Form.control
                                        name={
                                            "transferencias.bbva.titular" as keyof InformationSchema
                                        }
                                        title="Nombre de Titular"
                                        placeholder="XXXXXXX"
                                    />
                                    <Form.control
                                        name={
                                            "transferencias.bbva.soles" as keyof InformationSchema
                                        }
                                        title="Cuenta a soles"
                                        ico={<span>S/.</span>}
                                        placeholder="XXXXXXX-XXXXXX"
                                    />
                                    <Form.control
                                        name={
                                            "transferencias.bbva.dolares" as keyof InformationSchema
                                        }
                                        title="Cuenta a dolares"
                                        ico={<span>$</span>}
                                        placeholder="XXXXXXX-XXXXXX"
                                    />
                                </div>
                            </div>
                            <div>
                                <span class="text-xs font-bold dark:text-white">
                                    Interbank
                                </span>
                                <div class="flex gap-2 items-center flex-col md:flex-row">
                                    <Form.control
                                        name={
                                            "transferencias.interbank.titular" as keyof InformationSchema
                                        }
                                        title="Nombre de Titular"
                                        placeholder="XXXXXXX"
                                    />
                                    <Form.control
                                        name={
                                            "transferencias.interbank.soles" as keyof InformationSchema
                                        }
                                        title="Cuenta a soles"
                                        ico={<span>S/.</span>}
                                        placeholder="XXXXXXX-XXXXXX"
                                    />
                                    <Form.control
                                        name={
                                            "transferencias.interbank.dolares" as keyof InformationSchema
                                        }
                                        title="Cuenta a dolares"
                                        ico={<span>$</span>}
                                        placeholder="XXXXXXX-XXXXXX"
                                    />
                                </div>
                            </div>
                        </div>
                        <AlertInfo>
                            <>
                                Disponible para webs standard y empresarial
                                <a
                                    href="/admin/plus"
                                    class="font-bold underline ml-2"
                                >
                                    Mas información
                                </a>
                                .
                            </>
                        </AlertInfo>
                        <div class="flex gap-2 items-center w-full lg:flex-row flex-wrap">
                            <Form.control.map
                                title="ubicación de mapa al cliente"
                                name={"map_marker" as keyof InformationSchema}
                                question="Lugar de ubicación que se mostrará en el mapa."
                            />

                            <div class="flex flex-row lg:flex-col  gap-2">
                                <Form.control.toggle
                                    name={
                                        "enable_map_marker" as keyof InformationSchema
                                    }
                                    title="Habilitar ubicación a la hora de pagar"
                                    question="Se mostrará un campo para que tu cliente ponga su ubicación de entrega."
                                />
                                <Form.control.toggle
                                    name={
                                        "enabledAnimation" as keyof InformationSchema
                                    }
                                    title="Habilitar Animaciones"
                                    question="Ya no estará habilitado las animaciones que tendrás tus webs"
                                />
                                <Form.control.toggle
                                    name={
                                        "enable_pwa" as keyof InformationSchema
                                    }
                                    disabled={!webEmpresarial()}
                                    title="Habilitar PWA"
                                    question={
                                        <div class="w-[100px]">
                                            Tus clientes podrán obtendrán PWA
                                            para PC y android.
                                            <br />
                                            <span class="font-bold">
                                                Mirar los beneficios de tener
                                                una web PWA - APLICACION WEB
                                                PROGRESIVA
                                            </span>
                                            <a
                                                class="text-primary ml-2"
                                                target="_blank"
                                                rel="noreferrer"
                                                href="https://www.youtube.com/shorts/pfYdGhFWD7s"
                                            >
                                                VER
                                            </a>
                                        </div>
                                    }
                                />
                            </div>
                        </div>
                        <Form.button.submit
                            disabled={
                                informationUpdateMutation.isLoading || false
                            }
                            isLoading={
                                informationUpdateMutation.isLoading || false
                            }
                            title="Guardar Cambios"
                        />
                    </Form>
                    <Hr spacing={13} />
                    <Form
                        {...settingsLogoUpdateform}
                        onSubmit={onUpdateLogoInformation}
                    >
                        <Form.control.file
                            name={"logo" as keyof InformationSchema}
                            title="Logo de la empresa"
                            accept="image/*"
                            typeFile="image"
                        />
                        <Form.button.submit
                            disabled={
                                informationUpdateFotoMutation.isLoading || false
                            }
                            isLoading={
                                informationUpdateFotoMutation.isLoading || false
                            }
                            title="Guardar Cambios"
                        />
                    </Form>
                    <Hr spacing={13} />
                    <Form
                        {...settingsIconUpdateform}
                        onSubmit={onUpdateIconInformation}
                    >
                        <Form.control.file
                            name={"icon" as keyof InformationSchema}
                            title="Icono de la web"
                            accept="image/*"
                            typeFile="image"
                        />
                        <Form.button.submit
                            disabled={
                                informationUpdateIconMutation.isLoading || false
                            }
                            isLoading={
                                informationUpdateIconMutation.isLoading || false
                            }
                            title="Guardar Cambios"
                        />
                    </Form>
                    <Hr spacing={13} />
                    <div class="flex flex-col md:flex-row gap-4 items-center">
                        <Form
                            {...settingsQrYapeUpdateform}
                            onSubmit={onUpdateQrYapeInformation}
                        >
                            <Form.control.file
                                name={"qrYape" as keyof InformationSchema}
                                title="Qr Yape  - metodo de pago Yape"
                                accept="image/*"
                                typeFile="image"
                            />
                            <Form.button.submit
                                disabled={
                                    informationUpdateQrYapeMutation.isLoading ||
                                    false
                                }
                                isLoading={
                                    informationUpdateQrYapeMutation.isLoading ||
                                    false
                                }
                                title="Guardar Cambios"
                            />
                        </Form>
                        <Form
                            {...settingsQrPlinUpdateform}
                            onSubmit={onUpdateQrPlinInformation}
                        >
                            <Form.control.file
                                name={"qrPlin" as keyof InformationSchema}
                                title="Qr plin  - metodo de pago Plin"
                                accept="image/*"
                                typeFile="image"
                            />
                            <Form.button.submit
                                disabled={
                                    informationUpdateQrPlinMutation.isLoading ||
                                    false
                                }
                                isLoading={
                                    informationUpdateQrPlinMutation.isLoading ||
                                    false
                                }
                                title="Guardar Cambios"
                            />
                        </Form>
                    </div>
                </div>
            </Container>
        );
    }
    return component;
}

export default InformationUpdate;
