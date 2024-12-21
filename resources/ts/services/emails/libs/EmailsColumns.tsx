import type { Columns } from "@vigilio/preact-table";
import type { EmailsSchemaFromServer } from "../schemas/emails.schema";
import { formatDateTwo } from "~/libs/helpers";

export type EmailsIndexSecondaryPaginator = "acciones" | "index";

const emailsColumns: Columns<
	EmailsSchemaFromServer,
	EmailsIndexSecondaryPaginator,
	{ refetch: (clean?: boolean) => void }
> = [
	{ key: "id", isSort: true },
	{ key: "name", header: "Nombre" },
	{ key: "email", header: "Correo Electrónico" },
	{
		key: "subject",
		header: "Asunto",
		cell: (props) =>
			props.subject.length > 20
				? `${props.subject.slice(0, 18)}...`
				: props.subject,
	},
	{
		key: "content",
		header: "Contenido",
		cell: (props) =>
			props.content.length > 20
				? `${props.subject.slice(0, 18)}...`
				: props.content,
	},
	{
		key: "createdAt",
		header: "Fecha",
		cell: (props) => formatDateTwo(props.createdAt!, "MM-DD-YYYY hh:mm A"),
		isSort: true,
	},
];
export default emailsColumns;
