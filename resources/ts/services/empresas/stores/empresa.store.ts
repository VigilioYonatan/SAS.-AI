import { signal } from "@preact/signals";

import { FilesSchema } from "~/libs/upload";
import { TipoEmpresasSchemaFromServer } from "../schemas/tipo_empresa.schema";
import { AddressSchemaFromServer } from "../schemas/address.schema";
import { SettingsSchema } from "../schemas/settings.schema";
import {
    EmpresasSchemaFromServer,
    InteligenceArtificial,
} from "../schemas/empresas.schema";
export type empresaStore = Omit<
    EmpresasSchemaFromServer,
    "about" | "contacts" | "groupWhatsapp" | "credentials"
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
        enable_efectivo: boolean;
        qrYape: null | FilesSchema[];
        qrPlin: null | FilesSchema[];
    };
    inteligenceArtificial: { usage: InteligenceArtificial["usage"] };
    tipo_empresa: TipoEmpresasSchemaFromServer;
    address: AddressSchemaFromServer;
    setting: SettingsSchema;
};
export const storageEmpresa: empresaStore | null = JSON.parse(
    localStorage.getItem("empresa") ?? "null"
);
export const BASE_URL = storageEmpresa!.setting.host
    ? `https://www.${storageEmpresa!.setting.host}`
    : `https://${storageEmpresa!.slug}.vigilio-services.com`;

const empresa = signal<empresaStore | null>(storageEmpresa);

function useEmpresastore() {
    function updateempresa(info: Partial<empresaStore>) {
        empresa.value = {
            ...empresa.value,
            ...(info as empresaStore),
        };
    }

    return {
        state: empresa.value,
        methods: { updateempresa },
    };
}

export default useEmpresastore;
