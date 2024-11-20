import { Input, omit } from "@vigilio/valibot";
import { fileSchema } from "../schemas/file.schema";

export const fileUpdateDto = omit(fileSchema, ["empresa_id", "name"]);
export type FileUpdateDto = Input<typeof fileUpdateDto>;
