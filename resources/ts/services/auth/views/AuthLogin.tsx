import LogoImage from "~/components/LogoImage";
import Form from "~/components/form";
import { useForm } from "react-hook-form";
import { type AuthLoginDto, authLoginDto } from "../dtos/auth.login.dto";
import { googleUrl } from "../libs";
import { authLoginApi } from "../apis/auth.login.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import enviroments from "~/config";
import { useSignal } from "@preact/signals";
import { reactComponent } from "~/libs/preact";
import { useMediaQueryNoReactive } from "~/hooks/useMediaQuery";
import { webEmpresarial } from "~/config/guards";
import { valibotVigilio } from "~/libs/valibot";

function AuthLogin() {
	const rememberPassword = useSignal<string>(
		localStorage.getItem("rememberPassword") || "",
	);
	const authLoginApiMutation = authLoginApi();
	const authLoginForm = useForm<AuthLoginDto>({
		resolver: valibotVigilio(authLoginDto),
		mode: "all",
	});
	function onAuthLogin(data: AuthLoginDto) {
		if (!data.rememberPassword) {
			localStorage.removeItem("rememberPassword");
		}
		authLoginApiMutation.mutate(data, {
			onSuccess() {
				sweetAlert({
					icon: "success",
					title: "Iniciaste sessión correctamente",
				}).then(() => {
					if (data.rememberPassword) {
						localStorage.setItem("rememberPassword", data.password);
					}
					const url = window.location.href;

					if (!url.includes("/auth/login")) {
						window.location.reload();
						return;
					}
					window.location.href = `${enviroments.VITE_URL}/admin`;
				});
			},
			// no es necesario onError
		});
	}
	return (
		<div class="text-start p-4 w-full">
			<div class="flex justify-center items-center flex-col gap-2 mb-2">
				<LogoImage width="50" height="50" />
				<h3 class="text-2xl font-bold dark:text-secondary-light text-secondary-dark">
					Inicio de sesión
				</h3>
				<p class="dark:text-paper-light text-paper-dark text-sm">
					Inicia sesión para acceder a tu cuenta
				</p>
			</div>
			<Form onSubmit={onAuthLogin} {...authLoginForm}>
				{authLoginApiMutation.isError ? (
					<p class="text-white bg-danger w-full text-xs py-2 px-3 ">
						<i class="fa-solid fa-circle-exclamation mr-1" />
						{authLoginApiMutation.error?.message}
					</p>
				) : (
					<></>
				)}
				<Form.control.auth
					ico={<i class="fas fa-at text-sm" />}
					name={"email" as keyof AuthLoginDto}
					title="Correo Electrónico"
					placeholder="correo@gmail.com"
					autoComplete="email"
				/>
				<Form.control.auth
					name={"password" as keyof AuthLoginDto}
					title="Contraseña"
					type="password"
					placeholder="●●●●●●●●"
					ico={<i class="fas fa-lock" />}
					autoComplete="current-password"
					options={{ value: rememberPassword }}
				/>
				<div className="flex items-center gap-2 mb-6 mt-2">
					<input
						id="rememberPassword"
						type="checkbox"
						{...authLoginForm.register("rememberPassword", {
							value: false,
						})}
					/>
					<label
						htmlFor="rememberPassword"
						class="text-xs dark:text-secondary-light text-secondary-dark"
					>
						Recordar contraseña
					</label>
				</div>
				<Form.button.submit
					title="Iniciar sesión"
					className="justify-center w-full py-3"
					ico={null}
					disabled={authLoginApiMutation.isLoading || false}
					isLoading={authLoginApiMutation.isLoading || false}
				/>
			</Form>
			{webEmpresarial() ? (
				<div class="space-y-2">
					<div class="relative py-3">
						<hr class="border-t-gray-200 inset-x-0 w-full" />
						<div class="absolute top-1/2 px-2 -translate-y-2 left-1/2 -translate-x-1/2 bg-white dark:bg-paper-dark dark:text-secondary-light text-secondary-dark">
							ó
						</div>
					</div>
					<a
						href={googleUrl()}
						class="flex gap-2 items-center shadow px-4 py-3 border w-full rounded-sm justify-center bg-background-light text-sm lg:text-base font-bold"
					>
						<img
							width={20}
							height={20}
							alt="logo google"
							src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
						/>
						Iniciar sesión con Google
					</a>
				</div>
			) : null}
			<div class="mt-6 flex flex-col sm:flex-row justify-between gap-2 flex-wrap">
				<a
					href={`${enviroments.VITE_URL}/auth/forgot-password`}
					class="text-primary dark:text-principal-light text-xs hover:underline"
				>
					Me olvide mi contraseña?
				</a>
				<a
					class="text-primary dark:text-principal-light text-xs hover:underline"
					href={`${enviroments.VITE_URL}/auth/register`}
				>
					No tengo una cuenta?
				</a>
			</div>
		</div>
	);
}
export function openAuth() {
	sweetModal({
		html: reactComponent(<AuthLogin />),
		showCloseButton: true,
		sweetWidth: "600px",
		position: useMediaQueryNoReactive("(min-width:700px)") ? "center" : "start",
	});
}
export default AuthLogin;
