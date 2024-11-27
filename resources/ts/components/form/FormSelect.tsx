import { useContext, useEffect } from "preact/hooks";
import { FormControlContext } from "./Form";
import type { JSX } from "preact";
import type {
	FieldValues,
	Path,
	RegisterOptions,
	UseFormReturn,
} from "react-hook-form";
import { useSignal } from "@preact/signals";
import { anidarPropiedades } from ".";

interface FormControlLabelProps<T extends object>
	extends Omit<JSX.IntrinsicElements["select"], "type" | "name"> {
	title: string;
	name: keyof T;
	question?: JSX.Element | JSX.Element[] | string;
	options?: RegisterOptions<T, Path<T>>;
	placeholder: string;
	ico?: JSX.Element | JSX.Element[];
	isLoading?: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	array: { value: string; key: any }[];
}
function FormSelect<T extends object>({
	name,
	title,
	question,
	options = {},
	array,
	placeholder,
	isLoading = false,
	ico,
	...rest
}: FormControlLabelProps<T>) {
	const {
		register,
		getValues,
		formState: { errors },
	} = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);

	const err = anidarPropiedades(errors, (name as string).split("."));
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const arraySelect = useSignal<{ value: string; key: any }[]>([]);

	useEffect(() => {
		arraySelect.value = array;
	}, [array]);

	return (
		<div class="lg:mb-2 w-full mb-2">
			<label
				class="text-xs dark:text-secondary-light text-secondary-dark capitalize font-semibold"
				htmlFor={name as string}
			>
				{title}
			</label>
			<div class="flex items-center gap-2">
				<div
					class={`${
						Object.keys(err).length
							? "border border-red-600"
							: "border border-gray-200 dark:border-gray-600"
					} w-full h-[2.5rem] flex items-center text-xs rounded-lg  overflow-hidden dark:text-secondary-light text-secondary-dark dark:bg-admin-terciary bg-paper-light my-1 shadow-sm `}
				>
					{ico ? (
						<div class="dark:bg-admin-background-dark bg-background-light  shadow min-w-[2.8rem]  h-full flex justify-center items-center">
							{ico}
						</div>
					) : null}
					<select
						id={name as string}
						class={`${
							(errors as T)[name] ? "border-red-600" : ""
						}  bg-transparent font-normal my-1 text-sm w-full outline-none`}
						{...rest}
						{...register(name as unknown as Path<T>, options)}
						disabled={isLoading || false}
					>
						<option
							class="text-black"
							selected={
								Number.isNaN(getValues(name as unknown as Path<T>)) ||
								getValues(name as unknown as Path<T>) === null
							}
							value=""
						>
							{placeholder}
						</option>
						{arraySelect.value.map(({ value, key }) => (
							<option
								selected={getValues(name as unknown as Path<T>) === key}
								class="text-black"
								value={key}
								key={key}
							>
								{value}
							</option>
						))}
					</select>
				</div>
				{question ? (
					<div class="relative group ">
						<i class="fa-solid fa-circle-question text-xs dark:text-white" />
						<div class="text-xs min-w-[100px] hidden group-hover:block -top-[35px] right-1 p-1 shadow text-center absolute rounded-md dark:bg-admin-background-dark bg-background-light dark:text-white font-semibold">
							{question}
						</div>
					</div>
				) : null}
			</div>
			<div class={`${isLoading ? "loading-bar" : ""} w-full h-[2px] `} />
			{Object.keys(err).length ? (
				<p class="text-xs text-red-600">{err?.message}</p>
			) : null}
			<style jsx>{`
                @keyframes loadingAnimation {
                    0% {
                        left: -100%;
                        width: 100%;
                    }
                    50% {
                        left: 0%;
                        width: 10%;
                    }
                    100% {
                        left: 100%;
                        width: 100%;
                    }
                }

                .loading-bar {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                }

                .loading-bar::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    background-color: currentColor;
                    animation: loadingAnimation 2s infinite;
                }
            `}</style>
		</div>
	);
}
export function formSelectNumber(value: string) {
	return Number(value) > 0 ? Number(value) : null;
}

export default FormSelect;
