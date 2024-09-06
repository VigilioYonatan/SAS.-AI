import Container from "@/admin/components/Container";
import useAuthStore from "@/auth/stores/auth.store";
import { informationContactsPaginatorApi } from "@/common/paginator/information.contacts.paginator.api";
import { useTable } from "@vigilio/preact-table";
import contactsColumns from "../libs/ContactsColumns";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import VigilioTable from "~/components/table";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { useForm } from "react-hook-form";
import { useSignal } from "@preact/signals";
import { informationContactsUpdateApi } from "@/information/apis/information.contacts.update.api";
import {
	whatsappGetQrApi,
	whatsappRestart,
	whatsappSendMessageApi,
	whatsappSendFileApi,
} from "../apis/whatsapp.api";
import { delay, handlerError } from "~/libs/helpers";
import {
	contactsSchema,
	groupWhatsapp,
	type ContactsSchema,
	type GroupWhatsapp,
} from "@/information/schemas/information.schema";
import { informationContactsFavoritesApi } from "@/information/apis/information.contacts.favorites.api";
import { informationContactsIndexApi } from "@/information/apis/information.contacts.index.api";
import Form from "~/components/form";
import { valibotVigilio } from "~/libs/valibot";
import { informationContactsStoreUpdateApi } from "@/information/apis/information.contacts.store.api";
import LoaderSubmit from "~/components/LoaderSubmit";
import { linkVigilio } from "~/config/settings";
import { Fragment } from "preact/jsx-runtime";
import { groupWhatsappStoreApi } from "../apis/group-whatsapp.store.api";
import { groupWhatsappIndexApi } from "../apis/group-whatsapp.index.api";
import { groupWhatsappShowApi } from "../apis/group-whatsapp.show.api";
import { groupWhatsappDestroyApi } from "../apis/group-whatsapp.destroy.api";
import type { Whatsappconfig } from "../../information/schemas/information.schema";
import Loading from "@/admin/components/Loading";
import { groupWhatsappTelephoneDestroyApi } from "../apis/group-whatsapp.telephone.destroy.api";
import { informationContactsSearchApi } from "@/information/apis/information.contacts.search.api";
import useDropdown from "~/hooks/useDropdown";
import { informationGroupWhatsappUpdateApi } from "@/information/apis/information.group-whatsapp.update.api";
import { subWhatsappIA } from "~/config/guards";
import { informationWhatsappConfigUpdateApi } from "@/information/apis/information.whatsapp-config.api";
import useInformationStore, {
	storageInformation,
} from "@/information/stores/information.store";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { whatsappLogoutApi } from "../apis/whatsapp-logout.api";

