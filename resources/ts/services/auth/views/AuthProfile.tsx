import useAuthstore from "../stores/auth.store";
import Form from "~/components/form";
import { printFileUser, type UsersFotoQualities } from "@/users/libs/helpers";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { formatDateTwo, handlerError } from "~/libs/helpers";
import { useSignal } from "@preact/signals";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { useEffect, useMemo } from "preact/hooks";
import {
	usersProfileDto,
	usersProfilePhotoDto,
	type UsersProfileDto,
	type UsersProfilePhotoDto,
} from "@/users/dtos/users.profile.dto";
import {
	usersProfileApi,
	usersProfilePhotoApi,
} from "@/users/apis/users.profile.api";
import { usersPasswordApi } from "@/users/apis/users.password.api";
import useAuthStore from "../stores/auth.store";
import {
	usersPasswordDto,
	type UsersPasswordDto,
} from "@/users/dtos/users.password.dto";
import { getFilesEdit } from "~/libs/upload";
import { logoutUrl } from "../libs";
import { ordersUserPaginatorApi } from "@/common/paginator/orders.paginator.api";
import usePaginatorTimer from "~/hooks/usePaginatorTimer";
import { useTable } from "@vigilio/preact-table";
import VigilioTable from "~/components/table";
import ordersUserColumns from "@/orders/libs/OrdersUserColumns";
import enviroments from "~/config";
import type { OrdersSchemaFromServer } from "@/orders/schemas/orders.schema";
import OrderShowClient from "@/orders/components/OrderShowClient";
import usePaginator from "@vigilio/preact-paginator";
import { favoritesPaginatorApi } from "@/common/paginator/favorites.paginator.api";
import { printImagesProduct } from "@/products/libs/helpers";
import Loader from "~/components/Loader";
import {
	formatMoney,
	formatMoneyDinamic,
	subtotalIgv,
} from "@/cart/libs/helpers";
import useProduct from "@/products/hooks/useProduct";
import LoaderSubmit from "~/components/LoaderSubmit";

type View = "information" | "orders" | "change-password" | "favorites";

function AuthProfile() {
	const view = useSignal<View>("information");

	const authStore = useAuthstore();
	if (!authStore.state) return null;

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const query = urlParams.get("type")!;
		if (
			["orders", "information", "change-password", "favorites"].includes(query)
		) {
			view.value = query as View;
		}
	}, []);
	const state = authStore.state;

	function onOpenPhotoUser() {
		sweetModal({
			html: reactComponent(<UpdatePhoto />),
			isCloseInBackground: false,
			showCloseButton: true,
		});
	}
	return (
		<div class="max-w-6xl mx-auto w-full">
			<section class="flex gap-5 flex-col md:flex-row dark:bg-paper-dark bg-background-light shadow-md w-full mx-auto p-8 rounded-md ">
				<div class="flex flex-col gap-4  lg:w-[350px]">
					<h2 class="text-primary font-vigilio-title px-3 mx-auto font-bold dark:text-white">
						Mi Perfil
					</h2>
					<div class="relative w-[100px] h-[100px] rounded-full mx-auto overflow-hidden group">
						<img
							src={printFileUser(state.photo, 300)[0]}
							width={100}
							height={100}
							class=""
							alt={state.name}
						/>
						<button
							class="flex justify-center items-center  py-2 absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 group-hover:translate-y-0 md:translate-y-52  delay-100 transition-transform cursor-pointer"
							onClick={onOpenPhotoUser}
							type="button"
							aria-label="open to change profile image"
						>
							<span class=" text-white">
								<i class="fas fa-camera" />
							</span>
						</button>
					</div>
					<ul class="flex md:flex-col gap-2 justify-center md:justify-start">
						<li
							class={`${
								view.value === "information" ? "bg-primary text-white" : ""
							} py-2 px-3 rounded-sm hover:bg-primary delay-custom-1 hover:text-white`}
						>
							<a
								href={`${enviroments.VITE_URL}/auth/profile?type=information`}
								class="  font-vigilio-p dark:text-white"
							>
								<i class="fas fa-user mr-1" />
								<span class=" hidden md:inline">Información Personal</span>
							</a>
						</li>
						<li
							class={`${
								view.value === "favorites" ? "bg-primary text-white" : ""
							} py-2 px-3 rounded-sm  hover:bg-primary delay-custom-1 hover:text-white`}
						>
							<a
								href={`${enviroments.VITE_URL}/auth/profile?type=favorites`}
								class="font-vigilio-p dark:text-white"
							>
								<i class="fas fa-heart mr-1" />
								<span class=" hidden md:inline">Mis Favoritos</span>
							</a>
						</li>
						<li
							class={`${
								view.value === "orders" ? "bg-primary text-white" : ""
							} py-2 px-3 rounded-sm  hover:bg-primary delay-custom-1 hover:text-white`}
						>
							<a
								href={`${enviroments.VITE_URL}/auth/profile?type=orders`}
								class=" font-vigilio-p dark:text-white"
							>
								<i class="fas fa-box mr-1" />
								<span class=" hidden md:inline"> Mis pedidos</span>
							</a>
						</li>
						<li
							class={`${
								view.value === "change-password" ? "bg-primary text-white" : ""
							} py-2 px-3 rounded-sm  hover:bg-primary delay-custom-1 hover:text-white`}
						>
							<a
								href={`${enviroments.VITE_URL}/auth/profile?type=change-password`}
								class="font-vigilio-p dark:text-white"
							>
								<i class="fas fa-lock mr-1" />
								<span class=" hidden md:inline">Cambiar Contraseña</span>
							</a>
						</li>
					</ul>
				</div>
				<div class="w-full">
					{view.value === "information" ? (
						<Information />
					) : view.value === "orders" ? (
						<OrdersUser />
					) : view.value === "change-password" ? (
						<ChangePassword />
					) : view.value === "favorites" ? (
						<Favorites />
					) : null}
				</div>
			</section>
		</div>
	);
}

