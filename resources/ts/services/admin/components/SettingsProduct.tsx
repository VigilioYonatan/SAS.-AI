import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export const settingsAdd = signal<{
    caracteristicas: boolean;
    description: boolean;
    images: boolean;
} | null>(
    JSON.parse(
        localStorage.getItem(`settings:${storageEmpresa?.slug}`) ?? "null"
    )
);
interface SettingsProductProps {
    caracteristicas?: boolean;
    description?: boolean;
    images?: boolean;
}
function SettingsProduct({
    caracteristicas = true,
    description = true,
    images = true,
}: SettingsProductProps) {
    useEffect(() => {
        if (!settingsAdd.value) {
            settingsAdd.value = {
                ...(settingsAdd.value ?? {}),
                caracteristicas: true,
                description: true,
                images: true,
            };
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            `settings:${storageEmpresa?.slug}`,
            JSON.stringify(settingsAdd.value)
        );
    }, [settingsAdd.value]);
    return (
        <button
            type="button"
            class="relative group dark:bg-admin-terciary bg-primary  px-2 md:px-4 dark:text-white py-1 md:py-2 rounded-md shadow"
        >
            <i class="fa-solid fa-gear text-white" />
            <div
                class="absolute  dark:bg-admin-background-dark bg-white p-2 hidden group-hover:block dark:text-white w-[120px] shadow rounded-md"
                style={{ top: 10, right: 10 }}
            >
                <span class="text-xs">
                    <i class="fa-solid fa-user-robot" />
                </span>
                <div class="flex flex-col gap-2 ">
                    {description ? (
                        <div class="flex gap-2">
                            <span class="text-xs w-[100px] text-start dark:text-white text-black">
                                Descripción
                            </span>
                            <input
                                type="checkbox"
                                name="description"
                                checked={settingsAdd.value?.description}
                                onChange={(e) => {
                                    const description = (
                                        e.target as HTMLInputElement
                                    ).checked!;
                                    if (settingsAdd.value) {
                                        settingsAdd.value = {
                                            ...(settingsAdd.value || {}),
                                            description,
                                        };
                                    }
                                }}
                            />
                        </div>
                    ) : null}

                    {caracteristicas ? (
                        <div class="flex gap-2">
                            <span class="text-xs w-[100px] text-start  dark:text-white text-black">
                                Características
                            </span>
                            <input
                                type="checkbox"
                                name="caracteristicas"
                                checked={settingsAdd.value?.caracteristicas}
                                onChange={(e) => {
                                    const caracteristicas = (
                                        e.target as HTMLInputElement
                                    ).checked;
                                    if (settingsAdd.value) {
                                        settingsAdd.value = {
                                            ...(settingsAdd.value ?? {}),
                                            caracteristicas,
                                        };
                                    }
                                }}
                            />
                        </div>
                    ) : null}
                    {images ? (
                        <div class="flex gap-2">
                            <span class="text-xs text-start  w-[100px]  dark:text-white text-black">
                                Imagenes
                            </span>
                            <input
                                type="checkbox"
                                name="images"
                                checked={settingsAdd.value?.images}
                                onChange={(e) => {
                                    const images = (
                                        e.target as HTMLInputElement
                                    ).checked;
                                    if (settingsAdd.value) {
                                        settingsAdd.value = {
                                            ...(settingsAdd.value || {}),
                                            images,
                                        };
                                    }
                                }}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        </button>
    );
}

export default SettingsProduct;
