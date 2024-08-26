import Form from "~/components/form";
import {
    type ProductsNormalStoreDto,
    productsNormalStoreDto,
} from "../dtos/products.store.dto";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import { useFieldArray, useForm, type UseFormReturn } from "react-hook-form";
import { useEffect, useMemo } from "preact/hooks";
import { subtotal as subtotalCart, formatSoles } from "@/cart/libs/helpers";
import { valibotVigilio } from "~/libs/valibot";
import { handlerError } from "~/libs/helpers";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { imageBackgroundIA } from "~/config/settings";
import useInformationstore from "@/information/stores/information.store";
import enviroments from "~/config";
import { subWhatsappIA } from "~/config/guards";
import { reactComponent } from "~/libs/preact";
import LoaderSubmit from "~/components/LoaderSubmit";
import useAuthstore from "@/auth/stores/auth.store";
import { familiesIndexApi } from "../apis/families/families.index.api";
import { brandsIndexApi } from "../apis/brands/brands.index.api";
import { productsNormalStoreApi } from "../apis/products/products.store.api";
import { familiesCategoriesApi } from "../apis/families/families.categories.api";
import { categoriesSubcategoriesApi } from "../apis/categories/categories.subcategories.api";
import { aiDescriptionApi } from "@/bot/apis/ai.description.api";
import { formSelectNumber } from "~/components/form/WebFormSelect";
import AdminHr from "~/components/AdminHr";
import useCopyToClipboard from "~/hooks/useCopyToClipboard";
import useDropdown from "~/hooks/useDropdown";
import { useSignal } from "@preact/signals";
import {
    optionsFeaturesApi,
    type OptionsOptionValuesAPI,
} from "../apis/options/options.features.api";
import { Fragment } from "preact/jsx-runtime";
import type { ProductsUpdateDto } from "../dtos/products.update.dto";