function Whatsapp() {
	const authStore = useAuthStore();
	const whatsappLogoutMutation = whatsappLogoutApi();
	if (!authStore.guards.permissionAdminGuard()) {
		window.history.back();
		return null;
	}
	if (!subWhatsappIA()) {
		window.location.href = "/admin/plus";
		return null;
	}
	const informationContactsUpdateMutation = informationContactsUpdateApi();
	const table = useTable({
		columns: contactsColumns,
		pagination: { limit: 20 },
		methods: { informationContactsUpdateMutation },
	});

	const query = informationContactsPaginatorApi(table);

	// actualizar tabla data

	function onSendALL(type: "selected" | "all" | "favorites") {
		sweetModal((onClose) => ({
			isCloseInBackground: false,
			showCloseButton: true,
			html: reactComponent(
				<ChatWhatsapp
					type={type}
					contacts={table.checks.value}
					onClose={onClose}
				/>,
			),
			sweetWidth: "600px",
		}));
	}
	function onStoreGroup() {
		sweetModal((onClose) => ({
			isCloseInBackground: false,
			showCloseButton: true,
			html: reactComponent(
				<GroupWhatsappStore
					contacts={table.checks.value}
					onClose={onClose}
					clear={table.checks.clearChecks}
				/>,
			),
			sweetWidth: "300px",
		}));
	}
	//enabled: "No estamos disponible este momento. Intentelo más tarde"
	//cerrado: "Cerrado. No estamos disponible este momento. Intentelo más tarde"
	//thank: "Muchas gracias por la compra, Su {COMPROBANTE} 😊."
	//thank2: "No olvides visitar nuestro sitio web: {URL} 😊 para tener más información de nuestros productos, como ofertas y novedades."
	//sendpdf: "Hola, Aqui {NAME_EMPRESA} le adyunta su {COMPROBANTE} 😊"
	return (
		<Container className="p-2">
			<div className=" flex flex-col gap-4">
				<AdminBreadCrumb current="Whatsapp" />
			</div>
			<div class="flex gap-2 items-center justify-between">
				<button
					className="bg-success px-4 py-2 rounded-md shadow text-white mr-2 self-end"
					type="button"
					onClick={() => {
						sweetModal({
							html: reactComponent(<QrWhatsapp />),
							showCloseButton: true,
						});
					}}
				>
					<i class="fab fa-whatsapp" />
				</button>
				<div class="flex gap-2 items-center">
					<button
						class="flex gap-2 items-center text-xs dark:bg-admin-terciary bg-paper-light dark:text-white  rounded-md px-4 py-2 shadow"
						type="button"
						onClick={() => {
							sweetModal({
								html: reactComponent(<MessagesWhatsappSettings />),
								showCloseButton: true,
								isCloseInBackground: false,
							});
						}}
					>
						<i class="fas fa-cogs" />
						Configuración
					</button>
					<button
						type="button"
						class="text-white bg-danger px-2 py-2 rounded-md shadow mr-2"
						disabled={whatsappLogoutMutation.isLoading || false}
						aria-label="close whatsapp"
						onClick={() => {
							sweetModal({
								icon: "danger",
								title: "¿Estas seguro de cerrar sesión whatsapp?",
								text: "Se cerrará sesión whatsapp y se reiniciará tu web por unos segundos. Se creará otro qr para iniciar sesión nuevamente.",
								isCloseInBackground: false,
								showCancelButton: true,
							}).then(({ isConfirmed }) => {
								if (isConfirmed) {
									whatsappLogoutMutation.mutate(null, {
										onSuccess() {
											sweetAlert({
												icon: "success",
												title:
													"Se cerro sessión correctamente. Espero unos segundos para el reinicio",
												height: 60,
											});
										},
										onError() {
											sweetAlert({
												icon: "danger",
												title:
													"¿Se cerró sesión de whatsapp. y se reinicio qr.",
												height: 60,
											});
										},
									});
								}
							});
						}}
					>
						{whatsappLogoutMutation.isLoading ? (
							<LoaderSubmit />
						) : (
							<i class="fas fa-sign-out-alt" />
						)}
					</button>
				</div>
			</div>

			<div class="flex flex-wrap items-center gap-3  justify-between">
				<div class="flex flex-col md:flex-row gap-2 items-center w-full  justify-center">
					<button
						type="button"
						onClick={() => {
							sweetModal({
								html: reactComponent(<StoreContact refetch={query.refetch} />),
								showCloseButton: true,
								isCloseInBackground: false,
							});
						}}
						aria-label="send all"
						class=" px-2 py-2 rounded-md dark:text-white text-sm flex  gap-2 items-center font-semibold  w-full justify-center  shadow bg-paper-light   dark:bg-admin-terciary"
					>
						<i class="fas fa-user" /> Agregar Nuevo contacto
					</button>
					<button
						type="button"
						onClick={() => {
							sweetModal({
								html: reactComponent(<GroupIndex />),
								showCloseButton: true,
								isCloseInBackground: false,
							});
						}}
						aria-label="send all"
						class=" px-2 py-2 rounded-md dark:text-white text-sm flex  gap-2 items-center font-semibold  w-full justify-center  shadow bg-paper-light   dark:bg-admin-terciary"
					>
						<i class="fa-duotone fa-people-group" /> Ver grupos
					</button>
				</div>

				<div class="flex gap-2  w-full justify-center flex-col md:flex-row items-center">
					<button
						type="button"
						onClick={() => onSendALL("favorites")}
						aria-label="send all"
						class=" px-2 py-2 rounded-md dark:text-white text-sm flex  gap-2 items-center font-semibold  w-full justify-center  shadow bg-paper-light   dark:bg-admin-terciary"
					>
						<span>
							<i class="fas fa-star" /> Enviar solo a favoritos
						</span>
					</button>
					<button
						type="button"
						onClick={() => onSendALL("all")}
						aria-label="send all"
						class=" px-2 py-2 rounded-md dark:text-white text-sm flex  gap-2 items-center font-semibold  w-full justify-center  shadow bg-paper-light   dark:bg-admin-terciary"
					>
						<span>
							<i class="fa-brands fa-whatsapp" /> Enviar a todos
						</span>
					</button>
				</div>
			</div>
			{table.checks.value.length ? (
				<div class="flex items-center gap-2">
					<button
						type="button"
						onClick={() => onSendALL("selected")}
						aria-label="send all"
						class="bg-blue-600 px-2 py-2  rounded-md text-white text-sm  shadow-md w-full"
					>
						<i class="fa-brands fa-whatsapp" /> Enviar a seleccionados{" "}
						<b>{table.checks.value.length}</b>
					</button>
					<button
						type="button"
						onClick={() => onStoreGroup()}
						aria-label="send all"
						class="bg-blue-600 px-2 py-2  rounded-md text-white text-sm  shadow-md w-full"
					>
						<i class="fa-duotone fa-people-group" /> Agregar a grupo{" "}
						<b>{table.checks.value.length}</b>
					</button>
				</div>
			) : (
				<></>
			)}
			<div class="overflow-auto ">
				<VigilioTable query={query} table={table}>
					<VigilioTable.header>
						<VigilioTable.header.tools
							hiddenDelete
							placeholderSearch="Buscar por nombre"
						/>
						<VigilioTable.header.limit />
					</VigilioTable.header>
					<VigilioTable.table>
						<VigilioTable.thead>
							<VigilioTable.thead.row>
								<VigilioTable.thead.th />
							</VigilioTable.thead.row>
						</VigilioTable.thead>
						<VigilioTable.tbody>
							<VigilioTable.tbody.row>
								{(data) => <VigilioTable.tbody.td data={data} />}
							</VigilioTable.tbody.row>
						</VigilioTable.tbody>
					</VigilioTable.table>
					<VigilioTable.footer>
						<VigilioTable.footer.paginator />
						<VigilioTable.footer.show />
					</VigilioTable.footer>
				</VigilioTable>
			</div>
		</Container>
	);
}

