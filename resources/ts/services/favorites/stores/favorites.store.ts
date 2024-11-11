import { signal } from "@preact/signals";
import { authStorage } from "@/auth/stores/auth.store";

const state = signal<number>(
	authStorage ? authStorage.products_favorites_length : 0,
);
function useFavoriteStore() {
	function onFavoriteStore() {
		state.value = state.value + 1;
	}

	function onFavoriteDestroy() {
		state.value = state.value - 1;
	}

	return {
		state: state.value,
		methods: {
			onFavoriteStore,
			onFavoriteDestroy,
		},
	};
}

export default useFavoriteStore;
