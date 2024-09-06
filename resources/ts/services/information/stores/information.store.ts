import { signal } from "@preact/signals";
import type {
	InformationSchemaFromServer,
	InteligenceArtificial,
} from "../schemas/information.schema";
import { FilesSchema } from "~/libs/upload";
import { TipoEmpresaSchemaFromServer } from "../schemas/tipo_empresa.schema";
import { AddressSchemaFromServer } from "../schemas/address.schema";
import { SettingsSchema } from "../schemas/settings.schema";
export type InformationStore = Omit<
	InformationSchemaFromServer,
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
	tipo_empresa: TipoEmpresaSchemaFromServer;
	address: AddressSchemaFromServer;
	setting: SettingsSchema;
};
export const storageInformation: InformationStore | null = JSON.parse(
	localStorage.getItem("information") ?? "null",
);
export const BASE_URL = storageInformation!.setting.host
	? `https://www.${storageInformation!.setting.host}`
	: `http://${storageInformation!.slug}.localhost:4003`;

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
