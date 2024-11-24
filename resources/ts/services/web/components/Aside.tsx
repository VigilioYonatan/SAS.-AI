import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import { useEffect } from "preact/hooks";
import type { UseDropdown } from "~/hooks/useDropdown";
import type { HeaderType } from "./WebLayout";
import useDropdown from "~/hooks/useDropdown";
import useAuthStore from "@/auth/stores/auth.store";
import { printFileUser } from "@/users/libs/helpers";
import LogoImage from "~/components/LogoImage";
import { isActive } from "~/libs/helpers";
import { BrandsSchema } from "@/products/schemas/brands.schema";

interface AsideProps {
    headerDropdown: UseDropdown;
    categories: HeaderType["categories"];
    categoriesServices: HeaderType["categoriesServices"];
    brands: Pick<BrandsSchema, "id" | "name" | "image" | "slug">[];
}
function Aside({
    headerDropdown,
    categories,
    categoriesServices,
    brands,
}: AsideProps) {
    const empresaStore = useEmpresastore();
    const authStore = useAuthStore();
    useEffect(() => {
        document.body.classList.toggle(
            "overflow-hidden",
            headerDropdown.dropdownOpen
        );
    }, [headerDropdown.dropdownOpen]);
    return (
        <aside
            class={`fixed lg:hidden overflow-hidden delay-custom-1 inset-0 bg-black bg-opacity-70 z-[999] ${
                headerDropdown.dropdownOpen ? "visible" : "invisible"
            }`}
        >
            <div
                class={`w-full md:w-[350px] shadow-md bg-background-light dark:bg-background-dark h-full delay-custom-1 relative ${
                    headerDropdown.dropdownOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                } overflow-hidden flex flex-col gap-4 `}
                ref={headerDropdown.dropdown}
            >
                <div class="flex justify-between px-4 py-2 items-center">
                    <LogoImage
                        width={storageEmpresa?.setting.logo_width}
                        height="60"
                    />
                    <span
                        class="text-2xl dark:text-white    text-end block"
                        onClick={() => headerDropdown.onClose()}
                    >
                        <i class="far fa-times" />
                    </span>
                </div>
                {/* <div class="mx-4">
					<SearchProducts />
				</div> */}
                <nav class="flex flex-col max-h-[500px] overflow-auto">
                    {storageEmpresa?.setting.header.home ? (
                        <a
                            class={` dark:text-white text-sm hover:bg-paper-light ${
                                isActive("/", false)
                                    ? "bg-background-light dark:bg-paper-dark"
                                    : ""
                            } py-2  px-4   dark:hover:bg-paper-dark tracking-wide font-semibold flex items-center gap-2`}
                            href={"/"}
                        >
                            <i
                                class={`fa${
                                    storageEmpresa?.setting.type_icons_bars ===
                                    "normal"
                                        ? "s"
                                        : "r"
                                } fa-home`}
                            />{" "}
                            Inicio
                        </a>
                    ) : null}
                    {storageEmpresa?.setting.header.shop ? (
                        <a
                            class={` dark:text-white   text-sm hover:bg-paper-light   flex gap-2 items-center dark:hover:dark:bg-paper-dark tracking-wide px-4 py-2  font-semibold ${
                                isActive("/shop", false)
                                    ? "bg-background-light dark:bg-paper-dark"
                                    : ""
                            }`}
                            href={"/shop"}
                        >
                            <i
                                class={`fa${
                                    storageEmpresa?.setting.type_icons_bars ===
                                    "normal"
                                        ? "s"
                                        : "r"
                                } fa-store`}
                            />{" "}
                            Tienda
                        </a>
                    ) : null}
                    {storageEmpresa?.setting.shows.about &&
                    storageEmpresa?.setting.header.about ? (
                        <a
                            class={` flex gap-2 items-center dark:text-white text-sm hover:bg-paper-light hover:dark:bg-paper-dark py-2  px-4    tracking-wide font-semibold ${
                                isActive("/nosotros")
                                    ? "bg-background-light dark:bg-paper-dark"
                                    : ""
                            }`}
                            href={"/nosotros"}
                        >
                            <i
                                class={`fa${
                                    storageEmpresa?.setting.type_icons_bars ===
                                    "normal"
                                        ? "s"
                                        : "r"
                                } fa-users`}
                            />{" "}
                            Nosotros
                        </a>
                    ) : null}
                    {storageEmpresa?.setting.header.categories ? (
                        <div class="">
                            {categories.map((category) => (
                                <button
                                    type="button"
                                    onClick={() => {}}
                                    // href={`/tienda/${family.slug}`}

                                    class={`flex gap-2 items-center justify-between  hover:bg-paper-light hover:dark:bg-paper-dark  w-full rounded-md px-4 py-2  tracking-wide ${
                                        isActive(`/shop/${category.slug}`)
                                            ? "bg-background-light dark:bg-paper-dark"
                                            : ""
                                    }`}
                                    key={category.id}
                                >
                                    <div class="flex gap-3 items-center justify-between w-full  font-semibold dark:text-white">
                                        <a
                                            href={`/shop/${category.slug}`}
                                            class="flex items-center gap-2 w-full"
                                        >
                                            {category.icon ? (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: category.icon,
                                                    }}
                                                />
                                            ) : null}

                                            <span class="text-sm">
                                                {category.name}
                                            </span>
                                        </a>
                                        {(() => {
                                            const dropdown = useDropdown();
                                            return (
                                                <>
                                                    {category.subcategories
                                                        .length &&
                                                    storageEmpresa?.setting
                                                        .is_subcategory ? (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                dropdown.onOpen();
                                                            }}
                                                        >
                                                            <i class="far fa-chevron-right" />
                                                            <div
                                                                class={`${
                                                                    dropdown.dropdownOpen
                                                                        ? "visible translate-x-0"
                                                                        : "invisible translate-x-full"
                                                                } delay-custom-1  absolute inset-0 bg-white dark:bg-paper-dark`}
                                                            >
                                                                <span
                                                                    class="text-2xl dark:text-principal-light text-principal-dark px-4 py-2  text-end block"
                                                                    onClick={() => {
                                                                        dropdown.onClose();
                                                                    }}
                                                                >
                                                                    <i class="far fa-times" />
                                                                </span>
                                                                <div class="flex flex-col gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            dropdown.onClose();
                                                                        }}
                                                                        class="self-start px-6"
                                                                    >
                                                                        <i class="fas fa-long-arrow-left" />
                                                                    </button>
                                                                    <div class="flex flex-col   w-full  font-semibold dark:text-principal-light">
                                                                        <span class="self-start text-sm font-bold  py-3  w-full  px-6 text-start">
                                                                            {
                                                                                category.name
                                                                            }
                                                                        </span>
                                                                        {category.subcategories.map(
                                                                            (
                                                                                subcategory
                                                                            ) => (
                                                                                <div
                                                                                    class="flex gap-2 items-center   py-3   px-6  hover:bg-paper-light  dark:hover:bg-paper-dark"
                                                                                    key={
                                                                                        subcategory.id
                                                                                    }
                                                                                >
                                                                                    <a
                                                                                        href={`/shop/${category.slug}/${subcategory.slug}`}
                                                                                        class="self-start text-sm font-semibold text-start  w-full "
                                                                                        key={
                                                                                            subcategory.id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            subcategory.name
                                                                                        }
                                                                                    </a>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ) : null}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : null}
                    {/* CATEGORIAS */}
                    {categoriesServices.length &&
                    storageEmpresa?.setting.header.services ? (
                        <>
                            {categoriesServices.map((servicio) => (
                                <div
                                    class="px-4 py-2 flex gap-2 items-center  justify-between"
                                    key={servicio.id}
                                >
                                    <div
                                        class={` dark:text-white text-sm hover:bg-paper-light   flex gap-2 items-center dark:hover:dark:bg-paper-dark tracking-wide   font-semibold ${
                                            isActive("/shop", false)
                                                ? "bg-background-light dark:bg-paper-dark"
                                                : ""
                                        }`}
                                    >
                                        {servicio.icon ? (
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: servicio.icon,
                                                }}
                                            />
                                        ) : null}

                                        {servicio.name}
                                    </div>
                                    {(() => {
                                        const dropdown = useDropdown();
                                        return (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        dropdown.onOpen();
                                                    }}
                                                    class=" dark:text-white "
                                                >
                                                    <i class="far fa-chevron-right" />
                                                    <div
                                                        class={`${
                                                            dropdown.dropdownOpen
                                                                ? "visible translate-x-0"
                                                                : "invisible translate-x-full"
                                                        } delay-custom-1  absolute inset-0 bg-background-light  dark:dark:bg-paper-dark`}
                                                    >
                                                        <span
                                                            class="text-2xl dark:text-white  px-4 py-2  text-end block"
                                                            onClick={() => {
                                                                dropdown.onClose();
                                                            }}
                                                        >
                                                            <i class="far fa-times" />
                                                        </span>
                                                        <div class="flex flex-col gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    dropdown.onClose();
                                                                }}
                                                                class="self-start px-6 dark:text-white"
                                                            >
                                                                <i class="fas fa-long-arrow-left" />
                                                            </button>
                                                            <div class="flex flex-col   w-full  font-semibold dark:text-white">
                                                                {servicio.products.map(
                                                                    (
                                                                        product
                                                                    ) => (
                                                                        <a
                                                                            key={
                                                                                product.id
                                                                            }
                                                                            href={`/servicio/${product.slug}`}
                                                                            class="self-start text-sm  font-semibold py-3   px-6 text-start hover:bg-paper-light w-full   dark:hover:text-primary"
                                                                        >
                                                                            {
                                                                                product.name
                                                                            }
                                                                        </a>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            </>
                                        );
                                    })()}
                                </div>
                            ))}
                        </>
                    ) : null}
                    {brands.length ? (
                        <div class="px-4 py-2 flex gap-2 items-center  justify-between">
                            <div
                                class={` dark:text-white text-sm hover:bg-paper-light   flex gap-2 items-center dark:hover:dark:bg-paper-dark tracking-wide   font-semibold ${
                                    isActive("/shop", false)
                                        ? "bg-background-light dark:bg-paper-dark"
                                        : ""
                                }`}
                            >
                                <i class="fa-solid fa-tag" /> Marcas
                            </div>
                            {(() => {
                                const dropdown = useDropdown();
                                return (
                                    <>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dropdown.onOpen();
                                            }}
                                            class=" dark:text-white "
                                        >
                                            <i class="far fa-chevron-right" />
                                            <div
                                                class={`${
                                                    dropdown.dropdownOpen
                                                        ? "visible translate-x-0"
                                                        : "invisible translate-x-full"
                                                } delay-custom-1  absolute inset-0 bg-background-light  dark:dark:bg-paper-dark`}
                                            >
                                                <span
                                                    class="text-2xl dark:text-white  px-4 py-2  text-end block"
                                                    onClick={() => {
                                                        dropdown.onClose();
                                                    }}
                                                >
                                                    <i class="far fa-times" />
                                                </span>
                                                <div class="flex flex-col gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            dropdown.onClose();
                                                        }}
                                                        class="self-start px-6 dark:text-white"
                                                    >
                                                        <i class="fas fa-long-arrow-left" />
                                                    </button>
                                                    <div class="flex flex-col   w-full  font-semibold dark:text-white">
                                                        {brands.map((brand) => (
                                                            <a
                                                                key={brand.id}
                                                                href={`/marcas/${brand.slug}`}
                                                                class="self-start text-sm  font-semibold py-3   px-6 text-start hover:bg-paper-light w-full   dark:hover:text-primary"
                                                            >
                                                                {brand.name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </>
                                );
                            })()}
                        </div>
                    ) : null}
                    {authStore.state! ? (
                        <div class="px-4 py-2 flex gap-2 items-center  justify-between">
                            <div class="flex gap-2  items-center">
                                <img
                                    width={100}
                                    height={100}
                                    class="w-[40px] h-[40px] rounded-full"
                                    src={
                                        printFileUser(
                                            authStore.state!.photo,
                                            100
                                        )[0]
                                    }
                                    alt={authStore.state!.name}
                                />
                                <span class=" dark:text-white ">
                                    Hola <b>{authStore.state.username}</b>
                                </span>
                            </div>
                            {(() => {
                                const dropdown = useDropdown();
                                return (
                                    <>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dropdown.onOpen();
                                            }}
                                            class=" dark:text-white "
                                        >
                                            <i class="far fa-chevron-right" />
                                            <div
                                                class={`${
                                                    dropdown.dropdownOpen
                                                        ? "visible translate-x-0"
                                                        : "invisible translate-x-full"
                                                } delay-custom-1  absolute inset-0 bg-background-light  dark:dark:bg-paper-dark`}
                                            >
                                                <span
                                                    class="text-2xl dark:text-white  px-4 py-2  text-end block"
                                                    onClick={() => {
                                                        dropdown.onClose();
                                                    }}
                                                >
                                                    <i class="far fa-times" />
                                                </span>
                                                <div class="flex flex-col gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            dropdown.onClose();
                                                        }}
                                                        class="self-start px-6 dark:text-white"
                                                    >
                                                        <i class="fas fa-long-arrow-left" />
                                                    </button>
                                                    <div class="flex flex-col   w-full  font-semibold dark:text-white">
                                                        {authStore.guards.permissionAdminGuard() ? (
                                                            <a
                                                                href={"/admin"}
                                                                class="self-start text-sm  font-semibold py-3   px-6 text-start hover:bg-paper-light w-full   dark:hover:text-primary"
                                                            >
                                                                Ir a
                                                                administrador
                                                            </a>
                                                        ) : null}

                                                        <a
                                                            href={
                                                                "/auth/logout"
                                                            }
                                                            class="self-start text-sm font-semibold py-3   px-6 text-start  hover:bg-paper-light w-full   dark:hover:text-primary "
                                                        >
                                                            <i
                                                                class={`fa${
                                                                    storageEmpresa
                                                                        ?.setting
                                                                        .type_icons_bars ===
                                                                    "normal"
                                                                        ? "s"
                                                                        : "r"
                                                                } fa-right-from-bracket`}
                                                            />{" "}
                                                            Cerrar Sessión
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </>
                                );
                            })()}
                        </div>
                    ) : (
                        <a
                            class=" dark:text-white text-sm hover:bg-background-light px-4 py-2  flex gap-3 items-center font-semibold dark:hover:dark:bg-paper-dark tracking-wide"
                            href={"/auth/login"}
                        >
                            <i
                                class={`fa${
                                    storageEmpresa?.setting.type_icons_bars ===
                                    "normal"
                                        ? "s"
                                        : "r"
                                } fa-user-alt`}
                            />{" "}
                            Iniciar Sesión
                        </a>
                    )}
                </nav>{" "}
                <a
                    class="text-xl font-semibold px-4 gap-2 items-center flex tracking-wider  dark:text-white  py-4  absolute bottom-0 right-0 left-0 border-t-[1px] border-primary w-full "
                    href={`https://wa.me/${empresaStore.state!.telephoneFirst}`}
                >
                    <i class="fab fa-whatsapp" />+
                    {empresaStore.state!.dial_code}{" "}
                    {empresaStore.state!.telephoneFirst.replace(
                        /(\d{3})(\d{3})(\d{3})/,
                        "$1 $2 $3"
                    )}
                </a>
            </div>
        </aside>
    );
}

export default Aside;
