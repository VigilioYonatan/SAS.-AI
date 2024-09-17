import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { useEffect, useMemo } from "preact/hooks";
import Form from "~/components/form";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import { formatDateTwo, handlerError } from "~/libs/helpers";
import type { UsersFotoQualities } from "../libs/helpers";
import { getFilesEdit } from "~/libs/upload";
import { valibotVigilio } from "~/libs/valibot";
import useAuthStore from "@/auth/stores/auth.store";
import { useForm } from "react-hook-form";
import {
	usersProfileDto,
	usersProfilePhotoDto,
	type UsersProfileDto,
	type UsersProfilePhotoDto,
} from "../dtos/users.profile.dto";
import {
	usersProfileApi,
	usersProfilePhotoApi,
} from "../apis/users.profile.api";
import { usersPasswordApi } from "../apis/users.password.api";
import {
	usersPasswordDto,
	type UsersPasswordDto,
} from "../dtos/users.password.dto";
import { logoutUrl } from "@/auth/libs";
import Container from "@/admin/components/Container";

function UsersProfile() {
	const authStore = useAuthStore();
	const user = authStore.state!;
	const formUsersProfile = useForm<UsersProfileDto>({
		resolver: valibotVigilio(usersProfileDto),
		mode: "all",
		defaultValues: useMemo(() => {
			return {
				user_code: user.user_code,
				username: user.username,
				name: user.name,
				address: user.address,
				email: user.email,
				lastname: user.lastname,
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
	const formUsersProfilePhoto = useForm<UsersProfilePhotoDto>({
		mode: "all",
		resolver: valibotVigilio(usersProfilePhotoDto),
	});
	const userPasswordFrom = useForm<UsersPasswordDto>({
		mode: "all",
		resolver: valibotVigilio(usersPasswordDto),
	});

	async function initialUpdatePhoto() {
		if (user.photo) {
			const photo = await getFilesEdit(user.photo, 300 as UsersFotoQualities);
			formUsersProfilePhoto.setValue("photo", photo);
		}
	}
	useEffect(() => {
		initialUpdatePhoto();
	}, []);

	const mutateUsersProfileApi = usersProfileApi();
	const mutateUsersProfilePhotoApi = usersProfilePhotoApi(user.id);
	const usersPasswordMutation = usersPasswordApi();

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
		<Container className="p-2">
			<div className="flex flex-col self-start gap-4 mx-1">
				<AdminBreadCrumb
					uris={[{ title: "usuarios", uri: "/usuarios" }]}
					current={user.username}
				/>
			</div>
			<div className="flex flex-col lg:flex-row gap-3">
				<div class="w-full dark:bg-admin-paper-dark p-4 rounded-md">
					<div class="flex justify-between items-center mb-4">
						<h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
							<i class="fa-solid fa-users" />
							Mi perfil - {user.username}
						</h3>
					</div>
					<Form {...formUsersProfile} onSubmit={onUpdateUser}>
						<div class="flex justify-end items-center mb-4">
							<Form.button.reset />
						</div>
						<div class="w-full flex flex-col sm:flex-row gap-2">
							<Form.control
								ico={<i class="fas fa-user-circle" />}
								name={"username" as keyof UsersProfileDto}
								title="Nombre de usuario"
								disabled
							/>
							<Form.control
								ico={<i class="fas fa-user" />}
								name={"name" as keyof UsersProfileDto}
								title="Nombre"
								placeholder="Jhon"
							/>
						</div>
						<div class="w-full flex flex-col sm:flex-row gap-2">
							<Form.control
								ico={<i class="fas fa-user-circle" />}
								name={"user_code" as keyof UsersProfileDto}
								title="Codigo de usuario"
								disabled
							/>
							<Form.control
								ico={<i class="fas fa-user" />}
								name={"speciality" as keyof UsersProfileDto}
								title="Especialidad"
							/>
						</div>
						<div class="w-full flex flex-col sm:flex-row gap-2">
							<Form.control
								ico={<i class="fas fa-at" />}
								name={"email" as keyof UsersProfileDto}
								type="email"
								title="Correo Electrónico"
								placeholder="correo@gmail.com"
							/>
							<Form.control
								ico={<i class="fas fa-female" />}
								name={"lastname" as keyof UsersProfileDto}
								title="Apellidos"
								placeholder=""
								question="Este campo no es obligatorio"
							/>
						</div>
						<div class="w-full flex flex-col sm:flex-row gap-2">
							<Form.control
								ico={<i class="fas fa-mobile-alt" />}
								name={"telephone" as keyof UsersProfileDto}
								type="tel"
								title="Numero de Celular"
								placeholder="9XXXXXXXX"
								question="Este campo no es obligatorio"
							/>
							<Form.control
								ico={<i class="fas fa-birthday-cake" />}
								name={"birthday" as keyof UsersProfileDto}
								type="date"
								title="Fecha de Nacimiento"
								placeholder="dni"
								question={"Este campo no es obligatorio"}
							/>
						</div>
						<div class="w-full flex flex-col sm:flex-row gap-2">
							<Form.control
								ico={<i class="fas fa-at" />}
								name={"address" as keyof UsersProfileDto}
								title="Dirección"
								placeholder="MZ D LT - Puente Piedra"
							/>
						</div>
						<div class="w-full flex flex-col sm:flex-row gap-2">
							<Form.control
								ico={<i class="fa-solid fa-calendar-days" />}
								name={"createdAt" as keyof UsersProfileDto}
								title="Fecha de creación"
								disabled
							/>
							<Form.control
								ico={<i class="fa-solid fa-calendar-days" />}
								name={"updatedAt" as keyof UsersProfileDto}
								title="Fecha de actualización"
								disabled
							/>
						</div>
						<h3 class="dark:text-white text-sm font-semibold">Configuración</h3>
						<div class="w-full flex flex-col sm:flex-row gap-2">
							<Form.control.toggle
								name={"enabledNotification" as keyof UsersProfileDto}
								title="Habilitar Notificaciones"
								question="Ya no estará habilitado las notificaciones push de tu navegador si no está habilitado"
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
				<div class="lg:w-[600px]">
					<div class="lg:col-span-2 dark:bg-admin-paper-dark p-4 rounded-md">
						<div class="flex justify-between items-center">
							<h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
								Cambiar Contraseña
							</h3>
						</div>
						<Form {...userPasswordFrom} onSubmit={onUpdatePassword}>
							<Form.control
								ico={<i class="fas fa-lock" />}
								name={"passwordActual" as keyof UsersPasswordDto}
								title="Contraseña actual"
								placeholder="Digite su contraseña Actual"
								type="password"
							/>
							<Form.control
								ico={<i class="fas fa-lock" />}
								name={"newPassword" as keyof UsersPasswordDto}
								title="Nueva contraseña"
								placeholder="Digite su nueva contraseña"
								type="password"
							/>
							<Form.control
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
					<div class="mt-2 dark:bg-admin-paper-dark p-4 rounded-md">
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
				</div>
			</div>
		</Container>
	);
}

export default UsersProfile;
