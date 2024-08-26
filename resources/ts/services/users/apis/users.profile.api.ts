import { useMutation } from "@vigilio/preact-fetching";
import type {
	UsersProfileDto,
	UsersProfilePhotoDto,
} from "../dtos/users.profile.dto";
import type { UsersSchemaFromServer } from "../schemas/users.schema";
import enviroments from "~/config";
import { uploadApi, type ResultApiImages } from "~/libs/upload";
import { usersUploadPhoto } from "./users.store.api";

export function usersProfileApi() {
	return useMutation<
		{ success: true; user: UsersSchemaFromServer },
		UsersProfileDto,
		UsersProfileErrorAPI
	>("/users/profile", async (url, body: UsersProfileDto) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
			method: "PUT",
			body: JSON.stringify(body),
			headers: {
				"content-type": "application/json",
			},
		});
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
export function usersProfilePhotoApi(id: number) {
	return useMutation<
		ResultApiImages,
		UsersProfilePhotoDto & { name: string },
		UsersProfileErrorAPI
	>(`${usersUploadPhoto}/${id}`, async (url, body) => {
		const result = await uploadApi(`${enviroments.VITE_URL}/api${url}`, {
			name: body.name,
			file: body.photo,
		});
		return result;
	});
}

export interface UsersProfileErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
