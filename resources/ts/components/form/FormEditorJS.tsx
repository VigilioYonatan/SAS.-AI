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
import FilesIndex from "@/empresas/views/FilesIndex";
import MonacoEditor from "@monaco-editor/react";
import useThemeStore from "~/stores/theme.store";
import { useSignal } from "@preact/signals";
import { ChangeEvent, HTMLProps } from "preact/compat";
import { HTMLSHOW } from "@/empresas/views/BannersIndex";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { anidarPropiedades } from ".";

interface FormControlLabelProps<T extends object> {
    title: string;
    name: string;
    question?: JSX.Element | JSX.Element[] | string;
    options?: RegisterOptions<T, Path<T>>;
    className?: string;
    type?: "html" | "javascript";
}
function FormEditorJSControl<T extends object>({
    name,
    title,
    question,
    type = "javascript",
    className = "",
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
                    <div class="flex gap-2 items-center">
                        {" "}
                        <button
                            type="button"
                            onClick={() => {
                                sweetModal({
                                    html: reactComponent(
                                        <FilesIndex params={{}} />
                                    ),
                                    sweetWidth: "800px",
                                    position: "start",
                                    showCloseButton: true,
                                    isCloseInBackground: false,
                                });
                            }}
                        >
                            <i class="fas fa-image text-lg" />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                mode.value = !mode.value;
                            }}
                        >
                            {mode.value ? (
                                <i class="fas fa-eye text-lg" />
                            ) : (
                                <i class="fas fa-eye-slash text-lg" />
                            )}
                        </button>
                    </div>
                ) : null}
            </label>
            <div class={`flex items-center gap-2 w-full border-2 ${className}`}>
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
    function handleArrayAddition(arrayId: string) {
        const div = document.createElement("div");

        div.innerHTML = content;

        // Find the element with the data-array attribute
        const arrayContainer = div.querySelector(`[data-array="${arrayId}"]`);
        if (arrayContainer) {
            const lastChild = arrayContainer.lastElementChild;

            if (lastChild) {
                const clonedElement = lastChild?.cloneNode(true) as HTMLElement;
                const lastLabels =
                    arrayContainer.querySelectorAll("[data-label]");
                const images = arrayContainer.querySelectorAll("img");
                Array.from(lastLabels).map((label) => {
                    if (label) {
                        label.setAttribute(
                            "data-label",
                            Math.random().toString(32).slice(3)
                        );
                    }
                });
                Array.from(images).map((img) => {
                    if (img) {
                        img.setAttribute(
                            "data-image",
                            Math.random().toString(32).slice(3)
                        );
                    }
                });

                arrayContainer.appendChild(clonedElement);
                setContent(div.innerHTML);
                addDeleteButton(clonedElement);
            }
        }
    }

    function addDeleteButton(element: HTMLElement) {
        if (!element) {
            console.error("Elemento no válido proporcionado.");
            return;
        }
        element.classList.add(
            "relative",
            "border-gray-400",
            "border-b-2",
            "w-full",
            "flex",
            "flex-col",
            "gap-4",
            "items-center",
            "justify-center"
        );

        const deleteButton = document.createElement("span");

        deleteButton.classList.add(
            "bg-danger",
            "px-2",
            "py-1",
            "rounded-md",
            "absolute",
            "right-2"
        );
        deleteButton.style.cursor = "pointer";
        deleteButton.addEventListener("click", () => {
            sweetModal({ html: "aggg" });
            // element.remove(); // Eliminamos el contenedor
        });
        const icon = document.createElement("i");
        icon.classList.add("fas", "fa-trash", "text-xs");
        deleteButton.appendChild(icon);
        element.appendChild(deleteButton);
    }

    const renderElement = (el: Node) => {
        if (el.nodeType === 1) {
            const element = el as HTMLElement;
            const elementId = element.getAttribute("data-label");

            if (elementId && editingId === elementId) {
                return (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={stopEditing}
                        class="dark:bg-admin-paper-dark dark:text-white text-black border border-black"
                    />
                );
            }
            const dataArray = element.getAttribute("data-array");
            if (dataArray) {
                const arrayId = dataArray;

                for (const child of Array.from(element.children)) {
                    addDeleteButton(child as HTMLElement);
                }
                const validAttributes = Array.from(element.attributes)
                    .filter((attr) => /^[a-zA-Z_][\w\-]*$/.test(attr.name))
                    .reduce((attrs, attr) => {
                        attrs[attr.name] = attr.value;
                        return attrs;
                    }, {} as Record<string, string>);
                return (
                    <div {...validAttributes} class="relative">
                        {Array.from(element.childNodes).map((child, index) => (
                            // Render child nodes recursively
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            <Fragment key={index}>
                                {renderElement(child)}
                            </Fragment>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleArrayAddition(arrayId)}
                            class="mt-2 px-2 py-1 bg-blue-500 text-white absolute -bottom-0 rounded-md font-bold"
                            style={{ position: "relative", bottom: "-1rem" }}
                        >
                            +
                        </button>
                    </div>
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
                        }}
                        class="relative block dark:text-white"
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
                    const imageName = (
                        element.getAttribute(":src") ||
                        element.getAttribute("src")
                    )
                        ?.split("/")
                        .pop();

                    function changeImage(newImageName: string) {
                        const updatedContent = content.replace(
                            new RegExp(
                                `(<img data-image="${element.getAttribute(
                                    "data-image"
                                )}" [^>]*?:src="[^"]*/empresas/[^/]+/images/files/)${imageName}(".*?>)`,
                                "gs"
                            ),
                            `$1${`${newImageName}\``}$2`
                        );
                        setContent(updatedContent); // Actualiza el HTML con el nuevo valor
                    }
                    return (
                        <div className="relative inline-block min-w-[100px] max-w-[100px] min-h-[100px]  max-h-[100px] [&>img]:object-contain [&>img]:w-full">
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
                                    sweetModal({
                                        html: reactComponent(
                                            <FilesIndex
                                                params={{
                                                    file: imageName?.replaceAll(
                                                        "`",
                                                        ""
                                                    ),
                                                    changeImage,
                                                }}
                                            />
                                        ),
                                        sweetWidth: "800px",
                                        position: "start",
                                        showCloseButton: true,
                                        isCloseInBackground: false,
                                    });
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
        <div class="relative min-h-[250px] w-full overflow-auto max-h-[300px] form-html-editor">
            {parseHtml()}
            <style jsx>{`
                .form-html-editor .my-slider {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 1rem;
                    width: 100%;
                    height: 200px !important;
                }
            `}</style>
        </div>
    );
}

export default FormEditorJSControl;
