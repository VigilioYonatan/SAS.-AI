import {
    type Input,
    mergeAsync,
    objectAsync,
    omitAsync,
    string,
} from "@vigilio/valibot";
import { usersFormSchema } from "../schemas/users-form.schema";

export const usersFormStoreDto = mergeAsync([
    omitAsync(usersFormSchema, ["id", "empresa_id"]),
    objectAsync({ api_key: string() }),
]);
export type UsersFormStoreDto = Input<typeof usersFormStoreDto>;
