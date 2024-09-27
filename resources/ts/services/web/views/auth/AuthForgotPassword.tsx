import { useForm } from "react-hook-form";

import { valibotVigilio } from "~/libs/valibot";
import LogoImage from "~/components/LogoImage";
import Form from "~/components/form";
import { handlerError } from "~/libs/helpers";
import { sweetModal } from "@vigilio/sweet";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import {
	authForgotPasswordDto,
	AuthForgotPasswordDto,
} from "@/auth/dtos/auth.forgot-password.dto";
import { authForgotPasswordApi } from "@/auth/apis/auth.forgot-password.api";
import { authWallpaper } from "~/config/settings";
import { UsersSchemaFromServer } from "@/users/schemas/users.schema";
import AuthConfirmPassword from "./AuthConfirmPassword";
interface AuthForgotPasswordProps {
	user: UsersSchemaFromServer;
}
function AuthForgotPassword({ user }: AuthForgotPasswordProps) {
	const authForgotPasswordForm = useForm<AuthForgotPasswordDto>({
		mode: "all",
		resolver: valibotVigilio(authForgotPasswordDto),
	});
	const authForgotPasswordMutation = authForgotPasswordApi();
	function onAuthLogin(body: AuthForgotPasswordDto) {
		authForgotPasswordMutation.mutate(body, {
			onSuccess() {
				sweetModal({
					icon: "success",
					title: "Estas apunto de recuperar tu contraseña",
					text: `Se envió un mensaje a +${storageEmpresa?.dial_code} ${body.telephone}`,
				});
				authForgotPasswordForm.reset();
			},
			onError(error) {
				handlerError(authForgotPasswordForm, error);
			},
		});
	}
	return (
		<section class="relative flex flex-col-reverse h-screen overflow-hidden sm:grid sm:grid-cols-5 lg:grid-cols-3">
			<div class="sticky z-10 bg-white dark:bg-background-dark sm:static sm:col-span-3 lg:col-span-1">
				<div class="col-span-1 flex h-[85vh] flex-col items-start justify-center px-4 sm:h-[calc(100vh-34px)] sm:px-8">
					{user ? (
						<AuthConfirmPassword id={user.id} />
					) : (
						<div class="text-start p-4 w-full">
							<div class="flex justify-center items-center flex-col gap-2 mb-2">
								<LogoImage width="50" height="50" />
								<h3 class="text-2xl font-bold dark:text-secondary-light text-secondary-dark text-center">
									Me olvidé mi contraseña
								</h3>
							</div>
							<Form onSubmit={onAuthLogin} {...authForgotPasswordForm}>
								<Form.control.auth
									ico={<span class="font-bold">+51</span>}
									name={"telephone" as keyof AuthForgotPasswordDto}
									title="Telefono"
									placeholder=""
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
					)}
				</div>
			</div>
			<img
				width={1200}
				height={1200}
				src={authWallpaper()}
				alt=""
				class="object-cover w-full h-screen translate-y-16 sm:col-span-2 sm:translate-y-0 gradient"
			/>
		</section>
	);
}

export default AuthForgotPassword;
