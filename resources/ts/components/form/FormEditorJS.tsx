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
import MonacoEditor from "@monaco-editor/react";
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
			<div class="flex items-center gap-2 w-full border-2">
				<MonacoEditor
					height="300px"
					defaultLanguage="javascript"
					defaultValue={value}
					onChange={(val) =>
						setValue(name as Path<T>, val as PathValue<T, Path<T>>)
					}
					options={{
						selectOnLineNumbers: true,
						autoClosingBrackets: "always",
						suggestOnTriggerCharacters: true,
						minimap: { enabled: false },
					}}
					theme={useThemeStore().state === "dark" ? "vs-dark" : ""}
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
