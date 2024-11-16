import { ratingsStoreApi } from "@/polymorphism/apis/ratings.store.api";
import { ratingsUpdateApi } from "@/polymorphism/apis/ratings.update.api";
import { Rating } from "react-custom-rating-component";
import { sweetAlert } from "@vigilio/sweet";
import { Signal } from "@preact/signals";
import { ProductsNormalSchemaFromServer } from "../schemas/products_normal.schema";
import { ProductsServicioSchemaFromServer } from "../schemas/products_servicio.schema";
import { ProductsRestaurantSchemaFromServer } from "../schemas/products_restaurant.schema";
import enviroments from "~/config";

interface ProductRatingStoreProps {
	product: Signal<
		| ProductsNormalSchemaFromServer
		| ProductsServicioSchemaFromServer
		| ProductsRestaurantSchemaFromServer
	>;
	type: "ProductsNormals" | "ProductsRestaurants" | "ProductsServicios";
}
function ProductRatingStore({ product, type }: ProductRatingStoreProps) {
	const ratingsStoreMutation = ratingsStoreApi(type, product.value.id);
	const ratingsUpdateMutation = ratingsUpdateApi(type, product.value.id);

	return (
		<div class="flex flex-col">
			<span class="font-bold dark:text-white">Deja tu reseña</span>
			<Rating
				defaultValue={product.value.user?.rating ?? 0}
				onChange={(newRating) => {
					// si ya dio rating que actualize sino cree
					if (product.value.user!.rating) {
						if (product.value.user!.rating === newRating) return;
						ratingsUpdateMutation.mutate(
							{
								rating: newRating,
							},
							{
								onSuccess() {
									//    value / rating.length
									product.value = {
										...product.value,
										user: {
											...product.value.user!,
											rating: newRating,
										},
									};
									sweetAlert({
										icon: "success",
										title: "Rating Actualizado correctamente.",
									});
								},
								onError(data) {
									sweetAlert({
										icon: "danger",
										title: data.message,
									});
								},
							},
						);
						return;
					}
					ratingsStoreMutation.mutate(
						{
							rating: newRating,
						},
						{
							onSuccess() {
								product.value = {
									...product.value,
									user: {
										...product.value.user!,
										rating: newRating,
									},
								};

								sweetAlert({
									icon: "success",
									title: "Rating agregado correctamente.",
								});
							},
							onError(data) {
								sweetAlert({
									icon: "danger",
									title: data.message,
								});
							},
						},
					);
				}}
				shape={enviroments.TYPE_START}
				size="30px"
				spacing="5px"
				activeColor="var(--primary)"
				precision={0.5}
			/>
		</div>
	);
}

export default ProductRatingStore;
