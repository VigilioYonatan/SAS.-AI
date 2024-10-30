import { productsLazyApi } from "@/products/apis/products/products.lazy.api";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import {
    SampleNextArrow,
    SamplePrevArrow,
} from "@/web/components/ArrowsSlider";
import ProductCard from "@/web/components/product";
import { useSignal } from "@preact/signals";
import usePaginator from "@vigilio/preact-paginator";
import { useEffect } from "preact/hooks";
import Slider from "react-slick";

function ProductsOfferSection() {
    const paginator = usePaginator({ limit: 7 });
    const products = useSignal<
        ProductsNormalSchemaFromServer[] | ProductsRestaurantSchemaFromServer[]
    >([]);
    const showCards = 4;

    const productsPaginator = productsLazyApi(paginator);

    useEffect(() => {
        productsPaginator.refetch(false);
    }, [paginator.pagination.page]);

    useEffect(() => {
        if (
            productsPaginator.isSuccess &&
            productsPaginator.data!.results!.length > 0
        ) {
            products.value = [
                ...products.value,
                ...productsPaginator.data!.results,
            ] as
                | ProductsNormalSchemaFromServer[]
                | ProductsRestaurantSchemaFromServer[];
        }
    }, [
        productsPaginator.data,
        productsPaginator.isSuccess,
        paginator.pagination.page,
    ]);

    function beforeChange(current: number) {
        if (current >= products.value.length - showCards) {
            paginator.pagination.onNextPage();
        }
    }

    let component = null;
    if (productsPaginator.isLoading) {
        component = <ProductsOfferSliderSkeleton />;
    }
    if (productsPaginator.isError) {
        component = (
            <span class="dark:text-white">
                {productsPaginator.error?.message}
            </span>
        );
    }

    if (productsPaginator.isSuccess) {
        component = (
            <>
                <Slider
                    {...{
                        dots: false,
                        infinite: false,
                        speed: 500,
                        slidesToShow: showCards,
                        slidesToScroll: 1,
                        arrows: true,
                        beforeChange,
                        adaptiveHeight: true,
                        nextArrow: <SampleNextArrow />,
                        prevArrow: <SamplePrevArrow />,
                    }}
                    className={`product-offer-section ${
                        productsPaginator.isFetching ? "opacity-20" : ""
                    }`}
                >
                    {products.value.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        >
                            <ProductCard.header />
                            <ProductCard.body showDescription={false} />
                            <ProductCard.footer />
                        </ProductCard>
                    ))}
                </Slider>
            </>
        );
    }
    return (
        <div>
            <h3 class="text-primary font-bold text-center my-4 text-3xl">
                Nuestros ultimas ofertas
            </h3>
            {/* client  */}
            {component}
        </div>
    );
}
function ProductsOfferSliderSkeleton() {
    return (
        <div class="animate-pulse  w-full grid grid-cols-4  gap-4 h-[300px]">
            <div class=" bg-secondary  w-full h-full rounded-md" />
            <div class=" bg-secondary h-full w-full rounded-md" />
            <div class=" bg-secondary h-full w-full rounded-md" />
            <div class=" bg-secondary h-full w-full rounded-md" />
        </div>
    );
}
export default ProductsOfferSection;
