import { signal } from "@preact/signals";
import type {
    InformationSchema,
    InteligenceArtificial,
} from "../schemas/information.schema";
import { FilesSchema } from "~/libs/upload";
export type InformationStore = Omit<
    InformationSchema,
    "about" | "certificado" | "contacts" | "groupWhatsapp" | "credentials"
> & {
    metodos_pago: {
        transferencias: Record<
            string,
            { titular: string | null; dolares: string | null } & {
                [a in keyof string]: string | null;
            }
        > | null;
        paypal: { enabled: boolean };
        mercado_pago: { enabled: boolean };
        enabled_efectivo: boolean;
        qrYape: null | FilesSchema[];
        qrPlin: null | FilesSchema[];
    } & { inteligenceArtificial: { usage: InteligenceArtificial["usage"] } };
};
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
