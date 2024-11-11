import useFavoriteStore from "../stores/favorites.store";

function FavoritesLength() {
	const favoriteStore = useFavoriteStore();
	return <>{favoriteStore.state}</>;
}

export default FavoritesLength;
