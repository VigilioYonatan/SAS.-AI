import { useContext, useEffect, useMemo, useRef } from "preact/hooks";
import type {
	FieldValues,
	Path,
	PathValue,
	UseFormReturn,
} from "react-hook-form";
import { FormControlContext } from "./Form";
import Quill from "quill";
import QuillResize from "quill-image-resize";
import "quill/dist/quill.snow.css"; // Estilos por defecto de Quill
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { anidarPropiedades } from ".";
import useThemeStore from "~/stores/theme.store";
Quill.register("modules/imageResize", QuillResize); // Registrar el módulo

interface FormEditorLabelProps {
	title: string;
	name: string;
	height?: number;
	isShow?: boolean;
	change?: string | null;
}
function FormEditor<T extends object>({
	name,
	title,
	height = 300,
	isShow = true,
	change,
}: FormEditorLabelProps) {
	const {
		formState: { errors },
		watch,
		setValue,
	} = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
	const editorRef = useRef<HTMLDivElement | null>(null);
	const quillRef = useRef<Quill | null>(null); // Reference to the Quill instance
	const themeStore = useThemeStore();

	useEffect(() => {
		if (change && quillRef.current) {
			quillRef.current.root.innerHTML = change;
		}
	}, [change, quillRef.current]);

	useEffect(() => {
		if (editorRef.current) {
			const toolbarOptions = [
				[{ header: [1, 2, 3, 4, 5, false] }],
				["bold", "italic", "underline"],
				[{ list: "ordered" }, { list: "bullet" }],
				["link", "image"],
				[{ align: [] }],
				["clean"], // remove formatting button
			];

			quillRef.current = new Quill(editorRef.current, {
				theme: "snow",
				modules: {
					toolbar: toolbarOptions,
					imageResize: {},
				},
			});
			quillRef.current.on("text-change", () => {
				const val = quillRef.current?.root.innerHTML as PathValue<T, Path<T>>;
				setValue(name as Path<T>, val);
			});
		}
	}, []);

	function showHTML() {
		sweetModal({
			html: reactComponent(
				<ShowHTML text={quillRef.current?.root.innerHTML as string} />,
			),
			sweetWidth: "500px",
			showCloseButton: true,
		});
	}

	const err = anidarPropiedades(errors, (name as string).split("."));
	const theme = useMemo(
		() => (themeStore.state === "dark" ? "#fff" : "#000"),
		[themeStore.state],
	);

	return (
		<div class="w-full mb-2">
			<label
				class="text-xs dark:text-secondary-light text-secondary-dark capitalize font-semibold"
				htmlFor={name as string}
			>
				{title}
			</label>
			<div class="flex items-center gap-2 w-full mt-1">
				<div
					class={`w-full relative ${
						Object.keys(err).length
							? "border border-red-600"
							: "border border-gray-200 dark:border-gray-600"
					}  `}
				>
					<div ref={editorRef} id={name as string} style={{ height }} />
					{watch(name as Path<T>) && isShow ? (
						<button
							type="button"
							aria-label="show text"
							onClick={showHTML}
							class="absolute top-0 right-0 mr-2 mt-1 text-white bg-primary px-2 py-1 rounded-md"
						>
							<i class="fa-solid fa-eyes" />
						</button>
					) : null}
				</div>
			</div>

			{Object.keys(err).length ? (
				<p class="text-xs text-red-600">{err?.message}</p>
			) : null}
			<style jsx>{`
                .ql-formats button .ql-stroke {
                    fill: rgba(255, 255, 255, 0.7) !important;
                    stroke: ${theme} !important;
                }
                .ql-formats button .ql-fill {
                    stroke: rgba(255, 255, 255, 0.7) !important;
                }
                .ql-formats .ql-picker-label .ql-stroke {
                    fill: rgba(255, 255, 255, 0.7) !important;
                    stroke: ${theme} !important;
                }
                .ql-formats .ql-picker-label .ql-fill {
                    stroke: rgba(255, 255, 255, 0.7) !important;
                }
                .ql-picker-label::before {
                    color: ${theme} !important;
                }
                .ql-editor {
                    color: ${theme} !important;
                }
            `}</style>
		</div>
	);
}

interface ShowHTMLProps {
	text: string;
}
export function ShowHTML({ text }: ShowHTMLProps) {
	return (
		<>
			<div
				class="w-full dark:text-white min-h-40"
				dangerouslySetInnerHTML={{
					__html: text,
				}}
			/>
		</>
	);
}

export default FormEditor;
