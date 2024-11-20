import { useContext } from "preact/hooks";
import type { JSX } from "preact";

import { anidarPropiedades } from ".";
import { isColorLight } from "~/libs/helpers";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import {
    FieldValues,
    Path,
    RegisterOptions,
    UseFormReturn,
} from "react-hook-form";
import { FormControlContext } from "./Form";

interface WebFormControlLabelProps<T extends object> {
    title: string | JSX.Element;
    name: keyof T;
    question?: JSX.Element | JSX.Element[] | string;
    options?: RegisterOptions<T, Path<T>>;
    disabled?: boolean;
}
function WebFormRadio<T extends object>({
    name,
    title,
    question,
    options = {},
    disabled = false,
}: WebFormControlLabelProps<T>) {
    const {
        register,
        formState: { errors },
    } = useContext<UseFormReturn<T, unknown, FieldValues>>(FormControlContext);
    const nameRandom = `${name as string}${Math.random()
        .toString(32)
        .substring(4)}`;

    const err = anidarPropiedades(errors, (name as string).split("."));

    return (
        <>
            <div class="lg:mb-2 w-full ">
                <label
                    class="text-xs  capitalize font-semibold"
                    htmlFor={nameRandom}
                >
                    {title}
                </label>
                <div class="flex gap-4 items-center">
                    <div class="wrap-toggle my-1">
                        <input
                            type="checkbox"
                            {...register(name as unknown as Path<T>, options)}
                            id={nameRandom}
                            class="offscreen"
                            disabled={disabled}
                        />
                        <label for={nameRandom} class="switch" />
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
                    <p class="text-xs text-red-600">{err.message}</p>
                ) : null}
            </div>
            <style jsx>{`
                .wrap-toggle {
                }

                .switch {
                    position: relative;
                    display: inline-block;
                    width: 80px;
                    height: 35px;
                    background-color: #848484;
                    border-radius: 40px;
                    transition: all 0.3s;
                    cursor: pointer;
                }

                .switch:after {
                    content: "";
                    position: absolute;
                    width: 25px;
                    height: 25px;
                    border-radius: 30px;
                    background-color: white;
                    top: 5px;
                    left: 5px;
                    transition: all 0.3s;
                }

                input[type="checkbox"]:checked + .switch:after {
                    transform: translateX(40px);
                    background-color: ${isColorLight(
                        storageEmpresa!.setting.bg_color
                    )
                        ? "#000"
                        : "#fff"};
                }

                input[type="checkbox"]:checked + .switch {
                    background-color: var(--primary);
                }

                .offscreen {
                    position: absolute;
                    left: -9999px;
                }
            `}</style>
        </>
    );
}

export default WebFormRadio;