interface ChatWhatsappProps {
	contacts: number[];
	type: "favorites" | "all" | "selected";
	onClose: () => void;
}
function ChatWhatsapp({ contacts, type, onClose }: ChatWhatsappProps) {
	const messages = useSignal<(string | File)[]>([]);
	const messageForm = useForm<{ message: string }>({});
	const delayValue = useSignal(35);
	const botSendMessageMutation = whatsappSendMessageApi();
	const whatsappSendFileMutation = whatsappSendFileApi();
	const informationFavoritesMutation = informationContactsFavoritesApi();
	const informationContactsMutation = informationContactsIndexApi();
	const messageSuccess = useSignal<string | null>(null);
	const isLoading = useSignal<boolean>(false);

	function onSendMessage(data: { message: string }) {
		messages.value = [...messages.value, data.message];
		messageForm.reset();
	}

	function removeMessage(message: string | File) {
		messages.value = messages.value.filter((m) => m !== message);
	}
	async function sendMessage() {
		if (!messages.value.length) return;
		sweetModal({
			title: "¿Estás seguro de enviar mensajes de whatsapp?",
			customIcon:
				"<i class='fa-brands fa-whatsapp text-3xl dark:text-white' ></i>",
			showCloseButton: true,
			showCancelButton: true,
		}).then(async ({ isConfirmed }) => {
			if (isConfirmed) {
				if (type === "selected") {
					await send(contacts as unknown as string[]);
					return;
				}
				if (type === "all") {
					informationContactsMutation.mutate(null, {
						async onSuccess(data) {
							await send(data.data.map((contact) => String(contact.telephone)));
						},
					});
					return;
				}
				if (type === "favorites") {
					informationFavoritesMutation.mutate(null, {
						async onSuccess(data) {
							await send(
								data.favorites.map((contact) => String(contact.telephone)),
							);
						},
					});
					return;
				}
			}
		});
	}

	async function send(contacts: string[]) {
		isLoading.value = true;
		for (const contact of contacts) {
			await delay(delayValue.value);

			for (const message of messages.value) {
				if (message instanceof File) {
					whatsappSendFileMutation.mutateAsync({
						file: message,
						telephone: String(contact),
					});
				} else {
					await botSendMessageMutation.mutateAsync({
						message,
						telephone: String(contact),
					});
				}

				await delay(2);
			}
			messageSuccess.value = `Se envió correctamente mensaje a ${contact}`;
		}
		isLoading.value = false;
		messageSuccess.value = null;
		messages.value = [];
		sweetAlert({
			icon: "success",
			title: "Se envio los mensajes correctamente.",
		});
		onClose();
	}
	return (
		<div class="p-2 relative rounded-md overflow-hidden">
			<h3 class="text-xl text-primary font-bold text-center flex justify-center items-center">
				{type === "all"
					? "Enviar a todos"
					: type === "favorites"
						? "Enviar a favoritos"
						: `Enviar a seleccionados ${contacts?.length}`}
			</h3>
			<div class="flex flex-col h-[520px] gap-1.5 m-1 overflow-auto form-chat mb-12  p-3">
				{messages.value.length ? (
					<>
						{messages.value.map((message) => (
							<Fragment key={message}>
								{message instanceof File ? (
									<div class=" font-normal bg-[#E1FEC4] px-2 py-1 rounded-md self-end flex flex-col relative">
										{message.type.includes("image") ? (
											<img
												width={100}
												height={100}
												src={URL.createObjectURL(message)}
												alt=""
											/>
										) : (
											<span>
												Archivo: <span class="underline">
													{message.name}
												</span>{" "}
											</span>
										)}
										<button
											type="button"
											class="bg-danger text-white w-[15px] h-[15px] rounded-full absolute -top-2 -right-2 flex justify-center items-center"
											aria-label="remove"
											onClick={() => removeMessage(message)}
										>
											x
										</button>
									</div>
								) : (
									<div class=" font-normal bg-[#E1FEC4] px-2 py-1 rounded-md self-end flex flex-col relative">
										<p class="text-sm font-semibold">{message}</p>
										<button
											type="button"
											class="bg-danger text-white w-[15px] h-[15px] rounded-full absolute -top-2 -right-2 flex justify-center items-center"
											aria-label="remove"
											onClick={() => removeMessage(message)}
										>
											x
										</button>
									</div>
								)}
							</Fragment>
						))}
					</>
				) : (
					<span class="text-center block dark:text-white">
						No se ha escrito mensaje
					</span>
				)}
			</div>
			{messageSuccess.value ? (
				<h3 class="text-white py-2 px-1 bg-success  mb-8 text-xs">
					<i class="fa-solid fa-check" /> {messageSuccess.value}
				</h3>
			) : null}
			<form
				onSubmit={messageForm.handleSubmit(onSendMessage)}
				class="absolute bottom-0 right-0 left-0  flex   overflow-auto  h-[38px] shadow rounded-md"
			>
				<input
					class="w-full  outline-none px-1 bg-paper-light dark:bg-admin-terciary dark:text-white "
					type="text"
					{...messageForm.register("message", {
						required: {
							message: "Este campo es obligatorio",
							value: true,
						},
					})}
					placeholder="Escribir mensaje"
				/>
				<button
					class="px-4 py-2 flex justify-center items-center dark:text-white  text-xs font-light bg-primary"
					type="submit"
					aria-label="send message"
				>
					<i class="fa-solid fa-paper-plane-top" />
				</button>
				<div class="relative">
					<input
						type="number"
						value={delayValue.value}
						onChange={(e) => {
							const delay = Number((e.target as HTMLInputElement).value);
							if (delay < 50) {
								delayValue.value = 50;
								return;
							}
							delayValue.value = delay;
						}}
						class="w-[60px] h-full  bg-paper-light dark:bg-admin-terciary dark:text-white  pl-2"
					/>
					<span class="text-[8px] dark:text-white absolute  w-full left-2 top-6 z-10">
						seg x mensaje
					</span>
				</div>

				<label
					class="px-4 dark:text-white border border-gray-600 flex justify-center items-center"
					type="button"
					id="file"
				>
					<i class="fa-solid fa-image" />
					<input
						type="file"
						hidden
						id="file"
						onChange={(e) => {
							messages.value = [
								...messages.value,
								...(e.target as HTMLInputElement).files!,
							];
						}}
						accept="image/*"
					/>
				</label>
				<label
					class="px-4 dark:text-white border border-gray-600 flex justify-center items-center"
					type="button"
					id="file2"
				>
					<i class="fa-solid fa-paperclip" />
					<input
						type="file"
						hidden
						id="file2"
						onChange={(e) => {
							messages.value = [
								...messages.value,
								...(e.target as HTMLInputElement).files!,
							];
						}}
						accept=".doc, .docx, .pdf"
					/>
				</label>
				{messages.value.length ? (
					<button
						class="px-4 py-2 flex justify-center relative items-center text-white font-light bg-green-600 ml-2 rounded-md  text-xs"
						type="submit"
						aria-label="send message"
						onClick={() => sendMessage()}
						disabled={botSendMessageMutation.isLoading || false}
					>
						{isLoading.value ? (
							<LoaderSubmit />
						) : (
							<>
								<i class="fa-brands fa-whatsapp mr-1" /> Enviar
							</>
						)}

						{type === "selected" ? (
							<span class="absolute -top-0 -right-0 w-[20px] h-[20px] font-bold rounded-full bg-danger text-white flex justify-center items-center z-[99]">
								{contacts.length}
							</span>
						) : null}
					</button>
				) : null}
			</form>

			<style jsx>{`
                .form-chat {
                    scrollbar-color: black;
                    scrollbar-width: thin;
                }
            `}</style>
		</div>
	);
}