interface ProductsNormalStoreProps {
    refetch: (clean?: boolean | undefined) => Promise<void>;
    onClose: () => void;
}
function ProductsNormalStore({ refetch, onClose }: ProductsNormalStoreProps) {
    const { guards } = useAuthstore();
    if (!guards.permissionAdminGuard()) {
        window.history.back();
        return null;
    }
    const information = useInformationstore();
    const productsNormalStoreDtoForm = useForm<ProductsNormalStoreDto>({
        resolver: valibotVigilio(productsNormalStoreDto),
        mode: "all",
        defaultValues: {
            characteristics: [],
            options: [],
            description: null,
            enabled: true,
        },
    });

    const productsNormalStoreMutation = productsNormalStoreApi();
    const aiDescriptionQuery = aiDescriptionApi();
    const optionsFeaturesQuery = optionsFeaturesApi();
    const family_id = productsNormalStoreDtoForm.watch("family_id");
    const category_id = productsNormalStoreDtoForm.watch("category_id");
    const earning = productsNormalStoreDtoForm.watch("earning");
    const [copy] = useCopyToClipboard();

    const familiesIndexQuery = familiesIndexApi();
    const brandsIndexQuery = brandsIndexApi();
    const familiesCategoriesQuery = familiesCategoriesApi(family_id);
    const categoriesSubcategoriesQuery =
        categoriesSubcategoriesApi(category_id);

    const optionsFeaturesData = useMemo(() => {
        if (optionsFeaturesQuery.isSuccess && optionsFeaturesQuery.data) {
            return optionsFeaturesQuery.data.data.map((option) => option);
        }
        return [];
    }, [optionsFeaturesQuery.data, optionsFeaturesQuery.isSuccess]);

    const familiesSelect = useMemo(() => {
        if (familiesIndexQuery.isSuccess && familiesIndexQuery.data) {
            return familiesIndexQuery.data.data.map((value) => ({
                key: value.id,
                value: value.name,
            }));
        }
        return [];
    }, [familiesIndexQuery.data, familiesIndexQuery.isSuccess]);

    const brandsSelect = useMemo(() => {
        if (brandsIndexQuery.isSuccess && brandsIndexQuery.data) {
            return brandsIndexQuery.data.data.map((value) => ({
                key: value.id,
                value: value.name,
            }));
        }
        return [];
    }, [brandsIndexQuery.data, brandsIndexQuery.isSuccess]);

    const categoriesSelect = useMemo(() => {
        if (familiesCategoriesQuery.isSuccess && familiesCategoriesQuery.data) {
            return familiesCategoriesQuery.data.data.map((value) => ({
                key: value.id,
                value: value.name,
            }));
        }
        return [];
    }, [familiesCategoriesQuery.data, familiesCategoriesQuery.isSuccess]);
    const subcategoriesSelect = useMemo(() => {
        if (
            categoriesSubcategoriesQuery.isSuccess &&
            categoriesSubcategoriesQuery.data
        ) {
            return categoriesSubcategoriesQuery.data.data.map((value) => ({
                key: value.id,
                value: value.name,
            }));
        }
        return [];
    }, [
        categoriesSubcategoriesQuery.data,
        categoriesSubcategoriesQuery.isSuccess,
    ]);

    const name = productsNormalStoreDtoForm.watch("name");
    const discount = productsNormalStoreDtoForm.watch("discount");
    const price = productsNormalStoreDtoForm.watch("price");

    useEffect(() => {
        productsNormalStoreDtoForm.unregister("category_id");
        productsNormalStoreDtoForm.unregister("subcategory_id");
        if (family_id) {
            familiesCategoriesQuery.refetch();
        } else {
            familiesCategoriesQuery.transformData((data) => ({
                ...data,
                data: [],
            }));
            categoriesSubcategoriesQuery.transformData((data) => ({
                ...data,
                data: [],
            }));
        }
    }, [family_id]);
    useEffect(() => {
        productsNormalStoreDtoForm.unregister("subcategory_id");
        if (category_id) {
            categoriesSubcategoriesQuery.refetch();
        } else {
            categoriesSubcategoriesQuery.transformData((data) => ({
                ...data,
                data: [],
            }));
        }
    }, [category_id]);

    useEffect(() => {
        if (name) {
            productsNormalStoreDtoForm.setValue(
                "slug",
                transformSlug(name || ""),
                {
                    shouldValidate: true,
                }
            );
        }
    }, [name]);

    const subtotal = useMemo(
        () =>
            subtotalCart(
                subtotalCart(
                    price,
                    earning ?? information.state!.earning,
                    true
                ),
                discount
            ),
        [discount, price, earning]
    );

    const { fields, append, remove } = useFieldArray({
        control: productsNormalStoreDtoForm.control,
        name: "characteristics",
    });
    function onProductStore(body: ProductsNormalStoreDto) {
        sweetModal({
            icon: "info",
            title: "¿Estas seguro de agregar este producto?",
            customIcon:
                "<i class='fas fa-phone-laptop text-3xl dark:text-white' /> </i>",
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                productsNormalStoreMutation.mutate(body, {
                    onSuccess(data) {
                        productsNormalStoreDtoForm.reset();
                        sweetAlert({
                            icon: "success",
                            title: `<p class="text-center">Nuevo producto insertado correctamente <b>${data.product.name}</b></p>`,
                        });
                        refetch(false);
                        onClose();
                    },
                    onError(error) {
                        handlerError(productsNormalStoreDtoForm, error);
                    },
                });
            }
        });
    }

    return (
        <div class="text-start  mt-6">
            <Form {...productsNormalStoreDtoForm} onSubmit={onProductStore}>
                <div class="flex justify-between items-center mb-4">
                    <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
                        <i class="fas fa-phone-laptop" />
                        Agregar Producto
                    </h3>
                    <Form.button.reset />
                </div>

                <div class="">
                    <div class="w-full flex flex-row gap-2">
                        <Form.control
                            name={"name" as keyof ProductsNormalStoreDto}
                            title="Nombre"
                            placeholder="Nombre de producto"
                        />
                        <Form.control
                            name={"slug" as keyof ProductsNormalStoreDto}
                            title="Slug"
                            placeholder="nombre-de-producto"
                            options={{ setValueAs: transformSlug }}
                            disabled
                        />
                    </div>
                    <div class="w-full flex flex-col md:flex-row gap-2">
                        <Form.control
                            name={"price" as keyof ProductsNormalStoreDto}
                            step={0.01}
                            type="number"
                            title="Precio Normal"
                            placeholder="S/. 10.00"
                            options={{
                                setValueAs(value) {
                                    return Number(value) > 0
                                        ? Number(value)
                                        : null;
                                },
                            }}
                        />
                        <Form.control
                            name={"earning" as keyof ProductsNormalStoreDto}
                            type="number"
                            step={0.01}
                            title="Ganancia por producto"
                            options={{
                                setValueAs(value) {
                                    return Number(value) > 0
                                        ? Number(value)
                                        : null;
                                },
                            }}
                            placeholder={`${information.state!.earning}%`}
                            ico={<i class="fas fa-sack" />}
                            question={
                                <div class="w-[200px]">
                                    El % de ganancia que obtendras por producto.{" "}
                                    <br />
                                    Si dejas este campo vació tendrá la ganancia
                                    puesta en configuración.
                                    <br />
                                    Puedes cambiar el % en{" "}
                                    <a
                                        href="/admin/empresa"
                                        rel="noreferrer"
                                        class="text-primary hover:underline"
                                        target="_blank"
                                    >
                                        configuración.
                                    </a>
                                </div>
                            }
                        />
                        <div class="w-full flex items-center gap-2">
                            <Form.control
                                name={
                                    "discount" as keyof ProductsNormalStoreDto
                                }
                                type="number"
                                title="Descuento"
                                placeholder="0%"
                                step={0.01}
                                options={{
                                    value: 0 as unknown as undefined,
                                    setValueAs(value) {
                                        return Number(value) >= 0
                                            ? Number(value)
                                            : null;
                                    },
                                }}
                            />
                            <div class="flex flex-col gap-1">
                                <span class="text-lg whitespace-nowrap  text-primary">
                                    <span class="text-gray-400">
                                        {formatSoles(subtotal)}
                                    </span>{" "}
                                    -{" "}
                                    {information.state!.igv
                                        ? formatSoles(
                                              subtotalCart(
                                                  subtotal,
                                                  enviroments.VITE_IGV,
                                                  true
                                              )
                                          )
                                        : null}{" "}
                                </span>
                                <span class="text-xs whitespace-nowrap dark:text-white flex gap-2 items-center">
                                    <span class="text-xs dark:text-white text-black">
                                        + incl.{" "}
                                        {earning ?? information.state!.earning}%
                                    </span>
                                    {discount ? (
                                        <span class="text-xs dark:text-white text-black">
                                            - incl. {discount}%
                                        </span>
                                    ) : null}
                                    {information.state!.igv
                                        ? `+ inc. ${enviroments.VITE_IGV}% igv`
                                        : null}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="w-full flex flex-row gap-2">
                        <Form.control.toggle
                            name={"enabled" as keyof ProductsNormalStoreDto}
                            title="Disponibilidad"
                            question="Cuando está habilitado los clientes podrán comprar el producto."
                        />
                        <Form.control.toggle
                            name={"isNew" as keyof ProductsNormalStoreDto}
                            title="¿Es nuevo?"
                            question="¿El producto es nuevo?"
                        />
                       
                    </div>
                    <div class="w-full flex flex-row gap-2">
                        <Form.control.select
                            name={"brand_id" as keyof ProductsNormalStoreDto}
                            title="Marca"
                            placeholder="Escoger marca"
                            array={brandsSelect}
                            isLoading={brandsIndexQuery.isLoading || false}
                            options={{
                                setValueAs: formSelectNumber,
                            }}
                        />
                        <Form.control.select
                            name={"family_id" as keyof ProductsNormalStoreDto}
                            title="Familia"
                            placeholder="Escoger familía"
                            array={familiesSelect}
                            options={{
                                setValueAs: formSelectNumber,
                            }}
                            isLoading={familiesIndexQuery.isLoading || false}
                        />
                    </div>
                    <div class="w-full flex flex-row gap-2">
                        <Form.control.select
                            name={"category_id" as keyof ProductsNormalStoreDto}
                            title="Categoría"
                            placeholder="Escoger categoría"
                            array={categoriesSelect}
                            options={{
                                setValueAs: formSelectNumber,
                            }}
                            isLoading={
                                familiesCategoriesQuery.isLoading || false
                            }
                        />
                        <Form.control.select
                            name={
                                "subcategory_id" as keyof ProductsNormalStoreDto
                            }
                            title="Subcategoría"
                            placeholder="Escoger subcategoria"
                            array={subcategoriesSelect}
                            isLoading={
                                categoriesSubcategoriesQuery.isLoading || false
                            }
                            options={{
                                setValueAs: formSelectNumber,
                            }}
                        />
                    </div>
                    <Form.control.editor
                        name={"description" as keyof ProductsNormalStoreDto}
                        title="Descripción"
                        height={200}
                    />
                    {name &&
                    !productsNormalStoreDtoForm.formState.errors.name
                        ?.message ? (
                        <div class="text-primary text-xs flex flex-col self-start ">
                            <span class="dark:text-white text-black">
                                Usar Inteligencia Artificial para buscar
                                descripción
                            </span>
                            <div class="flex relative gap-2 items-center">
                                <button
                                    type="button"
                                    aria-label="use ai decripcion"
                                    class=" p-2   text-sm  bg-primary px-2 py-1 rounded-md self-start text-white mt-1 flex items-center gap-2 "
                                    onClick={() => {
                                        if (!subWhatsappIA()) {
                                            sweetAlert({
                                                icon: "danger",
                                                title: `<span class="text-xs">No tienes la subscripción de Whatsapp y IA <a href='${enviroments.VITE_URL}/admin/plus' target="_blank" class="text-primary hover:underline">Ir a PLUS</a></span>`,
                                            });
                                            return;
                                        }
                                        aiDescriptionQuery.mutate(name, {
                                            onSuccess(data) {
                                                sweetModal((onClose) => ({
                                                    position: "start",
                                                    html: reactComponent(
                                                        <div class="flex flex-col gap-2 dark:text-white">
                                                            <p>
                                                                {
                                                                    data.description
                                                                }
                                                            </p>
                                                            <button
                                                                type="button"
                                                                aria-label="copy"
                                                                class="flex gap-2 items-center justify-center active:text-primary bg-primary px-4 py-1 rounded-md text-white"
                                                                onClick={() => {
                                                                    copy(
                                                                        data.description
                                                                    ).then(
                                                                        () => {
                                                                            sweetAlert(
                                                                                {
                                                                                    icon: "success",
                                                                                    title: "Copiado correctamente",
                                                                                }
                                                                            );
                                                                            onClose();
                                                                        }
                                                                    );
                                                                }}
                                                            >
                                                                <i class="far fa-copy text-base" />{" "}
                                                                Copiar
                                                            </button>
                                                        </div>
                                                    ),
                                                    showCloseButton: true,
                                                }));
                                            },
                                            onError(data) {
                                                sweetAlert({
                                                    icon: "danger",
                                                    title: data.message,
                                                });
                                            },
                                        });
                                    }}
                                >
                                    <i class="fa-sharp fa-solid fa-message-bot " />
                                    {aiDescriptionQuery.isLoading ? (
                                        <LoaderSubmit />
                                    ) : (
                                        name
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : null}
                    <div>
                        <div class="mb-2">
                            <span class="dark:text-white text-xs font-bold">
                                Caracterísiticas
                            </span>
                            {fields.map((field, i) => (
                                <div
                                    class="flex gap-2 items-center"
                                    key={field.id}
                                >
                                    <Form.control
                                        name={`characteristics.${i}.name`}
                                        title="Nombre"
                                        placeholder="Modelo"
                                    />
                                    <Form.control
                                        name={`characteristics.${i}.value`}
                                        title="Valor"
                                        placeholder="A32"
                                    />
                                    <button
                                        class="mx-auto block bg-danger px-2 py-1 mt-2 rounded-md shadow text-white"
                                        type="button"
                                        aria-label="to add"
                                        onClick={() => {
                                            remove(i);
                                        }}
                                    >
                                        <i class="fa-solid fa-trash" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            class="bg-primary px-4 py-2 rounded-md shadow text-white"
                            type="button"
                            aria-label="to add"
                            onClick={() => {
                                append({ name: "", value: "" });
                            }}
                        >
                            +
                        </button>
                    </div>
                    <AdminHr />
                    <div class="flex flex-col gap-2">
                        <span class="text-xs dark:text-white">Opciones</span>
                        <button
                            class="bg-primary px-4 py-2 rounded-md shadow text-white self-start"
                            type="button"
                            aria-label="to add"
                            onClick={() => {
                                sweetModal((onClose) => ({
                                    html: reactComponent(
                                        <ProductOptions
                                            optionsFeaturesData={
                                                optionsFeaturesData
                                            }
                                            productsNormalStoreDtoForm={
                                                productsNormalStoreDtoForm as UseFormReturn<
                                                    | ProductsNormalStoreDto
                                                    | ProductsUpdateDto
                                                >
                                            }
                                            onClose={onClose}
                                        />
                                    ),
                                    showCloseButton: true,
                                    position: "start",
                                }));
                            }}
                        >
                            +
                        </button>
                        {productsNormalStoreDtoForm.formState.errors.options ? (
                            <p class="text-xs text-red-600">
                                {
                                    productsNormalStoreDtoForm.formState.errors
                                        .options.message
                                }
                            </p>
                        ) : null}
                        <div class="flex flex-col flex-wrap  gap-2 my-4">
                            {productsNormalStoreDtoForm
                                .watch("options")
                                .map((option) => {
                                    const opt = optionsFeaturesData.find(
                                        (opt) => opt.id === option.option_id
                                    );
                                    if (opt) {
                                        const detailedFeatures =
                                            option.features.map((featureId) =>
                                                opt.features.find(
                                                    (feature) =>
                                                        feature.id === featureId
                                                )
                                            );
                                        return (
                                            <div
                                                key={opt.id}
                                                class="flex flex-col gap-2"
                                            >
                                                <span class="dark:text-white text-xs">
                                                    {opt.name}
                                                </span>
                                                <div class="flex flex-wrap gap-2 ">
                                                    {detailedFeatures!.map(
                                                        (feature) => (
                                                            <Fragment
                                                                key={
                                                                    feature?.id
                                                                }
                                                            >
                                                                {opt.type ===
                                                                1 ? (
                                                                    <div class=" px-6 py-1 rounded-md  bg-white dark:bg-admin-terciary dark:text-white text-xs font-bold flex items-center gap-2 shadow">
                                                                        {
                                                                            feature?.value
                                                                        }{" "}
                                                                        |{" "}
                                                                        {
                                                                            feature?.description
                                                                        }
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        class="relative w-[30px] h-[30px] rounded-full shadow  flex justify-center items-center group"
                                                                        style={{
                                                                            backgroundColor:
                                                                                feature?.value,
                                                                        }}
                                                                    >
                                                                        <span class="absolute -bottom-2 left-2 z-10 dark:bg-admin-background-dark shadow dark:text-white bg-white text-[10px] px-2 rounded-md py-1 hidden group-hover:block">
                                                                            {
                                                                                feature?.description
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </Fragment>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return option;
                                })}
                        </div>
                    </div>
                    <AdminHr />
                    <div class="flex flex-col gap-2">
                        <span class="text-xs dark:text-white">
                            Detalles de Envio
                        </span>
                        <div class="flex gap-2 items-center">
                            <Form.control
                                type="number"
                                title="Peso"
                                placeholder="0 kg"
                                name={
                                    "details.peso" as keyof ProductsNormalStoreDto
                                }
                                options={{ setValueAs: Number }}
                            />
                            <Form.control
                                type="number"
                                title="Largo"
                                placeholder="0 cm"
                                name={
                                    "details.largo" as keyof ProductsNormalStoreDto
                                }
                                options={{ setValueAs: Number }}
                            />
                            <Form.control
                                type="number"
                                title="Ancho"
                                placeholder="0 cm"
                                name={
                                    "details.ancho" as keyof ProductsNormalStoreDto
                                }
                                options={{ setValueAs: Number }}
                            />
                        </div>
                    </div>
                </div>
                <AdminHr />
                <AlertInfo>
                    <span>
                        Te recomendamos esta inteligencia artificial si deseas
                        eliminar fondos de tus imagenes.{" "}
                        <a
                            class="hover:underline text-primary"
                            target="_blank"
                            rel="noreferrer"
                            href={imageBackgroundIA()}
                        >
                            Ir a sitio web
                        </a>
                    </span>
                </AlertInfo>
                <Form.control.file
                    name={"images" as keyof ProductsNormalStoreDto}
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                    title="Imagenes"
                    typeFile="image"
                    multiple
                />
                <div class="flex justify-center">
                    <Form.button.submit
                        disabled={
                            productsNormalStoreMutation.isLoading || false
                        }
                        isLoading={
                            productsNormalStoreMutation.isLoading || false
                        }
                        title="Guardar"
                    />
                </div>
            </Form>
        </div>
    );
}

interface ProductOptions {
    optionsFeaturesData: OptionsOptionValuesAPI["data"];
    productsNormalStoreDtoForm: UseFormReturn<
        ProductsNormalStoreDto | ProductsUpdateDto
    >;
    onClose: () => void;
}
export function ProductOptions({
    optionsFeaturesData,
    productsNormalStoreDtoForm,
    onClose,
}: ProductOptions) {
    const optionsFeatures = useSignal<ProductsNormalStoreDto["options"]>(
        productsNormalStoreDtoForm.watch("options")
    );

    useEffect(() => {
        productsNormalStoreDtoForm.setValue("options", optionsFeatures.value);
    }, [optionsFeatures.value]);
    function onFeatures(body: { option_id: number; feature_id: number }) {
        const existOptionIndex = optionsFeatures.value.findIndex(
            (opt) => opt.option_id === body.option_id
        );

        if (existOptionIndex !== -1) {
            const existOption = optionsFeatures.value[existOptionIndex];
            if (!existOption.features.includes(body.feature_id)) {
                const updatedOptions = [...optionsFeatures.value];
                updatedOptions[existOptionIndex].features.push(body.feature_id);
                optionsFeatures.value = updatedOptions;
            } else {
                const updatedOptions = [...optionsFeatures.value];
                const featureIndex = updatedOptions[
                    existOptionIndex
                ].features.indexOf(body.feature_id);
                updatedOptions[existOptionIndex].features.splice(
                    featureIndex,
                    1
                );
                if (updatedOptions[existOptionIndex].features.length === 0) {
                    updatedOptions.splice(existOptionIndex, 1);
                }
                optionsFeatures.value = updatedOptions;
            }
        } else {
            optionsFeatures.value = [
                ...optionsFeatures.value,
                {
                    option_id: body.option_id,
                    features: [body.feature_id],
                },
            ];
        }
    }

    return (
        <div>
            <span class="dark:text-white mb-2">Opciones</span>
            {optionsFeaturesData?.map((option) => {
                const dropdown = useDropdown();
                const existOption = optionsFeatures.value.find(
                    (opt) => opt.option_id === option.id
                );

                return (
                    <div
                        key={option.id}
                        class={`${
                            dropdown.dropdownOpen
                                ? "max-h-[800px]"
                                : "max-h-9 overflow-hidden"
                        }`}
                    >
                        <button
                            type="button"
                            class={`dark:text-white text-xs flex justify-between w-full items-center py-2 border-b ${
                                existOption
                                    ? "border-primary"
                                    : "border-gray-600"
                            } `}
                            onClick={() => dropdown.onOpenClose()}
                        >
                            <span class="dark:text-secondary-light font-semibold ">
                                {option.name}
                            </span>
                            <i class="fa-solid fa-caret-down" />
                        </button>
                        <div class="flex gap-2 flex-wrap p-2">
                            {option.features.map((feature) => (
                                <button
                                    type="button"
                                    aria-label="choose"
                                    onClick={() => {
                                        onFeatures({
                                            option_id: option.id,
                                            feature_id: feature.id,
                                        });
                                    }}
                                    key={feature.id}
                                >
                                    {option.type === 1 ? (
                                        <div
                                            class={`${
                                                existOption?.features.some(
                                                    (feat) =>
                                                        feat === feature.id
                                                )
                                                    ? "border-2 border-primary"
                                                    : ""
                                            } px-6 py-1 rounded-md  bg-white dark:bg-admin-terciary dark:text-white text-xs font-bold flex items-center gap-2 shadow`}
                                        >
                                            {feature.value} |{" "}
                                            {feature.description}
                                        </div>
                                    ) : (
                                        <div
                                            class={`${
                                                existOption?.features.some(
                                                    (feat) =>
                                                        feat === feature.id
                                                )
                                                    ? "border-2 border-primary"
                                                    : ""
                                            } relative w-[30px] h-[30px] rounded-full shadow  flex justify-center items-center group`}
                                            style={{
                                                backgroundColor: feature.value,
                                            }}
                                        >
                                            <span class="absolute -bottom-2 left-2 z-10 dark:bg-admin-background-dark shadow dark:text-white bg-white text-[10px] px-2 rounded-md py-1 hidden group-hover:block">
                                                {feature.description}
                                            </span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
            {optionsFeatures.value.length ? (
                <div class="flex flex-col flex-wrap  gap-2 my-2">
                    <span class="text-primary text-center">Resultado</span>
                    {optionsFeatures.value.map((option) => {
                        const opt = optionsFeaturesData.find(
                            (opt) => opt.id === option.option_id
                        );
                        if (opt) {
                            const detailedFeatures = option.features.map(
                                (featureId) =>
                                    opt.features.find(
                                        (feature) => feature.id === featureId
                                    )
                            );
                            return (
                                <div key={opt.id} class="flex flex-col gap-2">
                                    <span class="dark:text-white text-xs">
                                        {opt.name}
                                    </span>
                                    <div class="flex flex-wrap gap-2 ">
                                        {detailedFeatures!.map((feature) => (
                                            <Fragment key={feature?.id}>
                                                {opt.type === 1 ? (
                                                    <div class=" px-6 py-1 rounded-md  bg-white dark:bg-admin-terciary dark:text-white text-xs font-bold flex items-center gap-2 shadow">
                                                        {feature?.value} |{" "}
                                                        {feature?.description}
                                                    </div>
                                                ) : (
                                                    <div
                                                        class="relative w-[30px] h-[30px] rounded-full shadow  flex justify-center items-center group"
                                                        style={{
                                                            backgroundColor:
                                                                feature?.value,
                                                        }}
                                                    >
                                                        <span class="absolute -bottom-2 left-2 z-10 dark:bg-admin-background-dark shadow dark:text-white bg-white text-[10px] px-2 rounded-md py-1 hidden group-hover:block">
                                                            {
                                                                feature?.description
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </Fragment>
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                        return option;
                    })}
                </div>
            ) : null}
            <button
                type="button"
                aria-label="ok"
                onClick={onClose}
                class="px-4 py-2 rounded-md text-white bg-primary mt-4"
            >
                OK
            </button>
        </div>
    );
}
export default ProductsNormalStore;
