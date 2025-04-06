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
    empresaScrappingTestPagesApi,
    empresaScrappingTestProductsApi,
    empresaScrappingUpdateApi,
} from "../apis/empresas_scrapping.api";
import AdminHr from "~/components/AdminHr";
import LoaderSubmit from "~/components/LoaderSubmit";
import { useEffect, useState } from "preact/hooks";
import { reactComponent } from "~/libs/preact";
import { formSelectNumber } from "~/components/form/FormSelect";
import { Fragment } from "preact/jsx-runtime";
import Hr from "@/web/components/Hr";

function ScrappingIndex() {
    const empresaScrappingForm = useForm<ScrappingUpdateDto>({
        resolver: valibotVigilio(scrappingUpdateDto),
    });

    const enabledCategories = empresaScrappingForm.watch("enabledCategories");
    const enabledEventClickCategories = empresaScrappingForm.watch(
        "enabledEventClickCategories"
    );
    const enabledEventClickProducts = empresaScrappingForm.watch(
        "enabledEventClickProducts"
    );

    const enabledEventClickNextPage = empresaScrappingForm.watch(
        "enabledEventClickNextPage"
    );

    const enabledProducts = empresaScrappingForm.watch("enabledProducts");
    const categories = empresaScrappingForm.watch("categories");
    const products = empresaScrappingForm.watch("products");
    const productsSsr = empresaScrappingForm.watch("products.ssr.enabled");
    const [categoriasIA, setCategoriasIA] = useState<
        { id: string | null; url: string }[]
    >([]);

    const empresaScrappingUpdateMutation = empresaScrappingUpdateApi();
    const empresaScrappingTestCategoriesMutation =
        empresaScrappingTestCategoriesApi();
    const empresaScrappingTestProductsMutation =
        empresaScrappingTestProductsApi();
    const empresaScrappingTestPagesMutation = empresaScrappingTestPagesApi();

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

    const pagesFieldArry = useFieldArray({
        control: empresaScrappingForm.control,
        name: "pages",
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
                                <div class="flex gap-2">
                                    <button
                                        type="button"
                                        class="bg-black text-white rounded-md text-xs p-2"
                                        onClick={() => {
                                            empresaScrappingForm.setValue(
                                                "categories",
                                                {
                                                    web_url:
                                                        "https://compuvisionperu.pe/CYM/shop-list-ctg.php",
                                                    ssr: true,
                                                    container_element:
                                                        ".widget_categories",
                                                    categoria_url:
                                                        "shop-list-ctg.php?ctg=",
                                                    image_url:
                                                        "../public/iconos",
                                                    categories: [],
                                                    event_click: null,
                                                    card: {
                                                        id: "",
                                                        element: "> li",
                                                        name: "> a > span",
                                                        url: "> a",
                                                        image: null,
                                                    },
                                                }
                                            );
                                        }}
                                    >
                                        <i class="fas fa-text" /> Auto
                                    </button>
                                    <button
                                        type="button"
                                        class="bg-black text-white rounded-md text-xs p-2"
                                        onClick={() => {
                                            sweetModal({
                                                title: "¿Estás seguro que deseas probar categorias?",
                                                isCloseInBackground: false,
                                                showCancelButton: true,
                                            }).then(({ isConfirmed }) => {
                                                if (isConfirmed) {
                                                    empresaScrappingTestCategoriesMutation.mutate(
                                                        {
                                                            categories,
                                                        },
                                                        {
                                                            onSuccess(data) {
                                                                setCategoriasIA(
                                                                    data.data.map(
                                                                        (
                                                                            props
                                                                        ) => ({
                                                                            url: props.url,
                                                                            id:
                                                                                props.id ||
                                                                                null,
                                                                        })
                                                                    )
                                                                );
                                                                sweetModal({
                                                                    html: reactComponent(
                                                                        <div class="overflow-auto">
                                                                            <pre class="dark:text-white font-semibold text-wrap">
                                                                                {JSON.stringify(
                                                                                    data.data,
                                                                                    null,
                                                                                    3
                                                                                )}
                                                                            </pre>
                                                                        </div>
                                                                    ),
                                                                    sweetWidth:
                                                                        "700px",
                                                                    position:
                                                                        "start",
                                                                    showCloseButton:
                                                                        true,
                                                                    isCloseInBackground:
                                                                        true,
                                                                });
                                                            },
                                                            onError(err) {
                                                                sweetAlert({
                                                                    icon: "danger",
                                                                    title: err.message,
                                                                });
                                                            },
                                                        }
                                                    );
                                                }
                                            });
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
                                </div>
                            ) : null}
                        </div>
                    </div>
                    {enabledCategories ? (
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                        <div class="flex gap-2 justify-between items-center">
                            <div class="flex gap-2">
                                <Form.control.toggle
                                    title="Activar"
                                    name={
                                        "enabledProducts" as keyof ScrappingUpdateDto
                                    }
                                />

                                {!productsSsr ? (
                                    <>
                                        <Form.control.toggle
                                            title="Activar Event click"
                                            name={
                                                "enabledEventClickProducts" as keyof ScrappingUpdateDto
                                            }
                                        />
                                        <Form.control.toggle
                                            title="Activar Event next page nossr"
                                            name={
                                                "enabledEventClickNextPage" as keyof ScrappingUpdateDto
                                            }
                                        />
                                    </>
                                ) : null}
                            </div>
                            {categoriasIA.length ? (
                                <div class="flex gap-2">
                                    <button
                                        type="button"
                                        class="bg-black text-white rounded-md text-xs p-2"
                                        onClick={() => {
                                            empresaScrappingForm.setValue(
                                                "enabledEventClickNextPage",
                                                true
                                            );
                                            empresaScrappingForm.setValue(
                                                "products",
                                                {
                                                    web_url: null,
                                                    ssr: {
                                                        enabled: false,
                                                        page_not_found: null,
                                                        query: "page",
                                                    },
                                                    event_click: null,
                                                    next_click: {
                                                        element:
                                                            ".pagination > li:last-child",
                                                        waitElement: "5",
                                                    },
                                                    limit: 12,
                                                    container_element:
                                                        "#content_principal",
                                                    card: {
                                                        element: ".product",
                                                        image: ".product_img > a > img",
                                                        name: ".product_title > a",
                                                        price: ".product_price > span:nth-child(2)",
                                                        quantity: ".rating_num",
                                                        url: ".product_title > a",
                                                    },
                                                    image_url:
                                                        "../public/img/productos",
                                                    product_url:
                                                        "shop-product-detail.php?prod=",
                                                }
                                            );
                                        }}
                                    >
                                        <i class="fas fa-text" /> Auto
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            empresaScrappingTestProductsMutation.mutate(
                                                {
                                                    categories: categoriasIA,
                                                    categoria_url:
                                                        empresaScrappingForm.watch(
                                                            "categories.categoria_url"
                                                        ),
                                                    products,
                                                    web_url:
                                                        empresaScrappingForm.watch(
                                                            "web_url"
                                                        ),
                                                }
                                            );
                                        }}
                                        disabled={
                                            empresaScrappingTestProductsMutation.isLoading ||
                                            false
                                        }
                                    >
                                        {" "}
                                        {empresaScrappingTestProductsMutation.isLoading ? (
                                            <LoaderSubmit />
                                        ) : (
                                            <>
                                                <i class="fas fa-vial" /> Probar
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    {enabledProducts ? (
                        <div class="grid grid-cols-3 gap-2">
                            <Form.control.toggle
                                title="¿Tienes SSR?"
                                name={
                                    "products.ssr.enabled" as keyof ScrappingUpdateDto
                                }
                            />
                            {enabledEventClickProducts && !productsSsr ? (
                                <>
                                    <Form.control
                                        title="Elemento Click products"
                                        name={
                                            "products.event_click.element" as keyof ScrappingUpdateDto
                                        }
                                        ico={<i class="fas fa-link" />}
                                        placeholder=".products-item-button"
                                    />
                                    <Form.control
                                        title="Elemento Waiting click products"
                                        name={
                                            "products.event_click.waitElement" as keyof ScrappingUpdateDto
                                        }
                                        ico={<i class="fas fa-link" />}
                                        placeholder=".products-item-wait ó 3seg"
                                    />
                                </>
                            ) : null}
                            {enabledEventClickNextPage && !productsSsr ? (
                                <>
                                    <Form.control
                                        title="Elemento Click next page products"
                                        name={
                                            "products.next_click.element" as keyof ScrappingUpdateDto
                                        }
                                        ico={<i class="fas fa-link" />}
                                        placeholder=".products-next-button"
                                    />
                                    <Form.control
                                        title="Elemento Waiting click products"
                                        name={
                                            "products.next_click.waitElement" as keyof ScrappingUpdateDto
                                        }
                                        ico={<i class="fas fa-link" />}
                                        placeholder=".products-item-wait ó 3seg"
                                    />
                                </>
                            ) : null}
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
                                    "products.card.name" as keyof ScrappingUpdateDto
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
                    <div class="flex justify-between gap-2">
                        <span class="dark:text-white font-semibold">
                            Páginas
                        </span>
                        <div class="flex gap-2">
                            <button
                                type="button"
                                class="bg-green-600 px-3 text-lg text-white rounded-md font-bold py-1"
                                onClick={() => {
                                    pagesFieldArry.append({
                                        renderer: [],
                                        ssr: true,
                                        web_url: "",
                                    });
                                }}
                                disabled={
                                    empresaScrappingTestCategoriesMutation.isLoading ||
                                    false
                                }
                            >
                                +
                            </button>
                            <button
                                type="button"
                                class="bg-black text-white rounded-md text-xs p-2"
                                onClick={() => {
                                    sweetModal({
                                        title: "¿Estás seguro que deseas probar?",
                                        isCloseInBackground: false,
                                        showCancelButton: true,
                                    }).then(({ isConfirmed }) => {
                                        if (isConfirmed) {
                                            empresaScrappingTestPagesMutation.mutate(
                                                {
                                                    pages: empresaScrappingForm.watch(
                                                        "pages"
                                                    ),
                                                },
                                                {
                                                    onSuccess(data) {
                                                        sweetModal({
                                                            html: reactComponent(
                                                                <div class="overflow-auto">
                                                                    <pre class="dark:text-white font-semibold text-wrap">
                                                                        {JSON.stringify(
                                                                            data.data,
                                                                            null,
                                                                            3
                                                                        )}
                                                                    </pre>
                                                                </div>
                                                            ),
                                                            sweetWidth: "700px",
                                                            position: "start",
                                                            showCloseButton:
                                                                true,
                                                            isCloseInBackground:
                                                                true,
                                                        });
                                                    },
                                                    onError(err) {
                                                        sweetAlert({
                                                            icon: "danger",
                                                            title: err.message,
                                                        });
                                                    },
                                                }
                                            );
                                        }
                                    });
                                }}
                                disabled={
                                    empresaScrappingTestPagesMutation.isLoading ||
                                    false
                                }
                            >
                                {empresaScrappingTestPagesMutation.isLoading ? (
                                    <LoaderSubmit />
                                ) : (
                                    <>
                                        <i class="fas fa-vial" /> Probar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    {pagesFieldArry.fields.map((field, index) => {
                        const rendererFieldArry = useFieldArray({
                            control: empresaScrappingForm.control,
                            name: `pages.${index}.renderer`,
                        });
                        const [isShow, setIsShow] = useState(false);
                        return (
                            <div
                                class="flex items-center gap-2 flex-col"
                                key={field.id}
                            >
                                <div class="flex items-center gap-2 w-full">
                                    {" "}
                                    <Form.control
                                        title="Web Url"
                                        name={
                                            `pages.${index}.web_url` as keyof ScrappingUpdateDto
                                        }
                                        placeholder="https://www.tu-web.com"
                                    />
                                    <Form.control.toggle
                                        title="¿Es SSR?"
                                        name={
                                            `pages.${index}.ssr` as keyof ScrappingUpdateDto
                                        }
                                    />{" "}
                                    <div className="flex gap-2 items-center">
                                        <button
                                            type="button"
                                            class="bg-green-600 px-3 text-lg text-white rounded-md font-bold py-1 mt-2 flex items-center"
                                            onClick={() => {
                                                setIsShow(true);
                                                rendererFieldArry.append({
                                                    container_element: "",
                                                    title: "",
                                                    when: "",
                                                    event: {
                                                        data: [],
                                                        element: "",
                                                        max_length: null,
                                                    },
                                                });
                                            }}
                                        >
                                            +{"  "}{" "}
                                            <i class="fas fa-code text-xs" />
                                        </button>
                                        <button
                                            type="button"
                                            class=" px-3 text-lg text-white rounded-md font-bold py-1 mt-2 flex items-center "
                                            onClick={() => {
                                                setIsShow(!isShow);
                                            }}
                                        >
                                            <i
                                                class={`fas ${
                                                    isShow
                                                        ? "fa-chevron-circle-up"
                                                        : "fa-chevron-circle-down"
                                                } `}
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            class="bg-red-600 px-3 text-lg text-white rounded-md font-bold py-1 mt-2"
                                            onClick={() => {
                                                sweetModal({
                                                    title: "Estas seguro de eliminar?",
                                                    showCancelButton: true,
                                                    isCloseInBackground: false,
                                                }).then(({ isConfirmed }) => {
                                                    if (isConfirmed) {
                                                        pagesFieldArry.remove(
                                                            index
                                                        );
                                                    }
                                                });
                                            }}
                                        >
                                            <i class="fas fa-trash" />
                                        </button>
                                    </div>
                                </div>
                                <div
                                    class={`grid grid-cols-2  gap-2 w-full ${
                                        isShow
                                            ? "max-h-[300px] overflow-auto "
                                            : "max-h-0 overflow-hidden"
                                    } delay-custom-1 `}
                                >
                                    {rendererFieldArry.fields.map(
                                        (_, index2) => {
                                            const dataFieldArry3 =
                                                useFieldArray({
                                                    control:
                                                        empresaScrappingForm.control,
                                                    name: `pages.${index}.renderer.${index2}.event.data`,
                                                });
                                            const [isShow, setIsShow] =
                                                useState(true);
                                            return (
                                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                                <Fragment key={index2}>
                                                    {" "}
                                                    <Form.control
                                                        title="Titulo"
                                                        name={
                                                            `pages.${index}.renderer.${index2}.title` as keyof ScrappingUpdateDto
                                                        }
                                                        placeholder="Titulo"
                                                    />{" "}
                                                    <Form.control
                                                        title="Cuando preguntes a la I.A? responderá?"
                                                        name={
                                                            `pages.${index}.renderer.${index2}.when` as keyof ScrappingUpdateDto
                                                        }
                                                        placeholder="cuando te pregunte sobre.."
                                                    />
                                                    <Form.control
                                                        title="Container Element"
                                                        name={
                                                            `pages.${index}.renderer.${index2}.container_element` as keyof ScrappingUpdateDto
                                                        }
                                                        placeholder=".container-element"
                                                    />
                                                    <div />
                                                    <Form.control
                                                        title="Elemento"
                                                        name={
                                                            `pages.${index}.renderer.${index2}.event.element` as keyof ScrappingUpdateDto
                                                        }
                                                        placeholder=".elemento"
                                                        question="Si se deja vacio, tomará será el padre"
                                                    />
                                                    <div class="flex gap-2 items-center">
                                                        <Form.control
                                                            title="Elemento"
                                                            name={
                                                                `pages.${index}.renderer.${index2}.event.max_length` as keyof ScrappingUpdateDto
                                                            }
                                                            type="number"
                                                            options={{
                                                                setValueAs:
                                                                    formSelectNumber,
                                                            }}
                                                            placeholder="12"
                                                            question="Este campo no es obligatorio, limita la cantidad, no es obligatorio"
                                                        />{" "}
                                                        <button
                                                            type="button"
                                                            class="bg-green-600 px-3 text-lg text-white rounded-md font-bold py-1 mt-2 flex items-center"
                                                            onClick={() => {
                                                                setIsShow(true);
                                                                dataFieldArry3.append(
                                                                    {
                                                                        attr: "attr:src",
                                                                        element:
                                                                            "",
                                                                        isContainElement:
                                                                            false,
                                                                        key: "nombre",
                                                                        reduce_url:
                                                                            null,
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            + <br />
                                                            <span class="text-xs">
                                                                Atributos
                                                            </span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            class=" px-3 text-lg text-white rounded-md font-bold py-1 mt-2 flex items-center "
                                                            onClick={() => {
                                                                setIsShow(
                                                                    !isShow
                                                                );
                                                            }}
                                                        >
                                                            <i
                                                                class={`fas ${
                                                                    isShow
                                                                        ? "fa-chevron-circle-up"
                                                                        : "fa-chevron-circle-down"
                                                                } `}
                                                            />
                                                        </button>{" "}
                                                        <button
                                                            type="button"
                                                            class="bg-red-600 px-3 text-lg text-white rounded-md font-bold py-1 mt-2 flex items-center"
                                                            onClick={() => {
                                                                sweetModal({
                                                                    title: "Estas seguro de eliminar?",
                                                                    showCancelButton:
                                                                        true,
                                                                    isCloseInBackground:
                                                                        false,
                                                                }).then(
                                                                    ({
                                                                        isConfirmed,
                                                                    }) => {
                                                                        if (
                                                                            isConfirmed
                                                                        ) {
                                                                            rendererFieldArry.remove(
                                                                                index2
                                                                            );
                                                                        }
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            <i class="fas fa-trash" />
                                                        </button>
                                                    </div>
                                                    {dataFieldArry3.fields.map(
                                                        (f, index3) => {
                                                            return (
                                                                <div
                                                                    key={f.id}
                                                                    class={`grid grid-cols-3 items-center gap-2 ${
                                                                        isShow
                                                                            ? "max-h-[300px] overflow-auto"
                                                                            : "max-h-0 overflow-hidden"
                                                                    } delay-custom-1 `}
                                                                >
                                                                    <Form.control
                                                                        title="Key"
                                                                        name={
                                                                            `pages.${index}.renderer.${index2}.event.data.${index3}.key` as keyof ScrappingUpdateDto
                                                                        }
                                                                        options={{
                                                                            setValueAs:
                                                                                formSelectNumber,
                                                                        }}
                                                                        placeholder="Nombre, precio,etc"
                                                                    />
                                                                    <Form.control
                                                                        title="Elemento"
                                                                        name={
                                                                            `pages.${index}.renderer.${index2}.event.data.${index3}.element` as keyof ScrappingUpdateDto
                                                                        }
                                                                        placeholder=".elemento"
                                                                    />
                                                                    <Form.control
                                                                        title="Attributo"
                                                                        name={
                                                                            `pages.${index}.renderer.${index2}.event.data.${index3}.attr` as keyof ScrappingUpdateDto
                                                                        }
                                                                        options={{
                                                                            setValueAs:
                                                                                formSelectNumber,
                                                                        }}
                                                                        placeholder="Nombre, precio,etc"
                                                                    />
                                                                    <Form.control.toggle
                                                                        title="¿Tomar el elemento cotenido?"
                                                                        name={
                                                                            `pages.${index}.renderer.${index2}.event.data.${index3}.isContainElement` as keyof ScrappingUpdateDto
                                                                        }
                                                                    />
                                                                    <Form.control
                                                                        title="Reducir elemento"
                                                                        name={
                                                                            `pages.${index}.renderer.${index2}.event.data.${index3}.reduce_url` as keyof ScrappingUpdateDto
                                                                        }
                                                                        placeholder="https://..web.com/.."
                                                                    />{" "}
                                                                    <button
                                                                        type="button"
                                                                        class="bg-red-600 px-3 text-lg text-white rounded-md font-bold py-1 mt-2 flex  justify-center items-center"
                                                                        onClick={() => {
                                                                            sweetModal(
                                                                                {
                                                                                    title: "Estas seguro de eliminar?",
                                                                                    showCancelButton:
                                                                                        true,
                                                                                    isCloseInBackground:
                                                                                        false,
                                                                                }
                                                                            ).then(
                                                                                ({
                                                                                    isConfirmed,
                                                                                }) => {
                                                                                    if (
                                                                                        isConfirmed
                                                                                    ) {
                                                                                        dataFieldArry3.remove(
                                                                                            index3
                                                                                        );
                                                                                    }
                                                                                }
                                                                            );
                                                                        }}
                                                                        disabled={
                                                                            empresaScrappingTestCategoriesMutation.isLoading ||
                                                                            false
                                                                        }
                                                                    >
                                                                        <i class="fas fa-trash" />
                                                                    </button>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                    {dataFieldArry3.fields
                                                        .length %
                                                        2 ===
                                                    0 ? null : (
                                                        <div />
                                                    )}
                                                    <Hr />
                                                    <Hr />
                                                </Fragment>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        );
                    })}
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
