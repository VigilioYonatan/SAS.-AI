import { Link } from "wouter-preact";
import { icoRoleColor, printFileUser, numberPhoneFormated } from "./helpers";
import type { Columns } from "@vigilio/preact-table";
import type { UsersSchemaFromServer } from "../schemas/users.schema";
import { NOW, restarDays } from "~/libs/helpers";

export type UsersIndexSecondaryPaginator = "acciones" | "index";

const usersColumns: Columns<
	UsersSchemaFromServer,
	UsersIndexSecondaryPaginator
> = [
	{ key: "id", isSort: true },
	{ key: "user_code", header: "código", isSort: "id" },
	{ key: "username", header: "usuario" },
	{
		key: "name",
		header: "nombre Completo",
		cell: (props) => `${props.name} ${props.lastname ?? ""}`,
	},
	{
		key: "photo",
		header: "foto",
		cell: (props) => {
			return (
				<img
					width={80}
					height={80}
					class="min-w-[50px] max-w-[50px] h-[50px] rounded-sm mx-auto object-cover "
					src={printFileUser(props.photo, 100)[0]}
					alt={props.name}
				/>
			);
		},
	},
	{
		key: "buys",
		header: "Compras Realizados",
		cell: (props) => (
			<div class="h-[60px] overflow-auto w-[200px]">
				{props.buys?.length ? (
					<div class="flex flex-col gap-1">
						{props.buys.slice(0, 10).map((buy, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<div class="flex gap-1 items-center" key={i}>
								<span class="flex">
									<b class="font-bold">Orden:</b>{" "}
									<a
										class="hover:text-primary"
										href={`/admin/orders/${buy.order}`}
									>
										{buy.order}
									</a>{" "}
								</span>
								<span class="flex">
									<b class="font-bold">Nombre:</b> <span>{buy.title}</span>
								</span>
								{buy.date ? (
									<span class="flex">
										<b class="font-bold">Vence:</b>{" "}
										<span>{restarDays(NOW(), buy.date, "day")} días</span>
									</span>
								) : null}
							</div>
						))}
					</div>
				) : (
					<span class="text-xs">No hay compras</span>
				)}
			</div>
		),
	},
	{
		key: "telephone",
		header: "teléfono",
		cell: (props) =>
			props.telephone ? numberPhoneFormated(props.telephone) : null,
	},
	{
		key: "isOnline",
		header: "OnLine",
		cell: (user) => (
			<div
				class={`${
					user.isOnline ? "bg-success" : "bg-danger"
				} w-3 rounded-full h-3 mx-auto`}
			/>
		),
		isSort: true,
	},
	{
		key: "role_id",
		header: "Rol",
		isSort: true,
		cell: (user) => (
			<span
				class={`${icoRoleColor(
					user.role_id,
				)} px-4 py-1 rounded-md text-white [&>div]:inline [&>div]:mr-1`}
			>
				{user.role_id === 1 ? "Administrador" : "Trabajador"}
			</span>
		),
	},
	{
		key: "acciones",
		cell: (props, _index) => {
			return (
				<div
					class="flex items-center justify-center gap-1 text-white"
					onClick={(e) => e.stopPropagation()}
				>
					<Link to={`/usuarios/${props.slug}`}>
						<button
							class="px-1 py-1 lg:px-4 lg:py-2 rounded-md bg-success"
							type="button"
							aria-label="show user"
						>
							<i class="fa-solid text-sm fa-eye lg:mr-1" />
						</button>
					</Link>
				</div>
			);
		},
	},
];
export default usersColumns;
