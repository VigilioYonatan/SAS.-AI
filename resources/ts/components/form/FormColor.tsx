import { useContext } from "preact/hooks";
import type { JSX } from "preact";
import type {
    FieldValues,
    Path,
    PathValue,
    RegisterOptions,
    UseFormReturn,
} from "react-hook-form";
import { anidarPropiedades } from ".";
import { ColorResult, SketchPicker } from "react-color";
import { FormControlContext } from "./Form";
import useDropdown from "~/hooks/useDropdown";

interface FormColorLabelProps<T extends object> {
    title: string;
    name: string;
    question?: JSX.Element | JSX.Element[] | string;
    options?: RegisterOptions<T, Path<T>>;
}
function FormColor<T extends object>({
    name,
    title,
    question,
}: FormColorLabelProps<T>) {
    const {
        formState: { errors },
        watch,
        setValue,
    } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
    const dropdown = useDropdown();
    const err = anidarPropiedades(errors, (name as string).split("."));
    function handleChangeComplete(newColor: ColorResult) {
        setValue(name as Path<T>, newColor.hex as PathValue<T, Path<T>>);
    }

    return (
        <div class="w-full mb-2">
            <label
                class="text-xs dark:text-secondary-light text-secondary-dark capitalize font-semibold"
                htmlFor={name as string}
            >
                {title}
            </label>
            <div class="flex items-center gap-2">
                <div
                    class="max-w-[100px] min-w-[100px] h-[30px] rounded-md border-2  border-gray-300 dark:border-white  relative"
                    style={{ background: watch(name as Path<T>) }}
                    onClick={() => {
                        dropdown.onOpenClose();
                    }}
                    ref={dropdown.dropdown}
                >
                    <div
                        class={`absolute top-0 -right-20 w-[200px] z-[99] ${
                            dropdown.dropdownOpen ? "" : "hidden"
                        }`}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <SketchPicker
                            color={watch(name as Path<T>)}
                            onChangeComplete={handleChangeComplete}
                        />
                    </div>
                </div>

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

export default FormColor;
