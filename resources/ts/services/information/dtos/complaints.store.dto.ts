import { type Input, omitAsync, getPipeIssues, getOutput } from "valibot";
import { complaintsSchema } from "../schemas/complaints.schema";

export const complaintsStoreDto = omitAsync(
    complaintsSchema,
    ["id"],
    [
        async (input) => {
            const typeOfDocument = input.typeOfDocument;

            if (typeOfDocument === "DNI") {
                if (input.numberDocument.length !== 8) {
                    return getPipeIssues(
                        "numberDocument",
                        "El DNI debe tener 8 digitos",
                        input
                    );
                }
            }

            if (typeOfDocument === "CE") {
                if (input.numberDocument.length !== 12) {
                    return getPipeIssues(
                        "numberDocument",
                        "El CE debe tener 11 digitos",
                        input
                    );
                }
            }

            if (typeOfDocument === "Pasaporte") {
                if (input.numberDocument.length !== 12) {
                    return getPipeIssues(
                        "numberDocument",
                        "El pasaporte debe tener 8 digitos",
                        input
                    );
                }
            }

            if (typeOfDocument === "RUC") {
                if (input.numberDocument.length !== 11) {
                    return getPipeIssues(
                        "numberDocument",
                        "El RUC debe tener 11 digitos",
                        input
                    );
                }
            }

            return getOutput(input);
        },
    ]
);

export type ComplaintsStoreDto = Input<typeof complaintsStoreDto>;
