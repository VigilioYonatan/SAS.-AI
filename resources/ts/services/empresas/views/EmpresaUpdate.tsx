import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import useAuthstore from "@/auth/stores/auth.store";
import Form from "~/components/form";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "preact/hooks";
import {
    empresasUpdateDto,
    EmpresasUpdateDto,
} from "../dtos/empresas.update.dto";

import {
    empresaUpdateApi,
    empresaUpdateLogoApi,
} from "../apis/empresas.update.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { valibotVigilio } from "~/libs/valibot";
import { formatDateTwo, handlerError } from "~/libs/helpers";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { empresaPrivateApi } from "../apis/empresas.private.api";
import {
    settingsLogoUpdateDto,
    SettingsLogoUpdateDto,
} from "../dtos/settings.update.dto";
import { getFilesEdit } from "~/libs/upload";
import Hr from "@/web/components/Hr";
import useEmpresastore, { storageEmpresa } from "../stores/empresa.store";
import { formSelectNumber } from "~/components/form/FormSelect";
import AlertInfo from "~/components/Alerts/AlertInfo";

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

        const settingsUpdateform = useForm<EmpresasUpdateDto>({
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
                    yearFounded: formatDateTwo(
                        yearFounded,
                        "YYYY-MM-DD"
                    ) as Date,
                };
            }, []),
        });

        function onUpdateempresa(body: EmpresasUpdateDto) {
            sweetModal({
                title: "¿Estas seguro de realizar estos cambios en tu web?",
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
                            handlerError(settingsUpdateform, error);
                        },
                    });
                }
            });
        }
        const empresaUpdateLogoMutation = empresaUpdateLogoApi();

        const settingsLogoUpdateform = useForm<SettingsLogoUpdateDto>({
            resolver: valibotVigilio(settingsLogoUpdateDto),
            mode: "all",
        });

        async function initialUpdateLogo() {
            if (empresa.logo) {
                const logo = await getFilesEdit(empresa.logo, 300);
                settingsLogoUpdateform.setValue("logo", logo);
            }
        }
        function onUpdateLogoSetting(body: SettingsLogoUpdateDto) {
            sweetModal({
                title: "¿Estas seguro de cambiar el logo de tu web?",
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
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

        useEffect(() => {
            initialUpdateLogo();
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
                    <Form {...settingsUpdateform} onSubmit={onUpdateempresa}>
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
                                />
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
                                            "enabledBotWeb" as keyof EmpresasUpdateDto
                                        }
                                        title="Habilitar Vendedor IA de web"
                                        question="Ya no estará habilitado el bot de web si no está habilitado"
                                    />
                                    {empresaStore.state!.dial_code === "51" ? (
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
                                                    se creará la boleta o
                                                    factura y se emitirá a sunat
                                                    automáticamente. Si no esta
                                                    habilitado, usted mismo
                                                    tendrá que emitir.
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
                                    title="Habilitar ubicación a la hora de pagar"
                                    question={
                                        <span>
                                            Se mostrará un campo para que tu
                                            cliente ponga su ubicación de
                                            entrega. <br />
                                            Recomendable para empresas/negocios
                                            que venden en todo el país.
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
                                    title="Telegram Token"
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
                                        </div>
                                    }
                                />
                            </div>{" "}
                        </div>
                        <Form.control.area
                            name={"header_cart" as keyof EmpresasUpdateDto}
                            title="Titulo Carrito Link"
                            question={
                                <div class="w-[250px]">
                                    Perzonaliza el texto del link de tu carrito
                                    de compra.
                                    <br />
                                    Por defecto es{" "}
                                    <b class="font-semibold">
                                        Los mejores productos en un solo lugar
                                    </b>
                                </div>
                            }
                        />
                        <Form.button.submit
                            disabled={empresaUpdateMutation.isLoading || false}
                            isLoading={empresaUpdateMutation.isLoading || false}
                            title="Guardar Cambios"
                        />
                    </Form>
                    <Hr spacing={13} />

                    <Form
                        {...settingsLogoUpdateform}
                        onSubmit={onUpdateLogoSetting}
                    >
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
                        <Form.control.file
                            name={"logo" as keyof SettingsLogoUpdateDto}
                            title="Logo de la empresa"
                            accept="image/*"
                            multiple={false}
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

                    <span class="dark:text-gray-300 mt-6 text-end text-xs block ">
                        <b>Token:</b> {empresa.token}
                    </span>
                </div>
            </Container>
        );
    }
    return component;
}

export default empresaUpdate;
