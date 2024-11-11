import { type Input, nullable, number, objectAsync } from "@vigilio/valibot";

export const favoritesSchema = objectAsync({
	product_id: number(),
	product_normal_id: nullable(number()),
	product_restaurant_id: nullable(number()),
	product_servicio_id: nullable(number()),
	empresa_id: number(),
});

export type FavoritesSchema = Input<typeof favoritesSchema>;
export type FavoritesSchemaFromServer = FavoritesSchema;
