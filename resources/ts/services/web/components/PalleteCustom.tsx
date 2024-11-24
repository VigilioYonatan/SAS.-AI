import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { ColorResult, SketchPicker } from "react-color";

function initialColor() {
    let colors = JSON.parse(
        localStorage.getItem(`colors:${storageEmpresa!.id}`) ?? "null"
    );
    if (!colors) {
        colors = {
            primary: storageEmpresa!.setting.bg_color,
            secondary: storageEmpresa!.setting.bg_color_secondary,
            button: storageEmpresa!.setting.bg_color_button,
        };
    }

    return colors;
}
function PalleteCustom() {
    if (!storageEmpresa?.isTemplate) return null;
    const empresaStore = useEmpresastore();
    const typeColor = useSignal<"primary" | "secondary" | "button">("primary");
    const colors = useSignal<{
        primary: string;
        secondary: string;
        button: string;
    }>(initialColor());

    useEffect(() => {
        document.documentElement.style.setProperty(
            "--primary",
            colors.value.primary
        );
        empresaStore.methods.updateempresa({
            setting: {
                ...empresaStore.state!.setting,
                bg_color: colors.value.primary,
                bg_color_secondary: colors.value.secondary,
                bg_color_button: colors.value.button,
            },
        });
    }, []);
    const showPallete = useSignal(false);
    function handleChangeComplete(newColor: ColorResult) {
        if (typeColor.value === "primary") {
            colors.value = { ...colors.value, primary: newColor.hex };
            document.documentElement.style.setProperty(
                "--primary",
                colors.value.primary
            );
            empresaStore.methods.updateempresa({
                setting: {
                    ...empresaStore.state!.setting,
                    bg_color: colors.value.primary,
                },
            });
        }
        if (typeColor.value === "secondary") {
            colors.value = { ...colors.value, secondary: newColor.hex };
            empresaStore.methods.updateempresa({
                setting: {
                    ...empresaStore.state!.setting,
                    bg_color_secondary: colors.value.secondary,
                },
            });
        }
        if (typeColor.value === "button") {
            colors.value = { ...colors.value, button: newColor.hex };

            empresaStore.methods.updateempresa({
                setting: {
                    ...empresaStore.state!.setting,
                    bg_color_button: colors.value.button,
                },
            });
        }
        localStorage.setItem(
            `colors:${storageEmpresa!.id}`,
            JSON.stringify(colors.value)
        );
    }
    return (
        <div class="">
            <button
                class="fixed bottom-44 right-10 z-[99]  bg-white shadow dark:bg-background-dark w-[50px] h-[50px] flex justify-center items-center rounded-full text-black dark:text-white"
                type="button"
                aria-label="open chat ai"
                onClick={() => {
                    showPallete.value = !showPallete.value;
                }}
            >
                <i class="fa-sharp fa-regular fa-palette" />
            </button>
            {showPallete.value ? (
                <div class="  bottom-56 right-10 fixed flex justify-center flex-col items-center rounded-md dark:bg-background-dark bg-white p-2 shadow gap-2">
                    <span class="dark:text-white text-xs font-semibold">
                        Personaliza los colores de la tienda Virtual 100% (demo)
                    </span>
                    <div class="flex">
                        <SketchPicker
                            color={
                                typeColor.value === "primary"
                                    ? colors.value.primary
                                    : typeColor.value === "secondary"
                                    ? colors.value.secondary
                                    : colors.value.button
                            }
                            onChangeComplete={handleChangeComplete}
                        />
                        <div class="flex flex-col  h-[310px] relative">
                            <button
                                class={`p-2 border border-gray-300 text-xs   text-black dark:text-white font-semibold ${
                                    typeColor.value === "primary"
                                        ? "bg-primary"
                                        : "bg-white dark:bg-background-dark"
                                }`}
                                type="button"
                                onClick={() => {
                                    typeColor.value = "primary";
                                }}
                            >
                                Primary
                                <br />
                                <span class="text-xs text-gray-400">
                                    {colors.value.primary}
                                </span>
                            </button>
                            <button
                                class={`p-2 border border-gray-300 text-xs   text-black dark:text-white font-semibold ${
                                    typeColor.value === "secondary"
                                        ? "bg-primary"
                                        : "bg-white dark:bg-background-dark"
                                }`}
                                type="button"
                                onClick={() => {
                                    typeColor.value = "secondary";
                                }}
                            >
                                Secondary <br />
                                <span class="text-xs text-gray-400">
                                    {colors.value.secondary}
                                </span>
                            </button>
                            <button
                                class={`p-2 border border-gray-300 text-xs   text-black dark:text-white font-semibold ${
                                    typeColor.value === "button"
                                        ? "bg-primary"
                                        : "bg-white dark:bg-background-dark"
                                }`}
                                type="button"
                                onClick={() => {
                                    typeColor.value = "button";
                                }}
                            >
                                Button
                                <br />
                                <span class="text-xs text-gray-400">
                                    {colors.value.button}
                                </span>
                            </button>
                            <button
                                class="p-2 border border-gray-300 text-xs bg-white dark:bg-background-dark text-black dark:text-white font-semibold absolute bottom-0 right-0 left-0"
                                type="button"
                                onClick={() => {
                                    colors.value = {
                                        ...colors.value,
                                        primary:
                                            storageEmpresa!.setting.bg_color,
                                        secondary:
                                            storageEmpresa!.setting
                                                .bg_color_secondary,
                                        button: storageEmpresa!.setting
                                            .bg_color_button,
                                    };

                                    empresaStore.methods.updateempresa({
                                        setting: {
                                            ...empresaStore.state!.setting,
                                            bg_color:
                                                storageEmpresa!.setting
                                                    .bg_color,
                                            bg_color_secondary:
                                                storageEmpresa!.setting
                                                    .bg_color_secondary,
                                            bg_color_button:
                                                storageEmpresa!.setting
                                                    .bg_color_button,
                                        },
                                    });
                                    document.documentElement.style.setProperty(
                                        "--primary",
                                        colors.value.primary
                                    );
                                    localStorage.removeItem(
                                        `colors:${storageEmpresa!.id}`
                                    );
                                }}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default PalleteCustom;
