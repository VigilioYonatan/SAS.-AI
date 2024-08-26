import Form from "~/components/form";
import {
    type CategoriesStoreDto,
    categoriesStoreDto,
} from "../dtos/categories.store.dto";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import { useForm } from "react-hook-form";
import { categoriesStoreApi } from "../apis/categories/categories.store.api";
import { sweetModal } from "@vigilio/sweet";
import { useEffect, useMemo } from "preact/hooks";
import { valibotVigilio } from "~/libs/valibot";
import useAuthStore from "@/auth/stores/auth.store";
import { handlerError } from "~/libs/helpers";
import { familiesIndexApi } from "../apis/families/families.index.api";
import { formSelectNumber } from "~/components/form/WebFormSelect";

interface CategoriesStoreProps {
    refetch: (clean?: boolean) => Promise<void>;
    onClose: () => void;
}
function CategoriesStore({ refetch, onClose }: CategoriesStoreProps) {
    const { guards } = useAuthStore();
    if (!guards.permissionAdminGuard()) {
        onClose();
        return null;
    }
    const categoriesStoreDtoForm = useForm<CategoriesStoreDto>({
        resolver: valibotVigilio(categoriesStoreDto),
        mode: "all",
    });

    const categoriesStoreMutation = categoriesStoreApi();

    const familiesIndexQuery = familiesIndexApi();

    const familiesData = useMemo(() => {
        if (familiesIndexQuery.isSuccess && familiesIndexQuery.data) {
            return familiesIndexQuery.data.data.map((family) => ({
                key: family.id,
                value: family.name,
            }));
        }
        return [];
    }, [familiesIndexQuery.data, familiesIndexQuery.isSuccess]);

    function onAddCategory(data: CategoriesStoreDto) {
        sweetModal({
            icon: "info",
            title: "¿Estás seguro de agregar esta categoría?",
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                categoriesStoreMutation.mutate(data, {
                    onSuccess(data) {
                        categoriesStoreDtoForm.reset();
                        sweetModal({
                            icon: "success",
                            text: `<p class="text-center">Nueva categoría insertado correctamente <b>${data.category.name}</b></p>`,
                        });
                        refetch(false);
                        onClose();
                    },
                    onError(error) {
                        handlerError(categoriesStoreDtoForm, error);
                    },
                });
            }
        });
    }
    const name = categoriesStoreDtoForm.watch("name");
    useEffect(() => {
        categoriesStoreDtoForm.setValue("slug", transformSlug(name || ""));
    }, [name]);

    return (
        <div className="mt-6 text-start">
            <Form {...categoriesStoreDtoForm} onSubmit={onAddCategory}>
                <div class="flex justify-between items-center mb-4">
                    <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
                        <i class="fa-solid fa-layer-group" />
                        Agregar Categoría
                    </h3>
                    <Form.button.reset />
                </div>
                <div class="flex flex-col gap-4 justify-center items-center">
                    <div class="w-full flex flex-col md:flex-row gap-2">
                        <Form.control
                            name={"name" as keyof CategoriesStoreDto}
                            title="Nombre"
                            placeholder="Nombre de categoria"
                        />
                    </div>
                    <Form.control.file
                        name={"image" as keyof CategoriesStoreDto}
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        title="Imagen"
                        typeFile="image"
                    />

                    <div class="w-full flex flex-col md:flex-row gap-2">
                        <Form.control
                            name={"slug" as keyof CategoriesStoreDto}
                            title="Slug"
                            placeholder="nombre-de-categoria"
                            options={{ setValueAs: transformSlug }}
                            disabled
                        />{" "}
                        <Form.control.select
                            title="Familias"
                            array={familiesData}
                            name={"family_id" as keyof CategoriesStoreDto}
                            options={{
                                setValueAs: formSelectNumber,
                            }}
                            isLoading={familiesIndexQuery.isLoading || false}
                            placeholder="Escoger Familia"
                        />
                    </div>
                    <Form.button.submit
                        isLoading={categoriesStoreMutation.isLoading || false}
                        disabled={categoriesStoreMutation.isLoading || false}
                        title="Guardar"
                    />
                </div>
            </Form>
        </div>
    );
}

export default CategoriesStore;
