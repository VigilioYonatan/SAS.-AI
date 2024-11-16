import type { FieldValues, UseFormReturn } from "react-hook-form";
import { FormControlContext } from "./Form";
import { useContext } from "preact/hooks";
function FormButtonReset<T extends object>() {
    const { reset } =
        useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
    return (
        <button
            type="button"
            aria-label="reset form"
            class="  bg-primary  px-4 py-2  rounded-md font-bold text-xs uppercase flex items-center gap-2"
            onClick={() => reset()}
        >
            <i class="fa-solid fa-rotate-right" />
            Resetear
        </button>
    );
}

export default FormButtonReset;
