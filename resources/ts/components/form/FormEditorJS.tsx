import { useContext, useEffect, useState } from "preact/hooks";
import { FormControlContext } from "./Form";
import { createElement, Fragment, type JSX } from "preact";
import type {
    FieldValues,
    Path,
    PathValue,
    RegisterOptions,
    UseFormReturn,
} from "react-hook-form";
import { anidarPropiedades } from ".";
import MonacoEditor from "@monaco-editor/react";
import useThemeStore from "~/stores/theme.store";
import { useSignal } from "@preact/signals";
import { isColorLight } from "~/libs/helpers";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { ChangeEvent, HTMLProps } from "preact/compat";
import { HTMLSHOW } from "@/empresas/views/BannersIndex";

interface FormControlLabelProps<T extends object> {
    title: string;
    name: string;
    question?: JSX.Element | JSX.Element[] | string;
    options?: RegisterOptions<T, Path<T>>;
    type?: "html" | "javascript";
}
function FormEditorJSControl<T extends object>({
    name,
    title,
    question,
    type = "javascript",
}: FormControlLabelProps<T>) {
    const mode = useSignal(true);
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
                {title}{" "}
                {type === "html" ? (
                    <button
                        type="button"
                        onClick={() => {
                            mode.value = !mode.value;
                        }}
                    >
                        {mode.value ? (
                            <i class="fas fa-eye" />
                        ) : (
                            <i class="fas fa-eye-slash" />
                        )}
                    </button>
                ) : null}
            </label>
            <div class="flex items-center gap-2 w-full border-2">
                {mode.value && type === "html" && HTMLSHOW ? (
                    value ? (
                        <HtmlEditor
                            htmlString={value}
                            onChange={(content) => {
                                setValue(
                                    name as Path<T>,
                                    content as PathValue<T, Path<T>>
                                );
                            }}
                        />
                    ) : (
                        <span class="dark:text-white font-semibold text-sm">
                            No HTML
                        </span>
                    )
                ) : (
                    <MonacoEditor
                        height="300px"
                        defaultLanguage={type}
                        defaultValue={value}
                        onChange={(val) =>
                            setValue(
                                name as Path<T>,
                                val as PathValue<T, Path<T>>
                            )
                        }
                        options={{
                            selectOnLineNumbers: true,
                            autoClosingBrackets: "always",
                            suggestOnTriggerCharacters: true,
                            minimap: { enabled: false },
                        }}
                        theme={
                            useThemeStore().state === "dark" ? "vs-dark" : ""
                        }
                    />
                )}

                {question && !mode.value ? (
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
interface HtmlEditorProps {
    htmlString: string;
    onChange: (content: string | null) => void;
}
function HtmlEditor({ htmlString, onChange }: HtmlEditorProps) {
    const [content, setContent] = useState<string>(htmlString);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState<string>("");
    // Función para manejar el inicio de la edición
    const startEditing = (id: string, currentValue: string): void => {
        setEditingId(id);
        setInputValue(currentValue);
    };
    useEffect(() => {
        if (content.length) {
            onChange(content);
        } else {
            onChange(null);
        }
    }, [content]);

    // Función para manejar el guardado del valor editado
    const stopEditing = (): void => {
        if (editingId && inputValue) {
            // Usamos una expresión regular para reemplazar solo el texto dentro de la etiqueta
            const updatedContent = content.replace(
                new RegExp(
                    `(<[^>]+data-label="${editingId}"[^>]*>)(.*?)(</[^>]+>)`,
                    "gs"
                ),
                `$1${inputValue}$3`
            );
            setContent(updatedContent); // Actualiza el HTML con el nuevo valor
            setEditingId(null); // Termina la edición
            setInputValue(""); // Limpia el valor del input
        }
    };

    // Función para manejar el cambio en el input
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setInputValue((e.target as HTMLInputElement).value);
    };

    // Función recursiva para renderizar los elementos HTML
    const renderElement = (el: Node) => {
        if (el.nodeType === 1) {
            // Si es un nodo de tipo elemento
            const element = el as HTMLElement;
            const elementId = element.getAttribute("data-label");

            if (elementId && editingId === elementId) {
                // Si es el elemento que estamos editando, renderizamos un input
                return (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={stopEditing}
                        class="dark:bg-admin-paper-dark dark:text-white text-black"
                    />
                );
            }

            // Si tiene un data-label, lo hacemos editable al hacer clic
            if (elementId) {
                const elementText = element.textContent?.trim() || ""; // El texto del elemento
                return (
                    <span
                        onClick={() => startEditing(elementId, elementText)}
                        style={{
                            cursor: "pointer",
                            color: isColorLight(
                                storageEmpresa!.setting.bg_color
                            )
                                ? "black"
                                : "var(--primary)",
                        }}
                        class="relative"
                    >
                        {element.innerHTML}
                        <i class="fas fa-pen text-[12px] rounded-md shadow bg-orange-600 text-white absolute right-0 -top-2 p-1" />
                    </span>
                );
            }

            // Si es una etiqueta auto-cerrada (como <img>, <video>, etc.), la procesamos automáticamente
            if (
                [
                    "img",
                    "video",
                    "input",
                    "br",
                    "hr",
                    "link",
                    "meta",
                    "source",
                    "area",
                    "base",
                    "col",
                ].includes(element.tagName.toLowerCase())
            ) {
                if (element.tagName.toLowerCase() === "img") {
                    const imageName = element
                        .getAttribute(":src")
                        ?.split("/")
                        .pop();
                    return (
                        <div className="relative inline-block">
                            {/* biome-ignore lint/a11y/useAltText: <explanation> */}
                            <img
                                {...Array.from(element.attributes).reduce(
                                    (attrs, attr) => {
                                        attrs[attr.name as keyof typeof attrs] =
                                            attr.value;
                                        return attrs;
                                    },
                                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                    {} as React.HTMLProps<any>
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    window.open(`/admin/files?file=${imageName}`, "_blank")
                                }}
                                className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded"
                            >
                                <i className="fas fa-pen" />
                            </button>
                        </div>
                    );
                }
                return createElement(
                    element.tagName.toLowerCase() as keyof JSX.IntrinsicElements,
                    Array.from(element.attributes).reduce((attrs, attr) => {
                        attrs[attr.name as keyof typeof attrs] = attr.value;
                        return attrs;
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    }, {} as HTMLProps<any>)
                );
            }

            // Si el elemento es de tipo div, span, p, etc., lo procesamos normalmente
            return createElement(
                element.tagName.toLowerCase() as keyof JSX.IntrinsicElements,
                Array.from(element.attributes).reduce((attrs, attr) => {
                    attrs[attr.name as keyof typeof attrs] = attr.value;
                    return attrs;
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                }, {} as HTMLProps<any>),
                ...Array.from(el.childNodes).map((child, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <Fragment key={index}>{renderElement(child)}</Fragment>
                ))
            );
        }

        if (el.nodeType === 3) {
            return el.textContent;
        }

        return null;
    };

    const parseHtml = (): JSX.Element => {
        const div = document.createElement("div");
        div.innerHTML = content;

        return (
            <>
                {Array.from(div.childNodes).map((el, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <Fragment key={index}>{renderElement(el)}</Fragment>
                ))}
            </>
        );
    };

    return (
        <div class="relative min-h-[250px] w-full overflow-auto">
            {parseHtml()}
        </div>
    );
}

export default FormEditorJSControl;
