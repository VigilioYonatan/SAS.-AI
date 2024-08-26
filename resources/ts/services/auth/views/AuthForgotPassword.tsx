import { useForm } from "react-hook-form";
import {
	authForgotPasswordDto,
	type AuthForgotPasswordDto,
} from "../dtos/auth.forgot-password.dto";
import { valibotVigilio } from "~/libs/valibot";
import LogoImage from "~/components/LogoImage";
import Form from "~/components/form";
import { authForgotPasswordApi } from "../apis/auth.forgot-password.api";
import { handlerError } from "~/libs/helpers";
import { sweetModal } from "@vigilio/sweet";

function AuthForgotPassword() {
	const authForgotPasswordForm = useForm<AuthForgotPasswordDto>({
		mode: "all",
		resolver: valibotVigilio(authForgotPasswordDto),
	});
	const authForgotPasswordMutation = authForgotPasswordApi();
	function onAuthLogin(body: AuthForgotPasswordDto) {
		authForgotPasswordMutation.mutate(body, {
			onSuccess(data) {
				sweetModal({
					customIcon:
						"<i class='fa-solid fa-envelope text-3xl dark:text-white'></i>",
					title: "Verifica tu correo Electrónico",
					text: data.message,
				}).then(() => {
					window.location.href = "/";
				});
				authForgotPasswordForm.reset();
			},
			onError(error) {
				handlerError(authForgotPasswordForm, error);
			},
		});
	}
	return (
		<div class="text-start p-4">
			<div class="flex justify-center items-center flex-col gap-2 mb-2">
				<LogoImage width="50" height="50" />
				<h3 class="text-2xl font-bold dark:text-secondary-light text-secondary-dark text-center">
					Me olvidé mi contraseña
				</h3>
			</div>
			<Form onSubmit={onAuthLogin} {...authForgotPasswordForm}>
				<Form.control.auth
					ico={<i class="fas fa-at text-sm" />}
					name={"email"}
					title="correo electrónico"
					placeholder="tu correo electrónico"
				/>
				<Form.button.submit
					title="Enviar"
					className="w-full justify-center py-3"
					ico={null}
					disabled={authForgotPasswordMutation.isLoading || false}
					isLoading={authForgotPasswordMutation.isLoading || false}
				/>
			</Form>
		</div>
	);
}

export default AuthForgotPassword;
