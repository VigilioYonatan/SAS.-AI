import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { informationIAUpdateApi } from "@/information/apis/information.ia.update.api";
import {
    informationIAUpdateDto,
    type InformationIAUpdateDto,
} from "@/information/dtos/information.ia.update.dto";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { useFieldArray, useForm } from "react-hook-form";
import AdminHr from "~/components/AdminHr";
import Form from "~/components/form";
import enviroments from "~/config";
import { NOW, handlerError } from "~/libs/helpers";
import { valibotVigilio } from "~/libs/valibot";
import { reactComponent } from "~/libs/preact";
import { informationPrivateApi } from "@/information/apis/information.private.api";

function InteligenciaArtificial() {
    const informationShowQuery = informationPrivateApi();
    let component = null;

    if (informationShowQuery.isLoading) {
        component = <Loading />;
    }
    if (informationShowQuery.isError) {
        component = <View404 message={informationShowQuery.error?.message} />;
    }
    if (informationShowQuery.isSuccess) {
        const usage =
            informationShowQuery.data!.information.inteligenceArtificial.usage;
        const information = informationShowQuery.data!.information;
        const informationPromptUpdateMutation = informationIAUpdateApi();
        const informationPromptForm = useForm<InformationIAUpdateDto>({
            resolver: valibotVigilio(informationIAUpdateDto),
            defaultValues: {
                inteligenceArtificial:
                    informationShowQuery.data!.information
                        .inteligenceArtificial,
            },
        });

        const { fields, prepend, remove } = useFieldArray({
            control: informationPromptForm.control,
            name: "inteligenceArtificial.datos" as never,
        });

        function onUpdateInformationPrompt(data: InformationIAUpdateDto) {
            sweetModal({
                title: "¿Estás seguro de realizar estos cambios?",
                customIcon:
                    "<i class='fas fa-user-robot text-3xl dark:text-white' ></i>",
                showCloseButton: true,
                showCancelButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    informationPromptUpdateMutation.mutate(data, {
                        onSuccess(data) {
                            sweetAlert({
                                icon: "success",
                                title: data.message,
                            });
                        },
                        onError(error) {
                            handlerError(informationPromptForm, error);
                        },
                    });
                }
            });
        }
        component = (
            <Container className="p-4">
                <div className="flex gap-4 justify-between">
                    <AdminBreadCrumb current="Inteligencia Artificial" />
                </div>
                <Form
                    {...informationPromptForm}
                    onSubmit={onUpdateInformationPrompt}
                >
                    <div class="flex justify-between  items-center my-2  mb-3 gap-2">
                        <button
                            class="bg-primary px-4 py-2 rounded-md text-white font-bold"
                            type="button"
                            aria-label="show question"
                            onClick={() => {
                                sweetModal({
                                    html: reactComponent(
                                        <div class="dark:text-white ">
                                            <h3 class="font-bold text-xl text-center">
                                                ¿Qué hará tu vendendor de
                                                inteligencia Artificial?
                                            </h3>
                                            <br />
                                            <div class="flex flex-col gap-2">
                                                <span>
                                                    {" "}
                                                    - Responderás las consultas
                                                    de tus clientes sobre tus
                                                    productos (cantidad,envia
                                                    imagen, etc) y información
                                                    de tu empresa
                                                </span>
                                                <span>
                                                    - Escucha audios en whatsapp
                                                    y envia imagenes.
                                                </span>
                                                <span>
                                                    - Si el cliente escribe su
                                                    orden de pedido ORD-XXXXXX,
                                                    la Inteligencia Artifiicial
                                                    le dirá el estado de ese
                                                    pedido , por eso{" "}
                                                    <b>
                                                        siempre cambiar el
                                                        estado de tus ordenes
                                                    </b>{" "}
                                                    para que tus clientes sepan
                                                    el estado de su orden en
                                                    tiempo real .
                                                </span>
                                                <span>
                                                    - Tu ia se comportará como
                                                    un carrito de compras, y
                                                    entregará link de pago para
                                                    que pague.
                                                </span>
                                                <span>
                                                    - Tratará de cerrar ventas.
                                                </span>
                                            </div>
                                        </div>
                                    ),
                                    showCloseButton: true,
                                });
                            }}
                        >
                            ?
                        </button>
                        <div class="flex gap-2 items-center">
                            <button
                                type="button"
                                class="text-xs font-bold flex flex-col items-center shadow dark:bg-admin-terciary dark:text-white bg-paper-light p-2 rounded-md w-[200px] mb-2 justify-center"
                                onClick={() => {
                                    sweetModal({
                                        html: reactComponent(
                                            <div class="flex flex-col gap-2 dark:text-white">
                                                <span class="text-2xl font-bold text-center">
                                                    Información de uso de tu
                                                    inteligencia Artificial
                                                </span>
                                                <div>
                                                    Inputs:{" "}
                                                    <b>{usage.input_tokens}</b>{" "}
                                                    tokens
                                                </div>
                                                <div>
                                                    Outputs:{" "}
                                                    <b>{usage.output_tokens}</b>{" "}
                                                    tokens
                                                </div>
                                                <span class="dark:text-white text-sm">
                                                    Si llegas al limite de token
                                                    mensual en inputs se
                                                    inhabilitará tu ia. Cada mes
                                                    reiniciarán tus tokens a 0,
                                                    Cuantos maximos tokens al
                                                    mes tienes?{" "}
                                                    <a
                                                        href="/admin/plus"
                                                        class="text-primary hover:underline"
                                                    >
                                                        Ver aquí.
                                                    </a>
                                                </span>
                                                <a
                                                    class="text-primary text-xs hover:underline"
                                                    href="https://www.anthropic.com/api"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Ver más información sobre
                                                    los token.
                                                </a>
                                            </div>
                                        ),
                                        showCloseButton: true,
                                    });
                                }}
                            >
                                Más información
                                <span class="font-normal">
                                    Input: <b>{usage.input_tokens} </b> tokens
                                </span>
                                <span class="font-normal">
                                    Output: <b>{usage.output_tokens} </b> tokens
                                </span>
                            </button>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-2 items-center">
                        <Form.control
                            name={
                                "inteligenceArtificial.nameIa" as keyof InformationIAUpdateDto
                            }
                            title="Nombre del asistente virtual"
                            question="Nombre de tu asistente virtual ia"
                            placeholder="Luna"
                        />{" "}
                        <Form.control.toggle
                            name={
                                "inteligenceArtificial.enabledBotInteligence" as keyof InformationIAUpdateDto
                            }
                            title="Habilitar IA - super inteligente"
                            question={
                                <div class="w-[200px]">
                                    Cuando está habilitado esta opción la IA es
                                    mas inteligente, por que tiene toda la
                                    información de los productos e información
                                    de la empresa. Si esto no está habilitado
                                    solo responderá lo que el cliente está
                                    buscando.
                                    <br />
                                    Desventaja: La ia inventará productos que no
                                    está en tu web si el cliente escribe mal un
                                    producto.
                                    <br />
                                    <b>
                                        Gastará menos tokens si esta
                                        deshabilitado
                                    </b>
                                </div>
                            }
                        />
                        <Form.control
                            type="number"
                            name={
                                "inteligenceArtificial.hour_update" as keyof InformationIAUpdateDto
                            }
                            title="Horas para actualización"
                            options={{ setValueAs: Number }}
                            question={
                                <span>
                                    Cada cuantas horas para actualizar la
                                    información de tu ia, por defecto es cada 24
                                    horas.<b>Recomendable: 6 - 24</b>
                                </span>
                            }
                        />
                        <Form.control
                            type="number"
                            name={
                                "inteligenceArtificial.memory" as keyof InformationIAUpdateDto
                            }
                            title="Memoria"
                            options={{ setValueAs: Number }}
                            question={
                                <div class="w-[200px]">
                                    Memoria para tu ia
                                    <br /> Entre más sea el numero tendrá una
                                    buena memoria al recordar los mensajes.{" "}
                                    <b>Recomendable: 7 hasta 21,</b> <br />
                                    Entre más memoria tiene tu ia, más tokens
                                    gastará.
                                    <br />
                                    Debe estar en inpar este campo 7,9,11,13....
                                </div>
                            }
                        />
                    </div>

                    <div class="flex flex-col dark:text-white mb-3">
                        <span class="dark:text-white font-bold ">
                            Variables de la inteligencia Artificial
                        </span>
                        <span>
                            <b>{"{WEB}"}</b> : {enviroments.VITE_URL}
                        </span>
                        <span>
                            <b>{"{NUMERO_RECLAMO}"}</b> :{" "}
                            {information.telephoneReclamos ?? "no se insertó"}
                        </span>
                        <span>
                            <b>{"{DIRECCION}"}</b> :{" "}
                            <span class="text-sm text-wrap break-words">
                                {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                                {JSON.stringify((information as any).address)}
                            </span>
                        </span>
                        <span>
                            <b>{"{EMAIL}"}</b> :{" "}
                            <span>{information.email}</span>
                        </span>
                        <span>
                            <b>{"{DB}"}</b> : Información de tu empresa y de tus
                            productos
                        </span>
                        <span>
                            <b>{"{DATE}"}</b> : {NOW().format("DD-MM-YYYY")}
                        </span>
                    </div>

                    <button
                        type="button"
                        aria-label="reset"
                        class="dark:bg-admin-terciary px-4 py-2 rounded-md bg-paper-light shadow text-xs active:scale-110 dark:text-white font-bold my-3"
                        onClick={() => {
                            informationPromptForm.setValue(
                                "inteligenceArtificial.prompt",
                                prompt()
                            );
                        }}
                    >
                        Resetear
                    </button>
                    <Form.control.area
                        name={
                            "inteligenceArtificial.prompt" as keyof InformationIAUpdateDto
                        }
                        title="Prompt Inteligencia Artificial"
                        className="min-h-[500px] max-h-[500px] lg:min-h-[500px] lg:max-h-[500px]"
                    />
                    <div class="flex gap-2  mt-6 flex-col">
                        <span class="dark:text-white text-xs font-bold">
                            Tiempo en segundos de enviar mensaje
                        </span>
                        <div class="flex gap-2 items-center w-full">
                            <Form.control
                                type="number"
                                name={
                                    "inteligenceArtificial.timer.start" as keyof InformationIAUpdateDto
                                }
                                title="Desde "
                                options={{ setValueAs: Number }}
                            />
                            <Form.control
                                type="number"
                                name={
                                    "inteligenceArtificial.timer.finish" as keyof InformationIAUpdateDto
                                }
                                title="Hasta"
                                options={{ setValueAs: Number }}
                            />
                        </div>
                    </div>

                    <AdminHr />
                    <div class="flex flex-col gap-2">
                        <span class="dark:text-white text-xs font-bold">
                            Más datos para la Inteligencia Artificial
                        </span>
                        {fields.map((field, i) => (
                            <div key={field.id} class="flex gap-2 items-center">
                                <Form.control
                                    title={`Dato ${i + 1}`}
                                    name={`inteligenceArtificial.datos.${i}`}
                                    placeholder="Ingresar dato"
                                    question="Más datos que deseas para  entrenar a tu ia, puede ser noticias de tu empresa, invitaciones, etc."
                                />
                                <button
                                    type="button"
                                    class="bg-danger px-2.5 py-1 rounded-md text-white  mt-2"
                                    onClick={() => remove(i)}
                                >
                                    <i class="fas fa-trash text-xs" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            class="bg-primary px-4 py-2 rounded-md text-white self-start"
                            onClick={() => prepend("")}
                        >
                            +
                        </button>
                    </div>
                    <Form.button.submit
                        title="Guardar Cambios"
                        ico={null}
                        isLoading={
                            informationPromptUpdateMutation.isLoading || false
                        }
                        disabled={
                            informationPromptUpdateMutation.isLoading || false
                        }
                    />
                </Form>
            </Container>
        );
    }
    return component;
}

export default InteligenciaArtificial;