interface StoreContactProps {
	refetch: (clean?: boolean) => void;
}

function StoreContact({ refetch }: StoreContactProps) {
	const storeContact = useForm<ContactsSchema>({
		resolver: valibotVigilio(contactsSchema),
		defaultValues: { ia: true },
	});
	const informationContactsStoreUpdateMutation =
		informationContactsStoreUpdateApi();

	function onAddContact(body: ContactsSchema) {
		sweetModal({
			title: "¿Estás seguro de agregar este contacto en whatsapp?",
			customIcon:
				"<i class='fa-brands fa-whatsapp text-3xl dark:text-white' ></i>",
			showCloseButton: true,
			showCancelButton: true,
		}).then(async ({ isConfirmed }) => {
			if (isConfirmed) {
				informationContactsStoreUpdateMutation.mutate(body, {
					onSuccess(data) {
						sweetAlert({ title: data.message, icon: "success" });
						refetch(false);
					},
					onError(error) {
						handlerError(storeContact, error);
					},
				});
			}
		});
	}
	return (
		<>
			<h2 class="dark:text-white text-xl mb-4 uppercase">
				<i class="fas fa-user" /> Agregar contacto
			</h2>{" "}
			<Form {...storeContact} onSubmit={onAddContact}>
				<Form.control
					name={"name" as keyof ContactsSchema}
					placeholder="XXXX"
					title="Nombre del contacto"
				/>
				<Form.control
					name={"telephone" as keyof ContactsSchema}
					placeholder="9XXXXXX"
					title="Nombre del contacto"
					ico={<span>+{storageInformation?.dial_code}</span>}
				/>
				<Form.control.toggle
					name={"isFavorite" as keyof ContactsSchema}
					title="Favorito"
				/>
				<Form.button.submit
					title="Guardar Contacto"
					disabled={informationContactsStoreUpdateMutation.isLoading || false}
					isLoading={informationContactsStoreUpdateMutation.isLoading || false}
				/>
			</Form>
		</>
	);
}