function Information() {
	const authStore = useAuthStore();
	const user = authStore.state!;
	const mutateUsersProfileApi = usersProfileApi();

	const formUsersProfile = useForm<UsersProfileDto>({
		resolver: valibotVigilio(usersProfileDto),
		mode: "all",
		defaultValues: useMemo(() => {
			return {
				user_code: user.user_code,
				username: user.username,
				specialty: user.specialty,
				name: user.name,
				address: user.address,
				dni: user.dni,
				email: user.email,
				father_lastname: user.father_lastname,
				mother_lastname: user.mother_lastname,
				enabledNotification: user.enabledNotification,
				birthday: user.birthday
					? (formatDateTwo(user.birthday, "YYYY-MM-DD") as Date)
					: null,
				telephone: user.telephone,
				createdAt: formatDateTwo(user.createdAt!, "YYYY-MM-DD hh:mm") as Date,
				updatedAt: formatDateTwo(user.updatedAt!, "YYYY-MM-DD hh:mm") as Date,
			};
		}, []),
	});

	function onUpdateUser(data: UsersProfileDto) {
		sweetModal({
			title: "¿Estás seguro de editar tu perfil?",
			customIcon: "<i class='fas fa-user text-3xl dark:text-white' ></i>",
			showCancelButton: true,
			showCloseButton: true,
		}).then(({ isConfirmed }) => {
			if (isConfirmed) {
				mutateUsersProfileApi.mutate(data, {
					onSuccess(data) {
						authStore.methods.updateUser(data.user);
						sweetAlert({
							icon: "success",
							title: `<p class="text-center">Se actualizó tu información correctamente <b>${data.user.name}</b></p>`,
						});
					},
					onError(error) {
						handlerError(formUsersProfile, error);
					},
				});
			}
		});
	}

	return (
		<div className="flex flex-col lg:flex-row gap-3">
			<div class="w-full  p-4 rounded-md">
				<div class="flex justify-between items-center mb-4">
					<h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
						<i class="fa-solid fa-users" />
						Información Personal - {user.username}
					</h3>
				</div>
				<Form {...formUsersProfile} onSubmit={onUpdateUser}>
					<div class="w-full flex flex-col sm:flex-row gap-2">
						<Form.control.web
							ico={<i class="fas fa-user-circle" />}
							name={"username" as keyof UsersProfileDto}
							title="Nombre de usuario"
							disabled
						/>
						<Form.control.web
							ico={<i class="fas fa-user" />}
							name={"name" as keyof UsersProfileDto}
							title="Nombre"
							placeholder="Jhon"
						/>
					</div>
					<div class="w-full flex flex-col sm:flex-row gap-2">
						<Form.control.web
							ico={<i class="fas fa-user-circle" />}
							name={"user_code" as keyof UsersProfileDto}
							title="Codigo de usuario"
							disabled
						/>
						<Form.control.web
							ico={<i class="fas fa-at" />}
							name={"email" as keyof UsersProfileDto}
							type="email"
							title="Correo Electrónico"
							placeholder="correo@gmail.com"
							disabled
						/>
					</div>
					<div class="w-full flex flex-col sm:flex-row gap-2">
						<Form.control.web
							ico={<i class="fas fa-male" />}
							name={"father_lastname" as keyof UsersProfileDto}
							title="Apellido paterno"
							placeholder=""
							question="Este campo no es obligatorio"
						/>
						<Form.control.web
							ico={<i class="fas fa-female" />}
							name={"mother_lastname" as keyof UsersProfileDto}
							title="Apellido materno"
							placeholder=""
							question="Este campo no es obligatorio"
						/>
					</div>
					<div class="w-full flex flex-col sm:flex-row gap-2">
						<Form.control.web
							ico={<i class="fas fa-at" />}
							name={"address" as keyof UsersProfileDto}
							title="Dirección"
							placeholder="MZ D LT - Puente Piedra"
						/>
						<Form.control.web
							ico={<i class="fas fa-mobile-alt" />}
							name={"telephone" as keyof UsersProfileDto}
							type="tel"
							title="Numero de Celular"
							placeholder="9XXXXXXXX"
							question="Este campo no es obligatorio"
						/>
					</div>
					<div class="w-full flex flex-col sm:flex-row gap-2">
						<Form.control.web
							ico={<i class="fas fa-id-card" />}
							name={"dni" as keyof UsersProfileDto}
							type="tel"
							title="DNI"
							placeholder="dni"
							question={"Este campo no es obligatorio"}
						/>
						<Form.control.web
							ico={<i class="fas fa-birthday-cake" />}
							name={"birthday" as keyof UsersProfileDto}
							type="date"
							title="Fecha de Nacimiento"
							placeholder="dni"
							question={"Este campo no es obligatorio"}
						/>
					</div>
					<h3 class="dark:text-white font-semibold text-sm mb-2">
						Configuración
					</h3>
					<div class="w-full flex flex-col sm:flex-row gap-2">
						<Form.control.toggle
							name={"enabledEmailsOffers" as keyof UsersProfileDto}
							title="Habilitar  Ofertas y Eventos"
							question="Ya no estará habilitado los correos de ofertas y eventos."
						/>
						<Form.control.toggle
							name={"enabledNotification" as keyof UsersProfileDto}
							title="Habilitar Notificaciones"
							question="Ya no estará habilitado las notificaciones push de tu navegador si no está habilitado."
						/>
					</div>

					<div class="w-full flex flex-col sm:flex-row gap-2">
						<Form.control.web
							ico={<i class="fa-solid fa-calendar-days" />}
							name={"createdAt" as keyof UsersProfileDto}
							title="Fecha de creación"
							disabled
						/>
						<Form.control.web
							ico={<i class="fa-solid fa-calendar-days" />}
							name={"updatedAt" as keyof UsersProfileDto}
							title="Fecha de actualización"
							disabled
						/>
					</div>

					<div class="flex justify-center">
						<Form.button.submit
							disabled={mutateUsersProfileApi.isLoading || false}
							isLoading={mutateUsersProfileApi.isLoading || false}
							ico={<i class="fas fa-pen" />}
							title="Guardar Cambios"
						/>
					</div>
				</Form>
			</div>
		</div>
	);
}

