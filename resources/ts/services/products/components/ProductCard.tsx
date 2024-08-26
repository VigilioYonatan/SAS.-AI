import type { ProductsSchemaFromServer } from "../schemas/products.schema";
import enviroments from "~/config";
import {
	formatMoney,
	formatMoneyDinamic,
	subtotalIgv,
} from "@/cart/libs/helpers";
import { printFileWithDimension } from "~/libs/upload";
import { printImagesProduct } from "../libs/helpers";
import { favoritesStoreApi } from "@/favorites/apis/favorites.store.api";
import { favoritesDestroyApi } from "@/favorites/apis/favorites.destroy.api";
import useFavoriteStore from "@/favorites/stores/favorites.store";
import { sweetAlert } from "@vigilio/sweet";
import confetti from "canvas-confetti";
import useAuthStore from "@/auth/stores/auth.store";
import { openAuth } from "@/auth/views/AuthLogin";
import LoaderSubmit from "~/components/LoaderSubmit";
import { useSignal } from "@preact/signals";
import { isDateWithin } from "~/libs/helpers";

interface ProductCardProps {
	product: ProductsSchemaFromServer;
}
function ProductCard({ product }: ProductCardProps) {
	const favoritesStoreMutation = favoritesStoreApi(product.id);
	const favoritesDestroyMutation = favoritesDestroyApi(product.id);
	const favoriteStore = useFavoriteStore();
	const authStore = useAuthStore();
	const producto = useSignal<ProductsSchemaFromServer>(product);

	function onFavorite() {
		if (!authStore.state) {
			openAuth();
			return;
		}

		if (producto.value.user!.isFavorite) {
			favoritesDestroyMutation.mutate(null, {
				onSuccess(data) {
					sweetAlert({
						title: data.message,
						icon: "success",
					});
					favoriteStore.methods.onFavoriteDestroy();
					producto.value = {
						...producto.value,
						user: {
							...producto.value.user!,
							isFavorite: false,
						},
					};
				},
				onError(error) {
					sweetAlert({
						title: error.message,
						icon: "danger",
					});
				},
			});
			return;
		}
		favoritesStoreMutation.mutate(null, {
			onSuccess() {
				confetti({
					angle: 90,
					spread: 360,
					startVelocity: 40,
					colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
				});
				favoriteStore.methods.onFavoriteStore();
				producto.value = {
					...producto.value,
					user: {
						...producto.value.user!,
						isFavorite: true,
					},
				};
			},
			onError(error) {
				sweetAlert({
					title: error.message,
					icon: "danger",
				});
			},
		});
	}
	return (
		<div class="overflow-hidden bg-white rounded-md shadow-lg block ">
			<div class="relative">
				<img
					width={300}
					height={300}
					src={`${printImagesProduct(product.images, 500)[0]}`}
					alt={product.name}
				/>
				{product.discount > 0 && (
					<span class="absolute top-0 left-0 bg-red-600 px-4 text-white font-bold rounded-md m-2">
						-{product.discount}%
					</span>
				)}
				<img
					class="w-[30px] h-[30px] object-contain absolute top-0 m-2 right-0"
					src={printFileWithDimension(product.brand.image, 100)[0]}
					width={100}
					height={100}
					alt={product.brand.name}
				/>
			</div>
			<div class="flex flex-col">
				<div class="flex flex-col p-3">
					{/* quiere decir que es un producto nuevo si fue creado desde 2 semanas  */}
					{!isDateWithin(product.createdAt!, 2, "week") ? (
						<span>Nuevo</span>
					) : null}
					<a
						href={`${enviroments.VITE_URL}/${product.slug}`}
						class="line-clamp-3 text-center font-bold"
					>
						{product.name}
					</a>
					{product.discount > 0 && (
						<span class="text-xs line-through text-terciary text-center">
							{formatMoney(formatMoneyDinamic(subtotalIgv(product, false)))}
						</span>
					)}
					<span class="font-semibold text-center">
						{formatMoney(formatMoneyDinamic(subtotalIgv(product, true)))}
					</span>
				</div>
				<div class="flex gap-2 items-center justify-center">
					<button
						type="button"
						disabled={
							favoritesStoreMutation.isLoading ||
							favoritesDestroyMutation.isLoading ||
							false
						}
						class={`${
							authStore.state! &&
							producto.value.user &&
							producto.value.user!.isFavorite
								? "bg-primary"
								: ""
						}  px-2 py-1 rounded-md border-2 border-primary `}
						onClick={onFavorite}
					>
						{favoritesStoreMutation.isLoading ||
						favoritesDestroyMutation.isLoading ? (
							<LoaderSubmit />
						) : (
							<i class="fas fa-heart" />
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
export default ProductCard;
