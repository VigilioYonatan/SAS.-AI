import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import useAuthstore from "@/auth/stores/auth.store";
import Form from "~/components/form";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "preact/hooks";
import {
    empresasIconUpdateDto,
    EmpresasIconUpdateDto,
    empresasLogoPWAUpdateDto,
    EmpresasLogoPWAUpdateDto,
    empresasLogoUpdateDto,
    EmpresasLogoUpdateDto,
    empresasUpdateDto,
    EmpresasUpdateDto,
} from "../dtos/empresas.update.dto";

import {
    empresasUpdateIconApi,
    empresaUpdateApi,
    empresaUpdateLogoApi,
    empresaUpdateLogoPWAApi,
} from "../apis/empresas.update.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { valibotVigilio } from "~/libs/valibot";
import {
    formatDateTwo,
    getDominantColorFromFile,
    handlerError,
    isColorLight,
    rgbToHex,
} from "~/libs/helpers";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { empresaPrivateApi } from "../apis/empresas.private.api";
import { getFilesEdit } from "~/libs/upload";
import useEmpresastore, { storageEmpresa } from "../stores/empresa.store";
import { formSelectNumber } from "~/components/form/FormSelect";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { DIALCODE, typeFiscal } from "../libs/helpers";
import { useSignal } from "@preact/signals";
import { settingsUpdateApi } from "../apis/settings/settings.update.api";
import {
    updateVps,
    vigilioVersionLatests,
} from "../apis/vigilio-services.information.api";
import Helper from "~/components/Helper";
import enviroments from "~/config";
import LoaderSubmit from "~/components/LoaderSubmit";

