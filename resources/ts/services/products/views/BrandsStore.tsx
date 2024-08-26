import Form from "~/components/form";
import { type BrandsStoreDto, brandsStoreDto } from "../dtos/brands.store.dto";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import { useForm } from "react-hook-form";
import { brandsStoreApi } from "../apis/brands/brands.store.api";
import { sweetModal } from "@vigilio/sweet";
import { useEffect } from "preact/hooks";
import { valibotVigilio } from "~/libs/valibot";
import useAuthStore from "@/auth/stores/auth.store";
import { handlerError } from "~/libs/helpers";

interface BrandsStoreProps {
    refetch: (clean?: boolean) => Promise<void>;
    onClose: () => void;
}
function BrandsStore({ refetch, onClose }: BrandsStoreProps) {
    const { guards } = useAuthStore();
    if (!guards.permissionAdminGuard()) {
        onClose();
        return null;
    }
    const brandsStoreDtoForm = useForm<BrandsStoreDto>({
        resolver: valibotVigilio(brandsStoreDto),
        mode: "all",
    });

    const brandsStoreMutation = brandsStoreApi();
    function onAddCategory(data: BrandsStoreDto) {
        brandsStoreMutation.mutate(data, {
            onSuccess(data) {
                brandsStoreDtoForm.reset();
                sweetModal({
                    icon: "success",
                    text: `<p class="text-center">Nueva marca insertado correctamente <b>${data.brand.name}</b></p>`,
                });
                refetch(false);
                onClose();
            },
            onError(error) {
                handlerError(brandsStoreDtoForm, error);
            },
        });
    }
    const name = brandsStoreDtoForm.watch("name");
    useEffect(() => {
        brandsStoreDtoForm.setValue("slug", transformSlug(name || ""));
    }, [name]);

    return (
        <div className="mt-6 text-start">
            <Form {...brandsStoreDtoForm} onSubmit={onAddCategory}>
                <div class="flex justify-between items-center mb-4">
                    <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
                        <i class="fas fa-tags" />
                        Agregar Marca
                    </h3>
                    <Form.button.reset />
                </div>
                <div class="flex flex-col gap-4 justify-center items-center">
                    <Form.control
                        name={"name" as keyof BrandsStoreDto}
                        title="Nombre"
                        placeholder="Nombre de categoria"
                    />

                    <Form.control.file
                        name={"image" as keyof BrandsStoreDto}
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        title="Imagen"
                        typeFile="image"
                    />

                    <div class="w-full flex flex-col md:flex-row gap-2">
                        <Form.control
                            name={"slug" as keyof BrandsStoreDto}
                            title="Slug"
                            placeholder="nombre-de-categoria"
                            options={{ setValueAs: transformSlug }}
                            disabled
                        />
                    </div>
                    <Form.button.submit
                        isLoading={brandsStoreMutation.isLoading || false}
                        disabled={brandsStoreMutation.isLoading || false}
                        title="Guardar"
                    />
                </div>
            </Form>
        </div>
    );
}

export default BrandsStore;