export function QrWhatsapp() {
	const qrCodeQuery = whatsappGetQrApi();
	const whatsappRestartMutation = whatsappRestart();
	return (
		<div class="flex flex-col gap-4 justify-center items-center">
			<h3 class="text-xl font-bold text-paper-light flex items-center gap-2 text-primary">
				<span>Conectar bot de WhatsApp</span>{" "}
				<i class="fa-duotone fa-message-bot" />
			</h3>
			<p class="text-md dark:text-white font-bold">
				Escanea este codigo Qr en ajustes de tu whatsapp
			</p>
			{qrCodeQuery.isLoading && <p class="dark:text-white">Cargando QR...</p>}
			{qrCodeQuery.data && (
				<div class="relative flex flex-col  gap-2">
					<img
						width={300}
						height={300}
						src={URL.createObjectURL(qrCodeQuery.data)}
						class="rounded-lg"
						alt="bot whatsapp"
					/>
					<div class="flex justify-between gap-2">
						<div />
						<button
							type="button"
							class="self-end bg-black bg-opacity-60 w-[30px] h-[30px] flex justify-center items-center rounded-md"
							onClick={() => {
								whatsappRestartMutation.mutate(null, {
									onSuccess() {
										sweetAlert({
											icon: "success",
											title: "Reinciado correctamente whatsapp",
										});
									},
									onError(err) {
										sweetAlert({
											icon: "success",
											title: (err as Error).message,
										});
									},
								});
							}}
						>
							<i class="fa-solid fa-rotate-right text-white text-xl" />
						</button>
						<div />
					</div>
				</div>
			)}
			<ul class="list-image-none flex flex-col gap-2">
				<li class="dark:text-white text-center">
					*Si no está funcionando el qr.{" "}
					<a
						href={linkVigilio()}
						class="text-md text-blue-400 hover:underline"
						target="_blank"
						rel="noreferrer"
					>
						Comunicarte con la empresa
					</a>{" "}
					para solucionarte el problema.
				</li>
			</ul>
		</div>
	);
}
interface GroupStoreProps {
	contacts: number[];
	onClose: () => void;
	clear: () => void;
}
function GroupWhatsappStore({ contacts, onClose, clear }: GroupStoreProps) {
	const groupWhatsappStoreMutation = groupWhatsappStoreApi();
	const groupStoreForm = useForm<GroupWhatsapp>({
		resolver: valibotVigilio(groupWhatsapp),
		defaultValues: {
			members: contacts.map((contact) => contact.toString()),
		},
	});
	function onGroupStore(body: GroupWhatsapp) {
		groupWhatsappStoreMutation.mutate(body, {
			onSuccess(data) {
				sweetAlert({ icon: "success", title: data.message });
				clear();
				onClose();
			},

			onError(error) {
				handlerError(groupStoreForm, error);
			},
		});
	}
	return (
		<div>
			<div class="flex items-center ">
				<h1 class="dark:text-white font-bold text-xl  text-center flex-1">
					Crear Grupo
				</h1>
			</div>
			<Form className="w-full" {...groupStoreForm} onSubmit={onGroupStore}>
				<Form.control
					name={"name" as keyof GroupWhatsapp}
					placeholder="Grupo 1"
					title="Nombre"
				/>
				<div class="break-words">
					<span class="text-primary text-xs">
						Numeros de telefonos <b>{contacts.length}</b>
					</span>
					<div class="dark:text-white h-[100px]  break-words overflow-auto text-xs text-wrap">
						<pre class="break-words text-wrap">{JSON.stringify(contacts)}</pre>
					</div>
				</div>

				<Form.button.submit
					title="Guardar"
					ico={null}
					isLoading={groupWhatsappStoreMutation.isLoading || false}
					disabled={groupWhatsappStoreMutation.isLoading || false}
				/>
			</Form>
		</div>
	);
}

