import { signal } from "@preact/signals";
import type { InformationSchema } from "../schemas/information.schema";
export type InformationStore = Omit<
    InformationSchema,
    | "about"
    | "certificado"
    | "inteligenceArtificial"
    | "contacts"
    | "groupWhatsapp"
    | "transferencias"
    | "payments"
    | "credentials"
>;
export const storageInformation: InformationStore | null = JSON.parse(
    localStorage.getItem("information") ?? "null"
);
const information = signal<InformationStore | null>(storageInformation);

function useInformationStore() {
    function updateInformation(info: Partial<InformationStore>) {
        information.value = {
            ...information.value,
            ...(info as InformationStore),
        };
    }

    return {
        state: information.value,
        methods: { updateInformation },
    };
}

export default useInformationStore;