function OrdersUser() {
	const { time, SelectTimer } = usePaginatorTimer();
	const tableUser = useTable({
		columns: ordersUserColumns,
		pagination: { limit: 20 },
	});
	const ordersUserPaginatorQuery = ordersUserPaginatorApi(tableUser, time);
	function handleOpenOrderLocals(order: OrdersSchemaFromServer) {
		return sweetModal({
			html: reactComponent(<OrderShowClient order_code={order.order_code} />),
			showCloseButton: true,
			position: "start",
			sweetWidth: "800px",
			isCloseInBackground: false,
		});
	}
	useEffect(() => {
		// cuando cambie el time en el select. hacer peticion
		ordersUserPaginatorQuery.refetch(false);
	}, [time]);
	return (
		<div>
			<div class="overflow-auto">
				<VigilioTable query={ordersUserPaginatorQuery} table={tableUser}>
					<VigilioTable.header className="flex justify-center md:justify-between items-center mb-3  flex-wrap gap-2">
						<SelectTimer />
						<div className="flex items-center gap-1">
							<VigilioTable.header.limit />
							<VigilioTable.header.refetch />
						</div>
					</VigilioTable.header>
					<VigilioTable.table>
						<VigilioTable.thead className="text-[10px] text-white lg:text-xs bg-primary uppercase  shadow-sm  border-b ">
							<VigilioTable.thead.row>
								<VigilioTable.thead.th className="px-1 py-2 lg:px-3 lg:py-3  bg-primary text-center cursor-pointer" />
							</VigilioTable.thead.row>
						</VigilioTable.thead>
						<VigilioTable.tbody>
							<VigilioTable.tbody.row
								className="border-b h-[60px] dark:border-admin-terciary border-paper-light dark:text-white  hover:bg-primary  hover:text-secondary-light"
								handleClick={handleOpenOrderLocals}
							>
								{(data) => <VigilioTable.tbody.td data={data} />}
							</VigilioTable.tbody.row>
						</VigilioTable.tbody>
					</VigilioTable.table>
					<VigilioTable.footer>
						<div className="flex justify-center flex-col items-center gap-2">
							<VigilioTable.footer.paginator />
							<VigilioTable.footer.show />
						</div>
					</VigilioTable.footer>
				</VigilioTable>
			</div>
		</div>
	);
}
function ChangePassword() {
	const usersPasswordMutation = usersPasswordApi();
	const userPasswordFrom = useForm<UsersPasswordDto>({
		mode: "all",
		resolver: valibotVigilio(usersPasswordDto),
	});
	function onUpdatePassword(body: UsersPasswordDto) {
		sweetModal({
			title: "¿Estás seguro de editar actualizar tu contraseña?",
			customIcon: "<i class='fas fa-user text-3xl dark:text-white' ></i>",
			showCancelButton: true,
			showCloseButton: true,
		}).then(({ isConfirmed }) => {
			if (isConfirmed) {
				usersPasswordMutation.mutate(body, {
					onSuccess(data) {
						userPasswordFrom.reset();
						userPasswordFrom.clearErrors();
						sweetAlert({
							icon: "success",
							title: data.message,
						}).then(() => {
							window.location.href = logoutUrl();
						});
						// cerrar sesión
					},
					onError(error) {
						handlerError(userPasswordFrom, error);
					},
				});
			}
		});
	}
	return (
		<div class="lg:col-span-2  p-4 rounded-md">
			<div class="flex justify-between items-center">
				<h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
					Cambiar Contraseña
				</h3>
			</div>
			<Form {...userPasswordFrom} onSubmit={onUpdatePassword}>
				<Form.control.web
					ico={<i class="fas fa-lock" />}
					name={"passwordActual" as keyof UsersPasswordDto}
					title="Contraseña actual"
					placeholder="Digite su contraseña Actual"
					type="password"
				/>
				<Form.control.web
					ico={<i class="fas fa-lock" />}
					name={"newPassword" as keyof UsersPasswordDto}
					title="Nueva contraseña"
					placeholder="Digite su nueva contraseña"
					type="password"
				/>
				<Form.control.web
					ico={<i class="fas fa-lock" />}
					name={"repeatNewPassword" as keyof UsersPasswordDto}
					title="Repetir Nueva contraseña"
					placeholder="Repita su nueva contraseña"
					type="password"
				/>
				<div class="flex justify-center">
					<Form.button.submit
						disabled={usersPasswordMutation.isLoading || false}
						isLoading={usersPasswordMutation.isLoading || false}
						ico={<i class="fas fa-lock" />}
						title="Actualizar Contraseña"
					/>
				</div>
			</Form>
		</div>
	);
}