function GroupIndex() {
	const groupWhatsappDestroyMutation = groupWhatsappDestroyApi();
	const groupWhatsappStoreQuery = groupWhatsappIndexApi();
	if (groupWhatsappStoreQuery.isLoading) return null;
	return (
		<div>
			<div class="flex  mb-6 items-center ">
				<h1 class="dark:text-white font-bold text-xl mb-2 text-center flex-1">
					Grupos
				</h1>
			</div>
			<div class="grid grid-cols-2 gap-2">
				{groupWhatsappStoreQuery.data?.data.length ? (
					<>
						{groupWhatsappStoreQuery.data?.data.map((group) => (
							<div
								type="button"
								class="flex gap-2 items-center justify-center dark:bg-admin-terciary bg-paper-light rounded-md shadow p-1 dark:text-white "
								key={group.name}
								onClick={() => {
									sweetModal({
										html: reactComponent(
											<GroupWhatsappShow
												refetch={groupWhatsappStoreQuery.refetch}
												name={group.name}
											/>,
										),
										showCloseButton: true,
										isCloseInBackground: false,
									});
								}}
							>
								<div class="flex flex-col gap-1 items-center">
									<span class="dark:text-white">{group.name}</span>
									<i class="fa-duotone fa-people-group" />
									<span>{group.members.length}</span>
									<button
										type="button"
										class="bg-danger px-2 py-1 rounded-md text-white"
										onClick={(e) => {
											e.stopPropagation();
											sweetModal({
												icon: "info",
												title: "Estas seguro de eliminar este grupo?",
												showCloseButton: true,
												showCancelButton: true,
											}).then(({ isConfirmed }) => {
												if (isConfirmed) {
													groupWhatsappDestroyMutation.mutate(group.name, {
														onSuccess(data) {
															sweetAlert({
																title: data.message,
																icon: "success",
															});
															groupWhatsappStoreQuery.refetch(false);
														},
														onError(error) {
															sweetAlert({
																title: error.message,
																icon: "danger",
															});
														},
													});
												}
											});
										}}
									>
										<i class="fas fa-trash" />
									</button>
								</div>
							</div>
						))}
					</>
				) : (
					<h3
						class="dark:text-white col-span-2 text-center
                    "
					>
						No hay miembros
					</h3>
				)}
			</div>
		</div>
	);
}

