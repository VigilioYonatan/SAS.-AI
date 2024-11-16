import { useContext } from "preact/hooks";
import { FormControlContext } from "./Form";
import type { JSX } from "preact";
import type {
    FieldValues,
    Path,
    PathValue,
    RegisterOptions,
    UseFormReturn,
} from "react-hook-form";
import { anidarPropiedades } from ".";
import CodeMirror from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-markup.min.js";
import useThemeStore from "~/stores/theme.store";
interface FormControlLabelProps<T extends object> {
    title: string;
    name: string;
    question?: JSX.Element | JSX.Element[] | string;
    options?: RegisterOptions<T, Path<T>>;
}
function FormEditorJSControl<T extends object>({
    name,
    title,
    question,
}: FormControlLabelProps<T>) {
    const {
        formState: { errors },
        watch,
        setValue,
    } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
    const value = watch(name as Path<T>);
    const err = anidarPropiedades(errors, (name as string).split("."));

    return (
        <div class="w-full mb-2">
            <label
                class="text-xs dark:text-secondary-light text-secondary-dark capitalize font-semibold"
                htmlFor={name as string}
            >
                {title}
            </label>
            <div class="flex items-center gap-2 w-full">
                <CodeMirror
                    value={value}
                    onValueChange={(val) => {
                        setValue(name as Path<T>, val as PathValue<T, Path<T>>);
                    }}
                    highlight={(code) =>
                        Prism.highlight(
                            code ?? "",
                            Prism.languages.html,
                            "html"
                        )
                    }
                    padding={10}
                    style={{
                        fontFamily: "monospace",
                        fontSize: 14,
                        color:
                            useThemeStore().state === "dark"
                                ? "#ffffff"
                                : "#000000", // Color de fondo del editor
                        backgroundColor:
                            useThemeStore().state === "dark"
                                ? "#111827"
                                : "#f5f5f5", // Color de fondo del editor
                        borderRadius: "5px", // Bordes redondeados
                        minHeight: "200px", // Altura mínima
                        overflow: "auto", // Scroll si el contenido es largo
                        whiteSpace: "pre-wrap", // Evitar que el código se desborde
                        wordWrap: "break-word", // Ajustar el texto si es necesario
                        lineHeight: "1.5", // Mejorar la legibilidad
                        width: "100%",
                    }}
                />

                {question ? (
                    <div class="relative group ">
                        <i class="fa-solid fa-circle-question text-xs dark:text-white" />
                        <div class="text-xs min-w-[100px] hidden group-hover:block -top-[35px] right-1 p-1 shadow text-center absolute rounded-md dark:bg-admin-background-dark bg-background-light dark:text-white z-10 font-semibold">
                            {question}
                        </div>
                    </div>
                ) : null}
            </div>

            {Object.keys(err).length ? (
                <p class="text-xs text-red-600">{err?.message}</p>
            ) : null}
        </div>
    );
}

export default FormEditorJSControl;