function UpdatePhoto() {
	const authStore = useAuthStore();
	const user = authStore.state!;
	const formUsersProfilePhoto = useForm<UsersProfilePhotoDto>({
		mode: "all",
		resolver: valibotVigilio(usersProfilePhotoDto),
	});
	async function initialUpdatePhoto() {
		if (user.photo) {
			const photo = await getFilesEdit(user.photo, 300 as UsersFotoQualities);
			formUsersProfilePhoto.setValue("photo", photo);
		}
	}
	useEffect(() => {
		initialUpdatePhoto();
	}, [user.photo]);

	const mutateUsersProfilePhotoApi = usersProfilePhotoApi(user.id);
	function onUpdatePhotoUser(data: UsersProfilePhotoDto) {
		sweetModal({
			title: "¿Estás seguro de editar tu foto de perfil?",
			customIcon: "<i class='fas fa-user text-3xl dark:text-white' ></i>",
			showCancelButton: true,
			showCloseButton: true,
		}).then(({ isConfirmed }) => {
			if (isConfirmed) {
				mutateUsersProfilePhotoApi.mutate(
					{ ...data, name: user.name },
					{
						onSuccess(result) {
							authStore.methods.updateUser({
								photo: result.files,
							});
							sweetAlert({
								icon: "success",
								title: "Se modifico foto correctamente",
							});
						},
					},
				);
			}
		});
	}
	return (
		<div class="mt-2  p-4 rounded-md">
			<div class="flex justify-between items-center">
				<h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
					<i class="fa-solid fa-image" />
					Editar photo - {user.username}
				</h3>
			</div>
			<Form {...formUsersProfilePhoto} onSubmit={onUpdatePhotoUser}>
				<Form.control.file
					name={"photo" as keyof UsersProfilePhotoDto}
					title="Photo de perfil"
					accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
					typeFile="image"
				/>
				<div class="flex justify-center">
					<Form.button.submit
						disabled={mutateUsersProfilePhotoApi.isLoading || false}
						isLoading={mutateUsersProfilePhotoApi.isLoading || false}
						ico={<i class="fas fa-pen" />}
						title="Actualizar foto"
					/>
				</div>
			</Form>
		</div>
	);
}

