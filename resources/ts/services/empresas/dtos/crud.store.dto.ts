import {
    omit,
    type Input,
} from "@vigilio/valibot";
import { crudSchema } from "../schemas/crud.schema";

export const crudStoreDto = omit(crudSchema, ["id"]);
export type CrudStoreDto = Input<typeof crudStoreDto>;
