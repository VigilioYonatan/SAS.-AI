import { type Input, omitAsync } from "valibot";
import { complaintsSchema } from "../schemas/complaints.schema";

export const complaintsStoreDto = omitAsync(complaintsSchema, ["id"]);

export type ComplaintsStoreDto = Input<typeof complaintsStoreDto>;
