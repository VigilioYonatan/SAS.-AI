import {
	number,
	objectAsync,
	type Input,
	minLength,
	maxLength,
	string,
} from "valibot";

export const floorsSchema = objectAsync({
	id: number(),
	name: string([minLength(1), maxLength(100)]),
	empresa_id: number(),
});

export type FloorsSchema = Input<typeof floorsSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