interface GroupWhatsappShowProps {
	name: string;
	refetch: (clean?: boolean) => void;
}
function GroupWhatsappShow({ name, refetch }: GroupWhatsappShowProps) {
	const groupWhatsappShowQuery = groupWhatsappShowApi(name);

	let component: JSX.Element | null = null;
	if (groupWhatsappShowQuery.isLoading) {
		component = <Loading />;
	}
	if (groupWhatsappShowQuery.isSuccess) {
		const groupWhatsappTelephoneDestroyMutation =
			groupWhatsappTelephoneDestroyApi();
		const informationGroupWhatsappUpdateMutation =
			informationGroupWhatsappUpdateApi();
		const value = useSignal("");
		const isOpenMoreMembers = useSignal(false);
		const informationContactsSearchQuery = informationContactsSearchApi(value);
		const newContacts = useSignal<
			{
				name: string;
				telephone: string;
				isFavorite: boolean;
			}[]
		>([]);
		const dropdown = useDropdown();

		component = (
			<div>
				<div class="flex justify-between">
					<div class="" />
					<span class="dark:text-white mb-2 block font-bold text-xl text-center">
						{name}
					</span>
					<button
						type="button"
						class="text-xl text-white bg-primary px-3 py-1 rounded-md mr-7"
						onClick={() => {
							isOpenMoreMembers.value = !isOpenMoreMembers.value;
						}}
					>
						+
					</button>
				</div>
				{isOpenMoreMembers.value ? (
					<>
						{" "}
						<div class="flex gap-2 mb-2 relative mt-2">
							<form
								onSubmit={(e) => {
									e.preventDefault();
									dropdown.onOpen();
									informationContactsSearchQuery.refetch(false);
								}}
								class="flex gap-2 w-full shadow p-1 rounded-md overflow-hidden border border-primary"
							>
								<input
									class="w-full border-none outline-none bg-transparent dark:text-white"
									type="text"
									placeholder="Digite nombre"
									onChange={(e) => {
										value.value = (e.target as HTMLInputElement).value;
									}}
								/>
								<button
									type="submit"
									class="bg-primary px-3 py-2 rounded-md text-white text-xs"
								>
									Buscar
								</button>
							</form>
							{informationContactsSearchQuery.isSuccess &&
							dropdown.dropdownOpen ? (
								<div class="absolute dark:bg-admin-terciary bg-white shadow p-2 top-6 w-full">
									{informationContactsSearchQuery.data?.data.length ? (
										<div
											class={`flex flex-col ${
												dropdown.dropdownOpen ? "" : "hidden"
											}`}
										>
											{informationContactsSearchQuery.data?.data.map(
												(contact) => (
													<div
														class="flex  gap-2 items-center tex-xs justify-between my-1"
														key={contact.telephone}
													>
														<span class="text-sm dark:text-white">
															{contact.name} | {contact.telephone}
														</span>
														{groupWhatsappShowQuery.data?.group.members.find(
															(member) =>
																member.telephone === contact.telephone,
														) ? (
															<i class="fas fa-empty-set mx-auto" />
														) : (
															<button
																onClick={() => {
																	const existContact = newContacts.value.find(
																		(co) => co.telephone === contact.telephone,
																	);
																	if (existContact) {
																		newContacts.value =
																			newContacts.value.filter(
																				(cont) =>
																					cont.telephone !== contact.telephone,
																			);
																		return;
																	}
																	sweetAlert({
																		icon: "success",
																		title: "Agregado correctamente",
																	});
																	newContacts.value = [
																		...newContacts.value,
																		contact,
																	];
																}}
																type="button"
																class="bg-primary px-3 py-2 rounded-md text-white"
															>
																{newContacts.value.some(
																	(co) => co.telephone === contact.telephone,
																)
																	? "-"
																	: "+"}
															</button>
														)}
													</div>
												),
											)}
											<button
												type="button"
												class="dark:text-white w-full text-center"
												onClick={() => {
													dropdown.onClose();
												}}
											>
												Cerrar
											</button>
										</div>
									) : (
										<span class="dark:text-white">
											No hay contactos encontrados
										</span>
									)}
								</div>
							) : null}
						</div>
					</>
				) : null}

				{newContacts.value.length ? (
					<div class="bg-paper-light dark:bg-admin-terciary p-2 rounded-md my-2 flex flex-col">
						{newContacts.value.map((contact) => (
							<div
								key={contact.telephone}
								class="text-xs dark:text-white flex justify-between"
							>
								<span class="py-1">
									{contact.name} - {contact.telephone}{" "}
								</span>
								<button
									type="button"
									onClick={() => {
										newContacts.value = newContacts.value.filter(
											(c) => c.telephone !== contact.telephone,
										);
									}}
								>
									x
								</button>
							</div>
						))}
						<button
							type="button"
							class="dark:text-white text-xs mt-2"
							onClick={() => {
								informationGroupWhatsappUpdateMutation.mutate(
									{
										name,
										members: [
											...groupWhatsappShowQuery.data!.group.members.map(
												(v) => v.telephone,
											),
											...newContacts.value.map((v) => v.telephone),
										],
									},
									{
										onSuccess() {
											sweetAlert({
												title: "Se editó grupo",
											});
											groupWhatsappShowQuery.refetch();
											newContacts.value = [];
										},
									},
								);
							}}
						>
							{informationGroupWhatsappUpdateMutation.isLoading ? (
								<LoaderSubmit />
							) : (
								"Agregar y actualizar"
							)}
						</button>
					</div>
				) : null}

				<div class="grid grid-cols-2 gap-2  h-[500px] overflow-auto my-2">
					{groupWhatsappShowQuery.data?.group.members.map((member) => (
						<div
							class="dark:bg-admin-terciary bg-paper-light p-1 rounded-md dark:text-white  self-start gap-2 items-center flex justify-between cursor-pointer"
							key={member.telephone}
						>
							<span class="text-black dark:text-white">
								{member.name} | {member.telephone}
							</span>
							<button
								onClick={() => {
									sweetModal({
										icon: "info",
										title: `Estas seguro de eliminar este miembro ${member.name}?`,
										showCloseButton: true,
										showCancelButton: true,
									}).then(({ isConfirmed }) => {
										if (isConfirmed) {
											groupWhatsappTelephoneDestroyMutation.mutate(
												{
													name,
													telephone: member.telephone,
												},
												{
													onSuccess(data) {
														sweetAlert({
															title: data.message,
															icon: "success",
														});
														groupWhatsappShowQuery.refetch(false);
														refetch(false);
													},
													onError(error) {
														sweetAlert({
															title: error.message,
															icon: "danger",
														});
													},
												},
											);
										}
									});
								}}
								type="button"
								class=" text-white bg-danger px-2 py-1 rounded-md text-xs"
							>
								<i class="fas fa-trash" />
							</button>
						</div>
					))}
				</div>
				{groupWhatsappShowQuery.data?.group.members.length ? (
					<button
						type="button"
						class="px-3 py-2 rounded-md text-white bg-primary text-xs mt-3"
						aria-label="send message group"
						onClick={() => {
							sweetModal((onClose) => ({
								isCloseInBackground: false,
								showCloseButton: true,
								html: reactComponent(
									<ChatWhatsapp
										type={"selected"}
										contacts={
											groupWhatsappShowQuery.data?.group.members.map(
												(member) => member.telephone,
												// biome-ignore lint/suspicious/noExplicitAny: <explanation>
											) as any
										}
										onClose={onClose}
									/>,
								),
								sweetWidth: "600px",
							}));
						}}
					>
						Enviar mensaje al grupo
					</button>
				) : null}
			</div>
		);
	}
	return component;
}