function empresaUpdate() {
    const { guards } = useAuthstore();
    if (!guards.permissionAdminGuard()) {
        window.history.back();
        return null;
    }
    const empresaQuery = empresaPrivateApi();
    let component: JSX.Element | JSX.Element[] | null = null;
    if (empresaQuery.isLoading) {
        component = <Loading />;
    }
    if (empresaQuery.isError) {
        component = <View404 message={empresaQuery.error?.message} />;
    }
    if (empresaQuery.isSuccess) {
        const empresaStore = useEmpresastore();

        const empresa = empresaQuery.data!.empresa;
        const empresaUpdateMutation = empresaUpdateApi();
        const empresaUpdateIconMutation = empresasUpdateIconApi();
        const empresasUpdateMutation = settingsUpdateApi();
        const color = useSignal<string | null>(
            storageEmpresa!.logo ? storageEmpresa!.setting.bg_color : null
        );
        const colorError = useSignal<string | null>(null);

        const colorChoose = useSignal<string[][] | null>(null);

        const empresasUpdateform = useForm<EmpresasUpdateDto>({
            resolver: valibotVigilio(empresasUpdateDto),
            mode: "all",
            defaultValues: useMemo(() => {
                const {
                    contacts,
                    inteligenceArtificial,
                    yearFounded,
                    logo,
                    ...rest
                } = empresa;

                return {
                    ...rest,
                    enabledBotWeb: true,
                    yearFounded: formatDateTwo(
                        yearFounded,
                        "YYYY-MM-DD"
                    ) as Date,
                };
            }, []),
        });

        const empresasIconUpdateform = useForm<EmpresasIconUpdateDto>({
            resolver: valibotVigilio(empresasIconUpdateDto),
            mode: "all",
        });

        async function initialUpdateIcon() {
            if (empresa.icon) {
                const icon = await getFilesEdit(empresa.icon, 300);
                empresasIconUpdateform.setValue("icon", icon);
            }
        }

        function onUpdateIconEmpresa(body: EmpresasIconUpdateDto) {
            sweetModal({
                title: "¿Estas seguro de cambiar el icono de tu web?",
                isCloseInBackground: false,
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    empresaUpdateIconMutation.mutate(
                        { ...body, name: empresaStore.state!.name_empresa },
                        {
                            onSuccess(data) {
                                empresaStore.methods.updateempresa({
                                    icon: data.files,
                                });
                                sweetAlert({
                                    icon: "success",
                                    title: "Actualizado icono correctamente",
                                });
                            },
                            onError() {
                                sweetAlert({
                                    icon: "danger",
                                    title: "Error al actualizar",
                                });
                            },
                        }
                    );
                }
            });
        }

        function onUpdateempresa(body: EmpresasUpdateDto) {
            sweetModal({
                title: "¿Estas seguro de realizar estos cambios en tu web?",
                isCloseInBackground: false,
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    empresaUpdateMutation.mutate(body, {
                        onSuccess(data) {
                            empresaStore.methods.updateempresa(data.empresa);
                            sweetAlert({
                                icon: "success",
                                title: `Actualizado correctamente tu aplicación: ${data.empresa.name_empresa}`,
                            });
                        },
                        onError(error) {
                            handlerError(empresasUpdateform, error);
                        },
                    });
                }
            });
        }
        const empresaUpdateLogoMutation = empresaUpdateLogoApi();
        const empresaUpdateLogoPWAMutation = empresaUpdateLogoPWAApi();

        const empresasLogoUpdateform = useForm<EmpresasLogoUpdateDto>({
            resolver: valibotVigilio(empresasLogoUpdateDto),
            mode: "all",
        });
        const empresasLogoPWAUpdateform = useForm<EmpresasLogoPWAUpdateDto>({
            resolver: valibotVigilio(empresasLogoPWAUpdateDto),
            mode: "all",
        });

        const logo = empresasLogoUpdateform.watch("logo");
        async function initialUpdateLogo() {
            if (empresa.logo) {
                const logo = await getFilesEdit(empresa.logo, 300);
                empresasLogoUpdateform.setValue("logo", logo);
                await getColor(logo[0]);
            }
        }
        async function initialUpdatePWALogo() {
            if (empresa.logo_pwa) {
                const logo_pwa = await getFilesEdit(empresa.logo_pwa, 513);
                empresasLogoPWAUpdateform.setValue("logo_pwa", logo_pwa);
            }
        }
        async function getColor(file: File) {
            const colorC = await getDominantColorFromFile(file);
            if (colorC) {
                colorChoose.value = colorC as string[][];
            }
        }
        useEffect(() => {
            if (logo) {
                getColor(logo[0]);
                color.value = null;
            }
        }, [logo]);
        useEffect(() => {
            initialUpdateIcon();
        }, []);

        function onUpdateLogoSetting(body: EmpresasLogoUpdateDto) {
            if (!color.value && logo) {
                colorError.value = "Escoge un color para tu Web.";
                return;
            }
            colorError.value = null;
            sweetModal({
                title: "¿Estas seguro de cambiar el logo de tu web?",
                isCloseInBackground: false,
                showCancelButton: true,
                showCloseButton: true,
            }).then(async ({ isConfirmed }) => {
                if (isConfirmed) {
                    await empresasUpdateMutation.mutateAsync(
                        empresaStore.state!.setting
                    );
                    empresaUpdateLogoMutation.mutate(
                        { ...body, name: empresaStore.state!.name_empresa },
                        {
                            onSuccess(data) {
                                empresaStore.methods.updateempresa({
                                    ...empresaStore.state!,
                                    logo: data.files,
                                });
                                sweetAlert({
                                    icon: "success",
                                    title: "Actualizado logo correctamente",
                                });
                            },
                            onError() {
                                sweetAlert({
                                    icon: "danger",
                                    title: "Error al actualizar",
                                });
                            },
                        }
                    );
                }
            });
        }
        function onUpdateLogoPWASetting(body: EmpresasLogoPWAUpdateDto) {
            sweetModal({
                title: "¿Estas seguro de cambiar el logo de tu web?",
                isCloseInBackground: false,
                showCancelButton: true,
                showCloseButton: true,
            }).then(async ({ isConfirmed }) => {
                if (isConfirmed) {
                    empresaUpdateLogoPWAMutation.mutate(
                        { ...body, name: empresaStore.state!.name_empresa },
                        {
                            onSuccess(data) {
                                empresaStore.methods.updateempresa({
                                    ...empresaStore.state!,
                                    logo_pwa: data.files,
                                });
                                sweetAlert({
                                    icon: "success",
                                    title: "Actualizado logo correctamente",
                                });
                            },
                            onError(error) {
                                sweetAlert({
                                    icon: "danger",
                                    title: error.message,
                                });
                            },
                        }
                    );
                }
            });
        }

        useEffect(() => {
            initialUpdateLogo();
            initialUpdatePWALogo();
        }, []);

        component = (
            <Container className="p-2">
                <div className="flex flex-col gap-4 mx-1 ">
                    <AdminBreadCrumb current="configuración" />
                </div>
                <div class="p-4">
                    <h3 class="dark:text-white lg:text-2xl  font-bold uppercase text-center flex gap-2  w-full mb-4">
                        <i class="fa-solid fa-tools" />
                        Empresa {empresa.name_empresa}
                    </h3>
                    <Form {...empresasUpdateform} onSubmit={onUpdateempresa}>
                        <div class="flex justify-between items-center mb-4 gap-2">
                            <div class="flex items-center justify-between w-full gap-2 flex-wrap">
                                <Form.button.reset />
                            </div>
                            <div class="flex  items-center gap-2">
                                <a
                                    href="/api/backup"
                                    type="button"
                                    class="bg-green-600 text-white px-5 py-2 rounded-md"
                                >
                                    <i class="far fa-file-spreadsheet" />
                                </a>
                                <a
                                    href="/api/backup/files"
                                    type="button"
                                    class=" text-white px-5 py-2 rounded-md bg-primary"
                                >
                                    <i class="fas fa-folder-open" />
                                </a>
                            </div>
                        </div>
                        <div class="flex flex-col gap-4 justify-center items-center">
                            <div class="w-full flex flex-col md:flex-row gap-2">
                                <Form.control
                                    name={
                                        "name_empresa" as keyof EmpresasUpdateDto
                                    }
                                    title="Nombre de empresa"
                                    placeholder="Nombre de empresa"
                                />
                                <Form.control
                                    name={"email" as keyof EmpresasUpdateDto}
                                    title="Correo electrónico de empresa"
                                    type="text"
                                    placeholder="tuempresa@gmail.com"
                                    ico={<i class="fas fa-at" />}
                                />
                            </div>
                            <div class="w-full flex flex-col md:flex-row gap-2">
                                <Form.control
                                    name={"negocio" as keyof EmpresasUpdateDto}
                                    placeholder="Tipo de empresa"
                                    title="Tipo de empresa"
                                    value={empresa.tipo_empresa.value}
                                    disabled
                                />
                                {storageEmpresa?.type_empresa_other ? (
                                    <Form.control
                                        name={
                                            "other" as keyof EmpresasUpdateDto
                                        }
                                        placeholder="empresa"
                                        title="Empresa"
                                        value={
                                            storageEmpresa?.type_empresa_other
                                        }
                                        disabled
                                    />
                                ) : null}

                                {empresa.web ? (
                                    <Form.control
                                        name={"web" as keyof EmpresasUpdateDto}
                                        title="Web"
                                        type="text"
                                        placeholder=""
                                        disabled
                                    />
                                ) : null}
                            </div>{" "}
                            <div class="w-full flex flex-col md:flex-row gap-2">
                                <Form.control.select
                                    array={
                                        storageEmpresa!.impuestos.map(
                                            (imp) => ({
                                                key: imp,
                                                value: `${imp.toString()}%`,
                                            })
                                        )!
                                    }
                                    name={"igv" as keyof EmpresasUpdateDto}
                                    placeholder={`Escoger ${empresa.tipo_impuesto}`}
                                    title={`${empresa.tipo_impuesto}`}
                                    question="Si el impuesto es distinto, puedes modificarlo"
                                    options={{
                                        setValueAs: formSelectNumber,
                                    }}
                                />
                                <Form.control.toggle
                                    name={
                                        "enabled_igv" as keyof EmpresasUpdateDto
                                    }
                                    title={`Activar impuestos ${storageEmpresa?.tipo_impuesto}`}
                                    question={
                                        <div class="flex flex-col">
                                            <span>
                                                ¿incluir %
                                                {storageEmpresa?.tipo_impuesto}{" "}
                                                en tus productos?
                                            </span>
                                            {storageEmpresa?.dial_code ===
                                            "51" ? (
                                                <span>
                                                    No podras emitir facturas ni
                                                    boletas si no está activado.
                                                </span>
                                            ) : null}
                                        </div>
                                    }
                                />{" "}
                            </div>
                            <div class="w-full flex flex-col md:flex-row gap-2">
                                <Form.control
                                    name={
                                        "telephoneFirst" as keyof EmpresasUpdateDto
                                    }
                                    type="tel"
                                    title="Primer Numero de Celular"
                                    ico={<i class="fas fa-mobile-alt" />}
                                />
                                <Form.control
                                    name={
                                        "telephoneReclamos" as keyof EmpresasUpdateDto
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
                                        "telephoneThird" as keyof EmpresasUpdateDto
                                    }
                                    type="tel"
                                    title="Tercer numero de celular"
                                    ico={<i class="fas fa-mobile-alt" />}
                                    question="Este campo no es obligatorio"
                                />
                                <Form.control
                                    name={
                                        "yearFounded" as keyof EmpresasUpdateDto
                                    }
                                    type="date"
                                    title="Fundado"
                                />
                            </div>
                            <Form.control.area
                                name={"about" as keyof EmpresasUpdateDto}
                                title="Acerca de la empresa"
                                placeholder={`Somos  ${storageEmpresa?.name_empresa} ...`}
                            />
                            <span class="font-semibold dark:text-secondary-light">
                                Redes Sociales
                            </span>
                            <div class="w-full flex flex-col md:flex-row gap-2">
                                <Form.control
                                    name={"facebook" as keyof EmpresasUpdateDto}
                                    title="Facebook"
                                    ico={<i class="fab fa-facebook" />}
                                    placeholder="facebook de empresa"
                                    question="Este campo no es obligatorio."
                                />
                                <Form.control
                                    name={"tiktok" as keyof EmpresasUpdateDto}
                                    title="Tik Tok"
                                    ico={<i class="fab fa-tiktok" />}
                                    question="Este campo no es obligatorio."
                                    placeholder="Tik Tok de empresa"
                                />
                                <Form.control
                                    name={"twitter" as keyof EmpresasUpdateDto}
                                    title="Twitter"
                                    ico={<i class="fab fa-twitter" />}
                                    placeholder="Twitter de empresa"
                                    question="Este campo no es obligatorio."
                                />
                            </div>
                            <div class="w-full flex flex-col md:flex-row gap-2">
                                <Form.control
                                    name={
                                        "instagram" as keyof EmpresasUpdateDto
                                    }
                                    title="Instagram"
                                    ico={<i class="fab fa-instagram" />}
                                    placeholder="Instagram de empresa"
                                    question="Este campo no es obligatorio."
                                />
                                <Form.control
                                    name={"youtube" as keyof EmpresasUpdateDto}
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
                                            "isOpen" as keyof EmpresasUpdateDto
                                        }
                                        title="Tienda Abierta"
                                        question={
                                            <div class="flex flex-col">
                                                Está disponible tu tienda? Tus
                                                clientes no podrán comprar
                                            </div>
                                        }
                                    />
                                    <Form.control
                                        name={
                                            "dial_code" as keyof EmpresasUpdateDto
                                        }
                                        disabled
                                        title="Pais codigo"
                                    />
                                    <Form.control
                                        name={"tz" as keyof EmpresasUpdateDto}
                                        disabled
                                        title="tz"
                                    />
                                    <Form.control.toggle
                                        name={
                                            "enabled_booster" as keyof EmpresasUpdateDto
                                        }
                                        title="Habilitar Velocidad 500% mas rápido a la web"
                                        question={
                                            <div class="w-[120px] md:w-[200px]">
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
                                                <br />
                                                Puede que si modifiques tu web
                                                se tarde en actualizarse 30 - 60
                                                minutos.
                                            </div>
                                        }
                                    />
                                    <Form.control.toggle
                                        name={
                                            "enabled_catalogo" as keyof EmpresasUpdateDto
                                        }
                                        title="Habilitar Web"
                                        question="Su web no se mostrará a los clientes."
                                    />
                                    <Form.control.toggle
                                        name={
                                            "enabledBot" as keyof EmpresasUpdateDto
                                        }
                                        title="Habilitar IA de de whatsapp"
                                        question="Ya no estará habilitado el bot de whatsapp IA si no está habilitado"
                                    />{" "}
                                    <Form.control.toggle
                                        name={
                                            "enabled_commentario_ia" as keyof EmpresasUpdateDto
                                        }
                                        title="Habilitar IA en los comentarios de tu web"
                                        question="Lo usuarios que comentan en tu productos o servicios, le responderá la I.A."
                                    />{" "}
                                    {/* <Form.control.toggle
                                        name={
                                            "" as keyof EmpresasUpdateDto
                                        }
                                        title="Habilitar Vendedor IA de web"
                                        question="Ya no estará habilitado el bot de web si no está habilitado"
                                    /> */}
                                    {[DIALCODE.peru].includes(
                                        empresaStore.state!
                                            .dial_code as DIALCODE
                                    ) ? (
                                        <Form.control.toggle
                                            name={
                                                "enabledSendSunat" as keyof EmpresasUpdateDto
                                            }
                                            title="Habilitar Enviar sunat automáticamente"
                                            question={
                                                <div class="min-w-[200px]">
                                                    Cuanto está habilitado esta
                                                    opción, cuando tu cliente
                                                    pague por pasarela o paypal,
                                                    se creará factura y se
                                                    emitirá automáticamente. Si
                                                    no esta habilitado, usted
                                                    mismo tendrá que emitir.
                                                </div>
                                            }
                                        />
                                    ) : null}
                                    <Form.control.toggle
                                        name={
                                            "enabledClientPayComision" as keyof EmpresasUpdateDto
                                        }
                                        title="El cliente pagará la comisión de las pasarelas"
                                        question={
                                            <div class="flex flex-col w-[120px] md:w-[250px]">
                                                Si está habilitado esta opción
                                                tu cliente pagará las comisiones
                                                de las pasarelas de pago, eso
                                                quiere decir que aumentará el
                                                precio a tus productos en las
                                                pasarelas de pago a la hora de
                                                pagar. <br />
                                                <b>
                                                    Si tu producto cuesta 100
                                                    totalmente y la pasarela de
                                                    pago te cobrabá comision %
                                                    el cliente pagará esa
                                                    comisión.
                                                </b>
                                            </div>
                                        }
                                    />
                                </div>
                                <div class="grid grid-cols-2 items-center  w-full  gap-2">
                                    <Form.control.toggle
                                        name={
                                            "enabledSendMessage" as keyof EmpresasUpdateDto
                                        }
                                        title="Habilitar Enviar mensajes de whatsapp"
                                        question="Ya no se podrá enviar mensajes de whatsapp de las ordenes de los clientes"
                                    />
                                    <Form.control.toggle
                                        name={
                                            "enable_sell_country" as keyof EmpresasUpdateDto
                                        }
                                        title="Habilitar Vender todo el pais"
                                        question="Venderás en todo el pais, Entrar a configuración/ Precio de envio"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="flex gap-2 items-center w-full lg:flex-row flex-wrap">
                            <Form.control.map
                                title="ubicación de empresa"
                                name={"map_marker" as keyof EmpresasUpdateDto}
                                question={
                                    <div>
                                        Lugar de ubicación que se mostrará en el
                                        mapa.
                                        <br />
                                        Recomendable el local de tu
                                        negocio/empresa
                                    </div>
                                }
                                isLocal
                            />
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-2 flex-wrap w-full">
                                <Form.control.toggle
                                    name={
                                        "enable_map_marker" as keyof EmpresasUpdateDto
                                    }
                                    title="Habilitar Google Maps a la hora de pagar"
                                    question={
                                        <span>
                                            Se mostrará un campo para que tu
                                            cliente ponga su ubicación de
                                            entrega (carrito). <br />
                                            Recomendable para empresas/negocios
                                            que venden en todo el país.
                                        </span>
                                    }
                                />
                                <Form.control.toggle
                                    name={
                                        "enabled_address" as keyof EmpresasUpdateDto
                                    }
                                    title="Habilitar Dirección a la hora de pagar"
                                    question={
                                        <span>
                                            Se mostrará los campos dirección y
                                            referencia a la hora de pagar
                                            (carrito).
                                        </span>
                                    }
                                />
                                <Form.control.toggle
                                    name={
                                        "enabled_dni_cart" as keyof EmpresasUpdateDto
                                    }
                                    title="Habilitar Documento de identidad a la hora de pagar"
                                    question={
                                        <span>
                                            Se mostrará los campos{" "}
                                            {
                                                typeFiscal[
                                                    storageEmpresa?.dial_code as keyof typeof typeFiscal
                                                ].type_dni
                                            }
                                            /
                                            {
                                                typeFiscal[
                                                    storageEmpresa?.dial_code as keyof typeof typeFiscal
                                                ].type_fiscal
                                            }{" "}
                                            a la hora de pagar (carrito).
                                            <br />
                                        </span>
                                    }
                                />
                                <Form.control.toggle
                                    name={
                                        "enabledAnimation" as keyof EmpresasUpdateDto
                                    }
                                    title="Habilitar Animaciones"
                                    question="Ya no estará habilitado las animaciones que tendrás tus webs"
                                />
                                <Form.control.toggle
                                    name={"isDolar" as keyof EmpresasUpdateDto}
                                    title="Habilitar Dolar"
                                    question={
                                        <>
                                            Tus clientes podrán ver los precios
                                            en dolares
                                            <br />
                                            <a
                                                href="https://www.xe.com/"
                                                target="_blank"
                                                rel="noreferrer"
                                                class="underline"
                                            >
                                                Más información
                                            </a>
                                        </>
                                    }
                                />
                                <Form.control.toggle
                                    name={
                                        "enabledSound" as keyof EmpresasUpdateDto
                                    }
                                    title="Habilitar Sonido Alerta"
                                    question="Ya no emitirá sonido a las ordenes de los clientes"
                                />
                                <Form.control
                                    type="text"
                                    ico={<i class="fab fa-telegram" />}
                                    name={
                                        "telegram_token" as keyof EmpresasUpdateDto
                                    }
                                    title="Telegram Token I.A"
                                    question={
                                        <div class="w-[250px]">
                                            Disponible para telegram PLAN
                                            <br />
                                            <span class="font-bold text-base">
                                                Como obtener telegram Token
                                            </span>
                                            <br />
                                            1. Buscar en Telegram{" "}
                                            <a
                                                target="_blank"
                                                class="text-primary underline"
                                                href="https://t.me/BotFather"
                                                rel="noreferrer"
                                            >
                                                BotFather
                                            </a>
                                            <br />
                                            2. Digitar /start <br /> 3. Despues
                                            digitar /token
                                            <br />
                                            4. Completar las preguntas.
                                            <br />
                                            5. Copiar Token. ejemplo:
                                            7504180864:AAG70K8Xy...
                                            <br />
                                            6. Enviar mensaje a tu Bot de
                                            telegram
                                            <br />
                                            <a
                                                href="https://core.telegram.org/"
                                                target="_blank"
                                                class="underline text-primary font-semibold"
                                                rel="noreferrer"
                                            >
                                                Más información
                                            </a>
                                        </div>
                                    }
                                />
                                <Form.control
                                    name={
                                        "header_cart" as keyof EmpresasUpdateDto
                                    }
                                    title="Titulo Carrito Link"
                                    question={
                                        <div class="w-[250px]">
                                            Perzonaliza el texto del link de tu
                                            carrito de compra.
                                            <br />
                                            Por defecto es{" "}
                                            <b class="font-semibold">
                                                Los mejores productos en un solo
                                                lugar
                                            </b>
                                        </div>
                                    }
                                />
                            </div>
                        </div>

                        <div class="w-full my-6">
                            {" "}
                            <span class="dark:text-white font-semibold text-lg  ">
                                Integraciones
                            </span>
                            <div class="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-2">
                                <Form.control
                                    name={
                                        "facebook_pixel" as keyof EmpresasUpdateDto
                                    }
                                    title="Facebook Pixel ID"
                                    question={
                                        <div class="w-[250px]">
                                            Facebook Pixel permite rastrear
                                            acciones de usuarios en sitios web,
                                            optimizando campañas publicitarias
                                            mediante audiencias personalizadas y
                                            análisis de conversiones detallado.
                                            <br />
                                            <a
                                                href="https://www.facebook.com/business/help/171689010314963"
                                                target="_blank"
                                                rel="noreferrer"
                                                class="underline text-primary"
                                            >
                                                {" "}
                                                Más información
                                            </a>
                                        </div>
                                    }
                                />
                                <Form.control
                                    name={
                                        "google_tag_manager" as keyof EmpresasUpdateDto
                                    }
                                    title="Google Tag Manager"
                                    question={
                                        <div class="w-[250px]">
                                            Google Tag Manager gestiona
                                            etiquetas en sitios web, facilita
                                            seguimiento de usuarios, optimiza
                                            rendimiento y permite integración
                                            con herramientas como Google
                                            Analytics.
                                            <br />
                                            <a
                                                href="https://marketingplatform.google.com/intl/es/about/tag-manager/"
                                                target="_blank"
                                                rel="noreferrer"
                                                class="underline text-primary"
                                            >
                                                {" "}
                                                Más información
                                            </a>
                                        </div>
                                    }
                                />
                                <Form.control
                                    name={
                                        "tiktok_pixel" as keyof EmpresasUpdateDto
                                    }
                                    title="TikTok Pixel ID"
                                    question={
                                        <div class="w-[250px]">
                                            TikTok Pixel es un código que
                                            rastrea acciones en tu sitio web,
                                            optimiza anuncios y mide
                                            conversiones en campañas de TikTok.
                                            <br />
                                            <a
                                                href="https://ads.tiktok.com/help/article/tiktok-pixel?lang=es"
                                                target="_blank"
                                                rel="noreferrer"
                                                class="underline text-primary"
                                            >
                                                {" "}
                                                Más información
                                            </a>
                                        </div>
                                    }
                                />
                                <Form.control
                                    name={
                                        "linkedin_tag" as keyof EmpresasUpdateDto
                                    }
                                    title="LinkedIn Pixel Tag"
                                    question={
                                        <div class="w-[250px]">
                                            LinkedIn Insight Tag rastrea
                                            acciones en sitios web, optimiza
                                            anuncios y mide conversiones en
                                            campañas de LinkedIn.
                                            <br />
                                            <a
                                                href="https://business.linkedin.com/es-es/marketing-solutions/conversion-tracking"
                                                target="_blank"
                                                rel="noreferrer"
                                                class="underline text-primary"
                                            >
                                                {" "}
                                                Más información
                                            </a>
                                        </div>
                                    }
                                />
                            </div>
                        </div>
                        <div class="w-full my-6">
                            {" "}
                            <span class="dark:text-white font-semibold text-lg   relative [&>button>div]:!w-[100px]">
                                Zoho Mail{" "}
                                {!storageEmpresa!.enabled_zoho_mail ? (
                                    <Helper top={0} right={0}>
                                        <span class="text-xs">
                                            Activar Zoho Mail{" "}
                                            <a
                                                href="/plus"
                                                class="text-primary underline"
                                            >
                                                Ir
                                            </a>
                                        </span>
                                    </Helper>
                                ) : null}
                            </span>
                            <div class="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                <Form.control
                                    name={
                                        "zoho.email" as keyof EmpresasUpdateDto
                                    }
                                    title="Correo Electrónico Zoho"
                                    disabled={
                                        !storageEmpresa!.enabled_zoho_mail
                                    }
                                    question={
                                        <div class="w-[250px]">
                                            Correo electrónico que se usará para
                                            enviar mensajes a tus clientes vía
                                            correo electrónico.
                                        </div>
                                    }
                                />
                                <Form.control
                                    name={
                                        "zoho.password" as keyof EmpresasUpdateDto
                                    }
                                    title="Contraseña Zoho"
                                    type="password"
                                    disabled={
                                        !storageEmpresa!.enabled_zoho_mail
                                    }
                                    question={
                                        <div class="w-[250px]">
                                            Contraseña de tu Zoho Mail.
                                            <br />
                                            Si cambias la contraseña de Zoho
                                            Mail en la web de Zoho, debes
                                            actualizarlo aquí tambien.
                                        </div>
                                    }
                                />{" "}
                                <Form.control
                                    name={
                                        "zoho.account_id" as keyof EmpresasUpdateDto
                                    }
                                    title="Account ID Zoho"
                                    disabled
                                />
                                <Form.control
                                    name={
                                        "zoho.client_id" as keyof EmpresasUpdateDto
                                    }
                                    title="Cient ID Zoho"
                                    question={
                                        <div class="w-[250px]">
                                            Este es su id de zoho para que
                                            funcione zoho en su tienda virtual.{" "}
                                        </div>
                                    }
                                    disabled
                                />
                                <Form.control
                                    name={
                                        "zoho.client_secret" as keyof EmpresasUpdateDto
                                    }
                                    title="Cient Secret Zoho"
                                    disabled
                                    type="password"
                                />
                                <Form.control
                                    name={
                                        "zoho.refresh_token" as keyof EmpresasUpdateDto
                                    }
                                    title="Refresh Zoho"
                                    disabled
                                />
                            </div>
                        </div>

                        <Form.button.submit
                            disabled={empresaUpdateMutation.isLoading || false}
                            isLoading={empresaUpdateMutation.isLoading || false}
                            title="Guardar Cambios"
                        />
                    </Form>
                    <br />
                    <AlertInfo>
                        <span class="font-semibold dark:text-white">
                            ¿No tienes un logo?
                            <br />
                            Digite su logo en esta Inteligencia Artificial{" "}
                            <a
                                href="https://www.bing.com/images/create"
                                target="_blank"
                                rel="noreferrer"
                                class="text-primary underline"
                            >
                                aquí
                            </a>{" "}
                            - GRATIS
                        </span>
                    </AlertInfo>
                    <div class="grid-cols-2 grid gap-2 items-center">
                        <Form
                            {...empresasLogoUpdateform}
                            onSubmit={onUpdateLogoSetting}
                        >
                            {colorChoose.value ? (
                                <div>
                                    <span class="text-xs dark:text-white font-semibold">
                                        Escoger color de tu Web:
                                    </span>
                                    <div class="flex gap-2">
                                        {colorChoose.value?.map((c) => (
                                            <div
                                                key={c}
                                                class={`${
                                                    color.value ===
                                                    `#${rgbToHex(c)}`
                                                        ? isColorLight(
                                                              `#${rgbToHex(c)}`
                                                          )
                                                            ? "border-black border-2"
                                                            : "border-gray-400 border-2"
                                                        : ""
                                                } w-[60px] h-[20px]`}
                                                onClick={() => {
                                                    color.value = `#${rgbToHex(
                                                        c
                                                    )}`;
                                                    document.documentElement.style.setProperty(
                                                        "--primary",
                                                        color.value
                                                    );
                                                    empresaStore.methods.updateempresa(
                                                        {
                                                            setting: {
                                                                ...empresaStore.state!
                                                                    .setting,
                                                                bg_color:
                                                                    color.value,
                                                            },
                                                        }
                                                    );
                                                }}
                                                style={{
                                                    backgroundColor: `#${rgbToHex(
                                                        c
                                                    )}`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                    {colorError.value ? (
                                        <p class="text-danger text-xs font-semibold">
                                            {colorError.value}
                                        </p>
                                    ) : null}
                                </div>
                            ) : (
                                <></>
                            )}

                            <Form.control.file
                                name={"logo" as keyof EmpresasLogoUpdateDto}
                                title="Logo de la empresa"
                                accept="image/*"
                                multiple={false}
                                showButonCopy
                                typeFile="image"
                            />
                            <Form.button.submit
                                disabled={
                                    empresaUpdateLogoMutation.isLoading || false
                                }
                                isLoading={
                                    empresaUpdateLogoMutation.isLoading || false
                                }
                                title="Guardar Cambios"
                            />
                        </Form>
                        <Form
                            {...empresasIconUpdateform}
                            onSubmit={onUpdateIconEmpresa}
                        >
                            <Form.control.file
                                name={"icon" as keyof EmpresasIconUpdateDto}
                                title="Icono de la web (Imagen cuadrada)"
                                accept="image/*"
                                multiple={false}
                                typeFile="image"
                                showButonCopy
                            />
                            <Form.button.submit
                                disabled={
                                    empresaUpdateIconMutation.isLoading || false
                                }
                                isLoading={
                                    empresaUpdateIconMutation.isLoading || false
                                }
                                title="Guardar Cambios"
                            />
                        </Form>
                        <Form
                            {...empresasLogoPWAUpdateform}
                            onSubmit={onUpdateLogoPWASetting}
                        >
                            <Form.control.file
                                name={
                                    "logo_pwa" as keyof EmpresasLogoPWAUpdateDto
                                }
                                title="Icono de la Aplicación Movil (Imagen Cuadrada)"
                                accept="image/*"
                                multiple={false}
                                typeFile="image"
                                showButonCopy
                            />
                            <Form.button.submit
                                disabled={
                                    empresaUpdateLogoPWAMutation.isLoading ||
                                    false
                                }
                                isLoading={
                                    empresaUpdateLogoPWAMutation.isLoading ||
                                    false
                                }
                                title="Guardar Cambios"
                            />
                        </Form>
                    </div>

                    <div class="dark:text-gray-300 mt-6 text-end text-xs flex  flex-col gap-2">
                        <span>
                            <b>Token:</b> {empresa.token}
                        </span>
                        {storageEmpresa?.isFreeVPS ? null : (
                            <>
                                {(() => {
                                    const vigilioVersionLatestsQuery =
                                        vigilioVersionLatests();
                                    const updateVpsMutate = updateVps();
                                    return (
                                        <div>
                                            <span>Versión</span>{" "}
                                            {storageEmpresa?.versionamiento}
                                            <br />
                                            {storageEmpresa?.versionamiento !==
                                            vigilioVersionLatestsQuery.data
                                                ?.version.versionamiento ? (
                                                <span>
                                                    Ultima versión{" "}
                                                    {
                                                        vigilioVersionLatestsQuery
                                                            .data?.version
                                                            .versionamiento
                                                    }
                                                    <br />
                                                    <button
                                                        class="relative mt-1 bg-black px-4 py-2 rounded-md text-white"
                                                        type="button"
                                                        aria-label="update"
                                                        onClick={() => {
                                                            sweetModal({
                                                                title: "¿Estas seguro actualizar tu web en la ultima version?",
                                                                isCloseInBackground:
                                                                    false,
                                                                showCancelButton:
                                                                    true,
                                                                showCloseButton:
                                                                    true,
                                                            }).then(
                                                                ({
                                                                    isConfirmed,
                                                                }) => {
                                                                    if (
                                                                        isConfirmed
                                                                    ) {
                                                                        updateVpsMutate.mutate(
                                                                            null,
                                                                            {
                                                                                onSuccess() {
                                                                                    sweetAlert(
                                                                                        {
                                                                                            title: "Esto puede tomar unos minutos",
                                                                                        }
                                                                                    );
                                                                                },
                                                                                onError() {
                                                                                    sweetAlert(
                                                                                        {
                                                                                            title: "Esto puede tomar unos minutos",
                                                                                        }
                                                                                    );
                                                                                },
                                                                            }
                                                                        );
                                                                    }
                                                                }
                                                            );
                                                        }}
                                                        disabled={
                                                            updateVpsMutate.isLoading ||
                                                            false
                                                        }
                                                    >
                                                        {updateVpsMutate.isLoading ? (
                                                            <LoaderSubmit />
                                                        ) : (
                                                            <>
                                                                <i class="far fa-sync-alt" />{" "}
                                                                Actualizar
                                                            </>
                                                        )}

                                                        <Helper
                                                            top={0}
                                                            right={9}
                                                        >
                                                            <span>
                                                                Actualizar{" "}
                                                                {
                                                                    vigilioVersionLatestsQuery
                                                                        .data
                                                                        ?.version
                                                                        .versionamiento
                                                                }
                                                            </span>
                                                            <div>
                                                                Actualizar tu
                                                                web tiene
                                                                mejoras, como
                                                                soluciones de
                                                                bugs y puede
                                                                tomar entre 5 -
                                                                20 minutos, y no
                                                                estará
                                                                disponible por
                                                                ese tiempo.
                                                                <br /> Cuando se
                                                                actualiza se
                                                                hará un respaldo
                                                                automaticamente.
                                                            </div>
                                                            <a
                                                                class="underline"
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                href={`${enviroments.VITE_VIGILIO_WEB}/saas/versions`}
                                                            >
                                                                Más información
                                                            </a>
                                                        </Helper>
                                                    </button>
                                                </span>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    );
                                })()}
                            </>
                        )}
                    </div>
                </div>
                <AlertInfo>
                    <span class="font-semibold">
                        <b class="font-bold">¿Sabias que?</b> El 96% de los
                        usuarios no permanece más de 5 minutos en los negocios
                        digitales/tienda virtual. Por esta razón, es crucial que
                        tu negocio digital sea directo y conciso, evitando la
                        sobrecarga de información innecesaria.
                    </span>
                </AlertInfo>
            </Container>
        );
    }
    return component;
}

export default empresaUpdate;
