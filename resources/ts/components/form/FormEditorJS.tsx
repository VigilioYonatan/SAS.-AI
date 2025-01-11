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
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import useThemeStore from "~/stores/theme.store";
import { useSignal } from "@preact/signals";
import { ChangeEvent, HTMLProps } from "preact/compat";
import { HIDDEEDITOR, HTMLSHOW } from "@/empresas/views/BannersIndex";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { anidarPropiedades } from ".";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { ShowTablesDB } from "@/empresas/views/PageStore";

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
    const handleEditorMount: OnMount = (editor, monaco) => {
        const model = editor.getModel();

        monaco.languages.register({ id: "javascript" });

        // Crear el proveedor de autocompletado para JavaScript
        monaco.languages.registerCompletionItemProvider("javascript", {
            provideCompletionItems: (model, position) => {
                // Obtener el texto desde el inicio hasta la posición actual del cursor
                const textUntilPosition = model.getValueInRange({
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                });

                const word = model.getWordUntilPosition(position);
                const range = new monaco.Range(
                    position.lineNumber,
                    word.startColumn,
                    position.lineNumber,
                    word.endColumn
                );

                // Verificar si el cursor está dentro de style.innerHTML = ``
                const innerHTMLMatch = textUntilPosition.match(
                    /style\.innerHTML\s*=\s*`([^`]*)$/
                );
                if (innerHTMLMatch) {
                    return {
                        suggestions: cssProperties.map((property) => ({
                            label: property,
                            kind: monaco.languages.CompletionItemKind.Property,
                            insertText: `${property}: `,
                            detail: "CSS property",
                            range: range,
                        })),
                    };
                }

                return { suggestions: [] };
            },
        });

        monaco.languages.register({ id: "html" });

        // Crear el proveedor de autocompletado
        monaco.languages.registerCompletionItemProvider("html", {
            provideCompletionItems: (model, position) => {
                const textUntilPosition = model.getValueInRange({
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                });

                const word = model.getWordUntilPosition(position);
                const range = new monaco.Range(
                    position.lineNumber,
                    word.startColumn,
                    position.lineNumber,
                    word.endColumn
                );

                // Verificar si el cursor está dentro de un atributo style=""
                if (/style\s*=\s*"[^"]*$/.test(textUntilPosition)) {
                    return {
                        suggestions: cssProperties.map((property) => ({
                            label: property,
                            kind: monaco.languages.CompletionItemKind.Property,
                            insertText: `${property}: `,
                            detail: "CSS property",
                            range: range,
                        })),
                    };
                }

                // Verificar si el cursor está dentro de una etiqueta <style>
                if (/<style[^>]*?>[\s\S]*$/i.test(textUntilPosition)) {
                    return {
                        suggestions: cssProperties.map((property) => ({
                            label: property,
                            kind: monaco.languages.CompletionItemKind.Property,
                            insertText: `${property}: `,
                            detail: "CSS property",
                            range: range,
                        })),
                    };
                }

                return { suggestions: [] };
            },
        });
        if (model) {
            // Agregar autocierre de etiquetas
            let isTypingClosingTag = false; // Para evitar el ciclo infinito

            editor.onDidChangeModelContent(() => {
                const position = editor.getPosition();
                if (!model || !position) return;

                const lineContent = model.getLineContent(position.lineNumber);
                const match = lineContent.match(/<([a-zA-Z]+)>$/); // Detectar etiquetas abiertas

                // Si se está escribiendo una etiqueta
                if (match && !isTypingClosingTag) {
                    const tagName = match[1];
                    const insertPosition = {
                        column: position.column,
                        lineNumber: position.lineNumber,
                    };

                    // Evitar insertar el cierre de la etiqueta si ya está presente
                    if (!lineContent.includes(`</${tagName}>`)) {
                        // Marcar que estamos insertando el cierre de la etiqueta
                        isTypingClosingTag = true;

                        // Insertar el cierre de la etiqueta
                        editor.executeEdits("", [
                            {
                                range: {
                                    startLineNumber: insertPosition.lineNumber,
                                    startColumn: insertPosition.column,
                                    endLineNumber: insertPosition.lineNumber,
                                    endColumn: insertPosition.column,
                                },
                                text: `</${tagName}>`,
                            },
                        ]);

                        // Mover el cursor entre las etiquetas
                        editor.setPosition({
                            lineNumber: insertPosition.lineNumber,
                            column: insertPosition.column,
                        });

                        // Reestablecer la bandera de autocierre
                        isTypingClosingTag = false;
                    }
                }
            });

            // Agregar validación de etiquetas y atributos requeridos
            editor.onDidChangeModelContent(() => {
                const text = model.getValue();
                const markers = [];

                // Definir las reglas de validación
                const validationRules = [
                    {
                        tag: "img",
                        requiredAttributes: [
                            "alt",
                            "title",
                            "data-image",
                            "width",
                            "height",
                            "lazy",
                        ],
                        message: `<img> debe tener atributos "width", "height","alt", "title", lazy="loading" y "data-image".`,
                    },
                    {
                        tag: "video",
                        requiredAttributes: [
                            "alt",
                            "data-image",
                            "width",
                            "height",
                        ],
                        message: `<video> debe tener atributos "width", "height", "alt" y "data-image".`,
                    },
                    {
                        tag: "button",
                        requiredAttributes: ["aria-label", "type"],
                        message: `<button> debe tener el atributo "aria-label y type".`,
                    },
                    {
                        tag: "a",
                        requiredAttributes: ["aria-label", "href"],
                        message: `<a> debe tener el atributo "aria-label" o "href".`,
                    },
                ];

                for (const rule of validationRules) {
                    const regex = new RegExp(`<${rule.tag}\\b[^>]*>`, "g");
                    const matches = text.matchAll(regex);

                    for (const match of matches) {
                        const tag = match[0];
                        if (
                            !rule.requiredAttributes.every((attr) =>
                                new RegExp(`${attr}=`).test(tag)
                            )
                        ) {
                            markers.push({
                                startLineNumber: text
                                    .substring(0, match.index)
                                    .split("\n").length,
                                startColumn:
                                    match.index -
                                    text.lastIndexOf("\n", match.index) +
                                    1,
                                endLineNumber: text
                                    .substring(0, match.index)
                                    .split("\n").length,
                                endColumn:
                                    match.index -
                                    text.lastIndexOf("\n", match.index) +
                                    tag.length +
                                    1,
                                message: rule.message,
                                severity: monaco.MarkerSeverity.Warning,
                            });
                        }
                    }
                }

                // Establecer marcadores en el editor
                monaco.editor.setModelMarkers(model, "html", markers);
            });
            // Función para formatear el HTML
            const formatHTML = () => {
                const action = editor.getAction("editor.action.formatDocument");
                if (action) {
                    action.run();
                }
            };

            // Opcional: Agregar un botón para formatear el HTML
            const toolbar = document.querySelector(".monaco-editor");
            if (toolbar) {
                const button = document.createElement("button");
                const i = document.createElement("i");
                i.className = "fa-solid fa-code";
                button.type = "button";
                button.className =
                    "absolute z-[99] top-0 bg-primary text-white rounded-md px-1 py-0.5 ";
                button.appendChild(i);
                button.onclick = formatHTML;
                toolbar.appendChild(button);
            }
        }
    };

    return (
        <div class="w-full mb-2">
            <label
                class="text-xs dark:text-secondary-light text-secondary-dark capitalize font-semibold"
                htmlFor={name as string}
            >
                {title}{" "}
                {type === "html" ? (
                    <div class="flex gap-2 items-center">
                        <button
                            type="button"
                            onClick={() => {
                                if (
                                    !HIDDEEDITOR ||
                                    storageEmpresa?.isProduction
                                ) {
                                    return;
                                }
                                mode.value = !mode.value;
                            }}
                        >
                            {mode.value ? (
                                <i class="fas fa-eye text-lg" />
                            ) : (
                                <i class="fas fa-eye-slash text-lg" />
                            )}
                        </button>
                        {!storageEmpresa?.isProduction ? (
                            <ShowTablesDB />
                        ) : null}
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
                        onMount={handleEditorMount}
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

    function useEdit(data: "data-label" | "data-link" | "data-youtube") {
        const [inputValue, setInputValue] = useState<string>("");
        const [editingId, setEditingId] = useState<string | null>(null);
        const startEditing = (id: string, currentValue: string): void => {
            setEditingId(id);
            setInputValue(currentValue);
        };
        const stopEditing = (): void => {
            if (editingId && inputValue) {
                // Usamos una expresión regular para reemplazar solo el texto dentro de la etiqueta
                const updatedContent = content.replace(
                    new RegExp(
                        `(<[^>]+${data}="${editingId}"[^>]*>)(.*?)(</[^>]+>)`,
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
        function rendering(element: Element) {
            const elementId = element.getAttribute(data);
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
            if (elementId) {
                const elementText = element.textContent?.trim() || ""; // El texto del elemento
                return (
                    <span
                        onClick={() =>
                            startEditing(elementId as string, elementText)
                        }
                        style={{
                            cursor: "pointer",
                        }}
                        class="relative block dark:text-white"
                    >
                        {element.innerHTML}

                        <i
                            class={`${
                                data === "data-label"
                                    ? "fas fa-pen"
                                    : data === "data-youtube"
                                    ? "fab fa-youtube"
                                    : data === "data-link"
                                    ? "fas fa-link"
                                    : ""
                            } text-[12px] rounded-md shadow ${
                                data === "data-label"
                                    ? "bg-orange-500"
                                    : data === "data-youtube"
                                    ? "bg-danger"
                                    : data === "data-link"
                                    ? "bg-blue-600"
                                    : ""
                            } text-white absolute right-0 -top-2 p-1`}
                        >
                            {data === "data-youtube" ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    type="button"
                                    class="bg-black text-[8px] absolute text-white px-0.5 py-0.5 rounded-full w-[20px] h-[20px] -left-2 -top-2 group"
                                >
                                    ?
                                    <div class="hidden w-[190px] group-hover:block text-white bg-black p-1 rounded-md bg-opacity-90 text-[10px] absolute left-[-12rem] z-[9999]">
                                        <img
                                            width={250}
                                            height={250}
                                            class="object-contain"
                                            src="/images/settings/others/yt.png"
                                            alt=""
                                        />
                                    </div>
                                </button>
                            ) : data === "data-link" ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    type="button"
                                    class="bg-black text-[8px] absolute text-white px-0.5 py-0.5 rounded-full w-[20px] h-[20px] -left-2 -top-2 group"
                                >
                                    ?
                                    <div class="hidden w-[100px] group-hover:block text-white bg-black p-1 rounded-md bg-opacity-90 text-[10px] absolute left-[-4rem] z-[9999]">
                                        Url de tu web
                                    </div>
                                </button>
                            ) : null}
                        </i>
                    </span>
                );
            }
            return false;
        }
        return rendering;
    }
    const renderingLabel = useEdit("data-label");
    const renderingLink = useEdit("data-link");
    const renderingYoutube = useEdit("data-youtube");

    useEffect(() => {
        if (content.length) {
            onChange(content);
        } else {
            onChange(null);
        }
    }, [content]);

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
                const lastYoutube =
                    arrayContainer.querySelectorAll("[data-youtube]");
                const lastLink = arrayContainer.querySelectorAll("[data-link]");
                const images = arrayContainer.querySelectorAll("img");
                Array.from(lastLabels).map((label) => {
                    if (label) {
                        label.setAttribute(
                            "data-label",
                            Math.random().toString(32).slice(3)
                        );
                    }
                });
                Array.from(lastYoutube).map((yt) => {
                    if (yt) {
                        yt.setAttribute(
                            "data-youtube",
                            Math.random().toString(32).slice(3)
                        );
                    }
                });
                Array.from(lastLink).map((yt) => {
                    if (yt) {
                        yt.setAttribute(
                            "data-link",
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
            }
        }
    }

    const renderElement = (el: Node) => {
        if (el.nodeType === 1) {
            const element = el as HTMLElement;

            //   rendering
            const label = renderingLabel(element);
            if (label) {
                return label;
            }
            const link = renderingLink(element);
            if (link) {
                return link;
            }
            const youtube = renderingYoutube(element);
            if (youtube) {
                return youtube;
            }
            const dataArray = element.getAttribute("data-array");
            if (dataArray) {
                const arrayId = dataArray;
                const validAttributes = Array.from(element.attributes)
                    .filter((attr) => /^[a-zA-Z_][\w\-]*$/.test(attr.name))
                    .reduce((attrs, attr) => {
                        attrs[attr.name] = attr.value;
                        return attrs;
                    }, {} as Record<string, string>);
                return (
                    <div {...validAttributes} class="relative">
                        {Array.from(element.childNodes).map((child, index) => {
                            if (child.nodeType !== Node?.ELEMENT_NODE)
                                return null;
                            // const a =
                            return (
                                // Render child nodes recursively
                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                <Fragment key={index}>
                                    <div class="relative border-b-2 border-gray-400">
                                        {renderElement(child)}
                                        <button
                                            class="absolute top-0 right-0 bg-danger px-1 py-1 rounded-md "
                                            type="button"
                                            onClick={() => {
                                                sweetModal({
                                                    title: "Estás seguro de eliminar este elemento?",
                                                    isCloseInBackground: false,
                                                    showCancelButton: true,
                                                    showCloseButton: true,
                                                }).then(({ isConfirmed }) => {
                                                    if (isConfirmed) {
                                                        const div =
                                                            document.createElement(
                                                                "div"
                                                            );
                                                        div.innerHTML = content;
                                                        const parent =
                                                            child.parentElement?.getAttribute(
                                                                "data-array"
                                                            );
                                                        const getParent = (
                                                            div as HTMLDivElement
                                                        )?.querySelector(
                                                            `[data-array='${parent}']`
                                                        );
                                                        if (
                                                            getParent!.children
                                                                .length <= 1
                                                        ) {
                                                            sweetAlert({
                                                                title: "No se pudo eliminar, por que no puede estar vacio",
                                                                icon: "danger",
                                                            });
                                                            return;
                                                        }

                                                        const childNodes =
                                                            Array.from(
                                                                (
                                                                    div as HTMLDivElement
                                                                )?.querySelector(
                                                                    `[data-array='${parent}']`
                                                                )!.childNodes
                                                            );

                                                        childNodes[
                                                            index
                                                        ]?.remove(); // Elimina el nodo correspondiente

                                                        setContent(
                                                            div.innerHTML
                                                        );
                                                    }
                                                });
                                            }}
                                        >
                                            <i class="fas fa-trash" />
                                        </button>
                                    </div>
                                </Fragment>
                            );
                        })}
                        <button
                            type="button"
                            onClick={() => {
                                handleArrayAddition(arrayId);
                            }}
                            class="mt-2 px-2 py-1 bg-blue-500 text-white absolute -bottom-0 rounded-md font-bold"
                            style={{ position: "relative", bottom: "-1rem" }}
                        >
                            +
                        </button>
                    </div>
                );
            }

            if (["button", "a"].includes(element.tagName.toLowerCase())) {
                const existTitle = element.getAttribute("aria-label");
                if (!existTitle) {
                    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                    console.log(
                        "Falta aria label en <boton></boton> o <a></a>"
                    );
                    return null;
                }
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
                if (["img", "video"].includes(element.tagName.toLowerCase())) {
                    const existTitle = element.getAttribute("title");
                    const existTitle2 = element.getAttribute("alt");
                    const existdataImage = element.getAttribute("data-image");
                    if (!existTitle) {
                        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                        console.log("Title <img/> o  <video/> necesario");
                        return null;
                    }
                    if (!existTitle2) {
                        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                        console.log("alt  <img/> o  <video/> necesario");
                        return null;
                    }
                    if (!existdataImage) {
                        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                        console.log("data-image necesario  <img/> o  <video/>");
                        return null;
                    }
                }
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
                                `(<(?:img|video) data-image="${element.getAttribute(
                                    "data-image"
                                )}" [^>]*?:src="[^"]*/empresas/[^/]+/images/files/)${imageName}(".*?>)`,
                                "gs"
                            ),
                            `$1${`${newImageName}\``}$2`
                        );
                        setContent(updatedContent);
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
const cssProperties = [
    "align-content",
    "align-items",
    "align-self",
    "all",
    "animation",
    "animation-delay",
    "animation-direction",
    "animation-duration",
    "animation-fill-mode",
    "animation-iteration-count",
    "animation-name",
    "animation-play-state",
    "animation-timing-function",
    "backdrop-filter",
    "backface-visibility",
    "background",
    "background-attachment",
    "background-blend-mode",
    "background-clip",
    "background-color",
    "background-image",
    "background-origin",
    "background-position",
    "background-repeat",
    "background-size",
    "border",
    "border-bottom",
    "border-bottom-color",
    "border-bottom-left-radius",
    "border-bottom-right-radius",
    "border-bottom-style",
    "border-bottom-width",
    "border-collapse",
    "border-color",
    "border-image",
    "border-image-outset",
    "border-image-repeat",
    "border-image-slice",
    "border-image-source",
    "border-image-width",
    "border-left",
    "border-left-color",
    "border-left-style",
    "border-left-width",
    "border-radius",
    "border-right",
    "border-right-color",
    "border-right-style",
    "border-right-width",
    "border-spacing",
    "border-style",
    "border-top",
    "border-top-color",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-top-style",
    "border-top-width",
    "border-width",
    "bottom",
    "box-decoration-break",
    "box-shadow",
    "box-sizing",
    "break-after",
    "break-before",
    "break-inside",
    "caption-side",
    "caret-color",
    "clear",
    "clip",
    "clip-path",
    "color",
    "column-count",
    "column-fill",
    "column-gap",
    "column-rule",
    "column-rule-color",
    "column-rule-style",
    "column-rule-width",
    "column-span",
    "column-width",
    "columns",
    "content",
    "counter-increment",
    "counter-reset",
    "cursor",
    "direction",
    "display",
    "empty-cells",
    "filter",
    "flex",
    "flex-basis",
    "flex-direction",
    "flex-flow",
    "flex-grow",
    "flex-shrink",
    "flex-wrap",
    "float",
    "font",
    "font-family",
    "font-feature-settings",
    "font-kerning",
    "font-size",
    "font-size-adjust",
    "font-stretch",
    "font-style",
    "font-variant",
    "font-variant-caps",
    "font-weight",
    "gap",
    "grid",
    "grid-area",
    "grid-auto-columns",
    "grid-auto-flow",
    "grid-auto-rows",
    "grid-column",
    "grid-column-end",
    "grid-column-gap",
    "grid-column-start",
    "grid-gap",
    "grid-row",
    "grid-row-end",
    "grid-row-gap",
    "grid-row-start",
    "grid-template",
    "grid-template-areas",
    "grid-template-columns",
    "grid-template-rows",
    "hanging-punctuation",
    "height",
    "hyphens",
    "image-rendering",
    "inline-size",
    "inset",
    "inset-block",
    "inset-block-end",
    "inset-block-start",
    "inset-inline",
    "inset-inline-end",
    "inset-inline-start",
    "isolation",
    "justify-content",
    "justify-items",
    "justify-self",
    "left",
    "letter-spacing",
    "line-break",
    "line-height",
    "list-style",
    "list-style-image",
    "list-style-position",
    "list-style-type",
    "margin",
    "margin-block",
    "margin-block-end",
    "margin-block-start",
    "margin-bottom",
    "margin-inline",
    "margin-inline-end",
    "margin-inline-start",
    "margin-left",
    "margin-right",
    "margin-top",
    "mask",
    "mask-border",
    "mask-border-mode",
    "mask-border-outset",
    "mask-border-repeat",
    "mask-border-slice",
    "mask-border-source",
    "mask-border-width",
    "mask-clip",
    "mask-composite",
    "mask-image",
    "mask-mode",
    "mask-origin",
    "mask-position",
    "mask-repeat",
    "mask-size",
    "mask-type",
    "max-block-size",
    "max-height",
    "max-inline-size",
    "max-width",
    "min-block-size",
    "min-height",
    "min-inline-size",
    "min-width",
    "mix-blend-mode",
    "object-fit",
    "object-position",
    "offset",
    "offset-anchor",
    "offset-distance",
    "offset-path",
    "offset-position",
    "offset-rotate",
    "opacity",
    "order",
    "orphans",
    "outline",
    "outline-color",
    "outline-offset",
    "outline-style",
    "outline-width",
    "overflow",
    "overflow-anchor",
    "overflow-block",
    "overflow-clip-box",
    "overflow-inline",
    "overflow-wrap",
    "overflow-x",
    "overflow-y",
    "padding",
    "padding-block",
    "padding-block-end",
    "padding-block-start",
    "padding-bottom",
    "padding-inline",
    "padding-inline-end",
    "padding-inline-start",
    "padding-left",
    "padding-right",
    "padding-top",
    "page-break-after",
    "page-break-before",
    "page-break-inside",
    "perspective",
    "perspective-origin",
    "place-content",
    "place-items",
    "place-self",
    "pointer-events",
    "position",
    "quotes",
    "resize",
    "right",
    "row-gap",
    "ruby-align",
    "ruby-position",
    "scroll-behavior",
    "scroll-margin",
    "scroll-margin-block",
    "scroll-margin-block-end",
    "scroll-margin-block-start",
    "scroll-margin-bottom",
    "scroll-margin-inline",
    "scroll-margin-inline-end",
    "scroll-margin-inline-start",
    "scroll-margin-left",
    "scroll-margin-right",
    "scroll-margin-top",
    "scroll-padding",
    "scroll-padding-block",
    "scroll-padding-block-end",
    "scroll-padding-block-start",
    "scroll-padding-bottom",
    "scroll-padding-inline",
    "scroll-padding-inline-end",
    "scroll-padding-inline-start",
    "scroll-padding-left",
    "scroll-padding-right",
    "scroll-padding-top",
    "scroll-snap-align",
    "scroll-snap-stop",
    "scroll-snap-type",
    "shape-image-threshold",
    "shape-margin",
    "shape-outside",
    "tab-size",
    "table-layout",
    "text-align",
    "text-align-last",
    "text-combine-upright",
    "text-decoration",
    "text-decoration-color",
    "text-decoration-line",
    "text-decoration-style",
    "text-emphasis",
    "text-emphasis-color",
    "text-emphasis-position",
    "text-emphasis-style",
    "text-indent",
    "text-justify",
    "text-orientation",
    "text-overflow",
    "text-rendering",
    "text-shadow",
    "text-transform",
    "text-underline-offset",
    "text-underline-position",
    "top",
    "transform",
    "transform-box",
    "transform-origin",
    "transform-style",
    "transition",
    "transition-delay",
    "transition-duration",
    "transition-property",
    "transition-timing-function",
    "unicode-bidi",
    "user-select",
    "vertical-align",
    "visibility",
    "white-space",
    "widows",
    "width",
    "word-break",
    "word-spacing",
    "word-wrap",
    "writing-mode",
    "z-index",
];
export default FormEditorJSControl;
