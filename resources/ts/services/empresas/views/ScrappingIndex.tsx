import Form from "~/components/form";
import {
    scrappingUpdateDto,
    ScrappingUpdateDto,
} from "../dtos/scrapping.update.dto";
import { useFieldArray, useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import {
    empresaScrappingTestCategoriesApi,
    empresaScrappingUpdateApi,
} from "../apis/empresas_scrapping.api";
import AdminHr from "~/components/AdminHr";
import LoaderSubmit from "~/components/LoaderSubmit";
import { useEffect } from "preact/hooks";

function ScrappingIndex() {
    const empresaScrappingForm = useForm<ScrappingUpdateDto>({
        resolver: valibotVigilio(scrappingUpdateDto),
    });

    const enabledCategories = empresaScrappingForm.watch("enabledCategories");
    const enabledEventClickCategories = empresaScrappingForm.watch(
        "enabledEventClickCategories"
    );
    const categoriesEventClick = empresaScrappingForm.watch(
        "categories.event_click"
    );
    const enabledProducts = empresaScrappingForm.watch("enabledProducts");
    const categories = empresaScrappingForm.watch("categories");
    const empresaScrappingUpdateMutation = empresaScrappingUpdateApi();
    const empresaScrappingTestCategoriesMutation =
        empresaScrappingTestCategoriesApi();

    function onUpdateScrapping(data: ScrappingUpdateDto) {
        sweetModal({
            title: "¿Estás seguro de realizar estos cambios?",
            customIcon:
                "<i class='fas fa-user-robot text-3xl dark:text-white' ></i>",
            isCloseInBackground: false,
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                empresaScrappingUpdateMutation.mutate(data, {
                    onSuccess(data) {
                        sweetAlert({
                            icon: "success",
                            title: data.message,
                        });
                    },
                    onError(error) {
                        handlerError(empresaScrappingForm, error);
                    },
                });
            }
        });
    }

    useEffect(() => {
        if (!enabledEventClickCategories) {
            empresaScrappingForm.setValue("categories.event_click", null);
        }
    }, [enabledEventClickCategories]);

    const instructions = useFieldArray({
        control: empresaScrappingForm.control,
        name: "inteligenceArtificial.instructions" as never,
    });
    return (
        <>
            <h2 class="dark:text-white text-primary text-xl font-semibold">
                Web Información I.A
            </h2>
            <br />
            <Form
                className=" max-w-6xl"
                {...empresaScrappingForm}
                onSubmit={onUpdateScrapping}
            >
                <div class="grid grid-cols-2 gap-2">
                    <Form.control
                        title="Web Url"
                        ico={<i class="fas fa-globe" />}
                        name={"web_url" as keyof ScrappingUpdateDto}
                        placeholder="https://www.tu-web.com"
                    />
                    <Form.control
                        type="number"
                        title="Horas de actualización I.A"
                        name={"hours" as keyof ScrappingUpdateDto}
                        placeholder="12"
                        ico={<i class="fas fa-clock" />}
                        question="Horas para que la I.A actualize su información."
                        options={{ setValueAs: Number }}
                    />
                </div>
                <div>
                    <div class="flex gap-2  justify-between flex-col">
                        <span class="dark:text-white font-semibold">
                            Categorias
                        </span>
                        <div class="flex gap-2 items-center justify-between">
                            <div class="flex gap-2 items-center">
                                <Form.control.toggle
                                    title="Activar"
                                    name={
                                        "enabledCategories" as keyof ScrappingUpdateDto
                                    }
                                />
                                <Form.control.toggle
                                    title="Activar Evento Click"
                                    name={
                                        "enabledEventClickCategories" as keyof ScrappingUpdateDto
                                    }
                                />
                            </div>
                            {enabledCategories ? (
                                <button
                                    type="button"
                                    class="bg-black text-white rounded-md text-xs p-1"
                                    onClick={() => {
                                        empresaScrappingTestCategoriesMutation.mutate(
                                            {
                                                categories,
                                            }
                                        );
                                    }}
                                    disabled={
                                        empresaScrappingTestCategoriesMutation.isLoading ||
                                        false
                                    }
                                >
                                    {empresaScrappingTestCategoriesMutation.isLoading ? (
                                        <LoaderSubmit />
                                    ) : (
                                        <>
                                            <i class="fas fa-vial" /> Probar
                                        </>
                                    )}
                                </button>
                            ) : null}
                        </div>
                    </div>
                    {enabledCategories ? (
                        <div class="grid grid-cols-3 gap-2">
                            <Form.control
                                title="Categorías Web Url"
                                name={
                                    "categories.web_url" as keyof ScrappingUpdateDto
                                }
                                ico={<i class="fas fa-globe" />}
                                placeholder="https://www.tu-web.com"
                            />
                            <Form.control.toggle
                                title="¿Tienes SSR?"
                                name={
                                    "categories.ssr" as keyof ScrappingUpdateDto
                                }
                                question={
                                    <div>
                                        ¿La web tiene ssr? <br />
                                    </div>
                                }
                            />
                            <Form.control
                                title="Contenido Elemento"
                                name={
                                    "categories.container_element" as keyof ScrappingUpdateDto
                                }
                                ico={<i class="fas fa-code" />}
                                placeholder=".container-element"
                                question="Contenedor principal HTML clase, id,etc"
                            />
                            <Form.control
                                title="URL de la imagen categoria"
                                name={
                                    "categories.image_url" as keyof ScrappingUpdateDto
                                }
                                ico={<i class="fas fa-link" />}
                                placeholder="/images/category"
                                question="Url Imagen"
                            />
                            <Form.control
                                title="URL del link categoria"
                                name={
                                    "categories.categoria_url" as keyof ScrappingUpdateDto
                                }
                                ico={<i class="fas fa-link" />}
                                placeholder="/category"
                                question="Url Imagen"
                            />
                            <div />
                            {/*  */}
                            <Form.control
                                title="Elemento categoria ID - NO OBLIGATORIO"
                                name={
                                    "categories.card.id" as keyof ScrappingUpdateDto
                                }
                                ico={<i class="fas fa-link" />}
                                placeholder=".category-id"
                                question="categoria id HTML clase, id,etc"
                            />
                            <Form.control
                                title="Elemento categoria item"
                                name={
                                    "categories.card.element" as keyof ScrappingUpdateDto
                                }
                                ico={<i class="fas fa-link" />}
                                placeholder=".category-item"
                                question="categoria id HTML clase, id,etc"
                            />
                            <Form.control
                                title="Elemento categoria item nombre"
                                name={
                                    "categories.card.name" as keyof ScrappingUpdateDto
                                }
                                ico={<i class="fas fa-link" />}
                                placeholder=".category-item-name"
                                question="categoria nombre HTML clase, id,etc"
                            />
                            <Form.control
                                title="Elemento categoria item url (href)"
                                name={
                                    "categories.card.url" as keyof ScrappingUpdateDto
                                }
                                ico={<i class="fas fa-link" />}
                                placeholder=".category-item-url"
                                question="categoria url HTML clase, id,etc"
                            />
                            <Form.control
                                title="Elemento categoria item image (src) - NO OBLIGATORIO"
                                name={
                                    "categories.card.image" as keyof ScrappingUpdateDto
                                }
                                ico={<i class="fas fa-link" />}
                                placeholder=".category-item-image"
                                question="categoria image HTML clase, id,etc"
                            />
                            {enabledEventClickCategories ? (
                                <>
                                    <Form.control
                                        title="Elemento Click"
                                        name={
                                            "categories.event_click.element" as keyof ScrappingUpdateDto
                                        }
                                        ico={<i class="fas fa-link" />}
                                        placeholder=".category-item-button"
                                    />
                                    <Form.control
                                        title="Elemento Waiting click"
                                        name={
                                            "categories.event_click.waitElement" as keyof ScrappingUpdateDto
                                        }
                                        ico={<i class="fas fa-link" />}
                                        placeholder=".category-item-wait ó 3seg"
                                    />
                                </>
                            ) : null}
                        </div>
                    ) : null}
                </div>
                <div>
                    <div class="flex gap-2  justify-between flex-col">
                        <span class="dark:text-white font-semibold">
                            Productos
                        </span>
                        <Form.control.toggle
                            title="Activar"
                            name={"enabledProducts" as keyof ScrappingUpdateDto}
                        />
                    </div>
                    {enabledProducts ? (
                        <div class="grid grid-cols-3 gap-2">
                            <Form.control.toggle
                                title="¿Tienes SSR?"
                                name={
                                    "products.ssr.page_not_found" as keyof ScrappingUpdateDto
                                }
                            />
                            <Form.control
                                title="Products Web Url NO SSR"
                                name={
                                    "products.web_url" as keyof ScrappingUpdateDto
                                }
                                ico={<i class="fas fa-globe" />}
                                placeholder="/products"
                                question="No es necesario para webs  SSR"
                            />
                            <Form.control
                                title="Elemento PAGE404"
                                name={
                                    "products.ssr.page_not_found" as keyof ScrappingUpdateDto
                                }
                                ico={<i class="fas fa-code" />}
                                placeholder=".page-no-found"
                                question="Elemento id,clase,atributo html si encuentra pagian 404"
                            />
                            <Form.control
                                title="Query title"
                                name={
                                    "products.ssr.query" as keyof ScrappingUpdateDto
                                }
                                placeholder="page"
                                question="Query de la WEB ?page=3"
                            />
                            <Form.control
                                title="Productos Contenido Elemento"
                                name={
                                    "products.container_element" as keyof ScrappingUpdateDto
                                }
                                ico={<i class="fas fa-code" />}
                                placeholder=".container-element"
                                question="Contenedor principal HTML clase, id,etc"
                            />{" "}
                            <Form.control
                                title="URL de la imagen productos"
                                name={
                                    "products.image_url" as keyof ScrappingUpdateDto
                                }
                                ico={<i class="fas fa-link" />}
                                placeholder="/images/"
                                question="Url Imagen"
                            />
                            <Form.control
                                title="URL del link producto"
                                name={
                                    "products.product_url" as keyof ScrappingUpdateDto
                                }
                                ico={<i class="fas fa-link" />}
                                placeholder="/product/.."
                                question="Url LINK, vacio = por defecto url"
                            />
                            <Form.control
                                title="Limite de productos por pagina"
                                name={
                                    "products.limit" as keyof ScrappingUpdateDto
                                }
                                placeholder="12"
                                question="Cuantos productos ves por página"
                            />
                            <div />
                            <Form.control
                                title="Elemento de cada Producto"
                                ico={<i class="fas fa-code" />}
                                name={
                                    "products.card.element" as keyof ScrappingUpdateDto
                                }
                                placeholder=".product-card"
                            />
                            <Form.control
                                title="Elemento Nombre del producto"
                                ico={<i class="fas fa-code" />}
                                name={
                                    "products.card.element" as keyof ScrappingUpdateDto
                                }
                                placeholder=".product-card-name"
                            />
                            <Form.control
                                title="Elemento precio del producto"
                                ico={<i class="fas fa-code" />}
                                name={
                                    "products.card.price" as keyof ScrappingUpdateDto
                                }
                                placeholder=".product-card-price. No es obligatorio"
                            />
                            <Form.control
                                title="Elemento precio del producto"
                                ico={<i class="fas fa-code" />}
                                name={
                                    "products.card.quantity" as keyof ScrappingUpdateDto
                                }
                                placeholder=".product-card-quantity. No es obligatorio"
                            />
                            <Form.control
                                title="Elemento precio del producto (src)"
                                ico={<i class="fas fa-code" />}
                                name={
                                    "products.card.image" as keyof ScrappingUpdateDto
                                }
                                placeholder=".product-card-image. No es obligatorio"
                            />
                            <Form.control
                                title="Elemento precio del producto (href)"
                                ico={<i class="fas fa-code" />}
                                name={
                                    "products.card.url" as keyof ScrappingUpdateDto
                                }
                                placeholder=".product-card-url. No es obligatorio"
                            />
                        </div>
                    ) : null}
                </div>
                <div>
                    <span class="dark:text-white font-semibold">Páginas</span>
                    <div class="grid grid-cols-2 gap-2">
                        <Form.control
                            title="Web Url"
                            name={"web_url" as keyof ScrappingUpdateDto}
                            placeholder="https://www.tu-web.com"
                        />
                        <Form.control
                            type="number"
                            title="Horas de actualización I.A"
                            name={"hours" as keyof ScrappingUpdateDto}
                            placeholder="12"
                            question="Horas para que la I.A actualize su información."
                            options={{ setValueAs: Number }}
                        />
                    </div>
                </div>
                <AdminHr />
                <Form.button.submit
                    title="Guardar Cambios"
                    ico={null}
                    isLoading={
                        empresaScrappingUpdateMutation.isLoading || false
                    }
                    disabled={empresaScrappingUpdateMutation.isLoading || false}
                />
            </Form>
        </>
    );
}

export default ScrappingIndex;