function Favorites() {
	const paginator = usePaginator();
	const favoritesPaginator = favoritesPaginatorApi(paginator);

	let component = null;
	if (favoritesPaginator.isLoading) {
		component = <Loader />;
	}
	if (favoritesPaginator.isError) {
		component = (
			<span class="text-xs dark:text-white text-primary">Hubo un error</span>
		);
	}
	if (favoritesPaginator.isSuccess) {
		component = (
			<>
				{favoritesPaginator.data!.results.length ? (
					<>
						{favoritesPaginator.data!.results.map((product, i) => {
							const {
								onFavorite,
								favoritesStoreMutation,
								favoritesDestroyMutation,
								producto,
							} = useProduct({ product });
							if (!producto.value.user?.isFavorite) return null;
							return (
								<div class="flex gap-2 w-full" key={`${product.id}-${i}`}>
									<img
										class="w-[80px] h-[80px] object-cover"
										width={200}
										height={200}
										src={printImagesProduct(product.images, 500)[0]}
										alt=""
									/>
									<div class="flex flex-col w-full">
										<a
											href={`${enviroments.VITE_URL}/${product.slug}`}
											class="text-primary dark:text-white font-semibold hover:underline "
										>
											{product.name}
										</a>
										{product.discount ? (
											<span class="font-semibold text-terciary  text-xs  line-through">
												{formatMoney(
													formatMoneyDinamic(subtotalIgv(product, false)),
												)}
											</span>
										) : null}
										<span class="font-semibold dark:text-white">
											{formatMoney(formatMoneyDinamic(subtotalIgv(product)))}
										</span>
									</div>
									<div class="flex justify-center items-center">
										<button
											type="button"
											disabled={
												favoritesStoreMutation.isLoading ||
												favoritesDestroyMutation.isLoading ||
												false
											}
											class="bg-primary text-white px-2 py-1 rounded-md border-2 border-primary min-w-[50px] "
											onClick={onFavorite}
										>
											{favoritesStoreMutation.isLoading ||
											favoritesDestroyMutation.isLoading ? (
												<LoaderSubmit />
											) : (
												<i class="fas fa-heart text-2xl " />
											)}
										</button>
									</div>
								</div>
							);
						})}
					</>
				) : (
					<span class="font-semibold text-start text-primary self-start dark:text-white mt-4 ">
						No tienes ningun producto favorito
					</span>
				)}
			</>
		);
	}

	return (
		<div class="lg:col-span-2  p-4 rounded-md">
			<div class="flex justify-between items-center">
				<h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2 mb-2">
					Mis productos Favoritos
				</h3>
			</div>
			<div class="flex flex-col justify-center items-center gap-2">
				{component}
			</div>
		</div>
	);
}
export default AuthProfile;