function MessagesWhatsappSettings() {
	const information = useInformationStore();
	const informationWhatsappConfigUpdateMutation =
		informationWhatsappConfigUpdateApi();
	const whatsappConfigForm = useForm<Whatsappconfig>({
		defaultValues: information.state!.whatsappconfig,
	});
	function onUpdateWhatsapp(body: Whatsappconfig) {
		sweetModal({ title: "¿estas seguro de realizar esta acción?" }).then(
			({ isConfirmed }) => {
				if (isConfirmed) {
					informationWhatsappConfigUpdateMutation.mutate(body, {
						onSuccess(data) {
							information.methods.updateInformation({
								whatsappconfig: body,
							});
							sweetAlert({
								icon: "success",
								title: data.message,
							});
						},
						onError(error) {
							handlerError(whatsappConfigForm, error);
						},
					});
				}
			},
		);
	}
	return (
		<div class="flex flex-col gap-4 justify-center items-center">
			<h3 class="text-xl font-bold text-paper-light flex items-center gap-2 text-primary">
				<span>Configurar mensajes de whatsapp</span>
				<i class="fa-duotone fa-message-bot" />
			</h3>
			<Form {...whatsappConfigForm} onSubmit={onUpdateWhatsapp}>
				<div class="mb-2 flex justify-between items-center">
					<AlertInfo>
						<span>No borrar las variables {"{}"}</span>
					</AlertInfo>
					<button
						class="justify-end text-xs dark:bg-admin-terciary px-4 py-2 rounded-md shadow dark:text-white bg-paper-lights"
						type="button"
						aria-label="reset"
						onClick={() => {
							whatsappConfigForm.reset({
								enabled:
									"No estamos disponible este momento. Intentelo más tarde.",
								cerrado:
									"Cerrado. No estamos disponible este momento. Intentelo más tarde.",
								thank: "Muchas gracias por su compra, Su {COMPROBANTE}😊.",
								thank2:
									"No olvides visitar nuestro sitio web: {URL} 😊 para tener más información de nuestros productos, como ofertas y novedades.",
								sendpdf:
									"Hola, Aqui {NAME_EMPRESA} le adyunta su {COMPROBANTE} 😊.",
							});
						}}
					>
						Reset
					</button>
				</div>

				<Form.control
					title="Web disponible Mensaje"
					name={"enabled" as keyof Whatsappconfig}
				/>
				<Form.control
					title="Tienda Cerrado"
					name={"cerrado" as keyof Whatsappconfig}
				/>
				<Form.control
					title="Agradecimiento 1"
					name={"thank" as keyof Whatsappconfig}
				/>
				<Form.control
					title="Agradecimiento 2"
					name={"thank2" as keyof Whatsappconfig}
				/>
				<Form.control
					title="Mensaje al enviar pdf"
					name={"sendpdf" as keyof Whatsappconfig}
				/>
				<Form.button.submit
					title="Guardar cambios"
					isLoading={informationWhatsappConfigUpdateMutation.isLoading || false}
					disabled={informationWhatsappConfigUpdateMutation.isLoading || false}
				/>
			</Form>
		</div>
	);
}
export default Whatsapp;
