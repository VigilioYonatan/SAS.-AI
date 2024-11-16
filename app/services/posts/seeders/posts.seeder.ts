import { customArray } from "@vigilio/express-core/helpers";
import type { PostsSchema } from "../schemas/posts.schema";
import { faker } from "@faker-js/faker";

export const postsSeeder: Omit<PostsSchema, "id">[] = customArray(30).map(
	() => {
		return {
			content: faker.lorem.sentence(15),
			image: [
				{
					file: "https://cdn.www.gob.pe/uploads/document/file/229199/standard_conferencia_de_prensa.jpg",
					dimension: 100,
				},
			],
			title: faker.lorem.sentence(8),
			user_id: 1,
			empresa_id: 1,
			likes: [],
		};
	},
);
