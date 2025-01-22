import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { empresaIAUpdateApi } from "@/empresas/apis/empresas.ia.update.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { useFieldArray, useForm } from "react-hook-form";
import AdminHr from "~/components/AdminHr";
import Form from "~/components/form";
import { handlerError } from "~/libs/helpers";
import { valibotVigilio } from "~/libs/valibot";
import { reactComponent } from "~/libs/preact";
import { empresaPrivateApi } from "@/empresas/apis/empresas.private.api";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { useSignal } from "@preact/signals";
import AssistantVirtual from "@/admin/components/AssistantVirtual";
import {
    empresasIAUpdateDto,
    EmpresasIAUpdateDto,
} from "@/empresas/dtos/empresas.ia.update.dto";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { mensual } from "~/config/guards";
import QuestionsIndex from "@/empresas/views/QuestionsIndex";

function InteligenciaArtificial() {
    if (!mensual()) {
        window.history.back();
        return null;
    }
    const empresaShowQuery = empresaPrivateApi();
    let component = null;

    if (empresaShowQuery.isLoading) {
        component = <Loading />;
    }
    if (empresaShowQuery.isError) {
        component = <View404 message={empresaShowQuery.error?.message} />;
    }
    if (empresaShowQuery.isSuccess) {
        const usage =
            empresaShowQuery.data!.empresa.inteligenceArtificial.usage;
        const empresaPromptUpdateMutation = empresaIAUpdateApi();
        const isOpen = useSignal(false);
        function onClose() {
            isOpen.value = false;
        }
        function onOpen() {
            isOpen.value = true;
        }
        const empresaPromptForm = useForm<EmpresasIAUpdateDto>({
            resolver: valibotVigilio(empresasIAUpdateDto),
            defaultValues: {
                inteligenceArtificial:
                    empresaShowQuery.data!.empresa.inteligenceArtificial,
            },
        });
        const typeIA = [
            "Asistentes de Atención al Cliente",
            "Asistentes de Ventas y Marketing",
            "Asistentes de Entretenimiento",
        ];
        const datos = useFieldArray({
            control: empresaPromptForm.control,
            name: "inteligenceArtificial.datos" as never,
        });

        function onUpdateempresaPrompt(data: EmpresasIAUpdateDto) {
            sweetModal({
                title: "¿Estás seguro de realizar estos cambios?",
                customIcon:
                    "<i class='fas fa-user-robot text-3xl dark:text-white' ></i>",
                isCloseInBackground: false,
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    empresaPromptUpdateMutation.mutate(data, {
                        onSuccess(data) {
                            sweetAlert({
                                icon: "success",
                                title: data.message,
                            });
                        },
                        onError(error) {
                            handlerError(empresaPromptForm, error);
                        },
                    });
                }
            });
        }
        const instructions = useFieldArray({
            control: empresaPromptForm.control,
            name: "inteligenceArtificial.instructions" as never,
        });
        const didactrices = useFieldArray({
            control: empresaPromptForm.control,
            name: "inteligenceArtificial.didactrices" as never,
        });

        component = (
            <Container className="p-4">
                <div className="flex gap-4 justify-between">
                    <AdminBreadCrumb current="Inteligencia Artificial" />
                </div>
                <AssistantVirtual isOpen={isOpen.value} onClose={onClose} />
                <Form
                    className=" max-w-6xl"
                    {...empresaPromptForm}
                    onSubmit={onUpdateempresaPrompt}
                >
                    <div class="flex justify-between  items-center my-2  mb-3 gap-2">
                        <div class="flex items-center gap-2">
                            <button
                                class="bg-primary px-4 py-2 rounded-md text-white font-bold"
                                type="button"
                                aria-label="show question"
                                onClick={() => {
                                    sweetModal({
                                        html: reactComponent(
                                            <div class="dark:text-white ">
                                                <h3 class="font-bold text-xl text-center">
                                                    ¿Qué hará inteligencia
                                                    Artificial?
                                                </h3>
                                                <br />
                                                <div class="flex flex-col gap-2">
                                                    <span>
                                                        {" "}
                                                        - Responderás las
                                                        consultas de tus
                                                        clientes sobre tus
                                                        productos
                                                        (cantidad,envia imagen,
                                                        etc) y información de tu
                                                        empresa.
                                                    </span>
                                                    <span>
                                                        - Escucha{" "}
                                                        <b>
                                                            audios en whatsapp,
                                                            lee imágenes y envia
                                                            imagenes
                                                        </b>{" "}
                                                        .
                                                    </span>
                                                    <span>
                                                        - Si el cliente ingresa
                                                        su número de pedido
                                                        (ORD-XXXXXX), la
                                                        Inteligencia Artificial
                                                        le informará sobre el
                                                        estado actual de su
                                                        pedido. Por eso, es
                                                        importante{" "}
                                                        <b>
                                                            actualizar
                                                            regularmente el
                                                            estado
                                                        </b>{" "}
                                                        de las órdenes para que
                                                        los clientes puedan
                                                        conocer el progreso de
                                                        sus pedidos en tiempo
                                                        real.
                                                    </span>
                                                    <span>
                                                        - Tu inteligencia
                                                        Artificial se comportará
                                                        como un carrito de
                                                        compras, y entregará
                                                        link de pago para que
                                                        pague los pedidos de tus
                                                        productos o servicios{" "}
                                                        <b class="font-bold">
                                                            (SOLO DISPONIBLE
                                                            PARA CLIENTES)
                                                        </b>
                                                        .
                                                    </span>
                                                    <span>
                                                        - Tratará de cerrar
                                                        ventas y mucho más.
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
                            <button
                                type="button"
                                onClick={() => {
                                    sweetModal({
                                        html: reactComponent(
                                            <QuestionsIndex />
                                        ),
                                        sweetWidth: "700px",
                                        isCloseInBackground: false,
                                        showCloseButton: true,
                                    });
                                }}
                                class="bg-primary px-4 py-2 rounded-md text-white text-xs font-semibold relative"
                            >
                                Preguntas I.A{" "}
                                {storageEmpresa!.questionCount &&
                                storageEmpresa!.questionCount > 0 ? (
                                    <div class="w-[20px] h-[20px] bg-danger rounded-full flex justify-center items-center absolute -right-2  -top-2  text-white font-bold text-xs ">
                                        {storageEmpresa!.questionCount}
                                    </div>
                                ) : null}
                            </button>
                            <button
                                type="button"
                                onClick={onOpen}
                                class="bg-primary px-4 py-2 rounded-md text-white text-xs font-semibold"
                            >
                                <i class="fa-solid fa-message-bot" /> Probar
                            </button>
                        </div>

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
                                                <span>
                                                    Maximo outputs :{" "}
                                                    {
                                                        storageEmpresa?.payments
                                                            .tokens.tokens
                                                    }{" "}
                                                    tokens
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
                                                <a
                                                    class="text-primary text-xs hover:underline"
                                                    href="https://platform.openai.com/tokenizer"
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
                    <AlertInfo>
                        <b>
                            <b class="font-bold">
                                No es necesario modificar esto
                            </b>{" "}
                            , pero puedes personalizar a tu asistente con
                            Inteligencia Artificial a medida de tu
                            empresa/negocio.
                            <br />
                            Ten en cuenta que los cambios realizados en la
                            inteligencia artificial pueden tardar entre 1 minuto
                            a 24 horas en reflejarse.
                        </b>
                    </AlertInfo>
                    <div class="flex  gap-2 items-center">
                        <Form.control.select
                            name={
                                "inteligenceArtificial.type" as keyof EmpresasIAUpdateDto
                            }
                            array={typeIA.map((ia: string) => ({
                                key: ia,
                                value: ia,
                            }))}
                            placeholder="Escoger Tipo de asistente"
                            title="Tipo de Asistente"
                        />
                        <Form.control
                            name={
                                "inteligenceArtificial.nameIa" as keyof EmpresasIAUpdateDto
                            }
                            title={`Nombre de tu ${empresaPromptForm.watch(
                                "inteligenceArtificial.type"
                            )}`}
                            question={`Nombre de tu ${empresaPromptForm.watch(
                                "inteligenceArtificial.type"
                            )}`}
                            placeholder="Luna"
                        />
                    </div>
                    <div class="flex  gap-2 items-center">
                        <Form.control.toggle
                            name={
                                "inteligenceArtificial.enabledHuman" as keyof EmpresasIAUpdateDto
                            }
                            title="Habilitar Modo Humano"
                            question={
                                <div class="w-[200px]">
                                    La inteligencia Artificial es perfecta para
                                    comunicarse. Cuando activas esta opción la
                                    IA, tendrá pocos errores ortográficos y será
                                    más humano.
                                </div>
                            }
                        />
                        <Form.control.toggle
                            name={
                                "inteligenceArtificial.showAllProductsInformation" as keyof EmpresasIAUpdateDto
                            }
                            title="Habilitar Información detallada de productos"
                            question={
                                <div class="w-[200px]">
                                    La inteligencia Artificial tendrá más
                                    información de los productos, como las
                                    características y descripción.
                                    <br />
                                    Recuerda a más información que le des a tu
                                    Inteligencia Artificial, podría consumir más
                                    tokens.
                                </div>
                            }
                        />
                        <Form.control.toggle
                            name={
                                "inteligenceArtificial.try_to_sell" as keyof EmpresasIAUpdateDto
                            }
                            title="Habilitar Cerrar Ventas"
                            question={
                                <div class="w-[200px]">
                                    La inteligencia Artificial tratará de cerrar
                                    ventas, forzando a que el cliente vaya al
                                    carrito de compras.
                                </div>
                            }
                        />
                    </div>
                    <div class="flex gap-2 items-center">
                        <Form.control
                            type="number"
                            name={
                                "inteligenceArtificial.hour_update" as keyof EmpresasIAUpdateDto
                            }
                            title="Horas para actualización (caché)"
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
                                "inteligenceArtificial.memory" as keyof EmpresasIAUpdateDto
                            }
                            title="Memoria"
                            options={{ setValueAs: Number }}
                            question={
                                <div class="w-[200px]">
                                    Memoria para tu ia
                                    <br /> Entre más sea el numero tendrá una
                                    buena memoria al recordar los mensajes.{" "}
                                    <b>Recomendable: 7 hasta 21,</b>
                                    <br />
                                    Debe estar en inpar este campo 7,9,11,13....
                                </div>
                            }
                        />{" "}
                        <Form.control.toggle
                            name={
                                "inteligenceArtificial.enabledBotInteligence" as keyof EmpresasIAUpdateDto
                            }
                            title="Habilitar IA - super inteligente"
                            question={
                                <div class="w-[200px]">
                                    Cuando está habilitado esta opción la
                                    Inteligencia Artificial es mas inteligente,
                                    por que tiene toda la información de los
                                    productos e información de la empresa. Si
                                    esto no está habilitado solo responderá lo
                                    que el cliente está buscando.
                                </div>
                            }
                        />
                    </div>
                    <div class="flex gap-2  mt-6 flex-col">
                        <span class="dark:text-white text-xs font-bold">
                            Tiempo en segundos de enviar mensaje
                        </span>
                        <div class="flex gap-2 items-center w-full">
                            <Form.control
                                type="number"
                                name={
                                    "inteligenceArtificial.timer.start" as keyof EmpresasIAUpdateDto
                                }
                                title="Desde "
                                options={{ setValueAs: Number }}
                            />
                            <Form.control
                                type="number"
                                name={
                                    "inteligenceArtificial.timer.finish" as keyof EmpresasIAUpdateDto
                                }
                                title="Hasta"
                                options={{ setValueAs: Number }}
                            />
                            <Form.control
                                type="number"
                                name={
                                    "inteligenceArtificial.max_length" as keyof EmpresasIAUpdateDto
                                }
                                title="Maximo de Palabras"
                                question="Máximo de palabras que dirá la Inteligencia Artificial"
                                options={{ setValueAs: Number }}
                            />
                        </div>
                    </div>
                    <div class="flex gap-2  mt-6 flex-col">
                        <div class="flex gap-2 items-center w-full">
                            <Form.control.toggle
                                name={
                                    "inteligenceArtificial.settings.enabled_cart" as keyof EmpresasIAUpdateDto
                                }
                                title="Activar modo carrito de compra"
                                question={
                                    <div>
                                        Entregará links de pago, como modo
                                        carrito de compra para que el cliente
                                        pague.
                                    </div>
                                }
                            />
                            <Form.control.toggle
                                name={
                                    "inteligenceArtificial.settings.enabled_order" as keyof EmpresasIAUpdateDto
                                }
                                title="Activar modo estado de pedidos"
                                question={
                                    <div>
                                        Dará los estados de ordenes o pedidos de
                                        los clientes - ORD-
                                    </div>
                                }
                            />
                            <Form.control.toggle
                                name={
                                    "inteligenceArtificial.isChunk" as keyof EmpresasIAUpdateDto
                                }
                                title="¿Responder en trozos?"
                                question={
                                    <div class="w-[200px]">
                                        La inteligencia Artificial responderá en
                                        pequeños trozos, no en un único texto.
                                        <br />
                                        Disponible solo en Whatsapp y Telegram
                                    </div>
                                }
                            />
                        </div>
                    </div>
                    <br />
                    <div class="flex flex-col gap-2">
                        <span class="dark:text-white text-lg font-bold">
                            Instrucciones
                        </span>
                        <p class="dark:text-white text-xs">
                            Puedes enviarle instrucciones a tu I.A, de como
                            desees que responda a tus usuarios. Recuerda que la
                            I.A lee imagenes.
                        </p>
                        {instructions.fields.map((field, i) => (
                            <div key={field.id} class="flex gap-2 items-center">
                                <Form.control.area
                                    title={`Instrucción ${i + 1}`}
                                    name={`inteligenceArtificial.instructions.${i}`}
                                    placeholder="Ingresar instrucción"
                                    className="max-h-[80px!important] min-h-[80px!important]"
                                />
                                <button
                                    type="button"
                                    class="bg-danger px-2.5 py-1 rounded-md text-white  mt-2"
                                    onClick={() => instructions.remove(i)}
                                >
                                    <i class="fas fa-trash text-xs" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            class="bg-primary px-4 py-2 rounded-md text-white self-start"
                            onClick={() => instructions.append("")}
                        >
                            +
                        </button>
                    </div>
                    <br />
                    <br />
                    <div class="flex flex-col gap-2">
                        <span class="dark:text-white text-lg font-bold ">
                            Didactrices
                        </span>
                        {didactrices.fields.map((field, i) => (
                            <div key={field.id} class="flex gap-2 items-center">
                                <Form.control.area
                                    className="max-h-[80px!important] min-h-[80px!important]"
                                    title={`Didactriz ${i + 1}`}
                                    name={`inteligenceArtificial.didactrices.${i}`}
                                    placeholder="Ingresar instrucción"
                                />
                                <button
                                    type="button"
                                    class="bg-danger px-2.5 py-1 rounded-md text-white  mt-2"
                                    onClick={() => didactrices.remove(i)}
                                >
                                    <i class="fas fa-trash text-xs" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            class="bg-primary px-4 py-2 rounded-md text-white self-start"
                            onClick={() => didactrices.append("")}
                        >
                            +
                        </button>
                    </div>
                    <br />
                    {!storageEmpresa!.isProduction ? (
                        <div class="flex flex-col gap-2">
                            <span class="dark:text-white text-lg font-bold">
                                Más datos para tu Inteligencia Artificial
                            </span>
                            {datos.fields.map((field, i) => {
                                return (
                                    <div
                                        key={field.id}
                                        class="grid grid-cols-2 md:flex gap-2 items-center"
                                    >
                                        <div class="w-[150px]">
                                            <Form.control
                                                title={"Nombre"}
                                                name={`inteligenceArtificial.datos.${i}.key`}
                                                placeholder="posts"
                                            />
                                        </div>
                                        <Form.control
                                            title={"Query"}
                                            name={`inteligenceArtificial.datos.${i}.query`}
                                            placeholder="SELECT * FROM 'Post'"
                                            question="CONSULTA SQL."
                                        />
                                        <div>
                                            <Form.control.toggle
                                                title={"Sin condición"}
                                                name={`inteligenceArtificial.datos.${i}.enabled`}
                                                question="Se ejecutará el sql sin condición"
                                            />
                                        </div>

                                        {empresaPromptForm.watch(
                                            `inteligenceArtificial.datos.${i}.enabled`
                                        ) ? null : (
                                            <Form.control
                                                title={"Condicion"}
                                                name={`inteligenceArtificial.datos.${i}.condition`}
                                                placeholder="cuando te hable sobre publicaciones de mi empresa"
                                                question="Condición la cual se va a ejecutar la data sql"
                                            />
                                        )}

                                        <button
                                            type="button"
                                            class="bg-danger px-2.5 py-1 rounded-md text-white  mt-2"
                                            onClick={() => {
                                                sweetModal({
                                                    title: "Estas seguro de eliminar este dato ?",
                                                    isCloseInBackground: false,
                                                    showCloseButton: true,
                                                }).then(({ isConfirmed }) => {
                                                    if (isConfirmed) {
                                                        datos.remove(i);
                                                    }
                                                });
                                            }}
                                        >
                                            <i class="fas fa-trash text-xs" />
                                        </button>
                                    </div>
                                );
                            })}
                            <button
                                type="button"
                                class="bg-primary px-4 py-2 rounded-md text-white self-start"
                                onClick={() => datos.append("")}
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <></>
                    )}

                    <AdminHr />
                    <Form.button.submit
                        title="Guardar Cambios"
                        ico={null}
                        isLoading={
                            empresaPromptUpdateMutation.isLoading || false
                        }
                        disabled={
                            empresaPromptUpdateMutation.isLoading || false
                        }
                    />
                </Form>
            </Container>
        );
    }
    return component;
}

export default InteligenciaArtificial;
