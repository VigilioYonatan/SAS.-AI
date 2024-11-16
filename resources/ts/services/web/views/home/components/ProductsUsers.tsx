import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import ProductCard from "@/web/components/product";
import TitleSectionTwo from "@/web/components/TitleSectionTwo";
import { Fragment } from "preact/jsx-runtime";
import enviroments from "~/config";

interface ProductsUsersProps {
    productsmostreactionmapped:
        | (ProductsNormalSchemaFromServer & { favoritescount: string })[]
        | (ProductsRestaurantSchemaFromServer & { favoritescount: string })[];
    productsmostcommentsmapped:
        | (ProductsNormalSchemaFromServer & { quantity: string })[]
        | (ProductsRestaurantSchemaFromServer & { quantity: string })[];
    productsmostratingmapped:
        | ProductsNormalSchemaFromServer[]
        | ProductsRestaurantSchemaFromServer[];
}
function ProductsUsers({
    productsmostreactionmapped,
    productsmostratingmapped,
    productsmostcommentsmapped,
}: ProductsUsersProps) {
    if (!storageEmpresa?.setting.shows.offers_user) return null;

    return (
        <section class="max-w-6xl mx-auto my-4 md:my-8 px-4  gap-4 grid grid-cols-1 lg:grid-cols-3">
            <div
                class={`bg-background-light dark:bg-background-dark shadow p-2 ${
                    enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
                }`}
            >
                <div class="flex items-center justify-between">
                    <TitleSectionTwo>
                        <>
                            <i class="fas fa-heart" /> Productos Más Favoritos
                        </>
                    </TitleSectionTwo>
                    <a
                        href="/shop"
                        class="text-sm font-semibold pb-0.5 border-b-2 border-primary text-primary"
                    >
                        Ver más
                    </a>
                </div>
                <div>
                    {productsmostreactionmapped.map((product) => (
                        <Fragment key={product.id}>
                            <ProductCard
                                product={product}
                                key={product.id}
                                className="flex !bg-transparent !shadow-none  h-[120px]"
                            >
                                <ProductCard.header
                                    isShowVariants={false}
                                    className="  !w-[160px] [&>img]:!h-full [&>img]:!w-full [&>img]:!object-contain"
                                />
                                <div class="py-3 w-full  flex flex-col gap-1 items-center justify-center">
                                    <ProductCard.body
                                        showDescription={false}
                                        isShowRating={false}
                                    />
                                    <span class="font-semibold text-sm relative">
                                        <span class="absolute top-2 left-3 text-sm text-white font-bold">
                                            {product.favoritescount ?? 0}
                                        </span>
                                        <i class="fas fa-heart text-3xl text-primary" />
                                    </span>
                                    <ProductCard.footer className="pt-0" />
                                </div>
                            </ProductCard>
                            <div class="h-[1px] bg-gray-300 dark:bg-gray-500 w-full my-1" />
                        </Fragment>
                    ))}
                </div>
            </div>
            <div
                class={`bg-background-light dark:bg-background-dark shadow p-2 ${
                    enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
                }`}
            >
                <div class="flex items-center justify-between">
                    <TitleSectionTwo>
                        <>
                            <i class={`fas fa-${enviroments.TYPE_START}`} />{" "}
                            Productos Mejor Valorados
                        </>
                    </TitleSectionTwo>
                    <a
                        href="/shop"
                        class="text-sm font-semibold pb-0.5 border-b-2 border-primary text-primary"
                    >
                        Ver más
                    </a>
                </div>
                <div class="p-2 bg-background-light dark:bg-background-dark">
                    {productsmostratingmapped.map((product) => (
                        <Fragment key={product.id}>
                            <ProductCard
                                product={product}
                                key={product.id}
                                className="flex !bg-transparent !shadow-none  h-[120px]"
                            >
                                <ProductCard.header
                                    isShowVariants={false}
                                    className="  !w-[160px] [&>img]:!h-full [&>img]:!w-full [&>img]:!object-contain"
                                />
                                <div class="py-3 w-full  flex flex-col gap-1 items-center justify-center">
                                    <ProductCard.body
                                        showDescription={false}
                                        isShowRating
                                    />
                                    <ProductCard.footer className="pt-0" />
                                </div>
                            </ProductCard>
                            <div class="h-[1px] bg-gray-300 dark:bg-gray-500 w-full my-1" />
                        </Fragment>
                    ))}
                </div>
            </div>
            <div
                class={`bg-background-light dark:bg-background-dark shadow p-2 ${
                    enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
                }`}
            >
                <div class="flex items-center justify-between">
                    <TitleSectionTwo>
                        <>
                            <i class="fa-solid fa-comment" /> Productos más
                            comentados
                        </>
                    </TitleSectionTwo>
                    <a
                        href="/shop"
                        class="text-sm font-semibold pb-0.5 border-b-2 border-primary text-primary"
                    >
                        Ver más
                    </a>
                </div>
                <div class="p-2 bg-background-light dark:bg-background-dark">
                    {productsmostcommentsmapped.map((product) => (
                        <Fragment key={product.id}>
                            <ProductCard
                                product={product}
                                key={product.id}
                                className="flex !bg-transparent !shadow-none  h-[120px]"
                            >
                                <ProductCard.header
                                    isShowVariants={false}
                                    className="  !w-[160px] [&>img]:!h-full [&>img]:!w-full [&>img]:!object-contain"
                                />
                                <div class="py-3 w-full  flex flex-col gap-1 items-center justify-center">
                                    <ProductCard.body
                                        showDescription={false}
                                        isShowRating={false}
                                    />
                                    <span class="font-semibold text-sm relative">
                                        <span class="absolute top-2 left-3 text-sm text-white font-bold">
                                            {product.quantity ?? 0}
                                        </span>
                                        <i class="fa-solid fa-comment text-3xl text-primary" />
                                    </span>
                                    <ProductCard.footer className="pt-0" />
                                </div>
                            </ProductCard>
                            <div class="h-[1px] bg-gray-300 dark:bg-gray-500 w-full my-1" />
                        </Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ProductsUsers;
