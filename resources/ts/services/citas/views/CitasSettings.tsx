import Form from "~/components/form";
import { citasSettingsUpdateApi } from "../apis/citas.settings..update.api";
import {
    citasSettingsUpdateDto,
    CitasSettingsUpdateDto,
} from "../dtos/citas_settings.update.dto";
import { useFieldArray, useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import useEmpresastore from "@/empresas/stores/empresa.store";
import { handlerError, NOW } from "~/libs/helpers";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { formSelectNumber } from "~/components/form/FormSelect";

function CitasSettings() {
    const empresaStore = useEmpresastore();

    const citasSettings = useForm<CitasSettingsUpdateDto>({
        resolver: valibotVigilio(citasSettingsUpdateDto),
        defaultValues: empresaStore.state!.citasSetting,
    });
    const citasSettingsUpdateMutation = citasSettingsUpdateApi();
    const questionsArray = useFieldArray({
        control: citasSettings.control,
        name: "questions",
    });
    const horarioArray = useFieldArray({
        control: citasSettings.control,
        name: "horario",
    });

    function onCitasUpdate(body: CitasSettingsUpdateDto) {
        sweetModal({
            title: "¿Estas seguro de editar la configuración de la cita?",
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                citasSettingsUpdateMutation.mutate(body, {
                    onSuccess(data) {
                        empresaStore.methods.updateempresa({
                            citasSetting: {
                                ...empresaStore.state!.citasSetting,
                                ...body,
                            },
                        });
                        sweetAlert({ title: data.message, icon: "success" });
                    },
                    onError(err) {
                        handlerError(citasSettings, err);
                    },
                });
            }
        });
    }
    return (
        <div>
            <h1 class="font-semibold dark:text-white text-center">
                Configuración de las Citas
            </h1>
            <br />
            <Form onSubmit={onCitasUpdate} {...citasSettings}>
                <div class="grid grid-cols-2 md:grid-cols-4">
                    <Form.control.toggle
                        title="¿Activar IA para crear citas?"
                        name={"enabled" as keyof CitasSettingsUpdateDto}
                        question="Si no está activado, no estará disponible la IA para citas."
                    />
                    <Form.control.toggle
                        title="¿Que las citas se creen al día siguiente?"
                        name={"isNextDay" as keyof CitasSettingsUpdateDto}
                        question={
                            <span class="block w-[200px]">
                                Si está activado, Los usuarios/clientes podrán
                                crear citas al dia siguiente y no hoy. Eso puede
                                evitar que los clientes creen citas a ultima
                                hora.
                            </span>
                        }
                    />
                    <Form.control.toggle
                        title="Enviar cada pregunta por mensaje"
                        name={
                            "sendQuestionChunk" as keyof CitasSettingsUpdateDto
                        }
                        question={
                            <span class="block md:w-[200px]">
                                Si esto está activado, la IA enviará cada
                                pregunta mensaje por mensaje.
                            </span>
                        }
                    />
                    <Form.control
                        type="number"
                        title="Maximo de citas por hora"
                        name={"maxCitas" as keyof CitasSettingsUpdateDto}
                        question={
                            <span class="block w-[200px]">
                                Si esto está activado, se podrá agregar muchas
                                citas en cada hora.
                            </span>
                        }
                        options={{ setValueAs: Number }}
                    />
                </div>
                <div class="flex gap-2">
                    <Form.control
                        title="Máximo Días"
                        type="number"
                        question="Máximo de días para las citas, no se creará las citas despues de esos días."
                        name={"max_days" as keyof CitasSettingsUpdateDto}
                        options={{ setValueAs: Number }}
                    />
                    <Form.control
                        title="Duración en minutos por cita"
                        type="number"
                        question="Máximo Minutos por cada citas."
                        name={"max_minutes" as keyof CitasSettingsUpdateDto}
                        options={{ setValueAs: Number }}
                    />
                    <Form.control
                        title="Horas de Mensaje Pendiente"
                        type="number"
                        question={
                            <div class="w-[200px]">
                                Se enviará horas antes al cliente un mensaje a
                                WhatsApp que tiene una cita pendiente.
                                <br />
                                Si el valor es 0 no se enviará ningún mensaje.
                            </div>
                        }
                        name={"sendAlert" as keyof CitasSettingsUpdateDto}
                        options={{ setValueAs: formSelectNumber }}
                    />
                </div>

                <div>
                    <span class="dark:text-white text-xs font-semibold">
                        Preguntas para crear cita
                    </span>
                    <div class="h-[250px] overflow-auto">
                        {questionsArray.fields.map((field, i) => (
                            <div key={field} class="flex gap-2">
                                <Form.control
                                    title={`Pregunta #${i + 1}`}
                                    name={
                                        `questions.${i}.question` as keyof CitasSettingsUpdateDto
                                    }
                                />
                                <div class="flex gap-1">
                                    <button
                                        type="button"
                                        class="flex justify-center items-center bg-primary text-white self-start w-[35px] h-[35px] rounded-md mt-8 mr-2 relative group "
                                    >
                                        <i class="fas fa-list-alt" />

                                        <div
                                            class="absolute  dark:bg-admin-background-dark bg-white p-2 rounded-sm hidden group-hover:block dark:text-white w-[300px] z-[9]"
                                            style={{ top: -40, right: -10 }}
                                        >
                                            <div class="h-[200px] overflow-auto p-2 rounded-md shadow self-start ">
                                                <span class="dark:text-white font-bold  block text-black">
                                                    Opciones
                                                </span>
                                                <span class="dark:text-white text-xs  text-black">
                                                    El usuario tendrá que
                                                    escoger una opción
                                                </span>
                                                {(() => {
                                                    const questionsArray =
                                                        useFieldArray({
                                                            control:
                                                                citasSettings.control,
                                                            name: `questions.${
                                                                i
                                                                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                                            }.options` as any,
                                                        });
                                                    return (
                                                        <div>
                                                            <div class="grid grid-cols-2">
                                                                {questionsArray.fields.map(
                                                                    (
                                                                        field,
                                                                        u
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                field
                                                                            }
                                                                            class="flex gap-2 items-center"
                                                                        >
                                                                            <Form.control
                                                                                title={`Optión #${
                                                                                    u +
                                                                                    1
                                                                                }`}
                                                                                name={`questions.${i}.options.${u}`}
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                class="flex justify-center items-center bg-danger text-white self-start w-[35px] h-[35px] rounded-md mt-8 mr-2 relative"
                                                                                onClick={() => {
                                                                                    sweetModal(
                                                                                        {
                                                                                            title: "¿Estas seguro de eliminar esto?",
                                                                                            showCancelButton:
                                                                                                true,
                                                                                            showCloseButton:
                                                                                                true,
                                                                                        }
                                                                                    ).then(
                                                                                        ({
                                                                                            isConfirmed,
                                                                                        }) => {
                                                                                            if (
                                                                                                isConfirmed
                                                                                            ) {
                                                                                                questionsArray.remove(
                                                                                                    u
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <i class="fas fa-trash" />
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>

                                                            <button
                                                                type="button"
                                                                class="bg-primary px-4 py-2 rounded-md shadow"
                                                                onClick={() => {
                                                                    questionsArray.append(
                                                                        ""
                                                                    );
                                                                }}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        class="flex justify-center items-center bg-danger text-white self-start w-[35px] h-[35px] rounded-md mt-8 mr-2 relative"
                                        onClick={() => {
                                            sweetModal({
                                                title: "¿Estas seguro de eliminar esto?",
                                                showCancelButton: true,
                                                showCloseButton: true,
                                            }).then(({ isConfirmed }) => {
                                                if (isConfirmed) {
                                                    questionsArray.remove(i);
                                                }
                                            });
                                        }}
                                    >
                                        <i class="fas fa-trash" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                questionsArray.append({
                                    options: [],
                                    question: "",
                                });
                            }}
                            class="bg-primary px-4 py-2 rounded-md text-white "
                        >
                            +
                        </button>
                    </div>
                </div>
                <div class="overflow-auto h-[300px]">
                    <span class="dark:text-white text-xs font-semibold">
                        Horario
                    </span>
                    <table class="w-full ">
                        <thead class="text-[10px] lg:text-xs bg-paper-light dark:bg-admin-terciary dark:text-secondary-light dark:text-terciary-dark uppercase  shadow-sm  border-b dark:border-admin-terciary">
                            <tr>
                                <th class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer">
                                    Día
                                </th>
                                <th class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer">
                                    Abrir
                                </th>
                                <th class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer">
                                    Cerrar
                                </th>

                                <th class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer">
                                    Disponibilidad
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {horarioArray.fields.map((field, p) => (
                                <tr
                                    class={`border-b  dark:border-admin-terciary border-paper-light hover:bg-paper-light text-black dark:hover:bg-admin-terciary dark:text-secondary-light dark:hover:text-secondary-light ${
                                        NOW().day() === field.id
                                            ? "bg-primary  font-bold"
                                            : ""
                                    }`}
                                    key={field.id}
                                >
                                    <td class=" whitespace-nowrap text-center  text-xs lg:text-sm">
                                        {field.day}
                                    </td>
                                    <td class=" whitespace-nowrap text-center  text-xs lg:text-sm">
                                        <Form.control
                                            placeholder="Hora para abrir"
                                            title=""
                                            name={`horario.${p}.openTime`}
                                            type="time"
                                        />
                                    </td>
                                    <td class=" whitespace-nowrap text-center  text-xs lg:text-sm">
                                        <Form.control
                                            placeholder="Hora para cerrar"
                                            title=""
                                            name={`horario.${p}.closeTime`}
                                            type="time"
                                        />
                                    </td>
                                    <td class=" ">
                                        <div class="flex justify-center items-center mx-auto">
                                            <Form.control.toggle
                                                title=""
                                                name={`horario.${p}.enabled`}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <br />
                <Form.control
                    title="personalización citas IA"
                    placeholder=""
                    question={
                        <span class="block w-[180px]">
                            Este campo no es obligatorio.
                            <br />
                            Puedes personalizar las citas de la Inteligencia
                            artificial.
                        </span>
                    }
                    name={"custom" as keyof CitasSettingsUpdateDto}
                />
                <Form.button.submit
                    title="Guardar"
                    disabled={citasSettingsUpdateMutation.isLoading || false}
                    isLoading={citasSettingsUpdateMutation.isLoading || false}
                />
            </Form>
        </div>
    );
}

export default CitasSettings;
