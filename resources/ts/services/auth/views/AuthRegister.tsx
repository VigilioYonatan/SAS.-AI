import LogoImage from "~/components/LogoImage";
import Form from "~/components/form";
import { useForm } from "react-hook-form";
import {
	type AuthRegisterDto,
	authRegisterDto,
} from "../dtos/auth.register.dto";
import { useEffect } from "preact/hooks";
import { valibotVigilio } from "~/libs/valibot";
import { authRegisterApi } from "../apis/auth.register.api";
import useSocketStore from "~/stores/socket.store";
import { sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import enviroments from "~/config";

function AuthRegister() {
	const { io } = useSocketStore();
	const authRegisterForm = useForm<AuthRegisterDto>({
		resolver: valibotVigilio(authRegisterDto),
		mode: "all",
		defaultValues: { enabledEmailsOffers: true },
	});
	const authRegisterApiMutation = authRegisterApi();
	function onAuthRegister(data: AuthRegisterDto) {
		if (data.password !== data.repeat_password) {
			authRegisterForm.setError("repeat_password", {
				message: "Contraseña no similares",
			});
			return;
		}
		authRegisterApiMutation.mutate(data, {
			onSuccess(data) {
				authRegisterForm.reset();
				sweetModal({
					customIcon:
						"<i class='fa-solid fa-envelope text-3xl dark:text-white'></i>",
					title: `${data.user.username}, fuiste registrado correctamente!`,
					text: `Te enviamos un mensaje a tu correo Electrónico <b>${data.user.email}</b> Para verificar tu cuenta`,
				});
				io?.emit("notifications:auth-register", {
					id: data.user.id,
					username: data.user.username,
					slug: data.user.slug,
				});
			},
			onError(error) {
				handlerError(authRegisterForm, error);
			},
		});
	}
	const password = authRegisterForm.watch("password");
	const repeatPassword = authRegisterForm.watch("repeat_password");
	useEffect(() => {
		if (password !== repeatPassword) {
			authRegisterForm.setError("repeat_password", {
				message: "Contraseña no similares",
			});
			return;
		}
		authRegisterForm.clearErrors("repeat_password");
	}, [password, repeatPassword]);

	return (
		<div class="text-start p-4">
			<div class="flex justify-center items-center flex-col gap-2 mb-2">
				<LogoImage width="50" height="50" />
				<h3 class="text-2xl font-bold dark:text-secondary-light text-secondary-dark">
					Crear cuenta
				</h3>
				<p class="text-terciary text-sm font-semibold">
					Estás a punto de unirte a nosotros
				</p>
			</div>
			<Form onSubmit={onAuthRegister} {...authRegisterForm}>
				<Form.control.web
					ico={<i class="fas fa-circle-user text-xl" />}
					name={"username" as keyof AuthRegisterDto}
					title="Nombre de usuario"
				/>
				<Form.control.web
					ico={<i class="fas fa-user text-sm" />}
					name={"name" as keyof AuthRegisterDto}
					title="Nombre"
				/>
				<Form.control.web
					ico={<i class="fas fa-at text-sm" />}
					name={"email" as keyof AuthRegisterDto}
					title="Correo electrónico"
					autoComplete="email"
					placeholder="correo@gmail.com"
				/>
				<div class="flex flex-col gap-2 sm:flex-row">
					<Form.control.web
						name={"password" as keyof AuthRegisterDto}
						title="Contraseña"
						type="password"
						ico={<i class="fas fa-lock text-sm" />}
						placeholder="●●●●●●●●"
					/>
					<Form.control.web
						name={"repeat_password" as keyof AuthRegisterDto}
						title="Confirmar contraseña"
						type="password"
						ico={<i class="fas fa-lock text-sm" />}
						placeholder="●●●●●●●●"
					/>
				</div>
				<Form.button.submit
					ico={null}
					title="Registrarse"
					className="w-full justify-center py-3"
					disabled={authRegisterApiMutation.isLoading || false}
					isLoading={authRegisterApiMutation.isLoading || false}
				/>
				<p class="text-xs dark:text-white text-center mt-2">
					Al registrarte, aceptas nuestra{" "}
					<a
						class="text-primary hover:underline font-semibold"
						href={`${enviroments.VITE_URL}/politica-y-privacidad`}
					>
						Política de Privacidad y Términos de Servicio
					</a>
					, como tambien aceptarás recibir ofertas y correos electrónicos
					promocionales de nuestra parte.
				</p>
			</Form>
			<div class="mt-6 flex justify-center">
				<a
					href={`${enviroments.VITE_URL}/auth/login`}
					type="button"
					class="text-primary text-xs hover:underline font-semibold"
				>
					Ya tengo una cuenta
				</a>
			</div>
		</div>
	);
}

export default AuthRegister;
