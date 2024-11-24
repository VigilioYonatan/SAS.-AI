import { useContext } from "preact/hooks";
import { FormControlContext } from "./Form";
import type { JSX } from "preact";
import type {
	FieldErrors,
	FieldValues,
	Path,
	RegisterOptions,
	UseFormReturn,
} from "react-hook-form";
import enviroments from "~/config";

interface WebFormTextAreaLabelProps<T extends object>
	extends Omit<JSX.IntrinsicElements["textarea"], "type" | "name"> {
	title: string;
	name: keyof T;
	question?: JSX.Element | JSX.Element[];
	className?: string;
	options?: RegisterOptions<T, Path<T>>;
}
function WebFormTextArea<T extends object>({
	name,
	title,
	question,
	options = {},
	className,
	...rest
}: WebFormTextAreaLabelProps<T>) {
	const {
		register,
		formState: { errors },
		getValues,
	} = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
	function anidarPropiedades(obj: FieldErrors<T>, keysArray: string[]) {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		let currentObj: any = obj;
		for (let i = 0; i < keysArray.length; i++) {
			const key = keysArray[i];
			// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
			if (!currentObj.hasOwnProperty(key)) {
				currentObj[key] = {}; // Crear un objeto vacío si la propiedad no existe
			}
			currentObj = currentObj[key]; // Moverse al siguiente nivel del objeto
		}
		return currentObj;
	}
	const err = anidarPropiedades(errors, (name as string).split("."));

	return (
		<div class="lg:mb-2 w-full">
			<label
				class="text-xs  dark:text-white capitalize font-semibold"
				htmlFor={name as string}
			>
				{title}
			</label>
			<div class="flex items-center gap-2 ">
				<textarea
					className={`${className} ${
						Object.keys(err).length ? "border-red-600" : ""
					}   bg-background-light  shadow-sm  
                     border-2 p ${
												enviroments.TYPE_BORDER === "circle"
													? "rounded-md"
													: "rounded-sm"
											} py-2.5 my-1  text-sm w-full min-h-[100px] max-h-[100px] lg:min-h-[100px] lg:max-h-[100px] outline-none bg-transparent h-full dark:text-secondary-light  px-2 sm:text-sm `}
					id={name as string}
					{...rest}
					{...register(name as unknown as Path<T>, options)}
				>
					{getValues(name as unknown as Path<T>)}
				</textarea>
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

export default WebFormTextArea;
