import { type Input, omit } from "@vigilio/valibot";
import { notesSchema } from "../schemas/notes.schema";

export const notesStoreDto = omit(notesSchema, ["id", "empresa_id"]);
export type NotesStoreDto = Input<typeof notesStoreDto>;
