import type {
	UsersSchema,
	UsersSchemaFromServer,
} from "../schemas/users.schema";
import type { UsersStoreDto } from "../dtos/users.store.dto";
import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { uploadApi } from "~/libs/upload";

export const usersUploadPhoto = "/uploads/users/photo";

export function usersStoreApi() {
	return useMutation<UsersStoreAPI, UsersStoreDto, UsersStoreErrorAPI>(
		"/users",
		async (url, body) => {
			let photo = null;
			if (body.photo) {
				const resultImage = await uploadApi(
					`${enviroments.VITE_URL}/api${usersUploadPhoto}`,
					{ name: body.username, file: body.photo },
				);
				photo = resultImage.files;
			}

			const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
				body: JSON.stringify({
					...body,
					photo,
				} as UsersSchema),
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
			});
			const result: UsersStoreAPI = await response.json();

			if (!result.success) throw result;
			return result;
		},
	);
}

export interface UsersStoreAPI {
	success: boolean;
	user: UsersSchemaFromServer;
}

export interface UsersStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
